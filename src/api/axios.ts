import axios from 'axios';
import { authControllerRefresh } from './generated/auth/auth';
import { logout as authStoreLogout } from '../store/authStore';

// Настраиваем глобальный экземпляр axios (используется Orval)
axios.defaults.withCredentials = true;

// Флаг, чтобы избежать бесконечного цикла при рефреше
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не повторный запрос и не запрос на /refresh или /login
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh') && !originalRequest.url?.includes('/login')) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axios(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authControllerRefresh();
        processQueue(null, 'refreshed');
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStoreLogout();
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
