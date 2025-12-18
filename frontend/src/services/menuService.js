import api from '../config/api';

const menuService = {
  getAllMenuItems: async () => {
    const response = await api.get('/menu-items');
    return response.data;
  },

  getMenuItemsByCategory: async (categoryId) => {
    const response = await api.get(`/menu-items/category/${categoryId}`);
    return response.data;
  },

  getAvailableMenuItems: async () => {
    const response = await api.get('/menu-items/available');
    return response.data;
  },

  searchMenuItems: async (keyword) => {
    const response = await api.get(`/menu-items/search?name=${keyword}`);
    return response.data;
  },

  createMenuItem: async (formData) => {
    const response = await api.post('/menu-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateMenuItem: async (id, formData) => {
    const response = await api.put(`/menu-items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateAvailability: async (id, available) => {
    const response = await api.patch(`/menu-items/${id}/availability?available=${available}`);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu-items/${id}`);
    return response.data;
  },

  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (formData) => {
    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default menuService;

