import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('customerToken') || '');
  const [customer, setCustomer] = useState(() => JSON.parse(localStorage.getItem('customerUser') || 'null'));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('customerToken', token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      api
        .get('/customers/me')
        .then((res) => setCustomer(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
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
    setCustomer(user);
    localStorage.setItem('customerToken', newToken);
    localStorage.setItem('customerUser', JSON.stringify(user));
  };

  const logout = () => {
    setToken('');
    setCustomer(null);
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
  };

  const value = useMemo(
    () => ({
      token,
      customer,
      login,
      logout,
      isAuthenticated: Boolean(token),
      loading,
    }),
    [token, customer, loading],
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
