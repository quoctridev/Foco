import React, { useState, useEffect } from 'react';
import { BellIcon, CheckCircleIcon, XMarkIcon, TableCellsIcon, ShoppingBagIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MapPin, Users, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import orderStaffService from '../../services/orderStaffService';
import tableService from '../../services/tableService';
import menuService from '../../services/menuService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import api from '../../config/api';
import websocketService from '../../services/websocketService';

const OrderStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' hoặc 'tables'
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrders, setTableOrders] = useState([]);
  const [showTableDetail, setShowTableDetail] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [orderInfo, setOrderInfo] = useState({
    customerName: '',
    customerPhone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    } else {
      loadTables();
    }

    websocketService.connect(() => {
      websocketService.subscribeToNewOrders((order) => {
        console.log('Đơn mới:', order);
        showNotification('Có đơn hàng mới!');
        if (activeTab === 'orders') {
          loadOrders();
        }
        if (selectedTable) {
          loadTableOrders(selectedTable.id);
        }
      });

      websocketService.subscribeToOrderStatusUpdates((order) => {
        console.log('Cập nhật đơn:', order);
        if (activeTab === 'orders') {
          loadOrders();
        }
        if (selectedTable) {
          loadTableOrders(selectedTable.id);
        }
      });
    });

    return () => {
      websocketService.disconnect();
    };
  }, [activeTab, selectedTable]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderStaffService.getActiveOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      const zonesResponse = await api.get('/zone/store?id=1');
      setZones(zonesResponse.data.data || []);
      
      const allTables = [];
      for (const zone of zonesResponse.data.data || []) {
        try {
          const tablesResponse = await tableService.getTablesByZone(zone.id);
          if (tablesResponse.data?.data) {
            allTables.push(...tablesResponse.data.data);
          } else if (tablesResponse.data) {
            allTables.push(...tablesResponse.data);
          }
        } catch (err) {
          console.error(`Error loading tables for zone ${zone.id}:`, err);
        }
      }
      setTables(allTables);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bàn:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTableOrders = async (tableId) => {
    try {
      const response = await orderStaffService.getOrdersByTable(tableId);
      setTableOrders(response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải đơn của bàn:', error);
      setTableOrders([]);
    }
  };

  const loadMenuData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        menuService.getAvailableMenuItems(),
        menuService.getAllCategories(),
      ]);
      setMenuItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Lỗi khi tải menu:', error);
    }
  };

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    await loadTableOrders(table.id);
    setShowTableDetail(true);
  };

  const handleCreateOrder = async () => {
    await loadMenuData();
    setShowOrderModal(true);
  };

  const handleCloseTableDetail = () => {
    setShowTableDetail(false);
    setSelectedTable(null);
    setTableOrders([]);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setCart([]);
    setOrderInfo({ customerName: '', customerPhone: '', notes: '' });
  };

  const handleOpenPayment = (order) => {
    setSelectedOrderForPayment(order);
    setPaymentMethod('cash');
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedOrderForPayment(null);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!selectedOrderForPayment) return;

    try {
      const paymentData = {
        orderId: selectedOrderForPayment.id,
        paymentMethod: paymentMethod,
        amountPaid: selectedOrderForPayment.totalAmount,
        transactionId: null,
        paymentGateway: paymentMethod === 'cash' ? null : paymentMethod,
      };

      const paymentResponse = await paymentService.createPayment(paymentData);
      
      await paymentService.confirmPayment(paymentResponse.data.id);
      
      showNotification('Thanh toán thành công!');
      handleClosePaymentModal();
      
      if (selectedTable) {
        await loadTableOrders(selectedTable.id);
        await loadTables(); // Reload để cập nhật trạng thái bàn
      }
      await loadOrders();
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Không thể thanh toán. Vui lòng thử lại.');
    }
  };

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

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Vui lòng chọn ít nhất một món');
      return;
    }

    try {
      const orderData = {
        storeId: 1,
        tableId: selectedTable.id,
        orderType: 'dine_in',
        customerName: orderInfo.customerName || 'Khách vãng lai',
        customerPhone: orderInfo.customerPhone || '',
        notes: orderInfo.notes,
        orderDetails: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          specialInstructions: '',
          options: [],
        })),
      };

      await orderService.createOrder(orderData);
      showNotification('Tạo đơn hàng thành công!');
      handleCloseOrderModal();
      await loadTableOrders(selectedTable.id);
      loadOrders();
    } catch (error) {
      console.error('Lỗi khi tạo đơn:', error);
      alert('Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConfirm = async (orderId) => {
    try {
      await orderStaffService.confirmOrder(orderId);
      showNotification('Đã xác nhận đơn hàng!');
      loadOrders();
      if (selectedTable) {
        loadTableOrders(selectedTable.id);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể xác nhận đơn hàng');
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn này?')) {
      try {
        await orderStaffService.cancelOrder(orderId);
        showNotification('Đã hủy đơn hàng');
        loadOrders();
        if (selectedTable) {
          loadTableOrders(selectedTable.id);
        }
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Không thể hủy đơn hàng');
      }
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  const filteredTables = selectedZone === 'all'
    ? tables
    : tables.filter(table => table.zoneId === parseInt(selectedZone));

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    total: orders.length,
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { text: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      preparing: { text: 'Đang làm', class: 'bg-orange-100 text-orange-800' },
      ready: { text: 'Sẵn sàng', class: 'bg-purple-100 text-purple-800' },
      completed: { text: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
    };
    return config[status] || config.pending;
  };

  const getTableStatusBadge = (status) => {
    const config = {
      available: { text: 'Trống', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      occupied: { text: 'Đang dùng', class: 'bg-red-100 text-red-800', icon: XCircle },
      reserved: { text: 'Đã đặt', class: 'bg-yellow-100 text-yellow-800', icon: Clock },
      cleaning: { text: 'Đang dọn', class: 'bg-blue-100 text-blue-800', icon: Clock },
    };
    return config[status] || config.available;
  };

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === parseInt(selectedCategory));

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  if (loading && activeTab === 'orders') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce z-50">
          <BellIcon className="h-6 w-6" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Xử Lý Đơn Hàng & Bàn</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-md mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShoppingBagIcon className="h-5 w-5" />
            Đơn Hàng
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'tables'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TableCellsIcon className="h-5 w-5" />
            Quản Lý Bàn
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-2">Chờ Xác Nhận</p>
                    <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <BellIcon className="h-12 w-12 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-2">Đã Xác Nhận</p>
                    <p className="text-4xl font-bold text-blue-600">{stats.confirmed}</p>
                  </div>
                  <CheckCircleIcon className="h-12 w-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-2">Tổng Cộng</p>
                    <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Chờ xác nhận ({stats.pending})
                </button>
                <button
                  onClick={() => setFilter('confirmed')}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đã xác nhận ({stats.confirmed})
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusBadge(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-2xl transition">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h3>
                          <span className={`px-4 py-1 rounded-full text-sm font-bold ${statusConfig.class}`}>
                            {statusConfig.text}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Khách:</span> {order.customerName || 'Khách vãng lai'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">SĐT:</span> {order.customerPhone || '-'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Bàn:</span> {order.tableName || '-'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary-600">{order.totalAmount?.toLocaleString()}đ</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-bold mb-3">Danh sách món:</h4>
                      <div className="space-y-2">
                        {order.orderDetails?.map((detail, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-gray-700">
                              <span className="font-bold text-primary-600">{detail.quantity}x</span> {detail.itemName}
                            </span>
                            <span className="font-medium">{detail.totalPrice?.toLocaleString()}đ</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 mb-4">
                        <p className="text-sm font-medium text-gray-700">Ghi chú: {order.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {order.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleConfirm(order.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Xác Nhận Đơn
                        </button>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center"
                        >
                          <XMarkIcon className="h-5 w-5 mr-2" />
                          Hủy Đơn
                        </button>
                      </div>
                    )}
                    {(order.status === 'confirmed' || order.status === 'ready' || order.status === 'completed') && order.status !== 'completed' && (
                      <button
                        onClick={() => handleOpenPayment(order)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Thanh Toán
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có đơn hàng</h2>
                <p className="text-gray-600">Hiện tại không có đơn nào cần xử lý</p>
              </div>
            )}
          </>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {/* Zone Filter */}
                <div className="card mb-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Lọc theo khu vực:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedZone('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedZone === 'all'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Tất cả
                      </button>
                      {zones.map((zone) => (
                        <button
                          key={zone.id}
                          onClick={() => setSelectedZone(zone.id.toString())}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedZone === zone.id.toString()
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {zone.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTables.map((table) => {
                    const statusConfig = getTableStatusBadge(table.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary-500"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-500">{table.zoneName}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.class} flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.text}
                          </span>
                        </div>

                        <h3 className="font-bold text-xl text-gray-900 mb-3">{table.name}</h3>

                        <div className="flex items-center gap-2 mb-4 text-gray-600">
                          <Users className="h-5 w-5" />
                          <span className="text-sm">Sức chứa: {table.capacity} người</span>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <button className="w-full btn-primary text-sm py-2">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredTables.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Chưa có bàn nào</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Table Detail Modal */}
        {showTableDetail && selectedTable && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseTableDetail}></div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Thông Tin Bàn: {selectedTable.name}</h3>
                  <button onClick={handleCloseTableDetail} className="text-white hover:text-gray-200 transition">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="bg-white px-6 py-4">
                  {/* Table Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Khu vực</p>
                      <p className="font-medium">{selectedTable.zoneName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sức chứa</p>
                      <p className="font-medium">{selectedTable.capacity} người</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTableStatusBadge(selectedTable.status).class}`}>
                        {getTableStatusBadge(selectedTable.status).text}
                      </span>
                    </div>
                  </div>

                  {/* Orders of this table */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold">Đơn hàng của bàn này</h4>
                      <button
                        onClick={handleCreateOrder}
                        className="btn-primary flex items-center gap-2 text-sm"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Đặt món
                      </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {tableOrders.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Chưa có đơn hàng nào</p>
                      ) : (
                        tableOrders.map((order) => {
                          const statusConfig = getStatusBadge(order.status);
                          return (
                            <div key={order.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{order.orderNumber}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                                    {statusConfig.text}
                                  </span>
                                </div>
                                <span className="font-bold text-primary-600">{order.totalAmount?.toLocaleString()}đ</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {order.orderDetails?.map((detail, idx) => (
                                  <div key={idx}>
                                    {detail.quantity}x {detail.itemName}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                {order.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleConfirm(order.id)}
                                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg transition"
                                    >
                                      Xác nhận
                                    </button>
                                    <button
                                      onClick={() => handleCancel(order.id)}
                                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition"
                                    >
                                      Hủy
                                    </button>
                                  </>
                                )}
                                {(order.status === 'confirmed' || order.status === 'ready' || order.status === 'completed') && (
                                  <button
                                    onClick={() => handleOpenPayment(order)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg transition flex items-center justify-center gap-1"
                                    disabled={order.status === 'completed'}
                                  >
                                    {order.status === 'completed' ? 'Đã thanh toán' : 'Thanh toán'}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Modal */}
        {showOrderModal && selectedTable && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseOrderModal}></div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                <form onSubmit={handleSubmitOrder}>
                  <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Đặt món cho bàn: {selectedTable.name}</h3>
                    <button type="button" onClick={handleCloseOrderModal} className="text-white hover:text-gray-200 transition">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Menu Selection */}
                      <div className="lg:col-span-2">
                        <h4 className="font-bold mb-4">Chọn món</h4>
                        {/* Category Filter */}
                        <div className="mb-4 flex flex-wrap gap-2">
                          <button
                            type="button"
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
                              type="button"
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
                        {/* Menu Items Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {filteredMenuItems.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => addToCart(item)}
                              className="card cursor-pointer hover:shadow-lg transition"
                            >
                              <div className="h-24 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                    Không có ảnh
                                  </div>
                                )}
                              </div>
                              <h5 className="font-medium text-sm text-gray-900 mb-1">{item.name}</h5>
                              <p className="text-primary-600 font-bold text-sm">{item.price?.toLocaleString()}đ</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cart & Info */}
                      <div>
                        <div className="card mb-4">
                          <h4 className="font-bold mb-4">Thông tin khách</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách</label>
                              <input
                                type="text"
                                value={orderInfo.customerName}
                                onChange={(e) => setOrderInfo({ ...orderInfo, customerName: e.target.value })}
                                className="input-field text-sm"
                                placeholder="Nhập tên khách"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label>
                              <input
                                type="tel"
                                value={orderInfo.customerPhone}
                                onChange={(e) => setOrderInfo({ ...orderInfo, customerPhone: e.target.value })}
                                className="input-field text-sm"
                                placeholder="Nhập số điện thoại"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                              <textarea
                                value={orderInfo.notes}
                                onChange={(e) => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                                className="input-field text-sm"
                                rows="2"
                                placeholder="Ghi chú..."
                              ></textarea>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <h4 className="font-bold mb-4">Giỏ hàng ({cart.length})</h4>
                          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                            {cart.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-2 border-b text-sm">
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-primary-600">{item.price?.toLocaleString()}đ</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                            {cart.length === 0 && (
                              <p className="text-center text-gray-500 py-4 text-sm">Chưa có món nào</p>
                            )}
                          </div>

                          <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                              <span>Tạm tính:</span>
                              <span>{calculateTotal().subtotal.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Thuế (10%):</span>
                              <span>{calculateTotal().tax.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                              <span>Tổng:</span>
                              <span className="text-primary-600">{calculateTotal().total.toLocaleString()}đ</span>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={cart.length === 0}
                            className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Tạo Đơn Hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedOrderForPayment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClosePaymentModal}></div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmitPayment}>
                  <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Thanh Toán Đơn Hàng</h3>
                    <button type="button" onClick={handleClosePaymentModal} className="text-white hover:text-gray-200 transition">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-4">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Mã đơn hàng</p>
                      <p className="font-bold text-lg">{selectedOrderForPayment.orderNumber}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Tổng tiền</p>
                      <p className="font-bold text-2xl text-primary-600">{selectedOrderForPayment.totalAmount?.toLocaleString()}đ</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                      <div className="space-y-2">
                        {['cash', 'momo', 'bank', 'card'].map((method) => (
                          <label
                            key={method}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                              paymentMethod === method
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method}
                              checked={paymentMethod === method}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="mr-3"
                            />
                            <div>
                              <p className="font-medium">
                                {method === 'cash' ? 'Tiền mặt' :
                                 method === 'momo' ? 'Ví MoMo' :
                                 method === 'bank' ? 'Chuyển khoản' : 'Thẻ'}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClosePaymentModal}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Xác nhận thanh toán
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStaffDashboard;
