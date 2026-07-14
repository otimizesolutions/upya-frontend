import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyFormErrors, type Form } from '@/lib/errors';
import { login } from '../services';
import type { AuthResponse } from '../entities';
import { useAuthStore } from '@/domains/auth/stores';

interface MutationProps {
  email: string;
  password: string;
}

export const useLoginMutation = (form: Form<MutationProps>) => {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation<AuthResponse, unknown, MutationProps>({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: async (data) => {
      const { access, refresh } = data;
      await setTokens(access, refresh);
      await queryClient.refetchQueries({ queryKey: ['authenticated-user'] });
    },
    onError: (err) => applyFormErrors(err, form),
  });
};
