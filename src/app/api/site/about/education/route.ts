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
    const items = await prisma.educationQualification.findMany({
      where: { aboutConfigId: config.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching education items:', error);
    return NextResponse.json({ error: 'Failed to fetch education items' }, { status: 500 });
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received education POST data:', body);
    
    const config = await getAboutConfig();
    console.log('About config ID:', config.id);
    
    const item = await prisma.educationQualification.create({
      data: {
        qualification: body.degree, // Map 'degree' to 'qualification'
        institution: body.institution,
        year: body.year,
        description: body.description || '',
        icon: 'graduation-cap',
        order: 0,
        isActive: true,
        aboutConfigId: config.id,
      },
    });

    console.log('Created education item:', item);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating education item:', error);
    return NextResponse.json({ error: 'Failed to create education item', details: String(error) }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const item = await prisma.educationQualification.update({
      where: { id: body.id },
      data: {
        qualification: body.degree, // Map 'degree' to 'qualification'
        institution: body.institution,
        year: body.year,
        description: body.description || '',
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating education item:', error);
    return NextResponse.json({ error: 'Failed to update education item' }, { status: 500 });
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
    
    await prisma.educationQualification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting education item:', error);
    return NextResponse.json({ error: 'Failed to delete education item' }, { status: 500 });
  }
}

