import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar, Download, Filter } from 'lucide-react';
import orderService from '../services/orderService';

const Reports = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Đầu tháng
    end: new Date().toISOString().split('T')[0], // Hôm nay
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      const response = await orderService.getAllOrders();
      const allOrders = response.data || [];
      
      // Lọc theo date range
      const filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59);
        return orderDate >= startDate && orderDate <= endDate;
      });

      // Tính toán thống kê
      const completedOrders = filteredOrders.filter(o => o.status === 'completed');
      const revenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const avgOrderValue = completedOrders.length > 0 ? revenue / completedOrders.length : 0;

      setStats({
        totalRevenue: revenue,
        totalOrders: filteredOrders.length,
        averageOrderValue: avgOrderValue,
        totalCustomers: new Set(filteredOrders.map(o => o.customerId).filter(Boolean)).size,
      });

      setOrders(filteredOrders);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu báo cáo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán doanh thu theo ngày
  const getDailyRevenue = () => {
    const dailyData = {};
    orders
      .filter(o => o.status === 'completed')
      .forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('vi-VN');
        dailyData[date] = (dailyData[date] || 0) + (order.totalAmount || 0);
      });
    return Object.entries(dailyData).map(([date, revenue]) => ({ date, revenue }));
  };

  const dailyRevenue = getDailyRevenue();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo Cáo & Thống Kê</h1>
          <p className="text-gray-500 mt-1">Phân tích doanh thu và hoạt động kinh doanh</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
          <Download className="h-5 w-5" />
          Xuất Báo Cáo
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="card mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Khoảng thời gian:</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng Doanh Thu</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}đ</p>
            </div>
            <div className="p-4 rounded-xl bg-green-500 shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng Đơn Hàng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500 shadow-lg">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Giá Trị Đơn TB</p>
              <p className="text-3xl font-bold text-gray-900">{Math.round(stats.averageOrderValue).toLocaleString()}đ</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500 shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Khách Hàng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-500 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Revenue Chart */}
        <div className="card shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Doanh Thu Theo Ngày</h2>
              <p className="text-sm text-gray-500 mt-1">Biểu đồ doanh thu trong khoảng thời gian đã chọn</p>
            </div>
            <BarChart3 className="h-6 w-6 text-primary-600" />
          </div>
          <div className="space-y-3">
            {dailyRevenue.length > 0 ? (
              dailyRevenue.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(item.revenue / Math.max(...dailyRevenue.map(d => d.revenue))) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                      {item.revenue.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu trong khoảng thời gian này
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Phân Bố Trạng Thái Đơn</h2>
              <p className="text-sm text-gray-500 mt-1">Thống kê trạng thái đơn hàng</p>
            </div>
            <BarChart3 className="h-6 w-6 text-primary-600" />
          </div>
          <div className="space-y-3">
            {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => {
              const count = orders.filter(o => o.status === status).length;
              const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
              const statusNames = {
                pending: 'Chờ xử lý',
                confirmed: 'Đã xác nhận',
                preparing: 'Đang chuẩn bị',
                ready: 'Sẵn sàng',
                completed: 'Hoàn thành',
                cancelled: 'Đã hủy',
              };
              const statusColors = {
                pending: 'bg-yellow-500',
                confirmed: 'bg-blue-500',
                preparing: 'bg-orange-500',
                ready: 'bg-purple-500',
                completed: 'bg-green-500',
                cancelled: 'bg-red-500',
              };
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
                    <span className="text-sm text-gray-700">{statusNames[status]}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${statusColors[status]} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

