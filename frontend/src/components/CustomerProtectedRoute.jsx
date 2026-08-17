import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerProtectedRoute({ children }) {
  const { isAuthenticated } = useCustomerAuth();
  return isAuthenticated ? children : <Navigate to="/entrar" replace />;
}
