// src/app/api/auth/[...nextauth]/route.ts
import {db} from '@/lib/db';
import {PrismaAdapter} from '@auth/prisma-adapter';
import {compare} from 'bcryptjs';
import type {NextAuthOptions, Session, User} from 'next-auth';
import type {JWT} from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

interface CustomUser extends User {
  id: string;
  role: string;
}

interface CustomJWT extends JWT {
  id: string;
  role: string;
  exp?: number;
}

interface CustomSession extends Session {
  user: {
    id: string; role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// @ts-ignore
const prismaAdapter = PrismaAdapter(db);

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: prismaAdapter,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,     // 24 hours
    updateAge: 24 * 60 * 60,  // 24 hours
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials): Promise<CustomUser|null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid =
            await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}): Promise<CustomJWT> {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: (user as CustomUser).role,
        } as CustomJWT;
      }

      // 检查token是否过期
      const nowTimestamp = Math.floor(Date.now() / 1000);
      const tokenExp = (token as CustomJWT).exp;

      if (tokenExp && typeof tokenExp === 'number' && nowTimestamp > tokenExp) {
        // 如果token过期，返回一个带有默认值的token
        return {
          ...token,
          id: '',
          role: '',
        } as CustomJWT;
      }

      return token as CustomJWT;
    },
    async session({session, token}): Promise<CustomSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      } as CustomSession;
    },
  },
  events: {
    async signOut({token, session}) {
      // 可以在这里添加登出时的清理操作
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  jwt: {
    maxAge: 24 * 60 * 60,  // 24 hours
  },
};

import NextAuth from 'next-auth/next';
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};