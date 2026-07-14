import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TOKEN_KEY } from '@/config';
import { api } from '@/lib/axios';
import type { User } from '@/domains/users/entities';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setTokens: (access: string, refresh: string) => Promise<void>;
  setAccessToken: (access: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setTokens: async (access, refresh) => {
        await AsyncStorage.setItem(TOKEN_KEY, refresh);
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
        });
      },
      setAccessToken: (access) => {
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        set({ accessToken: access, isAuthenticated: true });
      },
      setUser: (user) => {
        set({ user });
      },
      clearAuth: async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        api.defaults.headers.common.Authorization = undefined;
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'upya-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state?.accessToken) {
          api.defaults.headers.common.Authorization = `Bearer ${state.accessToken}`;
        }
        // Sempre libera a UI, mesmo se o rehydrate falhar.
        useAuthStore.getState().setHasHydrated(true);
      },
    },
  ),
);

useAuthStore.persist.onFinishHydration(() => {
  useAuthStore.getState().setHasHydrated(true);
});
