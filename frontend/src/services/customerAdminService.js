import api from '../config/api';

const customerAdminService = {
  getAllCustomers: async () => {
    const response = await api.get('/admin/customer');
    return response.data;
  },

  getCustomersByTier: async (tierId) => {
    const response = await api.get(`/admin/customer/tier?id=${tierId}`);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await api.post(`/admin/customer?id=${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await api.delete(`/admin/customer?id=${id}`);
    return response.data;
  },
};

export default customerAdminService;

