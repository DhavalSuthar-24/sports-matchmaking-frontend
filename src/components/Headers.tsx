import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import      {logoutUser}       from "@/redux/features/auth/authSlice"
import { 
  Home, 
  Users, 
  Trophy, 
  Shield, 
  Target, 
  Menu, 
  X, 

  Zap,
LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { RootState } from '@/redux/store';

// Header Component
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const handleLogout = () => {
    dispatch(logoutUser());
  };


  const navItems = [
    { icon: <Home size={18} />, label: 'Home', path: '/' },
    { icon: <Users size={18} />, label: 'Teams', path: '/teams' },
    { icon: <Trophy size={18} />, label: 'Tournaments', path: '/tournaments' },
    { icon: <Shield size={18} />, label: 'Challenges', path: '/challenges' },
    { icon: <Target size={18} />, label: 'Sports', path: '/sports' },
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/" className="text-2xl font-bold text-yellow-500 flex items-center">
            <Zap className="mr-2" fill="currentColor" />
            GameFace
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <motion.div 
              key={item.path}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={item.path} 
                className="flex items-center text-gray-700 hover:text-yellow-500 transition-colors font-medium"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Authentication Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </motion.button>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className="flex items-center px-4 py-2 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-50 transition font-medium"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link 
                    to={item.path} 
                    className="flex items-center py-3 text-gray-700 hover:bg-yellow-50 rounded-lg px-3 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="space-y-3 pt-3 border-t">
                {token ? (
                  <motion.button
                    onClick={() => {
                     handleLogout()
                      setIsMenuOpen(false);
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="block w-full text-center py-3 border border-red-500 text-red-500 rounded-lg font-medium"
                  >
                    Logout
                  </motion.button>
                ) : (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Link 
                        to="/login" 
                        className="block text-center py-3 border border-yellow-500 text-yellow-500 rounded-lg font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                    >
                      <Link 
                        to="/register" 
                        className="block text-center py-3 bg-yellow-500 text-white rounded-lg font-medium shadow"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header