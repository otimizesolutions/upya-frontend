import { useMutation } from '@tanstack/react-query';
import type { ProfessionalRegistrationData } from '@/domains/professional-registration/context';
import { applyFormErrors, type Form } from '@/lib/errors';
import {
  PROFESSIONAL_REGISTRATION_FIELD_MAP,
  toCreateProfessionalPayload,
} from '../mappers';
import {
  createProfessional,
  type CreateProfessionalPayload,
} from '../services';
import type { ProfessionalCreate } from '@/gen/models/ProfessionalCreate';

type CreateProfessionalMutationOptions = {
  onFieldErrors?: (fields: (keyof ProfessionalRegistrationData)[]) => void;
  onSuccess?: (data: ProfessionalCreate) => void;
};

export const useCreateProfessionalMutation = (
  form: Form<ProfessionalRegistrationData>,
  options?: CreateProfessionalMutationOptions,
) => {
  return useMutation({
    mutationFn: (data: ProfessionalRegistrationData) =>
      createProfessional(toCreateProfessionalPayload(data)),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      const fields = applyFormErrors(err, form, {
        fieldMap: PROFESSIONAL_REGISTRATION_FIELD_MAP,
      }) as (keyof ProfessionalRegistrationData)[];
      options?.onFieldErrors?.(fields);
    },
  });
};

export type { CreateProfessionalPayload };
