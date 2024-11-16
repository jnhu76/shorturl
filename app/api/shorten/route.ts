import { prisma } from '@/lib/db';
import { urlSchema } from '@/lib/validations';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = urlSchema.parse(body);

    const shortCode = nanoid(6);
    const shortUrl = await prisma.shortUrl.create({
      data: {
        url,
        shortCode,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.json({
      shortUrl: `${baseUrl}/s/${shortCode}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 400 }
    );
  }
}
