'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  section?: string;
}

export default function ProtectedRoute({ children, section }: Props) {
  const { user, appUser, loading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (section && !hasPermission(section)) {
        router.replace('/dashboard');
      }
    }
  }, [user, appUser, loading, section, router, hasPermission]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;
  if (section && !hasPermission(section)) return null;

  return <>{children}</>;
}
