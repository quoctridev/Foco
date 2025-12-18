import api from '../config/api';

const tableService = {
  getTablesByZone: async (zoneId) => {
    const response = await api.get(`/tables/zone/${zoneId}`);
    return response.data;
  },

  getTableById: async (id) => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  getTableByIdPublic: async (id) => {
    const response = await api.get(`/tables/public/${id}`);
    return response.data;
  },

  createTable: async (tableData) => {
    const response = await api.post('/tables', tableData);
    return response.data;
  },

  updateTable: async (id, tableData) => {
    const response = await api.put(`/tables/${id}`, tableData);
    return response.data;
  },

  updateTableStatus: async (id, status) => {
    const response = await api.patch(`/tables/${id}/status?status=${status}`);
    return response.data;
  },

  deleteTable: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },
};

export default tableService;

