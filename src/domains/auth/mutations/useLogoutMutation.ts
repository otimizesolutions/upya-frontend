import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/axios';
import { TOKEN_KEY } from '@/config';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // TODO: clear saved tokens
      await AsyncStorage.removeItem(TOKEN_KEY);
      api.defaults.headers.common.Authorization = undefined;
      await queryClient.refetchQueries({ queryKey: ['authenticated-user'] });
    },
  });
};
