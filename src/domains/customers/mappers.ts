import type { ClientRegistrationData } from '@/domains/client-registration/context';
import { onlyDigits } from '@/domains/registration/validation';
import type { CreateCustomerPayload } from './services';

/** Paths da API → campos do formulário de cadastro de cliente. */
export const CUSTOMER_REGISTRATION_FIELD_MAP: Record<string, string> = {
  'user.name': 'fullName',
  'user.email': 'email',
  'user.confirm_email': 'confirmEmail',
  'user.phone': 'phone',
  'user.cpf': 'cpf',
  'user.password': 'password',
  'user.confirm_password': 'confirmPassword',
};

export function toCreateCustomerPayload(
  data: ClientRegistrationData,
): CreateCustomerPayload {
  return {
    user: {
      name: data.fullName.trim(),
      email: data.email.trim(),
      confirm_email: data.confirmEmail.trim(),
      phone: onlyDigits(data.phone),
      cpf: onlyDigits(data.cpf),
      password: data.password,
      confirm_password: data.confirmPassword,
    },
  };
}
