import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { text: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      preparing: { text: 'Đang chuẩn bị', class: 'bg-orange-100 text-orange-800' },
      ready: { text: 'Sẵn sàng', class: 'bg-purple-100 text-purple-800' },
      completed: { text: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Đã hủy', class: 'bg-red-100 text-red-800' },
    };
    const { text, class: className } = config[status] || config.pending;
    return <span className={`badge ${className}`}>{text}</span>;
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Đơn Hàng Của Tôi</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/my-orders/${order.id}`} className="card hover:shadow-lg transition block">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-lg text-gray-900">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="space-y-2 mb-4">
              {order.orderDetails?.slice(0, 2).map((detail, idx) => (
                <p key={idx} className="text-gray-600 text-sm">
                  {detail.quantity}x {detail.itemName}
                </p>
              ))}
              {order.orderDetails?.length > 2 && (
                <p className="text-gray-500 text-sm">+{order.orderDetails.length - 2} món khác</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-gray-600">Tổng cộng:</span>
              <span className="text-xl font-bold text-primary-600">{order.totalAmount?.toLocaleString()}đ</span>
            </div>
          </Link>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa có đơn hàng nào</h2>
            <Link to="/menu" className="btn-primary inline-block">Đặt Hàng Ngay</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;

