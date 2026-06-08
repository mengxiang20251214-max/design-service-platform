import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-05-27.dahlia' as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = 'usd',
      customerName,
      customerEmail,
      productName,
      styleName,
      packageType,
      requirements,
      designSize,
      fileFormat,
      uploadedFileCount,
    } = body;

    if (!amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in database
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        productName,
        styleName,
        packageType,
        requirements,
        designSize,
        fileFormat,
        uploadedFileCount,
        totalPrice: amount,
        status: 'pending',
      },
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: order.id,
        orderNumber,
        customerEmail,
        customerName,
      },
      description: `Design Order: ${productName} - ${styleName}`,
    });

    // Save payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret || '',
        amount,
        currency,
        status: 'pending',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
