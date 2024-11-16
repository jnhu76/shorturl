// app/dashboard/DashboardContent.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Session } from 'next-auth';

interface DashboardContentProps {
  session: Session & {
    user: {
      id: string;
      role: string;
    } & Session['user'];
  };
}

export default function DashboardContent({ session }: DashboardContentProps) {
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const interval = setInterval(() => {
      if (new Date(session.expires) < new Date()) {
        router.push('/login?error=SessionExpired');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [session, router]);

  if (!session.user) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session.user.name || 'User'}
      </h1>
      
      <div className="grid gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
          <p>ID: {session.user.id}</p>
        </div>

        {session.user.role === 'ADMIN' && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
            {/* Admin specific content */}
          </div>
        )}
      </div>
    </div>
  );
}