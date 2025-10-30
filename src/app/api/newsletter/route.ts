import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/newsletter (Admin only)
export async function GET(request: NextRequest) {
  try {
    const subscribers = await prisma.newsletterSubscription.findMany({
      orderBy: {
        subscribedAt: 'desc',
      },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

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
      
      console.log('Newsletter subscription reactivated:', body.email);
      return NextResponse.json({ message: 'Subscription reactivated successfully' });
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: { email: body.email },
    });

    console.log('Newsletter subscription created:', subscription.id);
    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

