import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: body.email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: 'Email already subscribed' });
      }
      
      // Reactivate subscription
      await prisma.newsletterSubscription.update({
        where: { email: body.email },
        data: { isActive: true },
      });
      
      return NextResponse.json({ message: 'Subscription reactivated successfully' });
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: { email: body.email },
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

