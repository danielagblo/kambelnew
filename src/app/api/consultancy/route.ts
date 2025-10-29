import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/consultancy
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (id) {
      // Get all services for admin (including inactive)
      const services = await prisma.consultancyService.findMany({
        include: {
          features: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      });
      return NextResponse.json(services);
    }

    // Get active services for public
    const services = await prisma.consultancyService.findMany({
      where: {
        isActive: true,
        ...(serviceType ? { serviceType } : {}),
      },
      include: {
        features: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching consultancy services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/consultancy (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const service = await prisma.consultancyService.create({
      data: {
        name: body.name,
        serviceType: body.serviceType,
        description: body.description,
        coverImage: body.coverImage,
        icon: body.icon || 'fas fa-briefcase',
        order: body.order || 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// PUT /api/consultancy (Admin only - Update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const service = await prisma.consultancyService.update({
      where: { id },
      data: {
        name: data.name,
        serviceType: data.serviceType,
        description: data.description,
        coverImage: data.coverImage,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE /api/consultancy (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    // Delete associated features first
    await prisma.serviceFeature.deleteMany({
      where: { serviceId: id },
    });

    // Then delete the service
    await prisma.consultancyService.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}

