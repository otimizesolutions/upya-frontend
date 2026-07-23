import { api } from '@/lib/axios';
import type { AuthApiUser } from '@/domains/auth/entities';
import { toSessionUser } from '@/domains/auth/entities';
import type { User } from './entities';

export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<AuthApiUser>('/users/me/');
    return toSessionUser(data);
  } catch {
    return null;
  }
};
