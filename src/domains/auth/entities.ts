import type { CustomerProfile } from '@/gen/models/CustomerProfile';
import type { UserCustomerLogin } from '@/gen/models/UserCustomerLogin';
import type { User } from '@/domains/users/entities';

export type AuthRole = 'client' | 'professional';

/** User vindo da API de login — pode incluir campos sensíveis (ex.: CPF). */
export type AuthApiUser = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  photo?: string | null;
  last_login?: string | null;
  date_joined?: string | null;
  is_phone_confirmed?: boolean;
  is_active?: boolean;
  customer?: Pick<CustomerProfile, 'id'> | null;
  professional?: { id: number } | null;
};

export interface AuthResponse {
  user: AuthApiUser;
  refresh: string;
  access: string;
}

export interface RefreshResponse {
  access: string;
}

/**
 * Resposta bruta do POST /auth/customer/token/.
 * O schema OpenAPI omite `access`/`refresh`, mas a API retorna o par JWT
 * junto com os dados do usuário (aninhados ou no root).
 */
export type CustomerTokenApiResponse = {
  access: string;
  refresh: string;
  user?: UserCustomerLogin;
} & Partial<UserCustomerLogin>;

/** Remove dados sensíveis antes de gravar a sessão. */
export function toSessionUser(
  user: AuthApiUser | (User & { customer?: { id: number } | null }),
): User {
  const customerId =
    'customerId' in user && user.customerId != null
      ? user.customerId
      : 'customer' in user && user.customer
        ? user.customer.id
        : null;

  return {
    id: user.id,
    name: user.name,
    email: user.email ?? '',
    photo: user.photo ?? null,
    last_login: user.last_login ?? '',
    date_joined: user.date_joined ?? '',
    is_phone_confirmed: user.is_phone_confirmed,
    customerId,
  };
}

/** Normaliza a resposta do login de cliente para o formato interno. */
export function normalizeCustomerAuthResponse(
  data: CustomerTokenApiResponse,
): AuthResponse {
  if (!data.access || !data.refresh) {
    throw new Error('Resposta de autenticação incompleta.');
  }

  const raw = data.user ?? data;

  if (raw.id == null || !raw.name) {
    throw new Error('Resposta de autenticação incompleta.');
  }

  return {
    access: data.access,
    refresh: data.refresh,
    user: {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      cpf: raw.cpf,
      photo: raw.photo,
      last_login: raw.last_login,
      date_joined: raw.date_joined,
      is_phone_confirmed: raw.is_phone_confirmed,
      is_active: raw.is_active,
      customer: raw.customer
        ? { id: raw.customer.id }
        : null,
    },
  };
}
