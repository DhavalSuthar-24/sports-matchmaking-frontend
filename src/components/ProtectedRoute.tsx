
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../src/redux/hooks/hooks';

const ProtectedRoute: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  console.log(token)
  const isAuthenticated = Boolean(user && token);
console.log(isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
