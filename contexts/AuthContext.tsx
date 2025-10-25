
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (ssoIdOrEmail: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'stationId'> & { stationName: string; password: string, stationId: string | null}) => Promise<User | null>;
  updateUserProfile: (updates: Partial<Omit<User, 'id' | 'ssoId'>>, passwordData: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (ssoIdOrEmail: string, password: string) => {
    const loggedInUser = await api.login(ssoIdOrEmail, password);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'stationId'> & { stationName: string; password: string, stationId: string | null}) => {
    const newUser = await api.registerUser(userData);
    if(newUser) {
      // maybe log them in automatically after registration
      // setUser(newUser); 
    }
    return newUser;
  };

  const updateUserProfile = async (updates: Partial<Omit<User, 'id' | 'ssoId'>>, passwordData: { currentPassword: string; newPassword: string }) => {
    if (!user) throw new Error("No user is logged in.");
    try {
      const updatedUser = await api.updateUserProfile(user.id, updates, passwordData);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile in context:", error);
      throw error; // Re-throw to be handled by the UI
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
