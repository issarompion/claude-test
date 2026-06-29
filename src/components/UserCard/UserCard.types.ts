export type UserStatus = 'online' | 'away' | 'offline';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  status: UserStatus;
}

export interface UserCardProps {
  /** User data to display */
  user?: User;
  /** When true, renders a loading skeleton in place of user data */
  isLoading?: boolean;
  /** When non-null, renders a user-friendly error in place of user data */
  error?: string | null;
  /** Additional CSS class names merged onto the card root */
  className?: string;
}
