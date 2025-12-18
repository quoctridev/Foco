import api from '../config/api';

const zoneService = {
  getZonesByStore: async (storeId) => {
    const response = await api.get(`/zone/store?id=${storeId}`);
    return response.data;
  },

  getZoneById: async (id) => {
    const response = await api.get(`/zone?id=${id}`);
    return response.data;
  },

  createZone: async (zoneData) => {
    const response = await api.post('/zone', zoneData);
    return response.data;
  },

  updateZone: async (id, zoneData) => {
    const response = await api.put(`/zone?id=${id}`, zoneData);
    return response.data;
  },

  deleteZone: async (id) => {
    const response = await api.delete(`/zone?id=${id}`);
    return response.data;
  },
};

export default zoneService;

