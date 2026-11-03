import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthUser } from '../types/auth';

interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializa e restaura a sessão persistida no AsyncStorage
  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const storedUser = await authService.getSession();
        if (storedUser) {
          // Tenta renovar o token automaticamente caso tenha expirado
          if (storedUser.refreshToken) {
            const refreshed = await authService.refreshToken(storedUser.refreshToken);
            if (refreshed) {
              setUser(refreshed);
              return;
            }
          }
          setUser(storedUser);
        }
      } catch (error) {
        console.log('Erro ao recuperar sessão persistida:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredSession();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    const loggedUser = await authService.login(email, pass);
    setUser(loggedUser);
  };

  const register = async (email: string, pass: string): Promise<void> => {
    const newUser = await authService.register(email, pass);
    setUser(newUser);
  };

  const logout = async (): Promise<void> => {
    await authService.clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.idToken || null,
        userId: user?.localId || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
