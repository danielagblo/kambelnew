import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/site/about
export async function GET() {
  try {
    const aboutConfig = await prisma.aboutConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

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
        isActive: body.isActive !== undefined ? body.isActive : true,
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
        isActive: body.isActive,
      },
    });

    return NextResponse.json(aboutConfig);
  } catch (error) {
    console.error('Error updating about config:', error);
    return NextResponse.json({ error: 'Failed to update about config' }, { status: 500 });
  }
}
