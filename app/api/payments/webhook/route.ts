import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-05-27.dahlia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { orderId } = paymentIntent.metadata as { orderId: string };

  if (!orderId) {
    console.error('Missing orderId in payment metadata');
    return;
  }

  await prisma.payment.update({
    where: { orderId },
    data: {
      status: 'succeeded',
      stripePaymentId: paymentIntent.id,
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'paid' },
  });

  console.log(`Payment succeeded for order: ${orderId}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { orderId } = paymentIntent.metadata as { orderId: string };

  if (!orderId) {
    console.error('Missing orderId in payment metadata');
    return;
  }

  const lastError = paymentIntent.last_payment_error;
  const errorMessage = lastError?.message || 'Payment failed';

  await prisma.payment.update({
    where: { orderId },
    data: {
      status: 'failed',
      errorMessage,
    },
  });

  console.log(`Payment failed for order: ${orderId}, error: ${errorMessage}`);
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const { orderId } = paymentIntent.metadata as { orderId: string };

  if (!orderId) {
    console.error('Missing orderId in payment metadata');
    return;
  }

  await prisma.payment.update({
    where: { orderId },
    data: {
      status: 'cancelled',
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'cancelled' },
  });

  console.log(`Payment cancelled for order: ${orderId}`);
}
