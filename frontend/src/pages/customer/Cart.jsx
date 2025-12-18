import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';

const CustomerCart = () => {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { subtotal, tax, total } = getTotal();

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-8">Hãy thêm món vào giỏ hàng để tiếp tục đặt hàng</p>
        <Link to="/menu" className="btn-primary inline-block">
          Xem Thực Đơn
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Giỏ Hàng</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="card flex items-center space-x-4">
              {/* Image */}
              <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl">🍽️</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <p className="text-primary-600 font-bold">{item.price?.toLocaleString()}đ</p>
                {item.options && item.options.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {item.options.map(opt => opt.name).join(', ')}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Total */}
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                  {(item.price * item.quantity).toLocaleString()}đ
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng Cộng</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Thuế VAT (10%):</span>
                <span>{tax.toLocaleString()}đ</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                <span>Tổng:</span>
                <span className="text-primary-600">{total.toLocaleString()}đ</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full text-center block mb-3">
              Thanh Toán
            </Link>
            <Link to="/menu" className="btn-outline w-full text-center block">
              Tiếp Tục Đặt Món
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCart;

