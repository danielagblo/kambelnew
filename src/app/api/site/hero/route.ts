import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/site/hero
export async function GET() {
  try {
    let hero = await prisma.heroConfig.findFirst({ where: { isActive: true } });
    
    if (!hero) {
      hero = await prisma.heroConfig.create({
        data: {
          heroTitle: 'Welcome to Kambel Consult',
          heroSubtitle: 'Your trusted partner in career development',
        },
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero config:', error);
    return NextResponse.json({ error: 'Failed to fetch hero config' }, { status: 500 });
  }
}

// PUT /api/site/hero (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received hero update:', body);
    
    const hero = await prisma.heroConfig.findFirst({ where: { isActive: true } });
    
    if (!hero) {
      const newHero = await prisma.heroConfig.create({
        data: body,
      });
      console.log('Created new hero config:', newHero);
      return NextResponse.json(newHero);
    }

    const updated = await prisma.heroConfig.update({
      where: { id: hero.id },
      data: body,
    });

    console.log('Updated hero config:', updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating hero config:', error);
    return NextResponse.json({ error: 'Failed to update hero config' }, { status: 500 });
  }
}

