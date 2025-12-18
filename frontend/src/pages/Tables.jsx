import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, MapPin, X, Save, Filter } from 'lucide-react';
import tableService from '../services/tableService';
import api from '../config/api';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableName: '',
    zoneId: '',
    capacity: 4,
    status: 'available',
    active: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load zones (giả sử store ID = 1, có thể lấy từ user context)
      const zonesResponse = await api.get('/zone/store?id=1');
      setZones(zonesResponse.data.data || []);
      
      // Load tables từ tất cả zones
      const allTables = [];
      for (const zone of zonesResponse.data.data || []) {
        try {
          const tablesResponse = await tableService.getTablesByZone(zone.id);
          if (tablesResponse.data?.data) {
            allTables.push(...tablesResponse.data.data);
          } else if (tablesResponse.data) {
            allTables.push(...tablesResponse.data);
          }
        } catch (err) {
          console.error(`Error loading tables for zone ${zone.id}:`, err);
        }
      }
      setTables(allTables);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      setError('Không thể tải dữ liệu bàn');
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = selectedZone === 'all'
    ? tables
    : tables.filter(table => table.zoneId === parseInt(selectedZone));

  const handleOpenModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableName: table.name || '',
        zoneId: table.zoneId?.toString() || '',
        capacity: table.capacity || 4,
        status: table.status || 'available',
        active: table.active !== undefined ? table.active : true,
      });
    } else {
      setEditingTable(null);
      setFormData({
        tableName: '',
        zoneId: '',
        capacity: 4,
        status: 'available',
        active: true,
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTable(null);
    setFormData({
      tableName: '',
      zoneId: '',
      capacity: 4,
      status: 'available',
      active: true,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const tableData = {
        tableName: formData.tableName,
        zoneId: parseInt(formData.zoneId),
        capacity: parseInt(formData.capacity),
        status: formData.status,
        active: formData.active,
      };

      if (editingTable) {
        const response = await tableService.updateTable(editingTable.id, tableData);
        if (response.data?.code === 200 || response.code === 200) {
          handleCloseModal();
          loadData();
        } else {
          setError(response.data?.message || response.message || 'Không thể cập nhật bàn');
        }
      } else {
        const response = await tableService.createTable(tableData);
        if (response.data?.code === 200 || response.code === 200) {
          handleCloseModal();
          loadData();
        } else {
          setError(response.data?.message || response.message || 'Không thể tạo bàn');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bàn này?')) {
      try {
        await tableService.deleteTable(id);
        loadData();
      } catch (error) {
        console.error('Lỗi khi xóa bàn:', error);
        alert('Không thể xóa bàn');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await tableService.updateTableStatus(id, newStatus);
      loadData();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Không thể cập nhật trạng thái bàn');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { text: 'Trống', class: 'bg-green-100 text-green-800' },
      occupied: { text: 'Đang dùng', class: 'bg-red-100 text-red-800' },
      reserved: { text: 'Đã đặt', class: 'bg-yellow-100 text-yellow-800' },
      cleaning: { text: 'Đang dọn', class: 'bg-blue-100 text-blue-800' },
    };

    const config = statusConfig[status] || statusConfig.available;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Bàn</h1>
          <p className="text-gray-500 mt-1">Quản lý bàn ăn và khu vực của nhà hàng</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          Thêm Bàn Mới
        </button>
      </div>

      {/* Filter */}
      <div className="card mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc theo khu vực:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedZone('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedZone === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id.toString())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedZone === zone.id.toString()
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid bàn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <div key={table.id} className="card hover:shadow-xl transition-all duration-300 group">
            {/* Header với trạng thái */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">{table.zoneName}</span>
              </div>
              {getStatusBadge(table.status)}
            </div>

            {/* Tên bàn */}
            <h3 className="font-bold text-xl text-gray-900 mb-3">{table.name}</h3>

            {/* Thông tin */}
            <div className="flex items-center gap-2 mb-4 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">Sức chứa: {table.capacity} người</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="available">Trống</option>
                <option value="occupied">Đang dùng</option>
                <option value="reserved">Đã đặt</option>
                <option value="cleaning">Đang dọn</option>
              </select>
              <button
                onClick={() => handleOpenModal(table)}
                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:shadow-md"
                title="Chỉnh sửa"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(table.id)}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md"
                title="Xóa"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có bàn nào</p>
          <p className="text-gray-400 text-sm mt-2">Hãy thêm bàn đầu tiên của bạn</p>
        </div>
      )}

      {/* Modal Thêm/Sửa Bàn */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleCloseModal}
            ></div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {editingTable ? 'Sửa Bàn' : 'Thêm Bàn Mới'}
                  </h3>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-white hover:text-gray-200 transition"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="bg-white px-6 py-4 space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Tên bàn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên bàn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tableName}
                      onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
                      className="input-field"
                      placeholder="Ví dụ: Bàn 1, Bàn VIP 1..."
                    />
                  </div>

                  {/* Khu vực */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khu vực <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.zoneId}
                      onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Chọn khu vực</option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Sức chứa */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sức chứa (người) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                          className="input-field pl-10"
                          placeholder="4"
                        />
                      </div>
                    </div>

                    {/* Trạng thái */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="input-field"
                      >
                        <option value="available">Trống</option>
                        <option value="occupied">Đang dùng</option>
                        <option value="reserved">Đã đặt</option>
                        <option value="cleaning">Đang dọn</option>
                      </select>
                    </div>
                  </div>

                  {/* Trạng thái hoạt động */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Bàn đang hoạt động
                    </label>
                  </div>
                </div>

                {/* Footer */}
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
                    {submitting ? 'Đang lưu...' : editingTable ? 'Cập nhật' : 'Tạo mới'}
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

export default Tables;

