// app/page.tsx
import { UrlShortener } from '@/components/url-shortener';
import { NavBar } from '@/components/nav-bar';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  // 仅获取 session 用于服务端渲染
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col mt-[15vh]">
        <div className="w-full max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">将长链接变短</h2>
          <UrlShortener />
        </div>
      </div>
    </main>
  );
}