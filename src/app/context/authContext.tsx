'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

type User = {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // FIX: Wrap login in useCallback to prevent infinite loops
  const login = useCallback((userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []); // Empty dependency array means this function never changes

  // FIX: Wrap logout in useCallback as well
  const logout = useCallback(async () => {
    const api = process.env.NEXT_PUBLIC_API;

    try {
      if (user?.token) {
        await fetch(`${api}/auth/logout`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API failed:', error);
    }

    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }, [user?.token, router]); // Re-create only if user token changes

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
