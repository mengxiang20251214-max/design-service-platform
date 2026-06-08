'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/lib/checkout-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Lock } from 'lucide-react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setLoading(false);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">卡号</label>
        <div className="p-3 border border-input rounded-md bg-background">
          <CardElement />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-800 dark:text-red-200"
        >
          {error}
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full gap-2 bg-green-600 hover:bg-green-700"
      >
        <Lock className="w-4 h-4" />
        {loading ? '处理中...' : '支付'}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const {
    selectedProductName,
    selectedStyleName,
    customerEmail,
    customerName,
    getTotalPrice,
    getOrderSummary,
  } = useCheckoutStore();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = getTotalPrice();
  const summary = getOrderSummary();

  useEffect(() => {
    if (!customerEmail || !customerName) {
      router.push('/checkout');
      return;
    }

    async function initializePayment() {
      try {
        setLoading(true);
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPrice,
            currency: 'usd',
            customerName,
            customerEmail,
            productName: selectedProductName,
            styleName: selectedStyleName,
            packageType: summary.packageType,
            requirements: summary.requirements,
            designSize: summary.designSize,
            fileFormat: summary.fileFormat,
            uploadedFileCount: summary.uploadedFileCount,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
      } catch (err) {
        setError('Failed to initialize payment');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    initializePayment();
  }, [customerEmail, customerName, totalPrice, selectedProductName, selectedStyleName, summary, router]);

  const handlePaymentSuccess = () => {
    if (orderId) {
      router.push(`/checkout/success?orderId=${orderId}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <Link href="/">
            <div className="font-bold text-lg hover:opacity-80 transition-opacity">
              🎨 Design Platform
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/checkout">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回下单
            </Button>
          </Link>
        </motion.div>

        {/* Payment Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">产品</span>
                    <span className="font-medium">{selectedProductName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">风格</span>
                    <span className="font-medium">{selectedStyleName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">套餐</span>
                    <span className="font-medium">{summary.packageType}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-medium">总费用</span>
                    <span className="text-2xl font-bold text-primary">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  支付信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground mt-2">初始化支付...</p>
                  </div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-800 dark:text-red-200"
                  >
                    {error}
                  </motion.div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                  </Elements>
                ) : null}

                {/* Security Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50 text-sm text-blue-800 dark:text-blue-200"
                >
                  <p className="font-medium mb-2">🔒 安全提示</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 您的支付信息由 Stripe 安全处理</li>
                    <li>• 支持国际信用卡、借记卡</li>
                    <li>• 交易经过 SSL 加密</li>
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
