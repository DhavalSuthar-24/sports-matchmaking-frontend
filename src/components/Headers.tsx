import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Home, 
    Users, 
    Trophy, 
    Shield, 
    Target, 
    Menu, 
    X, 
    LogIn, 
    UserPlus 
  } from 'lucide-react';

  
  // Header Component
 export  const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const navItems = [
      { icon: <Home />, label: 'Home', path: '/' },
      { icon: <Users />, label: 'Teams', path: '/teams' },
      { icon: <Trophy />, label: 'Tournaments', path: '/tournaments' },
      { icon: <Shield />, label: 'Challenges', path: '/challenges' },
      { icon: <Target />, label: 'Sports', path: '/sports' }
    ];
  
    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <Trophy className="mr-2" />
            Sports Connect
          </Link>
  
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </nav>
  
          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition"
            >
              <LogIn className="mr-2" size={20} />
              Login
            </Link>
            <Link 
              to="/register" 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <UserPlus className="mr-2" size={20} />
              Sign Up
            </Link>
          </div>
  
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
  
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className="flex items-center py-2 text-gray-700 hover:bg-blue-50 rounded-md px-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
                <div className="space-y-2 pt-2 border-t">
                  <Link 
                    to="/login" 
                    className="block text-center py-2 border border-blue-500 text-blue-500 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block text-center py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  };

  export default Header