import { useMutation } from '@tanstack/react-query';
import type { ClientRegistrationData } from '@/domains/client-registration/context';
import { applyFormErrors, type Form } from '@/lib/errors';
import type { CustomerCreate } from '@/gen/models/CustomerCreate';
import {
  CUSTOMER_REGISTRATION_FIELD_MAP,
  toCreateCustomerPayload,
} from '../mappers';
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
      const fields = applyFormErrors(err, form, {
        fieldMap: CUSTOMER_REGISTRATION_FIELD_MAP,
      }) as (keyof ClientRegistrationData)[];
      options?.onFieldErrors?.(fields);
    },
  });
};

export type { CreateCustomerPayload };
