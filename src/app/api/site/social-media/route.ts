import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/site/social-media
export async function GET() {
  try {
    const links = await prisma.socialMediaLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching social media links:', error);
    return NextResponse.json({ error: 'Failed to fetch social media links' }, { status: 500 });
  }
}

