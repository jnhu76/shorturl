// components/sign-out-button.tsx
'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  const handleSignOut = async () => {
    // 在登出前设置标记
    localStorage.setItem('logout-timestamp', Date.now().toString());
    
    await signOut({
      // 登出后重定向到首页
      callbackUrl: '/',
      // 不使用默认的重定向机制
      redirect: false
    });
    
    // 强制刷新页面以确保状态完全清除
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-gray-600 hover:text-gray-800"
    >
      退出
    </button>
  );
}