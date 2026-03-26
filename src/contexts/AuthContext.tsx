'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut as firebaseSignOut, User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firestore/users';
import { AppUser, UserRole } from '@/types';

interface AuthContextValue {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (section: string) => boolean;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const data = await getUserById(firebaseUser.uid);
        setAppUser(data);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAppUser(null);
  };

  // Permission map: which roles can access which section
  const PERMISSIONS: Record<string, UserRole[]> = {
    blog: ['admin', 'editor_blog'],
    services: ['admin', 'editor_services'],
    projects: ['admin', 'editor_projects'],
    news: ['admin', 'editor_news'],
    contacts: ['admin'],
    users: ['admin'],
    home_content: ['admin'],
    about_content: ['admin'],
  };

  const hasPermission = (section: string): boolean => {
    if (!appUser) return false;
    if (appUser.role === 'admin') return true;
    const allowed = PERMISSIONS[section] ?? [];
    return allowed.includes(appUser.role);
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signIn, signOut, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
