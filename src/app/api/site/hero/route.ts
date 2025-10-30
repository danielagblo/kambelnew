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
    
    // Only include valid fields from the schema
    const updateData = {
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle,
      yearsExperience: body.yearsExperience,
      yearsLabel: body.yearsLabel,
      clientsCount: body.clientsCount,
      clientsLabel: body.clientsLabel,
      publicationsCount: body.publicationsCount,
      publicationsLabel: body.publicationsLabel,
    };
    
    if (!hero) {
      // Create new hero with defaults for required fields
      const newHero = await prisma.heroConfig.create({
        data: {
          ...updateData,
          profileName: 'Moses Agbesi Katamani',
          profileTitle: 'Chief Executive Officer',
          yearsDescription: 'Professional Development',
          clientsDescription: 'Successfully Helped',
          publicationsDescription: 'Authored Works',
        },
      });
      console.log('Created new hero config:', newHero);
      return NextResponse.json(newHero);
    }

    const updated = await prisma.heroConfig.update({
      where: { id: hero.id },
      data: updateData,
    });

    console.log('Updated hero config:', updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating hero config:', error);
    console.error('Error details:', error.message);
    return NextResponse.json({ 
      error: 'Failed to update hero config',
      details: error.message 
    }, { status: 500 });
  }
}

