import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, FolderOpen, X, Upload, Save } from 'lucide-react';
import menuService from '../services/menuService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sortOrder: 0,
    active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await menuService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Lỗi:', error);
      setError('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        sortOrder: category.sortOrder || 0,
        active: category.active !== undefined ? category.active : true,
      });
      setImagePreview(category.imageUrl || null);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        sortOrder: 0,
        active: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      sortOrder: 0,
      active: true,
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
      const categoryData = {
        name: formData.name,
        description: formData.description,
        sortOrder: formData.sortOrder,
        active: formData.active,
      };
      
      formDataToSend.append('category', JSON.stringify(categoryData));
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingCategory) {
        // TODO: Implement update when backend API is available
        setError('Chức năng cập nhật chưa được hỗ trợ');
      } else {
        const response = await menuService.createCategory(formDataToSend);
        if (response.code === 200) {
          handleCloseModal();
          loadCategories();
        } else {
          setError(response.message || 'Không thể tạo danh mục');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        const response = await menuService.deleteCategory(id);
        if (response.code === 200 || response.data?.code === 200) {
          loadCategories();
        } else {
          alert(response.message || response.data?.message || 'Không thể xóa danh mục');
        }
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert(error.response?.data?.message || error.message || 'Không thể xóa danh mục');
      }
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh Mục Món Ăn</h1>
          <p className="text-gray-500 mt-1">Quản lý các danh mục trong menu</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          Thêm Danh Mục
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card hover:shadow-xl transition-all duration-300 group">
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
              {category.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FolderOpen className="h-12 w-12 mb-2 opacity-50" />
                  <span className="text-xs">Không có ảnh</span>
                </div>
              )}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{category.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{category.description || 'Chưa có mô tả'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => handleOpenModal(category)}
                className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Sửa
              </button>
              <button 
                onClick={() => handleDelete(category.id)}
                className="py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all"
                title="Xóa danh mục"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có danh mục nào</p>
          <p className="text-gray-400 text-sm mt-2">Hãy thêm danh mục đầu tiên của bạn</p>
        </div>
      )}

      {/* Modal Thêm/Sửa Danh Mục */}
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
                    {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
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

                  {/* Tên danh mục */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên danh mục <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Ví dụ: Món chính, Đồ uống..."
                    />
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
                      placeholder="Mô tả về danh mục..."
                    />
                  </div>

                  {/* Thứ tự sắp xếp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thứ tự sắp xếp
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  {/* Ảnh */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="flex-1">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
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
                  </div>

                  {/* Trạng thái */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Kích hoạt danh mục
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
                    {submitting ? 'Đang lưu...' : editingCategory ? 'Cập nhật' : 'Tạo mới'}
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

export default Categories;

