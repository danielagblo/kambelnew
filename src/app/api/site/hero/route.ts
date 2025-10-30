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

    // Get current values and merge with updates, keeping existing values for fields not in updateData
    const mergedData = {
      heroTitle: updateData.heroTitle !== undefined ? updateData.heroTitle : hero.heroTitle,
      heroSubtitle: updateData.heroSubtitle !== undefined ? updateData.heroSubtitle : hero.heroSubtitle,
      profileName: hero.profileName, // Keep existing
      profileTitle: hero.profileTitle, // Keep existing
      profilePicture: hero.profilePicture, // Keep existing
      yearsExperience: updateData.yearsExperience !== undefined ? updateData.yearsExperience : hero.yearsExperience,
      yearsLabel: updateData.yearsLabel !== undefined ? updateData.yearsLabel : hero.yearsLabel,
      yearsDescription: hero.yearsDescription, // Keep existing
      clientsCount: updateData.clientsCount !== undefined ? updateData.clientsCount : hero.clientsCount,
      clientsLabel: updateData.clientsLabel !== undefined ? updateData.clientsLabel : hero.clientsLabel,
      clientsDescription: hero.clientsDescription, // Keep existing
      publicationsCount: updateData.publicationsCount !== undefined ? updateData.publicationsCount : hero.publicationsCount,
      publicationsLabel: updateData.publicationsLabel !== undefined ? updateData.publicationsLabel : hero.publicationsLabel,
      publicationsDescription: hero.publicationsDescription, // Keep existing
    };
    
    const updated = await prisma.heroConfig.update({
      where: { id: hero.id },
      data: mergedData,
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

