import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User, LoginRequest, LoginResponse } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post<LoginResponse>('/auth/login', credentials);
          const { accessToken, refreshToken, user } = response.data;

          // Salvar tokens no localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
          }
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        } finally {
          // Limpar dados locais
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          await api.post<User>('/auth/register', data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
