import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { code: string } }
) {
  // 异步获取 params
  const { code: shortCode } = await context.params;

  const shortUrl = await prisma.shortUrl.findUnique({
    where: { shortCode },
  });

  if (!shortUrl) {
    return NextResponse.redirect('/404');
  }

  await prisma.shortUrl.update({
    where: { id: shortUrl.id },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.redirect(shortUrl.url);
}
