import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const data = await authService.login({ email, password });
      setCurrentUser(data);
      toast.success('Login successful');
      setAuthLoading(false);
      return data;
    } catch (error) {
      setAuthLoading(false);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const data = await authService.register(userData);
      setCurrentUser(data);
      toast.success('Registration successful');
      setAuthLoading(false);
      return data;
    } catch (error) {
      setAuthLoading(false);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  const updateProfile = async (userData) => {
    setAuthLoading(true);
    try {
      const data = await authService.updateProfile(userData);
      setCurrentUser(data);
      toast.success('Profile updated successfully');
      setAuthLoading(false);
      return data;
    } catch (error) {
      setAuthLoading(false);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    loading,
    authLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
