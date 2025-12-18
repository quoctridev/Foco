import api from '../config/api';

const paymentService = {
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getPaymentsByOrder: async (orderId) => {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },

  confirmPayment: async (id) => {
    const response = await api.patch(`/payments/${id}/confirm`);
    return response.data;
  },

  updatePaymentStatus: async (id, status) => {
    const response = await api.patch(`/payments/${id}/status?status=${status}`);
    return response.data;
  },
};

export default paymentService;

