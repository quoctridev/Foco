import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          let response;
          try {
            response = await axios.get(`${API_BASE_URL}/public/customer/refreshToken?token=${refreshToken}`);
          } catch (customerError) {
            response = await axios.get(`${API_BASE_URL}/auth/refresh?token=${refreshToken}`);
          }
          
          if (response?.data?.data?.token) {
            const newToken = response.data.data.token;
            const newRefreshToken = response.data.data.refreshToken;
            
            localStorage.setItem('token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user && Object.keys(user).length > 0) {
              user.token = newToken;
              if (newRefreshToken) {
                user.refreshToken = newRefreshToken;
              }
              localStorage.setItem('user', JSON.stringify(user));
            }
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
        }
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

