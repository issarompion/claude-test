import { Router } from 'express';
import type { Request, Response } from 'express';
import * as store from '../store/users';
import type { User, UserStatus } from '../types/user';

const router = Router();

const VALID_STATUSES: UserStatus[] = ['online', 'offline'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: Partial<Omit<User, 'id'>>): string[] {
  const errors: string[] = [];
  if (!body.name || body.name.trim() === '') {
    errors.push('name is required');
  } else if (body.name.length > 100) {
    errors.push('name must be 100 characters or fewer');
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    errors.push('email must be a valid email address');
  } else if (body.email.length > 254) {
    errors.push('email must be 254 characters or fewer');
  }
  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  return errors;
}

router.get('/', (_req: Request, res: Response) => {
  res.json(store.getAll());
});

router.get('/:id', (req: Request, res: Response) => {
  const user = store.getById(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

router.post('/', (req: Request, res: Response) => {
  const errors = validate(req.body as Partial<Omit<User, 'id'>>);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const user = store.create(req.body as Omit<User, 'id'>);
  res.status(201).json(user);
});

router.put('/:id', (req: Request, res: Response) => {
  const existing = store.getById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const merged = { ...existing, ...(req.body as Partial<Omit<User, 'id'>>) };
  const errors = validate(merged);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const updated = store.update(req.params.id, req.body as Partial<Omit<User, 'id'>>);
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.status(204).send();
});

export default router;
