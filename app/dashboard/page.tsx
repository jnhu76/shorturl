// src/app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import DashboardContent from './DashboardContent';
import { AppErrorBoundary } from '@/components/ErrorBoundary';
import type { Metadata } from 'next';
import type { Session } from 'next-auth';

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  return {
    title: `Dashboard | ${session?.user?.name || 'User'}`,
    description: 'User dashboard and overview',
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) as Session & {
    user: {
      id: string;
      role: string;
    } & Session['user'];
  };

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const sessionExpired = new Date(session.expires) < new Date();
  if (sessionExpired) {
    redirect('/login?error=SessionExpired');
  }

  if (session.user?.role && !['ADMIN', 'USER'].includes(session.user.role)) {
    redirect('/unauthorized');
  }

  return (
    <AppErrorBoundary fallback={<div>Something went wrong</div>}>
      <DashboardContent session={session} />
    </AppErrorBoundary>
  );
}