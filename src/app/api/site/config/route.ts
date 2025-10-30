import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/site/config
export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst();
    
    // Create default config if none exists
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          siteName: 'Kambel Consult',
          tagline: 'Professional Consulting and Training Services',
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 });
  }
}

// PUT /api/site/config (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received site config update:', body);
    
    const config = await prisma.siteConfig.findFirst();
    
    // Only include valid fields from the schema
    const updateData = {
      siteName: body.siteName,
      tagline: body.tagline,
      footerAbout: body.footerAbout,
      privacyPolicy: body.privacyPolicy,
      termsConditions: body.termsConditions,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      address: body.address,
      location: body.location,
      facebookUrl: body.facebookUrl,
      twitterUrl: body.twitterUrl,
      linkedinUrl: body.linkedinUrl,
      instagramUrl: body.instagramUrl,
      youtubeUrl: body.youtubeUrl,
    };
    
    if (!config) {
      const newConfig = await prisma.siteConfig.create({
        data: updateData,
      });
      console.log('Created new site config:', newConfig);
      return NextResponse.json(newConfig);
    }

    const updated = await prisma.siteConfig.update({
      where: { id: config.id },
      data: updateData,
    });

    console.log('Updated site config:', updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating site config:', error);
    console.error('Error details:', error.message);
    return NextResponse.json({ 
      error: 'Failed to update site config',
      details: error.message 
    }, { status: 500 });
  }
}

