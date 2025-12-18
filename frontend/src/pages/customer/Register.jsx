import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customerService from '../../services/customerService';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: false, // false = Nam, true = Nữ
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender,
        tier: 1, // Tier mặc định cho khách hàng mới
      };

      const response = await customerService.register(registerData);
      
      if (response.code === 200) {
        // Đăng ký thành công, chuyển đến trang đăng nhập
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      // Xử lý lỗi từ API
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="text-4xl font-bold text-primary-600">FOCO</Link>
            <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="input-field" placeholder="Nguyễn Văn A" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="email@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="input-field" placeholder="0123456789" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={(e) => setFormData({ ...formData, gender: e.target.value === 'true' })}
                className="input-field"
              >
                <option value="false">Nam</option>
                <option value="true">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="input-field" placeholder="Tối thiểu 8 ký tự" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="Nhập lại mật khẩu" />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Đăng nhập</Link>
            </p>
            <Link to="/" className="block text-sm text-gray-500 hover:text-gray-700">← Quay về trang chủ</Link>
            <p className="text-xs text-gray-400 mt-4">
              © 2024 FOCO - @QuocTriDev
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;

