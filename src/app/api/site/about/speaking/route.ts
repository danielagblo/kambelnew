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

// GET
export async function GET() {
  try {
    const config = await getAboutConfig();
    const items = await prisma.speakingEngagement.findMany({
      where: { aboutConfigId: config.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching speaking engagements:', error);
    return NextResponse.json({ error: 'Failed to fetch speaking engagements' }, { status: 500 });
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = await getAboutConfig();
    
    const item = await prisma.speakingEngagement.create({
      data: {
        title: body.title,
        event: body.event,
        date: body.date,
        location: body.location || '',
        order: 0,
        isActive: true,
        aboutConfigId: config.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating speaking engagement:', error);
    return NextResponse.json({ error: 'Failed to create speaking engagement' }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const item = await prisma.speakingEngagement.update({
      where: { id: body.id },
      data: {
        title: body.title,
        event: body.event,
        date: body.date,
        location: body.location || '',
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating speaking engagement:', error);
    return NextResponse.json({ error: 'Failed to update speaking engagement' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    await prisma.speakingEngagement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting speaking engagement:', error);
    return NextResponse.json({ error: 'Failed to delete speaking engagement' }, { status: 500 });
  }
}

