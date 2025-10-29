import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject || '',
        message: body.message,
      },
    });

    return NextResponse.json(
      { message: 'Message sent successfully', id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

