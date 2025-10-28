import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/masterclasses/registrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const masterclassId = searchParams.get('masterclassId');

    const registrations = await prisma.masterclassRegistration.findMany({
      where: masterclassId ? { masterclassId } : {},
      include: {
        masterclass: {
          select: {
            title: true,
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

// DELETE /api/masterclasses/registrations
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await prisma.masterclassRegistration.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}

