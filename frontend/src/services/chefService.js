import api from '../config/api';

const chefService = {
  getPendingOrders: async () => {
    const response = await api.get('/chef/orders/pending');
    return response.data;
  },

  getPreparingOrders: async () => {
    const response = await api.get('/chef/orders/preparing');
    return response.data;
  },

  getAllActiveOrders: async () => {
    const response = await api.get('/chef/orders/all-active');
    return response.data;
  },

  startPreparing: async (orderDetailId) => {
    const response = await api.patch(`/chef/order-detail/${orderDetailId}/start`);
    return response.data;
  },

  markAsReady: async (orderDetailId) => {
    const response = await api.patch(`/chef/order-detail/${orderDetailId}/ready`);
    return response.data;
  },

  updateStatus: async (orderDetailId, status) => {
    const response = await api.patch(`/chef/order-detail/${orderDetailId}/status?status=${status}`);
    return response.data;
  },
};

export default chefService;

