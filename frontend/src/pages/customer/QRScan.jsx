import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QrCode, Camera, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import tableService from '../../services/tableService';
import api from '../../config/api';

const QRScan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tableId, setTableId] = useState(searchParams.get('tableId') || '');
  const [tableInfo, setTableInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  // Nếu có tableId trong URL, tự động load
  useEffect(() => {
    const tableIdFromUrl = searchParams.get('tableId');
    if (tableIdFromUrl) {
      handleLoadTable(tableIdFromUrl);
    }
  }, [searchParams]);

  const handleLoadTable = async (id) => {
    if (!id) {
      setError('Vui lòng nhập mã bàn');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Gọi API public để lấy thông tin bàn
      const response = await api.get(`/tables/public/${id}`);
      const table = response.data?.data;
      
      if (table && table.active) {
        setTableInfo(table);
        // Lưu tableId vào localStorage để sử dụng khi checkout
        localStorage.setItem('selectedTableId', table.id);
        localStorage.setItem('selectedTableName', table.name);
      } else {
        setError('Bàn không tồn tại hoặc đã ngừng hoạt động');
        setTableInfo(null);
      }
    } catch (err) {
      setError('Không tìm thấy bàn. Vui lòng kiểm tra lại mã bàn.');
      setTableInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoadTable(tableId);
  };

  const handleStartScan = () => {
    setScanning(true);
    // TODO: Implement actual QR scanner using camera
    // For now, we'll use manual input
    alert('Tính năng quét QR bằng camera đang được phát triển. Vui lòng nhập mã bàn thủ công.');
    setScanning(false);
  };

  const handleContinue = () => {
    if (tableInfo) {
      navigate('/menu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
              <QrCode className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quét QR Bàn</h1>
            <p className="text-gray-600">Quét mã QR trên bàn để bắt đầu đặt món</p>
          </div>

          {/* Table Info Display */}
          {tableInfo && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Bàn đã được xác nhận</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Tên bàn:</span> {tableInfo.name}</p>
                <p><span className="font-medium">Khu vực:</span> {tableInfo.zoneName || 'N/A'}</p>
                <p><span className="font-medium">Sức chứa:</span> {tableInfo.capacity} người</p>
                <p className={`font-medium ${tableInfo.status === 'available' ? 'text-green-600' : 'text-orange-600'}`}>
                  Trạng thái: {
                    tableInfo.status === 'available' ? 'Trống' :
                    tableInfo.status === 'occupied' ? 'Đang dùng' :
                    tableInfo.status === 'reserved' ? 'Đã đặt' : 'Đang dọn'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Input Form */}
          {!tableInfo && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã bàn hoặc quét QR
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                    placeholder="Nhập mã bàn hoặc quét QR"
                    className="input-field flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleStartScan}
                    className="btn-primary px-4 flex items-center gap-2"
                    title="Quét QR bằng camera"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="h-5 w-5" />
                    <span>Xác nhận bàn</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Actions */}
          {tableInfo && (
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>Tiếp tục đặt món</span>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </button>
              <button
                onClick={() => {
                  setTableInfo(null);
                  setTableId('');
                  setError('');
                }}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Chọn bàn khác
              </button>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 card bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">Hướng dẫn:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Tìm mã QR trên bàn của bạn</li>
            <li>• Quét mã QR hoặc nhập mã bàn</li>
            <li>• Xác nhận thông tin bàn</li>
            <li>• Bắt đầu đặt món</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScan;

