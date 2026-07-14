import { User } from '@/domains/users/entities';

export interface AuthResponse {
  user: User;
  refresh: string;
  access: string;
}

export interface RefreshResponse {
  access: string;
}
