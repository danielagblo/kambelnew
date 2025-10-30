import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
    
    if (!config) {
      console.error('No existing site config to update (PUT)');
      return NextResponse.json({ error: 'No site config exists to update' }, { status: 404 });
    }

    const updated = await prisma.siteConfig.update({
      where: { id: config.id },
      data: body,
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

// Some hosts or proxies reject PUT requests from browsers. Provide a POST fallback
// so clients can send updates via POST when PUT is blocked.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received site config update via POST fallback:', body);

    const config = await prisma.siteConfig.findFirst();

    if (!config) {
      console.error('No existing site config to update (POST)');
      return NextResponse.json({ error: 'No site config exists to update' }, { status: 404 });
    }

    const updated = await prisma.siteConfig.update({
      where: { id: config.id },
      data: body,
    });

    console.log('Updated site config (POST):', updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating site config (POST):', error);
    return NextResponse.json({
      error: 'Failed to update site config',
      details: error?.message,
    }, { status: 500 });
  }
}

