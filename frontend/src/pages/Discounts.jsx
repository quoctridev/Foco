import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Edit, Trash2, Search, Calendar, Percent, DollarSign, X, Save, CheckCircle, XCircle } from 'lucide-react';
import discountService from '../services/discountService';

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    applicableTo: 'all',
    startDate: '',
    endDate: '',
    active: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      const response = await discountService.getAllDiscounts();
      setDiscounts(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải mã giảm giá:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDiscounts = discounts.filter(discount =>
    !searchTerm ||
    discount.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discount.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (discount = null) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        code: discount.code || '',
        name: discount.name || '',
        description: discount.description || '',
        type: discount.type || 'percentage',
        value: discount.value?.toString() || '',
        minOrderAmount: discount.minOrderAmount?.toString() || '',
        maxDiscountAmount: discount.maxDiscountAmount?.toString() || '',
        usageLimit: discount.usageLimit?.toString() || '',
        applicableTo: discount.applicableTo || 'all',
        startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 16) : '',
        endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 16) : '',
        active: discount.active !== undefined ? discount.active : true,
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        applicableTo: 'all',
        startDate: '',
        endDate: '',
        active: true,
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDiscount(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const discountData = {
        ...formData,
        value: parseFloat(formData.value),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (editingDiscount) {
        const response = await discountService.updateDiscount(editingDiscount.id, discountData);
        if (response.data?.code === 200 || response.code === 200) {
          handleCloseModal();
          loadDiscounts();
        } else {
          setError(response.data?.message || response.message || 'Không thể cập nhật mã giảm giá');
        }
      } else {
        const response = await discountService.createDiscount(discountData);
        if (response.data?.code === 201 || response.data?.code === 200 || response.code === 201 || response.code === 200) {
          handleCloseModal();
          loadDiscounts();
        } else {
          setError(response.data?.message || response.message || 'Không thể tạo mã giảm giá');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
      try {
        await discountService.deleteDiscount(id);
        loadDiscounts();
      } catch (error) {
        console.error('Lỗi khi xóa mã giảm giá:', error);
        alert('Không thể xóa mã giảm giá');
      }
    }
  };

  const isDiscountValid = (discount) => {
    if (!discount.active) return false;
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    return now >= startDate && now <= endDate;
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
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Mã Giảm Giá</h1>
          <p className="text-gray-500 mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          Thêm Mã Giảm Giá
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên chương trình..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Chương Trình</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá Trị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời Hạn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sử Dụng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDiscounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Ticket className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-900">{discount.code || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                    <div className="text-sm text-gray-500">{discount.description || 'Không có mô tả'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{discount.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      {discount.type === 'percentage' ? (
                        <>
                          <Percent className="h-4 w-4 mr-1" />
                          {discount.value}%
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-1" />
                          {discount.value?.toLocaleString()}đ
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <div>
                        <div>{discount.startDate ? new Date(discount.startDate).toLocaleDateString('vi-VN') : '-'}</div>
                        <div className="text-xs">→ {discount.endDate ? new Date(discount.endDate).toLocaleDateString('vi-VN') : '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.usedCount || 0} / {discount.usageLimit || '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isDiscountValid(discount) ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Hiệu lực
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Hết hạn
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(discount)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
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

          {filteredDiscounts.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không tìm thấy mã giảm giá nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Tương tự như Categories và MenuItems, tôi sẽ tạo modal đầy đủ */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {editingDiscount ? 'Sửa Mã Giảm Giá' : 'Thêm Mã Giảm Giá Mới'}
                  </h3>
                  <button type="button" onClick={handleCloseModal} className="text-white hover:text-gray-200 transition">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="bg-white px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
                  )}
                  {/* Form fields - tôi sẽ tạo đầy đủ các field */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                      <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="input-field" placeholder="Ví dụ: SALE50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên chương trình <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field" rows="2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loại <span className="text-red-500">*</span></label>
                      <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input-field">
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền cố định</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giá trị <span className="text-red-500">*</span></label>
                      <input type="number" required min="0" step="0.01" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="input-field" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Đơn tối thiểu</label>
                      <input type="number" min="0" value={formData.minOrderAmount} onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giảm tối đa</label>
                      <input type="number" min="0" value={formData.maxDiscountAmount} onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})} className="input-field" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số lần sử dụng</label>
                      <input type="number" min="0" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Áp dụng cho</label>
                      <select value={formData.applicableTo} onChange={(e) => setFormData({...formData, applicableTo: e.target.value})} className="input-field">
                        <option value="all">Tất cả</option>
                        <option value="dine_in">Tại chỗ</option>
                        <option value="takeaway">Mang về</option>
                        <option value="delivery">Giao hàng</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu <span className="text-red-500">*</span></label>
                      <input type="datetime-local" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc <span className="text-red-500">*</span></label>
                      <input type="datetime-local" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="input-field" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">Kích hoạt mã giảm giá</label>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Hủy</button>
                  <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    <Save className="h-4 w-4" />
                    {submitting ? 'Đang lưu...' : editingDiscount ? 'Cập nhật' : 'Tạo mới'}
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

export default Discounts;

