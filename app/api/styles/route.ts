import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;

    const styles = await prisma.style.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(styles);
  } catch (error) {
    console.error('Error fetching styles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch styles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, coverImage, price, categoryId, featured, rating, reviews } = body;

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const style = await prisma.style.create({
      data: {
        name,
        slug,
        description: description || null,
        coverImage: coverImage || null,
        price: parseFloat(price),
        categoryId,
        featured: featured || false,
        rating: rating || 0,
        reviews: reviews || 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(style, { status: 201 });
  } catch (error) {
    console.error('Error creating style:', error);
    return NextResponse.json(
      { error: 'Failed to create style' },
      { status: 500 }
    );
  }
}
