import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User roles matching backend
export const ROLES = {
  CENTRAL_ADMIN: 'central_admin',
  CENTRAL_FINANCE: 'central_finance',
  STATE_NODAL: 'state_nodal',
  STATE_FINANCE: 'state_finance',
  DISTRICT_OFFICER: 'district_officer',
  IMPLEMENTING_AGENCY: 'implementing_agency',
  EXECUTING_AGENCY: 'executing_agency',
  AUDITOR: 'auditor'
};

// Role display names
export const ROLE_NAMES = {
  central_admin: 'Central Admin (MoSJE)',
  central_finance: 'Central Finance Officer',
  state_nodal: 'State Nodal Officer',
  state_finance: 'State Finance Officer',
  district_officer: 'District Officer',
  implementing_agency: 'Implementing Agency',
  executing_agency: 'Executing Agency',
  auditor: 'Auditor'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('pm_ajay_token');
      const storedUser = localStorage.getItem('pm_ajay_user');
      
      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching profile
          const response = await authService.getProfile();
          if (response.success) {
            setUser(response.user);
            // Update stored user data
            localStorage.setItem('pm_ajay_user', JSON.stringify(response.user));
          }
        } catch (err) {
          // Token invalid, clear storage
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register(userData);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await authService.updateProfile(updates);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('pm_ajay_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    updateProfile,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role),
    // Helper to check if user can access central admin features
    isCentralAdmin: () => user?.role === ROLES.CENTRAL_ADMIN,
    isCentralFinance: () => user?.role === ROLES.CENTRAL_FINANCE,
    isStateNodal: () => user?.role === ROLES.STATE_NODAL,
    isStateFinance: () => user?.role === ROLES.STATE_FINANCE,
    isDistrictOfficer: () => user?.role === ROLES.DISTRICT_OFFICER,
    isImplementingAgency: () => user?.role === ROLES.IMPLEMENTING_AGENCY,
    isExecutingAgency: () => user?.role === ROLES.EXECUTING_AGENCY,
    isAuditor: () => user?.role === ROLES.AUDITOR
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
