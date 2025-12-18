# 🚀 FOCO Backend

Backend API cho hệ thống quản lý nhà hàng FOCO, được xây dựng với Spring Boot.

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Công Nghệ](#công-nghệ)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Yêu Cầu](#yêu-cầu)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Security](#security)
- [WebSocket](#websocket)

## 🎯 Tổng Quan

Backend cung cấp RESTful API và WebSocket cho hệ thống quản lý nhà hàng, bao gồm:

- Authentication & Authorization với JWT
- Quản lý Menu & Danh mục
- Quản lý Đơn hàng
- Quản lý Bàn & Khu vực
- Thanh toán
- Mã giảm giá
- Quản lý khách hàng
- Real-time updates qua WebSocket

## 🛠️ Công Nghệ

- **Framework**: Spring Boot 3.5.0
- **Java Version**: 21
- **Database**: SQL Server
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Real-time**: WebSocket (STOMP)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Build Tool**: Maven
- **Dependencies**:
  - Spring Boot Web
  - Spring Boot Data JPA
  - Spring Boot Security
  - Spring WebSocket
  - JWT (io.jsonwebtoken)
  - SQL Server Driver
  - AWS SDK (cho R2)

## 📁 Cấu Trúc Dự Án

```
backend/
├── src/
│   ├── main/
│   │   ├── java/dev/datn/foco/
│   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   └── CloudflareR2Config.java
│   │   │   ├── controller/      # REST Controllers
│   │   │   │   ├── AuthenticationController.java
│   │   │   │   ├── MenuItemController.java
│   │   │   │   ├── OrderController.java
│   │   │   │   └── ...
│   │   │   ├── service/         # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── MenuItemService.java
│   │   │   │   └── impl/        # Service implementations
│   │   │   ├── repository/      # Data access layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── MenuItemRepository.java
│   │   │   │   └── ...
│   │   │   ├── model/           # Entity models
│   │   │   │   ├── User.java
│   │   │   │   ├── MenuItem.java
│   │   │   │   └── ...
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── request/     # Request DTOs
│   │   │   │   ├── respone/     # Response DTOs
│   │   │   │   └── ApiResponse.java
│   │   │   ├── util/            # Utilities
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── JwtFilter.java
│   │   │   │   └── JwtAccessDeniedHandler.java
│   │   │   ├── constaint/       # Constants
│   │   │   │   ├── RoleName.java
│   │   │   │   └── ApiVersion.java
│   │   │   └── FocoApplication.java
│   │   └── resources/
│   │       └── application.yml  # Configuration
│   └── test/                    # Test files
└── pom.xml
```

## 💻 Yêu Cầu

- Java 21+
- Maven 3.6+
- SQL Server 2019+
- IDE: IntelliJ IDEA / Eclipse / VS Code

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/quoctridev/Foco.git
cd Foco/backend
```

### 2. Cài Đặt Dependencies

```bash
mvn clean install
```

### 3. Cấu Hình Database

1. Tạo database trong SQL Server
2. Import file `DB.sql` (ở root project) vào database
3. Cập nhật connection string trong `src/main/resources/application.yml`

### 4. Cấu Hình Cloudflare R2 (Optional)

Nếu sử dụng Cloudflare R2 cho file storage, cập nhật credentials trong `application.yml`:

```yaml
cloudflare:
  r2:
    account-id: your-account-id
    access-key-id: your-access-key
    secret-access-key: your-secret-key
    bucket-name: your-bucket-name
    public-url: your-public-url
```

## ⚙️ Cấu Hình

File cấu hình chính: `src/main/resources/application.yml`

### Database Configuration

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=foco_db
    username: your-username
    password: your-password
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
```

### JPA Configuration

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: none  # Sử dụng none khi đã có schema
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLServerDialect
```

### File Upload Configuration

```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 20MB
      max-request-size: 20MB
```

## ▶️ Chạy Ứng Dụng

### Development Mode

```bash
mvn spring-boot:run
```

### Production Mode

```bash
mvn clean package
java -jar target/foco-0.0.1-SNAPSHOT.war
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

## 📡 API Endpoints

Base URL: `http://localhost:8080/api/v1`

### Authentication

- `POST /auth/login` - Đăng nhập
- `GET /auth/refresh` - Refresh token

### Menu Items

- `GET /menu-items` - Lấy tất cả món ăn
- `GET /menu-items/{id}` - Lấy món ăn theo ID
- `GET /menu-items/category/{categoryId}` - Lấy món theo danh mục
- `GET /menu-items/available` - Lấy món đang có sẵn
- `POST /menu-items` - Tạo món mới
- `PUT /menu-items/{id}` - Cập nhật món
- `PATCH /menu-items/{id}/availability` - Cập nhật trạng thái
- `DELETE /menu-items/{id}` - Xóa món

### Categories

- `GET /categories` - Lấy tất cả danh mục
- `POST /categories` - Tạo danh mục mới
- `DELETE /categories/{id}` - Xóa danh mục

### Orders

- `GET /orders` - Lấy tất cả đơn hàng
- `GET /orders/{id}` - Lấy đơn hàng theo ID
- `GET /orders/store/{storeId}` - Lấy đơn theo cửa hàng
- `GET /orders/status/{status}` - Lấy đơn theo trạng thái
- `POST /orders` - Tạo đơn hàng mới
- `PATCH /orders/{id}/confirm` - Xác nhận đơn
- `PATCH /orders/{id}/complete` - Hoàn thành đơn
- `PATCH /orders/{id}/cancel` - Hủy đơn
- `PATCH /orders/{id}/status` - Cập nhật trạng thái

### Tables

- `GET /tables/zone/{zoneId}` - Lấy bàn theo khu vực
- `GET /tables/{id}` - Lấy bàn theo ID
- `GET /tables/public/{id}` - Lấy bàn (public)
- `POST /tables` - Tạo bàn mới
- `PUT /tables/{id}` - Cập nhật bàn
- `PATCH /tables/{id}/status` - Cập nhật trạng thái
- `DELETE /tables/{id}` - Xóa bàn

### Zones

- `GET /zone/store?id={storeId}` - Lấy khu vực theo cửa hàng
- `GET /zone?id={id}` - Lấy khu vực theo ID
- `POST /zone` - Tạo khu vực mới
- `PUT /zone?id={id}` - Cập nhật khu vực
- `DELETE /zone?id={id}` - Xóa khu vực

### Payments

- `POST /payments` - Tạo thanh toán
- `GET /payments/{id}` - Lấy thanh toán theo ID
- `GET /payments/order/{orderId}` - Lấy thanh toán theo đơn
- `PATCH /payments/{id}/confirm` - Xác nhận thanh toán
- `PATCH /payments/{id}/status` - Cập nhật trạng thái

### Discounts

- `GET /discounts` - Lấy tất cả mã giảm giá
- `GET /discounts/valid` - Lấy mã còn hiệu lực
- `GET /discounts/{id}` - Lấy mã theo ID
- `GET /discounts/code/{code}` - Lấy mã theo code
- `POST /discounts` - Tạo mã mới
- `PUT /discounts/{id}` - Cập nhật mã
- `DELETE /discounts/{id}` - Xóa mã

### Admin APIs

- `GET /admin/customer` - Lấy tất cả khách hàng
- `GET /admin/customer/tier?id={tierId}` - Lấy khách theo tier
- `POST /admin/customer?id={id}` - Cập nhật khách hàng
- `DELETE /admin/customer?id={id}` - Xóa khách hàng

### Chef APIs

- `GET /chef/orders` - Lấy đơn cần chế biến
- `PATCH /chef/orders/{id}/status` - Cập nhật trạng thái món

### Order Staff APIs

- `GET /order-staff/orders/pending` - Lấy đơn chờ xác nhận
- `GET /order-staff/orders/confirmed` - Lấy đơn đã xác nhận
- `GET /order-staff/orders/active` - Lấy đơn đang xử lý
- `PATCH /order-staff/orders/{id}/confirm` - Xác nhận đơn
- `PATCH /order-staff/orders/{id}/cancel` - Hủy đơn

### Public Customer APIs

- `POST /public/customer/create` - Đăng ký khách hàng
- `POST /public/customer/login` - Đăng nhập khách hàng
- `GET /public/customer/refreshToken` - Refresh token

## 🗄️ Database

### Schema

Database schema được định nghĩa trong file `DB.sql` ở root project.

### Entities Chính

- **User**: Người dùng hệ thống (Admin, Manager, Chef, Order Staff)
- **Customer**: Khách hàng
- **Role**: Vai trò người dùng
- **MenuItem**: Món ăn
- **Category**: Danh mục món ăn
- **Order**: Đơn hàng
- **OrderDetail**: Chi tiết đơn hàng
- **Table**: Bàn ăn
- **Zone**: Khu vực
- **Payment**: Thanh toán
- **Discount**: Mã giảm giá
- **CustomerTier**: Phân cấp khách hàng

## 🔐 Security

### JWT Authentication

- **Access Token**: Hết hạn sau 15 phút
- **Refresh Token**: Hết hạn sau 7 ngày
- Token được lưu trong header: `Authorization: Bearer <token>`

### Role-Based Access Control (RBAC)

Hệ thống hỗ trợ 5 roles:

- `ADMIN`: Quyền cao nhất
- `MANAGER`: Quản lý nhà hàng
- `CHEF`: Xử lý món ăn
- `ORDER`: Xử lý đơn hàng
- `CUSTOMER`: Khách hàng

### Security Configuration

File: `config/SecurityConfig.java`

- CORS được cấu hình để cho phép frontend
- Public endpoints không cần authentication
- Protected endpoints yêu cầu JWT token
- Role-based authorization với `@PreAuthorize`

## 🔌 WebSocket

### Configuration

File: `config/WebSocketConfig.java`

### Endpoints

- Connection: `ws://localhost:8080/ws`
- Topics:
  - `/topic/orders/new` - Đơn hàng mới
  - `/topic/orders/status` - Cập nhật trạng thái đơn
  - `/topic/chef/orders` - Cập nhật món cho Chef
  - `/topic/order-staff/orders` - Cập nhật đơn cho Order Staff

### Usage

Backend gửi message qua WebSocket khi có sự kiện:

```java
@Autowired
private SimpMessagingTemplate messagingTemplate;

messagingTemplate.convertAndSend("/topic/orders/new", order);
```

## 🧪 Testing

```bash
mvn test
```

## 📦 Build

### Development Build

```bash
mvn clean install
```

### Production Build

```bash
mvn clean package
```

Output: `target/foco-0.0.1-SNAPSHOT.war`

## 🐛 Troubleshooting

### Database Connection Error

- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string
- Kiểm tra credentials
- Kiểm tra firewall

### Port Already in Use

Thay đổi port trong `application.yml`:

```yaml
server:
  port: 8081
```

### JWT Token Issues

- Kiểm tra secret key trong `JwtUtil.java`
- Đảm bảo token được gửi đúng format trong header
- Kiểm tra token expiration

## 🚧 Tính Năng Chưa Hoàn Thành

- [ ] **Update Category API**: Endpoint `PUT /categories/{id}` chưa được implement
- [ ] **Unit Tests**: Chưa có test cases cho services và controllers
- [ ] **Integration Tests**: Chưa có integration tests
- [ ] **API Documentation**: Chưa có Swagger/OpenAPI documentation
- [ ] **Input Validation**: Một số endpoint chưa có validation đầy đủ
- [ ] **Error Handling**: Cần cải thiện error handling và error messages
- [ ] **Logging**: Cần thêm logging chi tiết hơn (SLF4J, Logback)
- [ ] **Caching**: Chưa implement caching cho các query thường dùng (Redis)
- [ ] **Rate Limiting**: Chưa có rate limiting cho API
- [ ] **File Upload Validation**: Cần validate file type và size tốt hơn
- [ ] **Database Migrations**: Chưa có migration scripts (Flyway/Liquibase)
- [ ] **Database Indexes**: Cần thêm indexes cho các cột thường query
- [ ] **Email Service**: Chưa có service gửi email thông báo
- [ ] **SMS Service**: Chưa có service gửi SMS
- [ ] **Audit Log**: Chưa có audit log cho các thao tác quan trọng

## 📝 Notes

- Database schema nên được tạo từ file `DB.sql`
- JWT secret keys nên được thay đổi trong production
- Cloudflare R2 credentials nên được bảo mật
- CORS configuration có thể cần điều chỉnh cho production

## 👨‍💻 Developer

**QuocTriDev**

- Email: quoctris.dev@gmail.com

