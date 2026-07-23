import { api } from '@/lib/axios';
import {
  AuthResponse,
  CustomerTokenApiResponse,
  normalizeCustomerAuthResponse,
  RefreshResponse,
} from './entities';

/** Login genérico (legado). Preferir `loginCustomer` / `loginProfessional`. */
export const login = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/token/', {
    email,
    password,
  });
  return data;
};

export const loginCustomer = async (email: string, password: string) => {
  const { data } = await api.post<CustomerTokenApiResponse>(
    '/auth/customer/token/',
    {
      email,
      password,
    },
  );
  return normalizeCustomerAuthResponse(data);
};

export const loginProfessional = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/professional/token/', {
    email,
    password,
  });
  return data;
};

export const refresh = async (
  refreshToken: string,
): Promise<RefreshResponse> => {
  const { data } = await api.post<RefreshResponse>('/auth/token/refresh/', {
    refresh: refreshToken,
  });
  return data;
};
