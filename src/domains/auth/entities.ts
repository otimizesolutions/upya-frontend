import type { User } from '@/domains/users/entities';

export type AuthRole = 'client' | 'professional';

/** User vindo da API de login — pode incluir campos sensíveis (ex.: CPF). */
export type AuthApiUser = User & {
  cpf?: string;
};

export interface AuthResponse {
  user: AuthApiUser;
  refresh: string;
  access: string;
}

export interface RefreshResponse {
  access: string;
}

/** Remove dados sensíveis antes de gravar a sessão. */
export function toSessionUser(user: AuthApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? '',
    phone: user.phone,
    photo: user.photo ?? null,
    last_login: user.last_login ?? '',
    date_joined: user.date_joined ?? '',
    is_phone_confirmed: user.is_phone_confirmed,
  };
}
