import api from '../config/api';

const discountService = {
  getAllDiscounts: async () => {
    const response = await api.get('/discounts');
    return response.data;
  },

  getValidDiscounts: async () => {
    const response = await api.get('/discounts/valid');
    return response.data;
  },

  getDiscountById: async (id) => {
    const response = await api.get(`/discounts/${id}`);
    return response.data;
  },

  getDiscountByCode: async (code) => {
    const response = await api.get(`/discounts/code/${code}`);
    return response.data;
  },

  createDiscount: async (discountData) => {
    const response = await api.post('/discounts', discountData);
    return response.data;
  },

  updateDiscount: async (id, discountData) => {
    const response = await api.put(`/discounts/${id}`, discountData);
    return response.data;
  },

  deleteDiscount: async (id) => {
    const response = await api.delete(`/discounts/${id}`);
    return response.data;
  },
};

export default discountService;

