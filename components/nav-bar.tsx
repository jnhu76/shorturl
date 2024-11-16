// components/nav-bar.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { SignOutButton } from './sign-out-button';
import { useEffect, useState } from 'react';

export function NavBar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 检查登出时间戳
    const logoutTimestamp = localStorage.getItem('logout-timestamp');
    const currentTime = Date.now();
    
    // 如果存在登出时间戳，且在最近30秒内发生的登出
    if (logoutTimestamp && (currentTime - parseInt(logoutTimestamp)) < 30000) {
      setIsAuthenticated(false);
      // 如果发现还有 session，强制登出
      if (status === 'authenticated') {
        signOut({ redirect: false });
      }
    } else {
      setIsAuthenticated(status === 'authenticated' && !!session);
    }
  }, [status, session]);

  // 监听存储事件，以便在其他标签页登出时同步状态
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logout-timestamp') {
        setIsAuthenticated(false);
        if (status === 'authenticated') {
          signOut({ redirect: false });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [status]);

  // 在初始加载前不显示登录状态
  if (!mounted) {
    return (
      <nav className="w-full px-6 py-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            短链接生成器
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full px-6 py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          短链接生成器
        </Link>
        <div className="space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800"
              >
                我的链接
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-800"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );}