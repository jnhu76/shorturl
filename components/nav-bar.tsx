// components/nav-bar.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { SignOutButton } from './sign-out-button';
import { useEffect, useState } from 'react';

export function NavBar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 检查本地存储中的登出标记
    const isLoggedOut = localStorage.getItem('isLoggedOut');
    
    if (isLoggedOut === 'true' && status === 'authenticated') {
      signOut({ redirect: false });
    }
    
    setMounted(true);
  }, [status]);

  // 在组件挂载前不渲染任何内容
  if (!mounted) {
    return <nav className="w-full px-6 py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">短链接生成器</h1>
      </div>
    </nav>;
  }

  return (
    <nav className="w-full px-6 py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">短链接生成器</h1>
        <div className="space-x-4">
          {status === 'authenticated' && session && !localStorage.getItem('isLoggedOut') ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800"
              >
                仪表盘
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
  );
}