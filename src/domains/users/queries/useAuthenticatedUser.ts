import { useSuspenseQuery } from '@tanstack/react-query';
import { getAuthenticatedUser } from '../services';

export const useAuthenticatedUser = () => {
  return useSuspenseQuery({
    queryKey: ['authenticated-user'],
    queryFn: () => getAuthenticatedUser(),
  });
};
