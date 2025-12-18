import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import orderService from '../../services/orderService';

const CustomerOrderTracking = () => {
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
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderSteps = () => {
    const steps = [
      { status: 'pending', label: 'Chờ xác nhận' },
      { status: 'confirmed', label: 'Đã xác nhận' },
      { status: 'preparing', label: 'Đang chuẩn bị' },
      { status: 'ready', label: 'Sẵn sàng' },
      { status: 'completed', label: 'Hoàn thành' },
    ];

    const currentIndex = steps.findIndex(s => s.status === order?.status);
    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= currentIndex,
      current: idx === currentIndex,
    }));
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!order) return null;

  const steps = getOrderSteps();

  return (
    <div>
      <button onClick={() => navigate('/my-orders')} className="text-gray-600 hover:text-gray-900 mb-6">← Quay lại</button>

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Theo Dõi Đơn Hàng</h1>

      {/* Order Status Timeline */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-6">Trạng Thái Đơn Hàng</h2>
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="relative flex justify-between">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.completed ? <CheckCircleIcon className="h-6 w-6" /> : <ClockIcon className="h-6 w-6" />}
                </div>
                <p className={`mt-2 text-sm font-medium ${step.current ? 'text-primary-600' : 'text-gray-600'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Chi Tiết Đơn Hàng</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Mã đơn:</span><span className="font-medium">{order.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Thời gian:</span><span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Loại:</span><span>{order.orderType === 'delivery' ? 'Giao hàng' : order.orderType === 'takeaway' ? 'Mang về' : 'Tại chỗ'}</span></div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">Danh Sách Món</h3>
            <div className="space-y-3">
              {order.orderDetails?.map((detail, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{detail.itemName}</p>
                    <p className="text-sm text-gray-600">Số lượng: {detail.quantity}</p>
                  </div>
                  <p className="font-bold">{detail.totalPrice?.toLocaleString()}đ</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-4">Thanh Toán</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Tạm tính:</span><span>{order.subtotal?.toLocaleString()}đ</span></div>
            <div className="flex justify-between"><span>Thuế:</span><span>{order.taxAmount?.toLocaleString()}đ</span></div>
            <div className="flex justify-between"><span>Giảm giá:</span><span className="text-green-600">-{order.discountAmount?.toLocaleString()}đ</span></div>
            <div className="border-t pt-3 flex justify-between text-xl font-bold"><span>Tổng:</span><span className="text-primary-600">{order.totalAmount?.toLocaleString()}đ</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderTracking;

