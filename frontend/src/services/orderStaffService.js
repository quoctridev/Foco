import api from '../config/api';

const orderStaffService = {
  getPendingOrders: async () => {
    const response = await api.get('/order-staff/orders/pending');
    return response.data;
  },

  getConfirmedOrders: async () => {
    const response = await api.get('/order-staff/orders/confirmed');
    return response.data;
  },

  getActiveOrders: async () => {
    const response = await api.get('/order-staff/orders/active');
    return response.data;
  },

  confirmOrder: async (orderId) => {
    const response = await api.patch(`/order-staff/orders/${orderId}/confirm`);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.patch(`/order-staff/orders/${orderId}/cancel`);
    return response.data;
  },

  getOrdersByTable: async (tableId) => {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
  },
};

export default orderStaffService;

