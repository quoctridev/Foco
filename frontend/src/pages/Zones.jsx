import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Search, X, Save, CheckCircle, XCircle, Store } from 'lucide-react';
import zoneService from '../services/zoneService';

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storeId: 1, // Giả sử store ID = 1, có thể lấy từ user context
    active: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await zoneService.getZonesByStore(1); // Store ID = 1
      setZones(response.data || []);
    } catch (error) {
      // Nếu không có zone nào, backend sẽ throw exception, nhưng ta vẫn hiển thị danh sách rỗng
      if (error.response?.status === 500 || error.response?.status === 400) {
        setZones([]);
      } else {
        console.error('Lỗi khi tải khu vực:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = zones.filter(zone =>
    !searchTerm ||
    zone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.storeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (zone = null) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        name: zone.name || '',
        description: zone.description || '',
        storeId: 1, // Store ID = 1
        active: zone.active !== undefined ? zone.active : true,
      });
    } else {
      setEditingZone(null);
      setFormData({
        name: '',
        description: '',
        storeId: 1, // Store ID = 1
        active: true,
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const zoneData = {
        name: formData.name,
        description: formData.description,
        storeId: formData.storeId,
        active: formData.active,
      };

      if (editingZone) {
        const response = await zoneService.updateZone(editingZone.id, zoneData);
        if (response.code === 200 || response.data?.code === 200) {
          handleCloseModal();
          loadZones();
        } else {
          setError(response.message || response.data?.message || 'Không thể cập nhật khu vực');
        }
      } else {
        const response = await zoneService.createZone(zoneData);
        if (response.code === 200 || response.data?.code === 200) {
          handleCloseModal();
          loadZones();
        } else {
          setError(response.message || response.data?.message || 'Không thể tạo khu vực');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khu vực này?')) {
      try {
        await zoneService.deleteZone(id);
        loadZones();
      } catch (error) {
        console.error('Lỗi khi xóa khu vực:', error);
        alert('Không thể xóa khu vực');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khu Vực</h1>
          <p className="text-gray-500 mt-1">Tạo và quản lý các khu vực trong nhà hàng</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          Thêm Khu Vực
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mô tả hoặc cửa hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Khu Vực</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô Tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cửa Hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-900">{zone.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {zone.description || 'Không có mô tả'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Store className="h-4 w-4 mr-1 text-gray-400" />
                      {zone.storeName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {zone.active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Ngừng hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(zone)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(zone.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredZones.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {zones.length === 0 ? 'Chưa có khu vực nào' : 'Không tìm thấy khu vực nào'}
              </p>
              {zones.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">Hãy thêm khu vực đầu tiên của bạn</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {editingZone ? 'Sửa Khu Vực' : 'Thêm Khu Vực Mới'}
                  </h3>
                  <button type="button" onClick={handleCloseModal} className="text-white hover:text-gray-200 transition">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="bg-white px-6 py-4 space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên khu vực <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      placeholder="Ví dụ: Tầng 1, Khu VIP, Khu ngoài trời..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="input-field"
                      rows="3"
                      placeholder="Mô tả về khu vực này..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Khu vực đang hoạt động
                    </label>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {submitting ? 'Đang lưu...' : editingZone ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Zones;

