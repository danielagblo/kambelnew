import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/analytics/track
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received analytics tracking request:', body);
    
    // Log the page view
    const pageView = await prisma.pageView.create({
      data: {
        path: body.path,
        title: body.title,
        referrer: body.referrer || null,
        userAgent: request.headers.get('user-agent') || null,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        contentType: body.contentType || null,
        contentId: body.contentId || null,
      },
    });
    
    console.log('Page view created successfully:', pageView.id);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 });
  }
}

