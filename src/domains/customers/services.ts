import type { CustomerCreate } from '@/gen/models/CustomerCreate';
import type { UserCustomerCreate } from '@/gen/models/UserCustomerCreate';
import { api } from '@/lib/axios';

export type CreateCustomerUserPayload = Omit<UserCustomerCreate, 'id'>;

export type CreateCustomerPayload = {
  user: CreateCustomerUserPayload;
};

export const createCustomer = async (payload: CreateCustomerPayload) => {
  const { data } = await api.post<CustomerCreate>('/customers/', payload);
  return data;
};
