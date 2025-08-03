import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './pages/AdminDashboard';
import Contact  from './pages/Contact';
import Home from './pages/Home';
import  About  from './pages/About';
import { Layout } from './components/Layout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { UserDashboard } from './pages/UserDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
// Protected route component
const ProtectedRoute = ({
  element,
  requiredRole
}: {
  element: JSX.Element;
  requiredRole?: string;
}) => {
  const {
    user
  } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return element;
};
export function App() {
  return <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/user" element={<ProtectedRoute element={<UserDashboard />} requiredRole="user" />} />
            <Route path="/dashboard/vendor" element={<ProtectedRoute element={<VendorDashboard />} requiredRole="vendor" />} />
            <Route path="/dashboard/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>;
}