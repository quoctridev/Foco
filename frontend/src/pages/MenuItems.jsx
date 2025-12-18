import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Filter, Image as ImageIcon, X, Upload, Save, Clock, DollarSign } from 'lucide-react';
import menuService from '../services/menuService';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    cost: '',
    prepTime: '',
    available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        menuService.getAllMenuItems(),
        menuService.getAllCategories(),
      ]);
      setMenuItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === parseInt(selectedCategory));

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        categoryId: item.categoryId?.toString() || '',
        price: item.price?.toString() || '',
        cost: item.cost?.toString() || '',
        prepTime: item.prepTime?.toString() || '',
        available: item.available !== undefined ? item.available : true,
      });
      setImagePreview(item.imageUrl || null);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        cost: '',
        prepTime: '',
        available: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      price: '',
      cost: '',
      prepTime: '',
      available: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      const menuItemData = {
        name: formData.name,
        description: formData.description || '',
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : 0,
        available: formData.available,
      };
      
      // Backend nhận menuItem như object, nhưng với FormData cần gửi như Blob với content-type
      const menuItemBlob = new Blob([JSON.stringify(menuItemData)], { type: 'application/json' });
      formDataToSend.append('menuItem', menuItemBlob);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingItem) {
        const response = await menuService.updateMenuItem(editingItem.id, formDataToSend);
        if (response.code === 200) {
          handleCloseModal();
          loadData();
        } else {
          setError(response.message || 'Không thể cập nhật món ăn');
        }
      } else {
        const response = await menuService.createMenuItem(formDataToSend);
        if (response.code === 201 || response.code === 200) {
          handleCloseModal();
          loadData();
        } else {
          setError(response.message || 'Không thể tạo món ăn');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await menuService.updateAvailability(id, !currentStatus);
      loadData();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Không thể cập nhật trạng thái món ăn');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
      try {
        await menuService.deleteMenuItem(id);
        loadData();
      } catch (error) {
        console.error('Lỗi khi xóa món ăn:', error);
        alert('Không thể xóa món ăn');
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
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Menu</h1>
          <p className="text-gray-500 mt-1">Quản lý món ăn và thực đơn của nhà hàng</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          Thêm Món Mới
        </button>
      </div>

      {/* Filter */}
      <div className="card mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc theo danh mục:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id.toString()
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid món ăn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card hover:shadow-lg transition">
            {/* Hình ảnh */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden group">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                  <span className="text-sm">Không có ảnh</span>
                </div>
              )}
              {!item.available && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-lg bg-red-500 px-4 py-2 rounded-lg">Hết món</span>
                </div>
              )}
              {item.available && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Có sẵn
                </div>
              )}
            </div>

            {/* Thông tin */}
            <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary-600 font-bold text-xl">
                {item.price?.toLocaleString()}đ
              </span>
              <span className="text-sm text-gray-500">{item.categoryName}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleToggleAvailability(item.id, item.available)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  item.available
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {item.available ? 'Có sẵn' : 'Hết món'}
              </button>
              <button
                onClick={() => handleOpenModal(item)}
                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:shadow-md"
                title="Chỉnh sửa"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md"
                title="Xóa"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Không có món ăn nào trong danh mục này
        </div>
      )}

      {/* Modal Thêm/Sửa Món Ăn */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleCloseModal}
            ></div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {editingItem ? 'Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
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
                <div className="bg-white px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tên món ăn */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên món ăn <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        placeholder="Ví dụ: Phở Bò, Cơm Gà..."
                      />
                    </div>

                    {/* Danh mục */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Giá bán */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá bán (đ) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          required
                          min="0"
                          step="1000"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="input-field pl-10"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Giá vốn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá vốn (đ)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                          className="input-field pl-10"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Thời gian chuẩn bị */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian chuẩn bị (phút)
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          value={formData.prepTime}
                          onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                          className="input-field pl-10"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="Mô tả về món ăn..."
                    />
                  </div>

                  {/* Ảnh */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh
                    </label>
                    <div className="mt-1">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click để chọn ảnh</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                      Món ăn có sẵn
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
                    {submitting ? 'Đang lưu...' : editingItem ? 'Cập nhật' : 'Tạo mới'}
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

export default MenuItems;

