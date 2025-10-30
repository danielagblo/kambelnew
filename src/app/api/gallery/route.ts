import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/gallery
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const id = searchParams.get('id');
    
    if (id) {
      // Get single gallery item by ID (for admin editing)
      const item = await prisma.galleryItem.findUnique({
        where: { id },
      });
      
      if (!item) {
        return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
      }
      
      return NextResponse.json(item);
    }

    // Get active gallery items for public
    const items = await prisma.galleryItem.findMany({
      where: {
        isActive: true,
        ...(featured ? { isFeatured: true } : {}),
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST /api/gallery (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const item = await prisma.galleryItem.create({
      data: {
        title: body.title,
        caption: body.caption,
        description: body.description,
        mediaType: body.mediaType || 'image',
        image: body.image,
        videoUrl: body.videoUrl,
        videoFile: body.videoFile,
        thumbnail: body.thumbnail,
        order: body.order || 0,
        isFeatured: body.isFeatured || false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

// PUT /api/gallery (Admin only - Update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        title: data.title,
        caption: data.caption,
        description: data.description,
        mediaType: data.mediaType,
        image: data.image,
        videoUrl: data.videoUrl,
        videoFile: data.videoFile,
        thumbnail: data.thumbnail,
        order: data.order,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

// DELETE /api/gallery (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}

