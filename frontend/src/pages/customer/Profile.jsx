import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const CustomerProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Tài Khoản Của Tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Thông Tin Cá Nhân</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input type="text" value={user?.name || ''} className="input-field" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={user?.email || ''} className="input-field" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input type="tel" value={user?.phone || ''} className="input-field" readOnly />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Địa Chỉ Giao Hàng</h2>
            <p className="text-gray-600">Chức năng đang phát triển...</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Điểm Thưởng</h2>
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-primary-600 mb-2">{user?.points || 0}</p>
              <p className="text-gray-600">điểm</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Hạng Thành Viên</h2>
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-bold text-lg">{user?.tier || 'Thành viên'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;

