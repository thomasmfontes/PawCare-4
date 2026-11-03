import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_ENDPOINTS } from '../config/firebase';
import { AuthUser } from '../types/auth';

const STORAGE_KEY_USER = '@pawcare:auth_user';

export const authService = {
  // Cadastra novo usuário no Firebase Authentication via REST
  register: async (email: string, password: string): Promise<AuthUser> => {
    const response = await axios.post(AUTH_ENDPOINTS.SIGN_UP, {
      email,
      password,
      returnSecureToken: true,
    });
    const user: AuthUser = response.data;
    await authService.saveSession(user);
    return user;
  },

  // Realiza login no Firebase Authentication via REST
  login: async (email: string, password: string): Promise<AuthUser> => {
    const response = await axios.post(AUTH_ENDPOINTS.SIGN_IN, {
      email,
      password,
      returnSecureToken: true,
    });
    const user: AuthUser = response.data;
    await authService.saveSession(user);
    return user;
  },

  // Renova o token de acesso expirado usando o refreshToken
  refreshToken: async (tokenToRefresh: string): Promise<AuthUser | null> => {
    try {
      const response = await axios.post(
        AUTH_ENDPOINTS.REFRESH,
        `grant_type=refresh_token&refresh_token=${tokenToRefresh}`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      const data = response.data;
      const stored = await authService.getSession();
      if (!stored) return null;
      const updatedUser: AuthUser = {
        ...stored,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
      await authService.saveSession(updatedUser);
      return updatedUser;
    } catch {
      return null;
    }
  },

  // Salva sessão localmente no AsyncStorage (requisito do edital)
  saveSession: async (user: AuthUser): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  },

  // Recupera sessão persistida
  getSession: async (): Promise<AuthUser | null> => {
    const data = await AsyncStorage.getItem(STORAGE_KEY_USER);
    if (!data) return null;
    try {
      return JSON.parse(data) as AuthUser;
    } catch {
      return null;
    }
  },

  // Remove a sessão do usuário (Logout funcional)
  clearSession: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY_USER);
  },
};
