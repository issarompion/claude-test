import { randomUUID } from 'crypto';
import type { User } from '../types/user';

const store = new Map<string, User>();

export function getAll(): User[] {
  return Array.from(store.values());
}

export function getById(id: string): User | undefined {
  return store.get(id);
}

export function create(data: Omit<User, 'id'>): User {
  const user: User = { id: randomUUID(), ...data };
  store.set(user.id, user);
  return user;
}

export function update(id: string, data: Partial<Omit<User, 'id'>>): User | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated: User = { ...existing, ...data };
  store.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return store.delete(id);
}

export function reset(): void {
  store.clear();
}
