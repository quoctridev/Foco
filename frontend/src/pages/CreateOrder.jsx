import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import menuService from '../services/menuService';
import orderService from '../services/orderService';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [orderInfo, setOrderInfo] = useState({
    customerName: '',
    customerPhone: '',
    orderType: 'dine_in',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === parseInt(selectedCategory));

  const addToCart = (item) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Vui lòng chọn ít nhất một món');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        storeId: 1,
        ...orderInfo,
        orderDetails: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          specialInstructions: '',
          options: [],
        })),
      };

      await orderService.createOrder(orderData);
      alert('Tạo đơn hàng thành công!');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Lỗi khi tạo đơn:', error);
      alert('Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tạo Đơn Hàng Mới</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Selection */}
        <div className="lg:col-span-2">
          {/* Category Filter */}
          <div className="card mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedCategory === category.id.toString()
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="card cursor-pointer hover:shadow-lg transition"
              >
                <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Không có ảnh
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                <p className="text-primary-600 font-bold">{item.price?.toLocaleString()}đ</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Customer Info */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Thông Tin Khách Hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    value={orderInfo.customerName}
                    onChange={(e) => setOrderInfo({ ...orderInfo, customerName: e.target.value })}
                    className="input-field"
                    placeholder="Nhập tên khách hàng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={orderInfo.customerPhone}
                    onChange={(e) => setOrderInfo({ ...orderInfo, customerPhone: e.target.value })}
                    className="input-field"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại đơn
                  </label>
                  <select
                    value={orderInfo.orderType}
                    onChange={(e) => setOrderInfo({ ...orderInfo, orderType: e.target.value })}
                    className="input-field"
                  >
                    <option value="dine_in">Tại chỗ</option>
                    <option value="takeaway">Mang về</option>
                    <option value="delivery">Giao hàng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={orderInfo.notes}
                    onChange={(e) => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Ghi chú đơn hàng..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Cart */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Giỏ Hàng ({cart.length})</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-primary-600 text-sm">{item.price?.toLocaleString()}đ</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Chưa có món nào</p>
                )}
              </div>

              {/* Total */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế (10%):</span>
                  <span>{tax.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">{total.toLocaleString()}đ</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || cart.length === 0}
                className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang xử lý...' : 'Tạo Đơn Hàng'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;

