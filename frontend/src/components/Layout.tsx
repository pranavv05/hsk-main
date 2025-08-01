import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, ChevronDown, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'vendor':
        return '/dashboard/vendor';
      case 'user':
        return '/dashboard/user';
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();
  
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' }
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-2">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <a href="tel:+919876543210" className="flex items-center hover:text-blue-100 transition-colors">
                <Phone className="w-4 h-4 mr-1" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:info@hindusevakendra.com" className="flex items-center hover:text-blue-100 transition-colors">
                <Mail className="w-4 h-4 mr-1" />
                <span>info@hindusevakendra.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <a href="#" className="hover:text-blue-200 transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg mr-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                Hindu Seva Kendra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-3 text-sm font-medium group transition-colors ${
                    location.pathname === link.to
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${
                      location.pathname === link.to ? 'w-full' : ''
                    }`}
                  />
                </Link>
              ))}
              {dashboardLink && <Link to={dashboardLink} className={`${location.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                Dashboard
              </Link>}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {user.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown 
                      className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
                      >
                        <div className="p-1">
                          <div className="px-4 py-3 border-b">
                            <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            to={dashboardLink || '#'}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="mr-3 h-5 w-5 text-gray-400" />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-50 text-left"
                          >
                            <LogOut className="mr-3 h-5 w-5 text-red-400" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              {user && (
                <Link to={dashboardLink || '#'} className="mr-4 p-2 text-gray-600 hover:text-blue-600 md:hidden">
                  <User className="h-5 w-5" />
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden mt-4 pb-4">
        <nav className="flex flex-col space-y-3">
          {navLinks.map(link => <Link key={link.to} to={link.to} className={`${location.pathname === link.to ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`} onClick={() => setMobileMenuOpen(false)}>
            {link.label}
          </Link>)}
          {dashboardLink && <Link to={dashboardLink} className={`${location.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`} onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>}
        </nav>
        <div className="mt-4 pt-4 border-t border-gray-200">
          {user ? <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              {user.profileImage ? <img src={user.profileImage} alt={user.name} className="h-8 w-8 rounded-full object-cover" /> : <User className="h-5 w-5 text-gray-600" />}
              <span className="ml-2 text-gray-700">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-red-600">
              <LogOut className="h-5 w-5 mr-1" />
              <span>Logout</span>
            </button>
          </div> : <div className="flex flex-col space-y-3">
            <Link to="/login" className="text-blue-600 hover:text-blue-800" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center" onClick={() => setMobileMenuOpen(false)}>
              Register
            </Link>
          </div>}
        </div>
      </div>}

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Hindu Seva Kendra</h3>
              <p className="text-gray-600">
                Connecting users who need services with vendors who provide
                them.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-blue-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-blue-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact</h3>
              <p className="text-gray-600">
                123 Hindu Seva Road
                <br />
                Mumbai, Maharashtra
                <br />
                India 400001
                <br />
                info@hindusevakendra.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-gray-600">
            &copy; {new Date().getFullYear()} Hindu Seva Kendra. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}