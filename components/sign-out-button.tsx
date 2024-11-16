// components/sign-out-button.tsx
'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      // 1. 设置登出标记
      localStorage.setItem('logout-timestamp', Date.now().toString());
      
      // 2. 清除所有本地存储
      localStorage.removeItem('next-auth.session-token');
      localStorage.removeItem('next-auth.callback-url');
      localStorage.removeItem('next-auth.csrf-token');
      
      // 3. 清除会话存储
      sessionStorage.clear();
      
      // 4. 执行 next-auth 登出
      await signOut({
        callbackUrl: '/',
        redirect: false
      });
      
      // 5. 强制刷新并重定向到首页
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // 即使出错也强制刷新
      window.location.href = '/';
    }
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