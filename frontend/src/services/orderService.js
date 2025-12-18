import api from '../config/api';

const orderService = {
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getOrdersByStore: async (storeId) => {
    const response = await api.get(`/orders/store/${storeId}`);
    return response.data;
  },

  getOrdersByStatus: async (status) => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  confirmOrder: async (id) => {
    const response = await api.patch(`/orders/${id}/confirm`);
    return response.data;
  },

  completeOrder: async (id) => {
    const response = await api.patch(`/orders/${id}/complete`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status?status=${status}`);
    return response.data;
  },
};

export default orderService;

