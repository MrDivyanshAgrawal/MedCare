import * as jwtDecode from 'jwt-decode';
import api from './api';

export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  return JSON.parse(userStr);
};

export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode.decode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    logout();
    return false;
  }
};

export const updateProfile = async (userData) => {
  // Check if userData is FormData or regular object
  let response;
  
  if (userData instanceof FormData) {
    // If FormData, use it directly with multipart/form-data content type
    response = await api.put('/users/profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } else {
    // If regular object, sanitize and send as JSON
    const sanitizedData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      ...(userData.password && { password: userData.password }),
      ...(userData.profilePicture && { profilePicture: userData.profilePicture })
    };
    
    response = await api.put('/users/profile', sanitizedData);
  }
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};
