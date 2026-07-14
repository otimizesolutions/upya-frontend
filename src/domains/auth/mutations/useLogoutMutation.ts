import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/domains/auth/stores';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await clearAuth();
      await queryClient.refetchQueries({ queryKey: ['authenticated-user'] });
    },
  });
};
