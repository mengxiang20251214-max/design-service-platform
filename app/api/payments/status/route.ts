import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      totalPrice: order.totalPrice,
      payment: order.payment ? {
        status: order.payment.status,
        amount: order.payment.amount,
        currency: order.payment.currency,
        errorMessage: order.payment.errorMessage,
      } : null,
    });
  } catch (error) {
    console.error('Payment status query error:', error);
    return NextResponse.json(
      { error: 'Failed to query payment status' },
      { status: 500 }
    );
  }
}
