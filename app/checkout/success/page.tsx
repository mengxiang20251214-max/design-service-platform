'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { CheckCircle2, Copy, Home } from 'lucide-react';
import { useCheckoutStore } from '@/lib/checkout-store';

interface OrderInfo {
  orderNumber: string;
  orderStatus: string;
  totalPrice: number;
  payment?: {
    status: string;
    amount: number;
    currency: string;
  };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { reset } = useCheckoutStore();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus();
      reset();
    }
  }, [orderId, reset]);

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status?orderId=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = () => {
    if (orderInfo?.orderNumber) {
      navigator.clipboard.writeText(orderInfo.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      <div className="container max-w-2xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">加载订单信息...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 20px rgba(34, 197, 94, 0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-600" />
                </motion.div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-green-600 mb-2">支付成功！</h1>
              <p className="text-lg text-muted-foreground">感谢您的订单，我们已收到您的支付</p>
            </motion.div>

            {/* Order Details */}
            {orderInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6 mb-8"
              >
                {/* Order Number Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">订单号</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-mono text-xl font-bold text-primary">
                        {orderInfo.orderNumber}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyOrderNumber}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? '已复制' : '复制'}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      请妥善保管此订单号，用于后续查询和售后服务
                    </p>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">订单信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">订单状态</p>
                        <p className="font-semibold text-green-600">
                          {orderInfo.orderStatus === 'paid' ? '已支付' : orderInfo.orderStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">支付金额</p>
                        <p className="font-semibold">${orderInfo.totalPrice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 dark:text-blue-100">后续步骤</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                      <li className="flex items-start gap-3">
                        <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                          1
                        </span>
                        <span>我们已确认您的订单和支付</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                          2
                        </span>
                        <span>设计师将在 24 小时内联系您确认需求</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                          3
                        </span>
                        <span>您会在邮件中收到订单确认和沟通方式</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                          4
                        </span>
                        <span>设计完成后我们会发送您最终的设计文件</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/">
                <Button className="gap-2 px-6">
                  <Home className="w-4 h-4" />
                  返回首页
                </Button>
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 bg-muted rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-3">有任何问题？</p>
              <p className="font-medium">联系我们</p>
              <p className="text-sm text-muted-foreground mt-1">
                📧 邮箱: support@designplatform.com
              </p>
              <p className="text-sm text-muted-foreground">
                💬 客服: 周一至周五 9:00 - 18:00
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="text-center py-12 mt-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
