export interface AuthUser {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string; // userId no Firebase
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
