# 🍽️ FOCO Restaurant Management System

Hệ thống quản lý nhà hàng toàn diện với đầy đủ chức năng từ quản lý menu, đơn hàng, bàn ăn đến thanh toán và báo cáo.

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Vai Trò Người Dùng](#vai-trò-người-dùng)
- [API Documentation](#api-documentation)
- [Tác Giả](#tác-giả)

## 🎯 Tổng Quan

FOCO là hệ thống quản lý nhà hàng hiện đại, hỗ trợ đầy đủ các chức năng cần thiết cho việc vận hành một nhà hàng:

- **Quản lý Menu & Danh mục**: Thêm, sửa, xóa món ăn và danh mục
- **Quản lý Đơn Hàng**: Xử lý đơn hàng realtime với WebSocket
- **Quản lý Bàn & Khu Vực**: Tổ chức bàn ăn theo khu vực
- **Thanh Toán**: Hỗ trợ nhiều phương thức thanh toán
- **Mã Giảm Giá**: Quản lý chương trình khuyến mãi
- **Báo Cáo & Thống Kê**: Dashboard với các chỉ số quan trọng
- **Quản lý Khách Hàng**: Hệ thống phân cấp khách hàng (Customer Tier)

## ✨ Tính Năng

### 👨‍💼 Admin/Manager
- Dashboard tổng quan với thống kê realtime
- Quản lý menu, danh mục món ăn
- Quản lý đơn hàng và trạng thái
- Quản lý bàn ăn và khu vực
- Quản lý khách hàng và phân cấp
- Quản lý mã giảm giá
- Xem báo cáo và thống kê

### 👨‍🍳 Chef
- Xem danh sách món cần chế biến realtime
- Cập nhật trạng thái món ăn
- Nhận thông báo đơn hàng mới qua WebSocket

### 📋 Order Staff
- Xem và xử lý đơn hàng chờ xác nhận
- Quản lý bàn và trạng thái bàn
- Xác nhận và thanh toán đơn hàng
- Nhận thông báo realtime qua WebSocket

### 👤 Customer
- Xem menu và đặt món online
- Quét QR code để lấy thông tin bàn
- Quản lý giỏ hàng
- Theo dõi đơn hàng realtime
- Xem lịch sử đơn hàng
- Quản lý thông tin cá nhân

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Framework**: Spring Boot 3.5.0
- **Language**: Java 21
- **Database**: SQL Server
- **Security**: JWT Authentication
- **Real-time**: WebSocket (STOMP)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: STOMP.js, SockJS
- **UI Components**: Headless UI, Heroicons, Lucide React

## 📁 Cấu Trúc Dự Án

```
Foco/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── dev/datn/foco/
│   │       │       ├── config/      # Configuration classes
│   │       │       ├── controller/  # REST Controllers
│   │       │       ├── service/     # Business logic
│   │       │       ├── repository/  # Data access layer
│   │       │       ├── model/       # Entity models
│   │       │       ├── dto/         # Data Transfer Objects
│   │       │       └── util/        # Utilities (JWT, etc.)
│   │       └── resources/
│   │           └── application.yml # Configuration
│   └── pom.xml
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React Contexts
│   │   ├── services/       # API services
│   │   ├── config/         # Configuration
│   │   └── util/           # Utilities
│   ├── package.json
│   └── vite.config.js
│
└── DB.sql                  # Database schema
```

## 💻 Yêu Cầu Hệ Thống

### Backend
- Java 21+
- Maven 3.6+
- SQL Server 2019+
- IDE: IntelliJ IDEA / Eclipse / VS Code

### Frontend
- Node.js 18+
- npm hoặc yarn

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/quoctridev/Foco.git
cd Foco
```

### 2. Backend Setup

Xem chi tiết trong [backend/README.md](./backend/README.md)

```bash
cd backend
mvn clean install
```

### 3. Frontend Setup

Xem chi tiết trong [frontend/README.md](./frontend/README.md)

```bash
cd frontend
npm install
```

## ⚙️ Cấu Hình

### Backend Configuration

Cấu hình trong `backend/src/main/resources/application.yml`:

- Database connection
- JWT secret keys
- Cloudflare R2 credentials
- File upload settings

### Frontend Configuration

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## ▶️ Chạy Ứng Dụng

### Chạy Backend

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 👥 Vai Trò Người Dùng

Hệ thống hỗ trợ 5 vai trò chính:

1. **ADMIN**: Quyền cao nhất, quản lý toàn bộ hệ thống
2. **MANAGER**: Quản lý nhà hàng, xem báo cáo
3. **CHEF**: Xử lý món ăn, cập nhật trạng thái
4. **ORDER**: Xử lý đơn hàng, quản lý bàn
5. **CUSTOMER**: Khách hàng đặt món

Mỗi vai trò có các route và chức năng riêng được bảo vệ bởi role-based access control (RBAC).

## 📚 API Documentation

API Base URL: `http://localhost:8080/api/v1`

### Các Endpoint Chính:

- `/auth/*` - Authentication
- `/menu-items/*` - Quản lý món ăn
- `/categories/*` - Quản lý danh mục
- `/orders/*` - Quản lý đơn hàng
- `/tables/*` - Quản lý bàn
- `/zones/*` - Quản lý khu vực
- `/payments/*` - Thanh toán
- `/discounts/*` - Mã giảm giá
- `/admin/customer/*` - Quản lý khách hàng
- `/chef/*` - API cho Chef
- `/order-staff/*` - API cho Order Staff
- `/public/customer/*` - API công khai cho khách hàng

### WebSocket Endpoints:

- `/ws` - WebSocket connection
- `/topic/orders/new` - Thông báo đơn hàng mới
- `/topic/orders/status` - Cập nhật trạng thái đơn
- `/topic/chef/orders` - Cập nhật món cho Chef
- `/topic/order-staff/orders` - Cập nhật đơn cho Order Staff

## 🔐 Authentication

Hệ thống sử dụng JWT (JSON Web Token) cho authentication:

- **Access Token**: Hết hạn sau 15 phút
- **Refresh Token**: Hết hạn sau 7 ngày
- Token được tự động refresh khi hết hạn

## 📝 Database

File `DB.sql` chứa schema database. Import vào SQL Server trước khi chạy ứng dụng.

## 🎨 UI/UX

- Responsive design cho mobile và desktop
- Dark/Light mode support (có thể mở rộng)
- Real-time updates với WebSocket
- Loading states và error handling
- Toast notifications

## 🧪 Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Build Production

### Backend
```bash
cd backend
mvn clean package
```

### Frontend
```bash
cd frontend
npm run build
```

Output sẽ ở thư mục `frontend/dist/`

## 🚧 Tính Năng Chưa Hoàn Thành / Roadmap

### Frontend
- [ ] **QR Code Scanner**: Tính năng quét QR code bằng camera chưa được implement, hiện tại chỉ hỗ trợ nhập mã bàn thủ công
- [ ] **Update Category**: API cập nhật danh mục chưa có ở backend, chỉ hỗ trợ tạo và xóa
- [ ] **Toast Notifications**: Hệ thống thông báo toast chưa được implement đầy đủ
- [ ] **Dark/Light Mode**: Tính năng chuyển đổi theme chưa được implement
- [ ] **Unit Tests**: Chưa có test cases cho các components và services
- [ ] **E2E Tests**: Chưa có end-to-end testing
- [ ] **Image Upload Preview**: Chưa có preview ảnh trước khi upload
- [ ] **Pagination**: Một số trang danh sách chưa có phân trang
- [ ] **Search & Filter**: Một số trang chưa có tìm kiếm và lọc nâng cao
- [ ] **Export Reports**: Chưa có tính năng xuất báo cáo ra file (PDF, Excel)

### Backend
- [ ] **Update Category API**: Endpoint cập nhật danh mục chưa được implement
- [ ] **Unit Tests**: Chưa có test cases cho services và controllers
- [ ] **Integration Tests**: Chưa có integration tests
- [ ] **API Documentation**: Chưa có Swagger/OpenAPI documentation
- [ ] **Input Validation**: Một số endpoint chưa có validation đầy đủ
- [ ] **Error Handling**: Cần cải thiện error handling và error messages
- [ ] **Logging**: Cần thêm logging chi tiết hơn
- [ ] **Caching**: Chưa implement caching cho các query thường dùng
- [ ] **Rate Limiting**: Chưa có rate limiting cho API
- [ ] **File Upload Validation**: Cần validate file type và size tốt hơn

### Database
- [ ] **Indexes**: Cần thêm indexes cho các cột thường query
- [ ] **Migrations**: Chưa có migration scripts
- [ ] **Backup Strategy**: Chưa có chiến lược backup

### DevOps & Deployment
- [ ] **Docker**: Chưa có Dockerfile và docker-compose
- [ ] **CI/CD**: Chưa có pipeline CI/CD
- [ ] **Environment Variables**: Cần tách các sensitive data ra environment variables
- [ ] **Monitoring**: Chưa có monitoring và alerting
- [ ] **Load Balancing**: Chưa có cấu hình load balancing

### Security
- [ ] **HTTPS**: Cần cấu hình HTTPS cho production
- [ ] **Password Policy**: Cần thêm password policy
- [ ] **2FA**: Chưa có two-factor authentication
- [ ] **Audit Log**: Chưa có audit log cho các thao tác quan trọng

### Features
- [ ] **Email Notifications**: Chưa có hệ thống gửi email thông báo
- [ ] **SMS Notifications**: Chưa có gửi SMS
- [ ] **Push Notifications**: Chưa có push notifications cho mobile
- [ ] **Multi-language**: Chưa hỗ trợ đa ngôn ngữ
- [ ] **Print Receipt**: Chưa có tính năng in hóa đơn
- [ ] **Inventory Management**: Chưa có quản lý kho nguyên liệu
- [ ] **Staff Management**: Chưa có quản lý nhân viên chi tiết
- [ ] **Shift Management**: Chưa có quản lý ca làm việc
- [ ] **Loyalty Program**: Chưa có chương trình tích điểm chi tiết

## 🐛 Troubleshooting

### Backend không kết nối được database
- Kiểm tra connection string trong `application.yml`
- Đảm bảo SQL Server đang chạy
- Kiểm tra firewall và network

### Frontend không kết nối được API
- Kiểm tra `VITE_API_URL` trong `.env`
- Đảm bảo backend đang chạy
- Kiểm tra CORS configuration

### WebSocket không hoạt động
- Kiểm tra WebSocket configuration trong backend
- Đảm bảo STOMP client được cấu hình đúng
- Kiểm tra network và firewall

## 📄 License

Dự án này được phát triển bởi QuocTriDev.

## 👨‍💻 Tác Giả

**QuocTriDev**

- Email: quoctris.dev@gmail.com
- Phone: 0793391878
- Facebook: [quoctris.dev](https://www.facebook.com/quoctris.dev/)

---

⭐ Nếu bạn thấy dự án này hữu ích, hãy cho một star!

