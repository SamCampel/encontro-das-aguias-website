import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('adminUser') || 'null'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('adminToken', token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }, [token]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(undefined, (error) => {
      if (error.response?.status === 401) logout();
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(interceptor);
  });

  const login = (newToken, user) => {
    setToken(newToken);
    setAdmin(user);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(user));
  };

  const logout = () => {
    setToken('');
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const value = useMemo(() => ({ token, admin, login, logout, isAuthenticated: Boolean(token) }), [token, admin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
