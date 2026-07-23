import type { ProfessionalCreate } from '@/gen/models/ProfessionalCreate';
import type { UserProfessionalCreate } from '@/gen/models/UserProfessionalCreate';
import { api } from '@/lib/axios';

export type CreateProfessionalUserPayload = Omit<UserProfessionalCreate, 'id'>;

export type CreateProfessionalPayload = {
  user: CreateProfessionalUserPayload;
  crefito: string;
};

export const createProfessional = async (
  payload: CreateProfessionalPayload,
) => {
  const { data } = await api.post<ProfessionalCreate>(
    '/professionals/',
    payload,
  );
  return data;
};
