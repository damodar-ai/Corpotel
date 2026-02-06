import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../services';

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  corporateClientId?: number;
  identityType?: 'Hotel' | 'Corporate' | null;
  isProfileCompleted?: boolean;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  getGoogleAuthUrl: () => Promise<string>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const getGoogleAuthUrl = async (): Promise<string> => {
    try {
      const response = await authService.getGoogleAuthUrl();
      return response.data.authUrl;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (code: string) => {
    try {
      const response = await authService.loginWithGoogle(code);
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await authService.register(email, password, firstName, lastName);
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithGoogle, getGoogleAuthUrl, register, updateUser, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
