import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ClipboardList,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import orderService from '../services/orderService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const ordersResponse = await orderService.getAllOrders();
      const orders = ordersResponse.data || [];
      
      // Tính toán thống kê
      const pending = orders.filter(o => o.status === 'pending').length;
      const completed = orders.filter(o => o.status === 'completed').length;
      const revenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        completedOrders: completed,
        totalRevenue: revenue,
        totalCustomers: 0,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Tổng Đơn Hàng',
      value: stats.totalOrders,
      icon: ClipboardList,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
    },
    {
      name: 'Đơn Chờ Xử Lý',
      value: stats.pendingOrders,
      icon: ShoppingBag,
      color: 'bg-yellow-500',
      change: '+5%',
      trend: 'up',
    },
    {
      name: 'Doanh Thu',
      value: `${stats.totalRevenue.toLocaleString()}đ`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+23%',
      trend: 'up',
    },
    {
      name: 'Khách Hàng',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8%',
      trend: 'up',
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      preparing: { text: 'Đang chuẩn bị', class: 'bg-orange-100 text-orange-800' },
      ready: { text: 'Sẵn sàng', class: 'bg-purple-100 text-purple-800' },
      completed: { text: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Đã hủy', class: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tổng Quan</h1>
        <p className="text-gray-500 mt-1">Thống kê và theo dõi hoạt động của nhà hàng</p>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                <div className="flex items-center">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Đơn hàng gần đây */}
      <div className="card shadow-lg">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Đơn Hàng Gần Đây</h2>
            <p className="text-sm text-gray-500 mt-1">5 đơn hàng mới nhất</p>
          </div>
          <a 
            href="/admin/orders" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition hover:gap-2"
          >
            Xem tất cả
            <span>→</span>
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã Đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách Hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng Tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời Gian
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-primary-600">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerName || 'Khách vãng lai'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {order.totalAmount?.toLocaleString()}đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

