import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import CustomerLayout from './components/CustomerLayout.jsx'

// Admin Pages
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MenuItems from './pages/MenuItems.jsx'
import Categories from './pages/Categories.jsx'
import Orders from './pages/Orders.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import CreateOrder from './pages/CreateOrder.jsx'
import Tables from './pages/Tables.jsx'
import Customers from './pages/Customers.jsx'
import Discounts from './pages/Discounts.jsx'
import Zones from './pages/Zones.jsx'
import Reports from './pages/Reports.jsx'

// Customer Pages
import CustomerLogin from './pages/customer/Login.jsx'
import CustomerRegister from './pages/customer/Register.jsx'
import CustomerHome from './pages/customer/Home.jsx'
import CustomerMenu from './pages/customer/Menu.jsx'
import CustomerCart from './pages/customer/Cart.jsx'
import CustomerCheckout from './pages/customer/Checkout.jsx'
import CustomerOrders from './pages/customer/Orders.jsx'
import CustomerOrderTracking from './pages/customer/OrderTracking.jsx'
import CustomerProfile from './pages/customer/Profile.jsx'
import QRScan from './pages/customer/QRScan.jsx'

// Chef Pages
import ChefDashboard from './pages/chef/ChefDashboard.jsx'
import ChefLogin from './pages/chef/ChefLogin.jsx'

// Order Staff Pages
import OrderStaffDashboard from './pages/order/OrderStaffDashboard.jsx'
import OrderStaffLogin from './pages/order/OrderStaffLogin.jsx'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin Routes - Chỉ ADMIN và MANAGER mới vào được */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}><Layout /></RoleProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="menu" element={<MenuItems />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="orders/create" element={<CreateOrder />} />
              <Route path="tables" element={<Tables />} />
              <Route path="zones" element={<Zones />} />
              <Route path="customers" element={<Customers />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Chef Routes - Chỉ CHEF mới vào được */}
            <Route path="/chef/login" element={<ChefLogin />} />
            <Route path="/chef" element={<RoleProtectedRoute allowedRoles="CHEF" redirectTo="/chef/login"><ChefDashboard /></RoleProtectedRoute>} />

            {/* Order Staff Routes - Chỉ ORDER mới vào được */}
            <Route path="/order-staff/login" element={<OrderStaffLogin />} />
            <Route path="/order-staff" element={<RoleProtectedRoute allowedRoles="ORDER" redirectTo="/order-staff/login"><OrderStaffDashboard /></RoleProtectedRoute>} />

            {/* Customer Routes */}
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/register" element={<CustomerRegister />} />
            <Route path="/qr-scan" element={<QRScan />} />
            {/* Public routes - không cần đăng nhập */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<CustomerHome />} />
              <Route path="menu" element={<CustomerMenu />} />
              <Route path="cart" element={<CustomerCart />} />
              {/* Protected customer routes - chỉ CUSTOMER mới vào được */}
              <Route path="checkout" element={<RoleProtectedRoute allowedRoles="CUSTOMER" redirectTo="/login"><CustomerCheckout /></RoleProtectedRoute>} />
              <Route path="my-orders" element={<RoleProtectedRoute allowedRoles="CUSTOMER" redirectTo="/login"><CustomerOrders /></RoleProtectedRoute>} />
              <Route path="my-orders/:id" element={<RoleProtectedRoute allowedRoles="CUSTOMER" redirectTo="/login"><CustomerOrderTracking /></RoleProtectedRoute>} />
              <Route path="profile" element={<RoleProtectedRoute allowedRoles="CUSTOMER" redirectTo="/login"><CustomerProfile /></RoleProtectedRoute>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

