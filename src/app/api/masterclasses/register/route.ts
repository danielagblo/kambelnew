import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/masterclasses/register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'First name, last name, email, and phone are required' },
        { status: 400 }
      );
    }

    const registration = await prisma.masterclassRegistration.create({
      data: {
        masterclassId: body.masterclassId,
        masterclassTitle: body.masterclassTitle,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        company: body.company,
        experienceYears: body.experienceYears,
        motivation: body.motivation,
        subscribeNewsletter: body.subscribeNewsletter || false,
      },
    });

    // Subscribe to newsletter if requested
    if (body.subscribeNewsletter) {
      try {
        await prisma.newsletterSubscription.upsert({
          where: { email: body.email },
          update: { isActive: true },
          create: { email: body.email },
        });
      } catch (error) {
        console.error('Error subscribing to newsletter:', error);
      }
    }

    // Update available seats if masterclass ID is provided
    if (body.masterclassId) {
      try {
        await prisma.masterclass.update({
          where: { id: body.masterclassId },
          data: {
            seatsAvailable: {
              decrement: 1,
            },
          },
        });
      } catch (error) {
        console.error('Error updating seats:', error);
      }
    }

    return NextResponse.json(
      { message: 'Registration successful', id: registration.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}

