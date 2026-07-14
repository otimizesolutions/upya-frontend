import { api } from '@/lib/axios';
import { AuthResponse, RefreshResponse } from './entities';

export const login = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/token/', {
    email,
    password,
  });
  return data;
};

export const refresh = async (
  refreshToken: string,
): Promise<RefreshResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/token/refresh/', {
    refresh: refreshToken,
  });
  return data;
};
