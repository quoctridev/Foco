import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import orderService from '../services/orderService';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không tìm thấy đơn hàng');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!order) return null;

  return (
    <div>
      <button onClick={() => navigate('/admin/orders')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Chi Tiết Đơn Hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Mã đơn:</span><span className="font-medium">{order.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Khách hàng:</span><span className="font-medium">{order.customerName || 'Khách vãng lai'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">SĐT:</span><span className="font-medium">{order.customerPhone || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Bàn:</span><span className="font-medium">{order.tableName || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Thời gian:</span><span className="font-medium">{new Date(order.createdAt).toLocaleString('vi-VN')}</span></div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-4">Danh Sách Món</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr><th className="px-4 py-2 text-left">Món</th><th className="px-4 py-2 text-right">SL</th><th className="px-4 py-2 text-right">Đơn giá</th><th className="px-4 py-2 text-right">Thành tiền</th></tr>
              </thead>
              <tbody>
                {order.orderDetails?.map((detail, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3">{detail.itemName}</td>
                    <td className="px-4 py-3 text-right">{detail.quantity}</td>
                    <td className="px-4 py-3 text-right">{detail.unitPrice?.toLocaleString()}đ</td>
                    <td className="px-4 py-3 text-right font-medium">{detail.totalPrice?.toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-lg mb-4">Thanh Toán</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Tạm tính:</span><span>{order.subtotal?.toLocaleString()}đ</span></div>
            <div className="flex justify-between"><span>Thuế:</span><span>{order.taxAmount?.toLocaleString()}đ</span></div>
            <div className="flex justify-between"><span>Giảm giá:</span><span className="text-green-600">-{order.discountAmount?.toLocaleString()}đ</span></div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>Tổng cộng:</span><span className="text-primary-600">{order.totalAmount?.toLocaleString()}đ</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

