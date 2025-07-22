import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  const location = useLocation();
  const {
    user,
    logout
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const navLinks = [{
    to: '/',
    label: 'Home'
  }, {
    to: '/about',
    label: 'About Us'
  }, {
    to: '/contact',
    label: 'Contact'
  }];
  return <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold flex items-center">
              <span className="text-orange-600">Hindu</span>
              <span className="text-green-600 mx-1">Seva</span>
              <span className="text-blue-600">Kendra</span>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                {navLinks.map(link => <Link key={link.to} to={link.to} className={`${location.pathname === link.to ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                    {link.label}
                  </Link>)}
                {dashboardLink && <Link to={dashboardLink} className={`${location.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                    Dashboard
                  </Link>}
              </nav>
              {user ? <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {user.profileImage ? <img src={user.profileImage} alt={user.name} className="h-8 w-8 rounded-full object-cover" /> : <User className="h-5 w-5 text-gray-600" />}
                    <span className="ml-2 text-gray-700">{user.name}</span>
                  </div>
                  <button onClick={() => logout()} className="flex items-center text-gray-600 hover:text-red-600">
                    <LogOut className="h-5 w-5 mr-1" />
                    <span>Logout</span>
                  </button>
                </div> : <div className="flex space-x-4">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Register
                  </Link>
                </div>}
            </div>
            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
                    <button onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }} className="flex items-center text-gray-600 hover:text-red-600">
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
        </div>
      </header>
      <main className="flex-grow bg-gray-50">{children}</main>
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
    </div>;
}