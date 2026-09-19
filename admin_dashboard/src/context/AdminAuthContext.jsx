import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session on mount
    const savedToken = localStorage.getItem('elderguard_admin_token');
    const savedUser = localStorage.getItem('elderguard_admin_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setAdmin(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('elderguard_admin_token');
        localStorage.removeItem('elderguard_admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await adminApi.login(email, password);
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem('elderguard_admin_token', data.token);
    localStorage.setItem('elderguard_admin_user', JSON.stringify(data.admin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('elderguard_admin_token');
    localStorage.removeItem('elderguard_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
