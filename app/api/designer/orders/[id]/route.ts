import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { designer: true },
    });

    if (!user || user.role !== 'designer' || !user.designer) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const designerOrder = await prisma.designerOrder.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!designerOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (designerOrder.designerId !== user.designer.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order: designerOrder });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { designer: true },
    });

    if (!user || user.role !== 'designer' || !user.designer) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, designNotes } = body;

    if (!['accept', 'reject', 'submit'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const designerOrder = await prisma.designerOrder.findUnique({
      where: { id },
    });

    if (!designerOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (designerOrder.designerId !== user.designer.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    if (action === 'accept') {
      if (designerOrder.status !== 'pending') {
        return NextResponse.json(
          { error: 'Order cannot be accepted' },
          { status: 400 }
        );
      }

      const updatedOrder = await prisma.designerOrder.update({
        where: { id },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
        },
        include: { order: true },
      });

      await prisma.order.update({
        where: { id: designerOrder.orderId },
        data: { status: 'in_progress' },
      });

      return NextResponse.json({ order: updatedOrder });
    }

    if (action === 'reject') {
      if (designerOrder.status !== 'pending') {
        return NextResponse.json(
          { error: 'Order cannot be rejected' },
          { status: 400 }
        );
      }

      const updatedOrder = await prisma.designerOrder.update({
        where: { id },
        data: { status: 'rejected' },
        include: { order: true },
      });

      return NextResponse.json({ order: updatedOrder });
    }

    if (action === 'submit') {
      if (designerOrder.status !== 'in_progress') {
        return NextResponse.json(
          { error: 'Order is not in progress' },
          { status: 400 }
        );
      }

      const updatedOrder = await prisma.designerOrder.update({
        where: { id },
        data: {
          status: 'submitted',
          designNotes,
          submittedAt: new Date(),
        },
        include: { order: true },
      });

      return NextResponse.json({ order: updatedOrder });
    }
  } catch (error) {
    console.error('Order action error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
