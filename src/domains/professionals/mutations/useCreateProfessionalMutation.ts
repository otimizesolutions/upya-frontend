import { useMutation } from '@tanstack/react-query';
import type { ProfessionalRegistrationData } from '@/domains/professional-registration/context';
import type { Form } from '@/lib/errors';
import type { ProfessionalCreate } from '@/gen/models/ProfessionalCreate';
import { applyProfessionalRegistrationErrors } from '../errors';
import { toCreateProfessionalPayload } from '../mappers';
import {
  createProfessional,
  type CreateProfessionalPayload,
} from '../services';

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
      const fields = applyProfessionalRegistrationErrors(err, form);
      options?.onFieldErrors?.(fields);
    },
  });
};

export type { CreateProfessionalPayload };
