export type UserStatus = 'online' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}
