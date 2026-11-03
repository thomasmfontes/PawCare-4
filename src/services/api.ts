import axios from 'axios';
import { FIREBASE_CONFIG } from '../config/firebase';
import { authService } from './authService';

const api = axios.create({
  baseURL: FIREBASE_CONFIG.databaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para renovar token automaticamente em caso de 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const session = await authService.getSession();
        if (session?.refreshToken) {
          const refreshedUser = await authService.refreshToken(session.refreshToken);
          if (refreshedUser?.idToken) {
            originalRequest.params = {
              ...originalRequest.params,
              auth: refreshedUser.idToken,
            };
            return api(originalRequest);
          }
        }
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
