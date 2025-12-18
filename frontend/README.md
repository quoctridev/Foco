# 🎨 FOCO Frontend

Frontend application cho hệ thống quản lý nhà hàng FOCO, được xây dựng với React và Vite.

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Công Nghệ](#công-nghệ)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Yêu Cầu](#yêu-cầu)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Routing](#routing)
- [Authentication](#authentication)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [WebSocket](#websocket)
- [Build & Deploy](#build--deploy)

## 🎯 Tổng Quan

Frontend cung cấp giao diện người dùng cho hệ thống quản lý nhà hàng với:

- **Multi-role Interface**: Giao diện riêng cho từng vai trò
- **Real-time Updates**: Cập nhật realtime qua WebSocket
- **Responsive Design**: Tối ưu cho mobile và desktop
- **Role-based Routing**: Bảo vệ route theo vai trò
- **JWT Authentication**: Xác thực và phân quyền

## 🛠️ Công Nghệ

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: STOMP.js, SockJS
- **UI Libraries**:
  - Headless UI
  - Heroicons
  - Lucide React

## 📁 Cấu Trúc Dự Án

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx              # Admin layout
│   │   ├── CustomerLayout.jsx     # Customer layout
│   │   ├── ProtectedRoute.jsx     # Route protection
│   │   └── RoleProtectedRoute.jsx # Role-based protection
│   │
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx          # Admin dashboard
│   │   ├── MenuItems.jsx          # Menu management
│   │   ├── Orders.jsx             # Order management
│   │   ├── Tables.jsx             # Table management
│   │   ├── customer/              # Customer pages
│   │   ├── chef/                  # Chef pages
│   │   └── order/                 # Order staff pages
│   │
│   ├── contexts/            # React Contexts
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── CartContext.jsx        # Shopping cart state
│   │
│   ├── services/            # API services
│   │   ├── authService.js
│   │   ├── menuService.js
│   │   ├── orderService.js
│   │   ├── websocketService.js
│   │   └── ...
│   │
│   ├── config/              # Configuration
│   │   └── api.js                  # Axios instance
│   │
│   ├── util/                # Utilities
│   │   └── jwtDecoder.js          # JWT decoder
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static files
├── package.json
├── vite.config.js
└── tailwind.config.cjs
```

## 💻 Yêu Cầu

- Node.js 18+
- npm hoặc yarn

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/quoctridev/Foco.git
cd Foco/frontend
```

### 2. Cài Đặt Dependencies

```bash
npm install
```

hoặc

```bash
yarn install
```

## ⚙️ Cấu Hình

### Environment Variables

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### API Configuration

File `src/config/api.js` chứa cấu hình Axios:

- Base URL từ environment variable
- Request interceptor: Thêm JWT token
- Response interceptor: Xử lý refresh token

## ▶️ Chạy Ứng Dụng

### Development Mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Production Build

```bash
npm run build
```

Output sẽ ở thư mục `dist/`

### Preview Production Build

```bash
npm run preview
```

## 🗺️ Routing

### Route Structure

```
/                           # Customer home (public)
/login                      # Customer login
/register                   # Customer register
/menu                       # Customer menu (public)
/cart                       # Customer cart
/checkout                   # Customer checkout (protected)
/my-orders                  # Customer orders (protected)
/profile                    # Customer profile (protected)

/admin/login                # Admin login
/admin/dashboard            # Admin dashboard (ADMIN, MANAGER)
/admin/menu                 # Menu management (ADMIN, MANAGER)
/admin/orders               # Order management (ADMIN, MANAGER)
/admin/tables               # Table management (ADMIN, MANAGER)
...

/chef/login                # Chef login
/chef                       # Chef dashboard (CHEF)

/order-staff/login          # Order staff login
/order-staff                # Order staff dashboard (ORDER)
```

### Route Protection

- **ProtectedRoute**: Yêu cầu đăng nhập
- **RoleProtectedRoute**: Yêu cầu đăng nhập và role cụ thể

Ví dụ:

```jsx
<Route 
  path="/admin" 
  element={
    <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
      <Layout />
    </RoleProtectedRoute>
  }
/>
```

## 🔐 Authentication

### JWT Token Management

- Token được lưu trong `localStorage`
- Tự động decode để lấy role
- Tự động refresh khi hết hạn
- Tự động logout khi token invalid

### AuthContext

File: `src/contexts/AuthContext.jsx`

Cung cấp:

- `user`: Thông tin user hiện tại
- `login(username, password, isCustomer)`: Đăng nhập
- `logout()`: Đăng xuất
- `isAuthenticated`: Trạng thái đăng nhập
- `hasRole(role)`: Kiểm tra role
- `hasAnyRole(roles)`: Kiểm tra một trong các roles

### Usage

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, hasRole } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  if (hasRole('ADMIN')) {
    return <div>Admin content</div>;
  }
  
  return <div>Regular content</div>;
};
```

## 🛒 State Management

### CartContext

File: `src/contexts/CartContext.jsx`

Quản lý giỏ hàng:

- `cart`: Danh sách món trong giỏ
- `addToCart(item, quantity, options)`: Thêm món
- `updateQuantity(index, quantity)`: Cập nhật số lượng
- `removeFromCart(index)`: Xóa món
- `clearCart()`: Xóa toàn bộ
- `getTotal()`: Tính tổng tiền
- `getItemCount()`: Đếm số lượng món

### Usage

```jsx
import { useCart } from '../contexts/CartContext';

const MyComponent = () => {
  const { cart, addToCart, getTotal } = useCart();
  const { subtotal, tax, total } = getTotal();
  
  return (
    <div>
      <p>Items: {cart.length}</p>
      <p>Total: {total}</p>
    </div>
  );
};
```

## 📡 API Integration

### Service Structure

Mỗi domain có một service file:

- `authService.js`: Authentication
- `menuService.js`: Menu & Categories
- `orderService.js`: Orders
- `tableService.js`: Tables
- `zoneService.js`: Zones
- `paymentService.js`: Payments
- `discountService.js`: Discounts
- `customerService.js`: Customer operations
- `customerAdminService.js`: Admin customer management
- `chefService.js`: Chef operations
- `orderStaffService.js`: Order staff operations

### Usage

```jsx
import menuService from '../services/menuService';

const MyComponent = () => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const loadItems = async () => {
      const response = await menuService.getAllMenuItems();
      setItems(response.data);
    };
    loadItems();
  }, []);
  
  return <div>...</div>;
};
```

## 🔌 WebSocket

### WebSocketService

File: `src/services/websocketService.js`

Cung cấp:

- `connect(onConnected)`: Kết nối WebSocket
- `disconnect()`: Ngắt kết nối
- `subscribeToNewOrders(callback)`: Subscribe đơn mới
- `subscribeToOrderStatusUpdates(callback)`: Subscribe cập nhật trạng thái
- `subscribeToChefOrders(callback)`: Subscribe cho Chef
- `subscribeToOrderStaffUpdates(callback)`: Subscribe cho Order Staff

### Usage

```jsx
import websocketService from '../services/websocketService';

