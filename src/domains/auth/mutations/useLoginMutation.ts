import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/axios';
import { TOKEN_KEY } from '@/config';
import { applyFormErrors, Form } from '@/lib/errors';
import { login } from '../services';
import { AuthResponse } from '../entities';

interface MutationProps {
  email: string;
  password: string;
}

export const useLoginMutation = (form: Form<MutationProps>) => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, MutationProps>({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: async (data) => {
      const { access, refresh } = data;
      try {
        await AsyncStorage.setItem(TOKEN_KEY, refresh);
      } catch {}
      api.defaults.headers.common.Authorization = `Bearer ${access}`;
      await queryClient.refetchQueries({ queryKey: ['authenticated-user'] });
    },
    onError: (err) => applyFormErrors(err, form),
  });
};
