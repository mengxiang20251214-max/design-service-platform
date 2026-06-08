'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderDetail {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  styleName: string;
  packageType: string;
  requirements: string;
  designSize: string;
  fileFormat: string;
  uploadedFileCount: number;
  totalPrice: number;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  payment?: {
    status: string;
    amount: number;
    currency: string;
    errorMessage?: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/users/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else if (response.status === 404) {
        router.push('/dashboard/orders');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const response = await fetch(`/api/users/orders/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setShowCancelConfirm(false);
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '待支付',
      paid: '设计中',
      completed: '已完成',
      cancelled: '已取消',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">订单未找到</p>
        <Link href="/dashboard/orders">
          <Button>返回订单列表</Button>
        </Link>
      </div>
    );
  }

  const canCancel = order.status !== 'completed' && order.status !== 'cancelled';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/dashboard/orders">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            返回订单列表
          </Button>
        </Link>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">订单详情</h1>
          <Badge className={getStatusColor(order.status)}>
            {getStatusLabel(order.status)}
          </Badge>
        </div>
      </motion.div>

      {/* Order Number and Payment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">订单号</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-xl font-bold text-primary">{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">订单金额</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">${order.totalPrice}</p>
              {order.payment && (
                <p className="text-sm text-muted-foreground mt-2">
                  支付状态: {order.payment.status === 'succeeded' ? '已支付' : '未支付'}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>设计信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">产品</p>
                <p className="font-medium">{order.productName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">设计风格</p>
                <p className="font-medium">{order.styleName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">套餐类型</p>
                <p className="font-medium">{order.packageType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">设计尺寸</p>
                <p className="font-medium">{order.designSize}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">文件格式</p>
                <p className="font-medium">{order.fileFormat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已上传文件</p>
                <p className="font-medium">{order.uploadedFileCount} 个</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">设计需求</p>
              <p className="text-sm whitespace-pre-wrap">{order.requirements}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>客户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">姓名</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">邮箱</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Details if available */}
      {order.payment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className={order.payment.status === 'failed' ? 'border-red-200 dark:border-red-900/50' : ''}>
            <CardHeader>
              <CardTitle>支付信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">支付状态</span>
                <Badge
                  className={
                    order.payment.status === 'succeeded'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : order.payment.status === 'failed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                  }
                >
                  {order.payment.status === 'succeeded'
                    ? '已支付'
                    : order.payment.status === 'failed'
                    ? '支付失败'
                    : '等待支付'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">支付金额</span>
                <span className="font-medium">
                  {order.payment.currency.toUpperCase()} {order.payment.amount}
                </span>
              </div>
              {order.payment.errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{order.payment.errorMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Cancel Button */}
      {canCancel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => setShowCancelConfirm(true)}
            >
              取消订单
            </Button>
          </div>

          {showCancelConfirm && (
            <Card className="mt-4 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">确认取消订单？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  确定要取消此订单吗？此操作无法撤销。
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={cancelling}
                  >
                    保留订单
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? '取消中...' : '确认取消'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
