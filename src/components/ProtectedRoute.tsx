import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useAppSelector, useAppDispatch } from '../../src/redux/hooks/hooks';
import {  logoutUser} from '../../src/redux/features/auth/authSlice';

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
};

const getTokenExpiryInMs = (token: string): number => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const now = Date.now() / 1000;
    return (decoded.exp - now) * 1000; // milliseconds
  } catch {
    return 0;
  }
};

const ProtectedRoute: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const isAuthenticated = Boolean(user && token && !isTokenExpired(token));

  useEffect(() => {
    if (token) {
      const timeout = getTokenExpiryInMs(token);
      if (timeout > 0) {
        const timer = setTimeout(() => {
          dispatch(logoutUser());
        }, timeout);
        return () => clearTimeout(timer); // Cleanup
      } else {
        dispatch(logoutUser());
      }
    }
  }, [token, dispatch]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
