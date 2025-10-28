import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/consultancy/features - Create a new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const feature = await prisma.serviceFeature.create({
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon || 'fas fa-check',
        isActive: body.isActive !== undefined ? body.isActive : true,
        order: body.order || 0,
        serviceId: body.serviceId,
      },
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}

// PUT /api/consultancy/features - Update a feature
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const feature = await prisma.serviceFeature.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon,
        isActive: body.isActive,
        order: body.order,
      },
    });

    return NextResponse.json(feature);
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

// DELETE /api/consultancy/features - Delete a feature
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    await prisma.serviceFeature.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}

