import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { RootState } from '../store';
import { logoutUser } from '../features/auth/authSlice';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = Boolean(user && token);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return { user, token, isAuthenticated, loading, error, logout: handleLogout };
};

export default useAuth;
