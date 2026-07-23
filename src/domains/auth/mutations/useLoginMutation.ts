import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Form } from '@/lib/errors';
import { useAuthStore } from '@/domains/auth/stores';
import type { AuthResponse, AuthRole } from '../entities';
import { toSessionUser } from '../entities';
import { applyLoginErrors } from '../login-errors';
import { loginCustomer, loginProfessional } from '../services';

interface MutationProps {
  email: string;
  password: string;
  role: AuthRole;
}

export const useLoginMutation = (
  form: Form<Pick<MutationProps, 'email' | 'password'>>,
) => {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation<AuthResponse, unknown, MutationProps>({
    mutationFn: ({ email, password, role }) =>
      role === 'professional'
        ? loginProfessional(email, password)
        : loginCustomer(email, password),
    onSuccess: async (data, { role }) => {
      const sessionUser = toSessionUser(data.user);
      await setSession(data.access, data.refresh, sessionUser, role);
      queryClient.setQueryData(['authenticated-user'], sessionUser);

      if (role === 'client') {
        await queryClient.refetchQueries({ queryKey: ['authenticated-user'] });
      }
    },
    onError: (err) => applyLoginErrors(err, form),
  });
};
