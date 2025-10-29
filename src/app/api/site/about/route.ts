import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/site/about
export async function GET(request: NextRequest) {
  try {
    // Check if this is for admin (no isActive filter) or site (isActive: true)
    const url = new URL(request.url);
    const forAdmin = url.searchParams.get('admin') === 'true';

    const whereClause = forAdmin ? {} : { isActive: true };
    
    const aboutConfig = await prisma.aboutConfig.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: forAdmin ? {
        journeyItems: {
          orderBy: { order: 'asc' },
        },
        educationItems: {
          orderBy: { order: 'asc' },
        },
        achievements: {
          orderBy: { order: 'asc' },
        },
        speakingEngagements: {
          orderBy: { order: 'asc' },
        },
      } : undefined,
    });

    // Return null explicitly if no config exists (not an error)
    if (!aboutConfig) {
      return NextResponse.json(null);
    }

    return NextResponse.json(aboutConfig);
  } catch (error) {
    console.error('Error fetching about config:', error);
    return NextResponse.json({ error: 'Failed to fetch about config' }, { status: 500 });
  }
}

// POST /api/site/about
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ensure isActive defaults to true if not provided
    const isActive = body.isActive !== undefined ? body.isActive : true;
    
    // If setting this config as active, deactivate all others first
    if (isActive) {
      await prisma.aboutConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }
    
    const aboutConfig = await prisma.aboutConfig.create({
      data: {
        heroYears: body.heroYears,
        heroClients: body.heroClients,
        heroPublications: body.heroPublications,
        heroSpeaking: body.heroSpeaking,
        profileName: body.profileName,
        profileTitle: body.profileTitle,
        profilePicture: body.profilePicture,
        bioSummary: body.bioSummary,
        tags: body.tags,
        philosophyQuote: body.philosophyQuote,
        ctaTitle: body.ctaTitle,
        ctaDescription: body.ctaDescription,
        isActive: isActive,
      },
    });

    return NextResponse.json(aboutConfig, { status: 201 });
  } catch (error) {
    console.error('Error creating about config:', error);
    return NextResponse.json({ error: 'Failed to create about config' }, { status: 500 });
  }
}

// PUT /api/site/about
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ensure isActive defaults to true if not provided
    const isActive = body.isActive !== undefined ? body.isActive : true;
    
    // If setting this config as active, deactivate all others first
    if (isActive) {
      await prisma.aboutConfig.updateMany({
        where: { 
          isActive: true,
          id: { not: body.id } // Exclude the current one
        },
        data: { isActive: false },
      });
    }
    
    const aboutConfig = await prisma.aboutConfig.update({
      where: { id: body.id },
      data: {
        heroYears: body.heroYears,
        heroClients: body.heroClients,
        heroPublications: body.heroPublications,
        heroSpeaking: body.heroSpeaking,
        profileName: body.profileName,
        profileTitle: body.profileTitle,
        profilePicture: body.profilePicture,
        bioSummary: body.bioSummary,
        tags: body.tags,
        philosophyQuote: body.philosophyQuote,
        ctaTitle: body.ctaTitle,
        ctaDescription: body.ctaDescription,
        isActive: isActive,
      },
    });

    return NextResponse.json(aboutConfig);
  } catch (error) {
    console.error('Error updating about config:', error);
    return NextResponse.json({ error: 'Failed to update about config' }, { status: 500 });
  }
}
