import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/masterclasses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get all masterclasses for admin (including inactive)
      const masterclasses = await prisma.masterclass.findMany({
        orderBy: { date: 'desc' },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      });
      return NextResponse.json(masterclasses);
    }

    // Get active masterclasses for public (upcoming first, sorted by date)
    const masterclasses = await prisma.masterclass.findMany({
      where: { isActive: true },
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json(masterclasses);
  } catch (error) {
    console.error('Error fetching masterclasses:', error);
    return NextResponse.json({ error: 'Failed to fetch masterclasses' }, { status: 500 });
  }
}

// POST /api/masterclasses (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const masterclass = await prisma.masterclass.create({
      data: {
        title: body.title,
        description: body.description,
        instructor: body.instructor || 'Moses Agbesi Katamani',
        date: new Date(body.date),
        duration: body.duration,
        price: body.price || 0,
        totalSeats: body.totalSeats || 30,
        seatsAvailable: body.seatsAvailable || body.totalSeats || 30,
        coverImage: body.coverImage,
        videoUrl: body.videoUrl,
        isUpcoming: body.isUpcoming ?? true,
      },
    });

    return NextResponse.json(masterclass, { status: 201 });
  } catch (error) {
    console.error('Error creating masterclass:', error);
    return NextResponse.json({ error: 'Failed to create masterclass' }, { status: 500 });
  }
}

// PUT /api/masterclasses (Admin only - Update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Masterclass ID is required' }, { status: 400 });
    }

    const masterclass = await prisma.masterclass.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        date: new Date(data.date),
        duration: data.duration,
        price: data.price,
        totalSeats: data.totalSeats,
        seatsAvailable: data.seatsAvailable,
        coverImage: data.coverImage,
        videoUrl: data.videoUrl,
        isUpcoming: data.isUpcoming,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(masterclass);
  } catch (error) {
    console.error('Error updating masterclass:', error);
    return NextResponse.json({ error: 'Failed to update masterclass' }, { status: 500 });
  }
}

// DELETE /api/masterclasses (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Masterclass ID is required' }, { status: 400 });
    }

    // Delete associated registrations first
    await prisma.masterclassRegistration.deleteMany({
      where: { masterclassId: id },
    });

    // Then delete the masterclass
    await prisma.masterclass.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Masterclass deleted successfully' });
  } catch (error) {
    console.error('Error deleting masterclass:', error);
    return NextResponse.json({ error: 'Failed to delete masterclass' }, { status: 500 });
  }
}

