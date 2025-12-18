import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  Home,
  ShoppingBag,
  ClipboardList,
  Table,
  Users,
  Ticket,
  BarChart3,
  Menu,
  X,
  LogOut,
  MapPin,
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Tổng Quan', href: '/admin/dashboard', icon: Home },
    { name: 'Menu', href: '/admin/menu', icon: ShoppingBag },
    { name: 'Danh Mục', href: '/admin/categories', icon: ClipboardList },
    { name: 'Đơn Hàng', href: '/admin/orders', icon: ClipboardList },
    { name: 'Bàn', href: '/admin/tables', icon: Table },
    { name: 'Khu Vực', href: '/admin/zones', icon: MapPin },
    { name: 'Khách Hàng', href: '/admin/customers', icon: Users },
    { name: 'Mã Giảm Giá', href: '/admin/discounts', icon: Ticket },
    { name: 'Báo Cáo', href: '/admin/reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-2">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">FOCO</span>
                <p className="text-xs text-primary-100">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-2">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">FOCO</span>
                <p className="text-xs text-primary-100">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-between flex-1 px-4">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-700">{user?.name}</p>
                <p className="text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                title="Đăng xuất"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

