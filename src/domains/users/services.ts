import { api } from '@/lib/axios';
import { User } from './entities';

export const getAuthenticatedUser = async () => {
  try {
    const { data } = await api.get<User>('/users/me/');
    return data;
  } catch {
    return null;
  }
};
