import { createContext } from 'react';
import { User } from '@/domains/users/entities';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextValue);
