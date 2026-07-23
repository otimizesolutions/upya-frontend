import type { ClientRegistrationData } from '@/domains/client-registration/context';
import { translateApiErrorMessages } from '@/lib/api-error-messages';
import { applyFormErrors, type Form } from '@/lib/errors';
import { CUSTOMER_REGISTRATION_FIELD_MAP } from './mappers';

export type ClientRegistrationStep =
  | 'email'
  | 'phone'
  | 'otp'
  | 'personal'
  | 'password'
  | 'success';

/** Ordem de prioridade dos campos para foco / navegação. */
export const CUSTOMER_FIELD_PRIORITY: (keyof ClientRegistrationData)[] = [
  'email',
  'confirmEmail',
  'phone',
  'fullName',
  'cpf',
  'password',
  'confirmPassword',
];

export const CUSTOMER_FIELD_STEP: Partial<
  Record<keyof ClientRegistrationData, ClientRegistrationStep>
> = {
  email: 'email',
  confirmEmail: 'email',
  phone: 'phone',
  fullName: 'personal',
  cpf: 'personal',
  password: 'password',
  confirmPassword: 'password',
};

export function resolveFirstCustomerErrorField(
  fields: (keyof ClientRegistrationData)[],
): keyof ClientRegistrationData | null {
  for (const field of CUSTOMER_FIELD_PRIORITY) {
    if (fields.includes(field)) return field;
  }
  return fields[0] ?? null;
}

export function resolveCustomerStepForField(
  field: keyof ClientRegistrationData,
): ClientRegistrationStep | null {
  return CUSTOMER_FIELD_STEP[field] ?? null;
}

/**
 * Aplica erros do POST /customers/ no formulário,
 * traduzindo mensagens para português.
 */
export function applyCustomerRegistrationErrors(
  error: unknown,
  form: Form<ClientRegistrationData>,
): (keyof ClientRegistrationData)[] {
  return applyFormErrors(error, form, {
    fieldMap: CUSTOMER_REGISTRATION_FIELD_MAP,
    translateMessages: translateApiErrorMessages,
    joinMessages: true,
  }) as (keyof ClientRegistrationData)[];
}
