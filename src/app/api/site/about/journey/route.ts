import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to get or create AboutConfig
async function getAboutConfig() {
  let config = await prisma.aboutConfig.findFirst({ where: { isActive: true } });
  if (!config) {
    config = await prisma.aboutConfig.create({ data: {} });
  }
  return config;
}

// GET - Fetch all journey items
export async function GET() {
  try {
    const config = await getAboutConfig();
    const items = await prisma.professionalJourneyItem.findMany({
      where: { aboutConfigId: config.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching journey items:', error);
    return NextResponse.json({ error: 'Failed to fetch journey items' }, { status: 500 });
  }
}

// POST - Create journey item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = await getAboutConfig();
    
    const item = await prisma.professionalJourneyItem.create({
      data: {
        title: body.title,
        organization: body.company, // Map 'company' to 'organization'
        period: body.yearRange, // Map 'yearRange' to 'period'
        description: body.description || '',
        icon: 'briefcase',
        order: 0,
        isActive: true,
        aboutConfigId: config.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating journey item:', error);
    return NextResponse.json({ error: 'Failed to create journey item' }, { status: 500 });
  }
}

// PUT - Update journey item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const item = await prisma.professionalJourneyItem.update({
      where: { id: body.id },
      data: {
        title: body.title,
        organization: body.company, // Map 'company' to 'organization'
        period: body.yearRange, // Map 'yearRange' to 'period'
        description: body.description || '',
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating journey item:', error);
    return NextResponse.json({ error: 'Failed to update journey item' }, { status: 500 });
  }
}

// DELETE - Delete journey item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    await prisma.professionalJourneyItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting journey item:', error);
    return NextResponse.json({ error: 'Failed to delete journey item' }, { status: 500 });
  }
}

