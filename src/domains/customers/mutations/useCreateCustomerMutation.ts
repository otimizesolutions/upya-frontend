import { useMutation } from '@tanstack/react-query';
import type { ClientRegistrationData } from '@/domains/client-registration/context';
import type { Form } from '@/lib/errors';
import type { CustomerCreate } from '@/gen/models/CustomerCreate';
import { applyCustomerRegistrationErrors } from '../errors';
import { toCreateCustomerPayload } from '../mappers';
import { createCustomer, type CreateCustomerPayload } from '../services';

type CreateCustomerMutationOptions = {
  onFieldErrors?: (fields: (keyof ClientRegistrationData)[]) => void;
  onSuccess?: (data: CustomerCreate) => void;
};

export const useCreateCustomerMutation = (
  form: Form<ClientRegistrationData>,
  options?: CreateCustomerMutationOptions,
) => {
  return useMutation({
    mutationFn: (data: ClientRegistrationData) =>
      createCustomer(toCreateCustomerPayload(data)),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      const fields = applyCustomerRegistrationErrors(err, form);
      options?.onFieldErrors?.(fields);
    },
  });
};

export type { CreateCustomerPayload };
