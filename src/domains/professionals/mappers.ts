import type { ProfessionalRegistrationData } from '@/domains/professional-registration/context';
import { onlyDigits } from '@/domains/registration/validation';
import type { CreateProfessionalPayload } from './services';

/** Paths da API → campos do formulário de cadastro profissional. */
export const PROFESSIONAL_REGISTRATION_FIELD_MAP: Record<string, string> = {
  'user.name': 'fullName',
  'user.email': 'email',
  'user.confirm_email': 'confirmEmail',
  'user.phone': 'phone',
  'user.cpf': 'cpf',
  'user.password': 'password',
  'user.confirm_password': 'confirmPassword',
  crefito: 'crefito',
};

export function toCreateProfessionalPayload(
  data: ProfessionalRegistrationData,
): CreateProfessionalPayload {
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
    crefito: onlyDigits(data.crefito),
  };
}
