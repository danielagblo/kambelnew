import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/publications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    
    const books = await prisma.book.findMany({
      where: {
        isActive: true,
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

// POST /api/publications (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const book = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author || 'Moses Agbesi Katamani',
        description: body.description,
        pages: body.pages || 0,
        price: body.price || 0,
        coverImage: body.coverImage,
        purchaseLink: body.purchaseLink,
        categoryId: body.categoryId,
        // Ensure newly created publications are active
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}

