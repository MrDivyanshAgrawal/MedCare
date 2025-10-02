// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { login, register, logout, getCurrentUser, isTokenValid } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      if (isTokenValid()) {
        setCurrentUser(getCurrentUser());
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    try {
      setError(null);
      const data = await login({ email, password });
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      setError(null);
      const data = await register(userData);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logoutUser = () => {
    logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
