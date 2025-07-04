// components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import LoadingIcon from './LoadingIcon';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, checking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checking && !user) {
      router.replace('/auth/signin');
    }
  }, [checking, user, router]);

  if (checking || !user) {
    return <LoadingIcon/>; // or spinner
  }

  return <>{children}</>;
}
