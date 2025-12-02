import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (nipd: string, password: string) => Promise<boolean>;
  register: (nipd: string, name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: '@perpustb_users',
  CURRENT_USER: '@perpustb_current_user',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current user on app start
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const currentUserJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (nipd: string, name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Check if NIPD already exists
      const existingUser = users.find((u: any) => u.nipd === nipd);
      if (existingUser) {
        return false; // NIPD already registered
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        nipd,
        name,
        email,
        password, // In production, hash this!
      };

      // Save to users list
      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Set as current user
      const userToSave = { id: newUser.id, nipd: newUser.nipd, name: newUser.name, email: newUser.email };
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userToSave));
      setUser(userToSave);

      return true;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  };

  const login = async (nipd: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user with matching NIPD and password
      const user = users.find((u: any) => u.nipd === nipd && u.password === password);
      
      if (!user) {
        return false; // Invalid credentials
      }

      // Set as current user
      const userToSave = { id: user.id, nipd: user.nipd, name: user.name, email: user.email };
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userToSave));
      setUser(userToSave);

      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
