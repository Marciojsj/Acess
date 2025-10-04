import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Criar instância do axios
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, tentar renovar
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Repetir requisição original com novo token
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api(error.config);
        } catch {
          // Falhou renovar, fazer logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        // Sem refresh token, redirecionar para login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
