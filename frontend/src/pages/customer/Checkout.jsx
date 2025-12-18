import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext.jsx';
import orderService from '../../services/orderService';

const CustomerCheckout = () => {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { subtotal, tax, total } = getTotal();

  // Lấy tableId từ QR scan (nếu có)
  const selectedTableId = localStorage.getItem('selectedTableId');
  const selectedTableName = localStorage.getItem('selectedTableName');
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    orderType: selectedTableId ? 'dine_in' : 'delivery', // Tự động chọn dine_in nếu có bàn
    address: '',
    notes: '',
    paymentMethod: 'cash',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        storeId: 1,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        orderType: formData.orderType,
        notes: formData.notes,
        tableId: selectedTableId ? parseInt(selectedTableId) : null, // Thêm tableId nếu có
        orderDetails: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          specialInstructions: '',
          options: item.options || [],
        })),
      };

      const response = await orderService.createOrder(orderData);
      clearCart();
      // Xóa tableId sau khi đặt hàng thành công
      if (selectedTableId) {
        localStorage.removeItem('selectedTableId');
        localStorage.removeItem('selectedTableName');
      }
      alert('Đặt hàng thành công!');
      navigate(`/my-orders/${response.data.id}`);
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Thanh Toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Thông Tin Khách Hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Hình Thức Nhận Hàng</h2>
              {selectedTableId && (
                <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Bàn đã chọn:</span> {selectedTableName || `Bàn #${selectedTableId}`}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  { value: 'delivery', label: 'Giao hàng' },
                  { value: 'takeaway', label: 'Mang về' },
                  { value: 'dine_in', label: 'Tại chỗ' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, orderType: type.value })}
                    className={`p-4 rounded-xl border-2 font-medium transition ${
                      formData.orderType === type.value
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {formData.orderType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    placeholder="Số nhà, tên đường, quận/huyện..."
                  />
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Phương Thức Thanh Toán</h2>
              <div className="space-y-3">
                {[
                  { value: 'cash', label: 'Tiền mặt', desc: 'Thanh toán khi nhận hàng' },
                  { value: 'momo', label: 'Ví MoMo', desc: 'Thanh toán qua ví điện tử' },
                  { value: 'bank', label: 'Chuyển khoản', desc: 'Chuyển khoản ngân hàng' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                      formData.paymentMethod === method.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-gray-600">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="card">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows="4"
                placeholder="Ghi chú thêm cho đơn hàng..."
              ></textarea>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold mb-4">Đơn Hàng ({cart.length} món)</h2>
              
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế:</span>
                  <span>{tax.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary-600">
                  <span>Tổng:</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Đặt Hàng'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerCheckout;

