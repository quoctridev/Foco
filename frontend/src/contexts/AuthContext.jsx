import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import customerService from '../services/customerService';
import { getRoleFromToken, isTokenExpired } from '../util/jwtDecoder';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      if (isTokenExpired(token)) {
        authService.logout();
        setUser(null);
      } else {
        const role = getRoleFromToken(token);
        const userData = JSON.parse(userStr);
        setUser({
          ...userData,
          role: role,
        });
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (username, password, isCustomer = false) => {
    try {
      let response;
      if (isCustomer) {
        response = await customerService.login(username, password);
        const token = response.data.data?.token || response.data.token;
        if (token) {
          const role = getRoleFromToken(token);
          const userData = {
            email: username,
            token: token,
            refreshToken: response.data.data?.refreshToken || response.data.refreshToken,
            role: role || 'CUSTOMER',
          };
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      } else {
        response = await authService.login(username, password);
        const token = response.data.data?.token || response.data.token;
        if (token) {
          const role = getRoleFromToken(token);
          const userData = response.data.data?.user || response.data.user || {};
          const updatedUser = {
            ...userData,
            token: token,
            role: role || userData.roleName,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role.toUpperCase() === role.toUpperCase();
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.some(role => user.role.toUpperCase() === role.toUpperCase());
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    hasRole,
    hasAnyRole,
    role: user?.role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

