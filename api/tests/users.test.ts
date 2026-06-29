import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';
import { reset } from '../src/store/users';

const request = supertest(app);

beforeEach(() => {
  reset();
});

// ── Health ────────────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns 200 with {status: "ok"}', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

// ── GET /users ────────────────────────────────────────────────────────────────

describe('GET /users', () => {
  it('returns an empty array when the store is empty', async () => {
    const res = await request.get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all users in the store', async () => {
    await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });
    await request.post('/users').send({ name: 'Bob', email: 'bob@example.com', status: 'offline' });

    const res = await request.get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('includes all user fields in each entry', async () => {
    await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });

    const res = await request.get('/users');
    expect(res.body[0]).toMatchObject({ name: 'Alice', email: 'alice@example.com', status: 'online' });
    expect(res.body[0].id).toBeDefined();
  });
});

// ── GET /users/:id ────────────────────────────────────────────────────────────

describe('GET /users/:id', () => {
  it('returns the user when found', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });

    const res = await request.get(`/users/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Alice', email: 'alice@example.com', status: 'online' });
  });

  it('returns 404 with error message when user does not exist', async () => {
    const res = await request.get('/users/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});

// ── POST /users ───────────────────────────────────────────────────────────────

describe('POST /users', () => {
  it('creates a user and returns 201 with the new user', async () => {
    const res = await request.post('/users').send({ name: 'Jane Doe', email: 'jane@example.com', status: 'online' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Jane Doe');
    expect(res.body.email).toBe('jane@example.com');
    expect(res.body.status).toBe('online');
  });

  it('assigns a unique id to each created user', async () => {
    const r1 = await request.post('/users').send({ name: 'A', email: 'a@example.com', status: 'online' });
    const r2 = await request.post('/users').send({ name: 'B', email: 'b@example.com', status: 'offline' });

    expect(r1.body.id).not.toBe(r2.body.id);
  });

  it('the created user appears in the list', async () => {
    await request.post('/users').send({ name: 'Jane', email: 'jane@example.com', status: 'online' });

    const list = await request.get('/users');
    expect(list.body).toHaveLength(1);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request.post('/users').send({ email: 'jane@example.com', status: 'online' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when name is an empty string', async () => {
    const res = await request.post('/users').send({ name: '', email: 'jane@example.com', status: 'online' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when email is missing', async () => {
    const res = await request.post('/users').send({ name: 'Jane', status: 'online' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when email format is invalid', async () => {
    const res = await request.post('/users').send({ name: 'Jane', email: 'not-an-email', status: 'online' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when status is missing', async () => {
    const res = await request.post('/users').send({ name: 'Jane', email: 'jane@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when status is not online or offline', async () => {
    const res = await request.post('/users').send({ name: 'Jane', email: 'jane@example.com', status: 'away' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('does not create a user when validation fails', async () => {
    await request.post('/users').send({ name: '', email: 'jane@example.com', status: 'online' });

    const list = await request.get('/users');
    expect(list.body).toHaveLength(0);
  });
});

// ── PUT /users/:id ────────────────────────────────────────────────────────────

describe('PUT /users/:id', () => {
  it('updates a field and returns the full updated user', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });

    const res = await request.put(`/users/${created.body.id}`).send({ status: 'offline' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('offline');
    expect(res.body.name).toBe('Alice');
    expect(res.body.email).toBe('alice@example.com');
  });

  it('persists the update in subsequent GET', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });
    await request.put(`/users/${created.body.id}`).send({ name: 'Alice Updated' });

    const res = await request.get(`/users/${created.body.id}`);
    expect(res.body.name).toBe('Alice Updated');
  });

  it('returns 404 when user does not exist', async () => {
    const res = await request.put('/users/nonexistent').send({ status: 'offline' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('returns 400 when updating status to an invalid value', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });

    const res = await request.put(`/users/${created.body.id}`).send({ status: 'away' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when updating email to an invalid format', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });

    const res = await request.put(`/users/${created.body.id}`).send({ email: 'bad-email' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

// ── DELETE /users/:id ─────────────────────────────────────────────────────────

describe('DELETE /users/:id', () => {
  it('deletes a user and returns 204 with no body', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });

    const res = await request.delete(`/users/${created.body.id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('removes the user from the list after deletion', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });
    await request.delete(`/users/${created.body.id}`);

    const list = await request.get('/users');
    expect(list.body).toHaveLength(0);
  });

  it('returns 404 when user does not exist', async () => {
    const res = await request.delete('/users/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('returns 404 when trying to delete the same user twice', async () => {
    const created = await request.post('/users').send({ name: 'Alice', email: 'alice@example.com', status: 'online' });
    await request.delete(`/users/${created.body.id}`);

    const res = await request.delete(`/users/${created.body.id}`);
    expect(res.status).toBe(404);
  });
});
