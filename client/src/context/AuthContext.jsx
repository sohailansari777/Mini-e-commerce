import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import { setAuthToken, configureApiClient } from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const updateToken = useCallback((token) => {
    setAccessTokenState(token);
    setAuthToken(token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout server request failed:', err);
    } finally {
      updateToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    }
  }, [updateToken]);

  // Configure apiClient callbacks
  useEffect(() => {
    configureApiClient(updateToken, () => {
      updateToken(null);
      setUser(null);
      setIsAuthenticated(false);
    });
  }, [updateToken]);

  // Load initial current user session
  const initializeAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Try refresh token to see if httpOnly cookie is present
      const refreshRes = await authService.refreshToken();
      if (refreshRes && refreshRes.accessToken) {
        updateToken(refreshRes.accessToken);
        const meRes = await authService.getCurrentUser();
        if (meRes && meRes.user) {
          setUser(meRes.user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      // Silent failure on init - user is guest
      updateToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [updateToken]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials) => {
    setAuthError(null);
    try {
      const data = await authService.login(credentials);
      if (data.accessToken) {
        updateToken(data.accessToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      }
      throw new Error('No access token received');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      setAuthError(errMsg);
      throw err;
    }
  };

  const register = async (data) => {
    setAuthError(null);
    try {
      const result = await authService.register(data);
      return result;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      setAuthError(errMsg);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res && res.user) {
        setUser((prev) => ({ ...prev, ...res.user }));
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const res = await authService.changePassword(passwordData);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      updateToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        loading,
        authError,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        initializeAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
