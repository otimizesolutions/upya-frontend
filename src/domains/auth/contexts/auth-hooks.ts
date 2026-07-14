import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { useAuthStore } from '@/domains/auth/stores';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const store = useAuthStore();

  return {
    ...context,
    accessToken: store.accessToken,
    refreshToken: store.refreshToken,
    hasHydrated: store.hasHydrated,
    setTokens: store.setTokens,
    setAccessToken: store.setAccessToken,
    setUser: store.setUser,
    clearAuth: store.clearAuth,
  };
};
