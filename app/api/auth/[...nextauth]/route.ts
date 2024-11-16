// app/api/auth/[...nextauth]/route.ts
import {db} from '@/lib/db';
import {compare} from 'bcryptjs';
import NextAuth from 'next-auth';
import type {AuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: {label: 'Email', type: 'email'},
      password: {label: 'Password', type: 'password'}
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {email: credentials.email},
          select:
              {id: true, email: true, name: true, password: true, role: true}
        });

        if (!user || !user.email || !user.password) {
          return null;
        }

        const isPasswordValid =
            await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // 确保返回的对象符合 User 接口
        return {
          id: user.id,
          email: user.email,      // 确保不为 null
          name: user.name ?? '',  // 提供默认值
          role: user.role
        };
      } catch (error) {
        console.error('Authentication error:', error);
        return null;
      }
    }
  })],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({session, token}) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,  // 30 days
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  }
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};