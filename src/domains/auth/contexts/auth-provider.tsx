import { PropsWithChildren, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { useAuthenticatedUser } from '@/domains/users/queries';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api } from '@/lib/axios';
import { TOKEN_KEY } from '@/config';
import { refresh } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user } = useAuthenticatedUser();
  const queryClient = useQueryClient();

  console.log(user);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        let refreshToken: string | null = '';
        try {
          refreshToken = await AsyncStorage.getItem(TOKEN_KEY);
        } catch {}

        if (!refreshToken) {
          return Promise.reject(error);
        }
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }
        const isRefreshToken = String(error.response.config.url).includes(
          'auth/token/refresh',
        );
        if (isRefreshToken) {
          await AsyncStorage.removeItem(TOKEN_KEY);
          await queryClient.refetchQueries({
            queryKey: ['authenticated-user'],
          });
          return Promise.reject(error);
        }
        try {
          const { access } = await refresh(refreshToken);
          api.defaults.headers.common.Authorization = `Bearer ${access}`;
          return api.request({
            ...(error.config || {}),
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });
        } catch {
          await AsyncStorage.removeItem(TOKEN_KEY);
          return Promise.reject(error);
        }
      },
    );

    return () => api.interceptors.response.eject(interceptorId);
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
