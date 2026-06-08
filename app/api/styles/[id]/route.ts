import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const style = await prisma.style.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!style) {
      return NextResponse.json(
        { error: 'Style not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(style);
  } catch (error) {
    console.error('Error fetching style:', error);
    return NextResponse.json(
      { error: 'Failed to fetch style' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const style = await prisma.style.update({
      where: { id },
      data: body,
      include: {
        category: true,
      },
    });

    return NextResponse.json(style);
  } catch (error) {
    console.error('Error updating style:', error);
    return NextResponse.json(
      { error: 'Failed to update style' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.style.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting style:', error);
    return NextResponse.json(
      { error: 'Failed to delete style' },
      { status: 500 }
    );
  }
}
