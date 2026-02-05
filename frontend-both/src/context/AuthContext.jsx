import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Invalid stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        
        const userData = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userName', userData.name);
        
        if (response.user.vehicleType && response.user.vehicleBrand && response.user.vehicleModel) {
          const vehicleData = {
            vehicleType: response.user.vehicleType,
            vehicleBrand: response.user.vehicleBrand,
            vehicleModel: response.user.vehicleModel,
            vehicleNumber: response.user.vehicleNumber || ''
          };
          localStorage.setItem('userData', JSON.stringify(vehicleData));
        }

        return { success: true };
      } else {
        return { success: false, message: 'Invalid response format' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.signup(userData);
      
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        
        const newUser = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('userId', newUser.id);
        localStorage.setItem('userRole', newUser.role);
        localStorage.setItem('userEmail', newUser.email);
        localStorage.setItem('userName', newUser.name);
        
        if (userData.vehicleType && userData.vehicleBrand && userData.vehicleModel) {
          const vehicleData = {
            vehicleType: userData.vehicleType,
            vehicleBrand: userData.vehicleBrand,
            vehicleModel: userData.vehicleModel,
            vehicleNumber: userData.vehicleNumber || ''
          };
          localStorage.setItem('userData', JSON.stringify(vehicleData));
        }

        return { success: true };
      } else {
        return { success: false, message: 'Invalid response format' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isUser: user?.role === 'User',
    isStationMaster: user?.role === 'StationMaster'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};