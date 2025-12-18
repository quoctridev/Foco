import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import menuService from '../../services/menuService';

const CustomerMenu = () => {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        menuService.getAvailableMenuItems(),
        menuService.getAllCategories(),
      ]);
      setMenuItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === parseInt(selectedCategory);
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    // TODO: Show toast notification
    alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Thực Đơn</h1>

      {/* Search & Filter */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-xl font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                selectedCategory === cat.id.toString()
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card hover:shadow-2xl transition group">
            <div className="relative h-56 bg-gray-200 rounded-xl mb-4 overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {item.categoryName}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{item.description || 'Món ăn ngon, đậm đà hương vị'}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary-600">{item.price?.toLocaleString()}đ</p>
                {item.prepTime && (
                  <p className="text-sm text-gray-500">~{item.prepTime} phút</p>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="btn-primary flex items-center py-2 px-4"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Thêm
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy món ăn phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;

