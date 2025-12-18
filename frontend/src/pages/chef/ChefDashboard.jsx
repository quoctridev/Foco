import React, { useState, useEffect } from 'react';
import { ClockIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import chefService from '../../services/chefService';
import websocketService from '../../services/websocketService';

const ChefDashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();

    // Kết nối WebSocket
    websocketService.connect(() => {
      // Subscribe nhận cập nhật realtime
      websocketService.subscribeToChefOrders((orderDetail) => {
        console.log('Nhận cập nhật món:', orderDetail);
        loadOrders(); // Reload danh sách khi có update
      });

      websocketService.subscribeToNewOrders((order) => {
        console.log('Đơn mới:', order);
        loadOrders(); // Reload khi có đơn mới
      });
    });

    // Cleanup khi unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const loadOrders = async () => {
    try {
      const response = await chefService.getAllActiveOrders();
      setActiveOrders(response.data || []);
    } catch (error) {
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPreparing = async (id) => {
    try {
      await chefService.startPreparing(id);
      loadOrders();
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const handleMarkReady = async (id) => {
    try {
      await chefService.markAsReady(id);
      loadOrders();
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const filteredOrders = filter === 'all' 
    ? activeOrders 
    : activeOrders.filter(order => order.status === filter);

  const stats = {
    pending: activeOrders.filter(o => o.status === 'pending').length,
    preparing: activeOrders.filter(o => o.status === 'preparing').length,
    total: activeOrders.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Bếp - Danh Sách Món</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Tổng số món</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Chờ Làm</p>
                <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <ClockIcon className="h-12 w-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Đang Làm</p>
                <p className="text-4xl font-bold text-orange-600">{stats.preparing}</p>
              </div>
              <FireIcon className="h-12 w-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Tổng Cộng</p>
                <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chờ làm ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('preparing')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === 'preparing'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang làm ({stats.preparing})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((orderDetail) => (
            <div
              key={orderDetail.id}
              className={`bg-white rounded-xl p-6 shadow-lg border-4 transition hover:shadow-2xl ${
                orderDetail.status === 'pending'
                  ? 'border-yellow-400'
                  : orderDetail.status === 'preparing'
                  ? 'border-orange-400'
                  : 'border-green-400'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {orderDetail.itemName}
                  </h3>
                  <p className="text-gray-600">Số lượng: <span className="font-bold text-3xl text-primary-600">{orderDetail.quantity}</span></p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  orderDetail.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : orderDetail.status === 'preparing'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {orderDetail.status === 'pending' ? 'Chờ làm' :
                   orderDetail.status === 'preparing' ? 'Đang làm' : 'Sẵn sàng'}
                </div>
              </div>

              {orderDetail.options && orderDetail.options.length > 0 && (
                <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Tùy chọn:</p>
                  {orderDetail.options.map((opt, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      • {opt.valueName} {opt.quantity > 1 && `(x${opt.quantity})`}
                    </p>
                  ))}
                </div>
              )}

              {orderDetail.specialInstructions && (
                <div className="mb-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm font-medium text-gray-700 mb-1">Yêu cầu đặc biệt:</p>
                  <p className="text-sm text-gray-800 font-medium">{orderDetail.specialInstructions}</p>
                </div>
              )}

              <div className="flex space-x-3">
                {orderDetail.status === 'pending' && (
                  <button
                    onClick={() => handleStartPreparing(orderDetail.id)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center"
                  >
                    <FireIcon className="h-5 w-5 mr-2" />
                    Bắt Đầu Làm
                  </button>
                )}

                {orderDetail.status === 'preparing' && (
                  <button
                    onClick={() => handleMarkReady(orderDetail.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Món Xong
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có món nào</h2>
            <p className="text-gray-600">Hiện tại không có món cần làm</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefDashboard;

