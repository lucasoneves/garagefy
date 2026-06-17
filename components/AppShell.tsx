'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/components/auth-provider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signed, loading } = useAuth();

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  useEffect(() => {
    if (loading) return;

    if (signed && isAuthPage) {
      router.push('/');
    } else if (!signed && !isAuthPage) {
      router.push('/login');
    }
  }, [signed, loading, isAuthPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="size-6 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!signed) {
    return null;
  }

  return (
    <div className="container max-w-2xl m-auto dark:bg-transparent p-4 min-h-screen pb-24">
      <MainHeader />
      {children}
      <BottomNav />
    </div>
  );
}
