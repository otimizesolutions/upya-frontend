import type { ProfessionalRegistrationData } from '@/domains/professional-registration/context';
import { translateApiErrorMessages } from '@/lib/api-error-messages';
import { applyFormErrors, type Form } from '@/lib/errors';
import { PROFESSIONAL_REGISTRATION_FIELD_MAP } from './mappers';

export type ProfessionalRegistrationStep =
  | 'email'
  | 'phone'
  | 'otp'
  | 'personal'
  | 'crefito'
  | 'password'
  | 'success';

/** Ordem de prioridade dos campos para foco / navegação. */
export const PROFESSIONAL_FIELD_PRIORITY: (keyof ProfessionalRegistrationData)[] =
  [
    'email',
    'confirmEmail',
    'phone',
    'fullName',
    'cpf',
    'crefito',
    'password',
    'confirmPassword',
  ];

export const PROFESSIONAL_FIELD_STEP: Partial<
  Record<keyof ProfessionalRegistrationData, ProfessionalRegistrationStep>
> = {
  email: 'email',
  confirmEmail: 'email',
  phone: 'phone',
  fullName: 'personal',
  cpf: 'personal',
  crefito: 'crefito',
  password: 'password',
  confirmPassword: 'password',
};

export function resolveFirstProfessionalErrorField(
  fields: (keyof ProfessionalRegistrationData)[],
): keyof ProfessionalRegistrationData | null {
  for (const field of PROFESSIONAL_FIELD_PRIORITY) {
    if (fields.includes(field)) return field;
  }
  return fields[0] ?? null;
}

export function resolveProfessionalStepForField(
  field: keyof ProfessionalRegistrationData,
): ProfessionalRegistrationStep | null {
  return PROFESSIONAL_FIELD_STEP[field] ?? null;
}

/**
 * Aplica erros do POST /professionals/ no formulário,
 * traduzindo mensagens para português.
 */
export function applyProfessionalRegistrationErrors(
  error: unknown,
  form: Form<ProfessionalRegistrationData>,
): (keyof ProfessionalRegistrationData)[] {
  return applyFormErrors(error, form, {
    fieldMap: PROFESSIONAL_REGISTRATION_FIELD_MAP,
    translateMessages: translateApiErrorMessages,
    joinMessages: true,
  }) as (keyof ProfessionalRegistrationData)[];
}