useEffect(() => {
  websocketService.connect(() => {
    websocketService.subscribeToNewOrders((order) => {
      console.log('New order:', order);
      // Update UI
    });
  });
  
  return () => {
    websocketService.disconnect();
  };
}, []);
```

## 🎨 Styling

### Tailwind CSS

Sử dụng Tailwind CSS cho styling:

```jsx
<div className="bg-white rounded-lg shadow-md p-4">
  <h1 className="text-2xl font-bold text-gray-800">Title</h1>
</div>
```

### Custom Classes

File `src/index.css` chứa custom classes:

- `.btn-primary`: Primary button
- `.input-field`: Input field
- `.card`: Card component

## 📦 Build & Deploy

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output: `dist/`

### Deploy

1. Build production:

```bash
npm run build
```

2. Deploy thư mục `dist/` lên hosting (Vercel, Netlify, etc.)

### Environment Variables for Production

Tạo file `.env.production`:

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

## 🐛 Troubleshooting

### API Connection Error

- Kiểm tra `VITE_API_URL` trong `.env`
- Đảm bảo backend đang chạy
- Kiểm tra CORS configuration

### WebSocket Connection Error

- Kiểm tra WebSocket URL trong `websocketService.js`
- Đảm bảo backend WebSocket đang chạy
- Kiểm tra firewall

### Build Errors

- Xóa `node_modules` và `package-lock.json`
- Chạy lại `npm install`
- Kiểm tra Node.js version

### Authentication Issues

- Kiểm tra token trong localStorage
- Kiểm tra JWT decoder
- Kiểm tra token expiration

## 🚧 Tính Năng Chưa Hoàn Thành

- [ ] **QR Code Scanner**: Tính năng quét QR code bằng camera chưa được implement, hiện tại chỉ hỗ trợ nhập mã bàn thủ công
- [ ] **Update Category**: API cập nhật danh mục chưa có ở backend, chỉ hỗ trợ tạo và xóa
- [ ] **Toast Notifications**: Hệ thống thông báo toast chưa được implement đầy đủ (cần thêm react-hot-toast hoặc similar)
- [ ] **Dark/Light Mode**: Tính năng chuyển đổi theme chưa được implement
- [ ] **Unit Tests**: Chưa có test cases cho các components và services (Jest, React Testing Library)
- [ ] **E2E Tests**: Chưa có end-to-end testing (Cypress, Playwright)
- [ ] **Image Upload Preview**: Chưa có preview ảnh trước khi upload
- [ ] **Pagination**: Một số trang danh sách chưa có phân trang
- [ ] **Search & Filter**: Một số trang chưa có tìm kiếm và lọc nâng cao
- [ ] **Export Reports**: Chưa có tính năng xuất báo cáo ra file (PDF, Excel)
- [ ] **Form Validation Library**: Chưa sử dụng form validation library (React Hook Form, Formik)
- [ ] **Error Boundary**: Chưa có Error Boundary component
- [ ] **Loading Skeletons**: Chưa có skeleton loading cho better UX
- [ ] **Offline Support**: Chưa có offline support (Service Worker, PWA)
- [ ] **Internationalization**: Chưa hỗ trợ đa ngôn ngữ (i18n)

## 📝 Best Practices

1. **Component Structure**: Tách logic và UI
2. **Error Handling**: Luôn xử lý lỗi trong API calls
3. **Loading States**: Hiển thị loading khi fetch data
4. **Form Validation**: Validate form trước khi submit
5. **Code Splitting**: Sử dụng lazy loading cho routes
6. **Performance**: Optimize re-renders với React.memo, useMemo, useCallback

## 🧪 Testing

```bash
npm test
```

## 📄 License

Dự án này được phát triển bởi QuocTriDev.

## 👨‍💻 Developer

**QuocTriDev**

- Email: quoctris.dev@gmail.com
- GitHub: [quoctridev](https://github.com/quoctridev)

