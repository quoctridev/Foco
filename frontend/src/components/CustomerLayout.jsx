import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  User,
  Menu,
  X,
  LogOut,
  Mail,
  Phone,
  Facebook,
  Github,
  Heart,
  Clock,
} from 'lucide-react';

const CustomerLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = getItemCount();

  const navigation = [
    { name: 'Trang Chủ', href: '/', icon: Home },
    { name: 'Thực Đơn', href: '/menu', icon: ShoppingBag },
    { name: 'Giỏ Hàng', href: '/cart', icon: ShoppingCart, badge: cartItemCount },
    { name: 'Đơn Hàng', href: '/my-orders', icon: ClipboardList, protected: true },
    { name: 'Tài Khoản', href: '/profile', icon: User, protected: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">FOCO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition relative ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                    {item.badge > 0 && (
                      <span className="ml-2 bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                    {item.badge > 0 && (
                      <span className="ml-auto bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-base font-medium bg-primary-600 text-white"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">FOCO Restaurant</h3>
              <p className="text-gray-600 mb-3">Hệ thống đặt món online tiện lợi và nhanh chóng</p>
              <p className="text-gray-600 text-sm">Developed by QuocTriDev</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Liên Hệ</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span>quoctris.dev@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                <span>0793391878</span>
              </div>
              <a href="https://www.facebook.com/quoctris.dev/" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary-600 hover:text-primary-700 mt-2">
                <Facebook className="h-4 w-4 mr-2" />
                <span>Facebook</span>
              </a>
              <a href="https://github.com/quoctridev" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary-600 hover:text-primary-700 mt-1">
                <Github className="h-4 w-4 mr-2" />
                <span>GitHub</span>
              </a>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Giờ Mở Cửa</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span>Thứ 2 - Chủ nhật</span>
              </div>
              <p className="text-gray-600 ml-6">9:00 - 22:00</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p className="flex items-center justify-center">
              © 2024 FOCO Restaurant - Developed with{' '}
              <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" /> by{' '}
              <a href="https://github.com/quoctridev" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium ml-1">@QuocTriDev</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;

