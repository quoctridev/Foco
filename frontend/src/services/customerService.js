import api from '../config/api';

const customerService = {
  register: async (customerData) => {
    const response = await api.post('/public/customer/create', customerData);
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/public/customer/login', { username, password });
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      const userData = {
        email: username,
        token: response.data.data.token,
        refreshToken: response.data.data.refreshToken,
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  },
};

export default customerService;

