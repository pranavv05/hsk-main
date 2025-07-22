// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// --- CHANGED: We now import from our real apiService ---
import { registerUser, loginUser } from '../utils/apiService';

// Define the shape of the user object
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  profileImage?: string;
}

// Define the shape of the context's value
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component that will wrap our application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check for existing user

  // This effect runs once when the app starts to see if a user is already logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('hindu_seva_kendra_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- REWIRED: The register function now calls our backend via apiService ---
  const register = async (userData: any): Promise<User> => {
    const newUser = await registerUser(userData);
    setUser(newUser); // Set the user state upon successful registration
    return newUser;
  };

  // --- REWIRED: The login function also calls our backend via apiService ---
  const login = async (email: string, password: string): Promise<User> => {
    const loggedInUser = await loginUser(email, password);
    setUser(loggedInUser); // Set the user state upon successful login
    return loggedInUser;
  };

  // --- REWIRED: The logout function clears our user and localStorage ---
  const logout = () => {
    setUser(null);
    // Clear both the user and the old auth library token, just in case
    localStorage.removeItem('hindu_seva_kendra_user');
    
    // Find and remove the old auth library token
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith('-auth-token')) {
            localStorage.removeItem(key);
        }
    }
  };

  // The value provided to all children components
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// The custom hook that components will use to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};