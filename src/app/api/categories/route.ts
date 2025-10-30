import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const forAdmin = url.searchParams.get('admin') === 'true';
    
    const whereClause = forAdmin ? {} : { isActive: true };
    
    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    console.log('Categories fetched:', categories.length);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

