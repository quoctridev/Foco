import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ClockIcon, TruckIcon, StarIcon } from '@heroicons/react/24/outline';

const CustomerHome = () => {
  const features = [
    {
      name: 'Đặt Món Nhanh',
      description: 'Đặt món online tiện lợi, nhanh chóng chỉ với vài thao tác',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Giao Hàng Tận Nơi',
      description: 'Giao hàng nhanh chóng đến tận nhà trong 30 phút',
      icon: TruckIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Mở Cửa Cả Ngày',
      description: 'Phục vụ từ 9:00 sáng đến 22:00 tối mỗi ngày',
      icon: ClockIcon,
      color: 'bg-orange-500',
    },
    {
      name: 'Chất Lượng Đảm Bảo',
      description: 'Món ăn ngon, an toàn vệ sinh thực phẩm',
      icon: StarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 mb-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">Chào mừng đến với FOCO</h1>
          <p className="text-xl mb-8 text-primary-100">
            Khám phá thực đơn phong phú với hàng trăm món ăn ngon, đặt hàng ngay chỉ với vài click!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/qr-scan" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-lg transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Quét QR Bàn
            </Link>
            <Link to="/menu" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-lg transition">
              Xem Thực Đơn
            </Link>
            <Link to="/cart" className="bg-primary-700 hover:bg-primary-800 font-bold py-4 px-8 rounded-xl border-2 border-white transition">
              Giỏ Hàng
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tại Sao Chọn Chúng Tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.name} className="card hover:shadow-xl transition">
              <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Danh Mục Phổ Biến</h2>
          <Link to="/menu" className="text-primary-600 hover:text-primary-700 font-medium">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Món Chính', 'Món Phụ', 'Đồ Uống', 'Tráng Miệng'].map((category) => (
            <Link
              key={category}
              to="/menu"
              className="card hover:shadow-xl transition text-center"
            >
              <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <h3 className="font-bold text-gray-900">{category}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-orange-50 border-2 border-primary-200">
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sẵn Sàng Đặt Món?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Hãy khám phá thực đơn của chúng tôi và thưởng thức những món ăn ngon nhất!
          </p>
          <Link to="/menu" className="btn-primary inline-block">
            Đặt Món Ngay
          </Link>
        </div>
      </div>

      {/* Developer Info */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>Developed by <a href="https://github.com/quoctridev" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">@QuocTriDev</a></p>
      </div>
    </div>
  );
};

export default CustomerHome;

