'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'participant';
  status: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      // In a real app, you would get the user from your auth system
      // For now, we'll simulate based on the current path or a token
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Fallback: determine role from current path
        const pathname = window.location.pathname;
        if (pathname.includes('/admin-dashboard')) {
          setUser({
            id: 1,
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active'
          });
        } else if (pathname.includes('/participant-dashboard')) {
          setUser({
            id: 1,
            name: 'Participant User',
            email: 'participant@example.com',
            role: 'participant',
            status: 'active'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Fallback logic
      const pathname = window.location.pathname;
      if (pathname.includes('/admin-dashboard')) {
        setUser({
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active'
        });
      } else if (pathname.includes('/participant-dashboard')) {
        setUser({
          id: 1,
          name: 'Participant User',
          email: 'participant@example.com',
          role: 'participant',
          status: 'active'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
