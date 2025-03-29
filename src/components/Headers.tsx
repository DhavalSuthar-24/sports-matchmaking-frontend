import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "@/redux/features/auth/authSlice";
import { RootState } from '@/redux/store';
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
  Sun,
  Moon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/" className="text-2xl font-bold text-yellow-500 dark:text-yellow-400 flex items-center">
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
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors font-medium"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-400"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition font-medium"
              >
                <LogOut className="mr-2" size={18} />
                Logout
              </motion.button>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-2 border border-yellow-500 dark:border-yellow-400 text-yellow-500 dark:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-gray-800 transition font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="flex items-center px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700 transition font-medium shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button 
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
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
                    className="flex items-center py-3 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-lg px-3 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {token ? (
                  <motion.button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="block w-full text-center py-3 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded-lg font-medium"
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
                        className="block text-center py-3 border border-yellow-500 dark:border-yellow-400 text-yellow-500 dark:text-yellow-400 rounded-lg font-medium"
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
                        className="block text-center py-3 bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg font-medium shadow"
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

export default Header;