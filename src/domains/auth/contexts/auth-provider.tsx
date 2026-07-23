import { type PropsWithChildren, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { AuthContext } from './auth-context';
import { useAuthenticatedUser } from '@/domains/users/queries';
import { api } from '@/lib/axios';
import { refresh } from '../services';
import { useAuthStore } from '@/domains/auth/stores';

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user } = useAuthenticatedUser();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storedUser = useAuthStore((state) => state.user);

  useEffect(() => {
    // Evita apagar o user da sessão (ex.: login profissional) se /users/me/ falhar.
    if (user) {
      setUser(user);
    }
  }, [setUser, user]);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const storedRefresh =
          useAuthStore.getState().refreshToken || refreshToken;

        if (!storedRefresh) {
          return Promise.reject(error);
        }
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }
        const isRefreshToken = String(error.response.config.url).includes(
          'auth/token/refresh',
        );
        if (isRefreshToken) {
          await clearAuth();
          await queryClient.refetchQueries({
            queryKey: ['authenticated-user'],
          });
          return Promise.reject(error);
        }
        try {
          const { access } = await refresh(storedRefresh);
          setAccessToken(access);
          return api.request({
            ...(error.config || {}),
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });
        } catch {
          await clearAuth();
          return Promise.reject(error);
        }
      },
    );

    return () => api.interceptors.response.eject(interceptorId);
  }, [clearAuth, queryClient, refreshToken, setAccessToken]);

  const sessionUser = user ?? storedUser;

  return (
    <AuthContext.Provider
      value={{
        user: sessionUser,
        isAuthenticated: isAuthenticated || !!sessionUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
