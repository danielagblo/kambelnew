import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
      console.error('No existing hero config to update (PUT)');
      return NextResponse.json({ error: 'No hero config exists to update' }, { status: 404 });
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

// POST fallback: some hosts block PUT; allow POST to update existing hero config only
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received hero update via POST fallback:', body);

    const hero = await prisma.heroConfig.findFirst({ where: { isActive: true } });

    if (!hero) {
      console.error('No existing hero config to update (POST)');
      return NextResponse.json({ error: 'No hero config exists to update' }, { status: 404 });
    }

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

    // Merge with existing values
    const mergedData = {
      heroTitle: updateData.heroTitle !== undefined ? updateData.heroTitle : hero.heroTitle,
      heroSubtitle: updateData.heroSubtitle !== undefined ? updateData.heroSubtitle : hero.heroSubtitle,
      profileName: hero.profileName,
      profileTitle: hero.profileTitle,
      profilePicture: hero.profilePicture,
      yearsExperience: updateData.yearsExperience !== undefined ? updateData.yearsExperience : hero.yearsExperience,
      yearsLabel: updateData.yearsLabel !== undefined ? updateData.yearsLabel : hero.yearsLabel,
      yearsDescription: hero.yearsDescription,
      clientsCount: updateData.clientsCount !== undefined ? updateData.clientsCount : hero.clientsCount,
      clientsLabel: updateData.clientsLabel !== undefined ? updateData.clientsLabel : hero.clientsLabel,
      clientsDescription: hero.clientsDescription,
      publicationsCount: updateData.publicationsCount !== undefined ? updateData.publicationsCount : hero.publicationsCount,
      publicationsLabel: updateData.publicationsLabel !== undefined ? updateData.publicationsLabel : hero.publicationsLabel,
      publicationsDescription: hero.publicationsDescription,
    };

    const updated = await prisma.heroConfig.update({
      where: { id: hero.id },
      data: mergedData,
    });

    console.log('Updated hero config (POST):', updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating hero config (POST):', error);
    return NextResponse.json({ error: 'Failed to update hero config', details: error?.message }, { status: 500 });
  }
}

