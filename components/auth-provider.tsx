'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('garagefy_token');
    const storagedUser = Cookies.get('garagefy_user');

    if (token && storagedUser) {
      try {
        setUser(JSON.parse(storagedUser));
      } catch {
        Cookies.remove('garagefy_token');
        Cookies.remove('garagefy_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: loggedUser } = response.data;

    setUser(loggedUser);

    Cookies.set('garagefy_token', token, { expires: 7 });
    Cookies.set('garagefy_user', JSON.stringify(loggedUser), { expires: 7 });

    router.push('/');
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, user: newUser } = response.data;

    setUser(newUser);

    Cookies.set('garagefy_token', token, { expires: 7 });
    Cookies.set('garagefy_user', JSON.stringify(newUser), { expires: 7 });

    router.push('/');
  };

  const signOut = () => {
    Cookies.remove('garagefy_token');
    Cookies.remove('garagefy_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
