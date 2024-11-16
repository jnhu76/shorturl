import { db } from '@/lib/db';
import RedisClient from '@/lib/redis';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, verificationCode } = await req.json();

    const redis = await RedisClient.getInstance();

    // 验证验证码
    const codeKey = `verification:${email}`;
    const storedCode = await redis.get(codeKey);

    if (!storedCode || storedCode !== verificationCode) {
      return NextResponse.json(
        { message: '验证码无效或已过期' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ message: '该邮箱已被注册' }, { status: 400 });
    }

    // 创建新用户
    const hashedPassword = await hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 删除验证码
    await redis.del(codeKey);

    return NextResponse.json({
      message: '注册成功',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { message: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
