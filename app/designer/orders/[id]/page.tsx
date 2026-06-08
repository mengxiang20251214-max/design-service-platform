'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderDetail {
  id: string;
  status: string;
  designNotes: string | null;
  order: {
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
    createdAt: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [designNotes, setDesignNotes] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/designer/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setDesignNotes(data.order.designNotes || '');
      } else if (response.status === 404) {
        router.push('/designer/orders');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setProcessing(true);
      setMessage(null);
      const response = await fetch(`/api/designer/orders/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setMessage({ type: 'success', text: '订单已接受' });
      } else {
        setMessage({ type: 'error', text: '接受订单失败' });
      }
    } catch (error) {
      console.error('Failed to accept order:', error);
      setMessage({ type: 'error', text: '接受订单失败，请重试' });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      setMessage(null);
      const response = await fetch(`/api/designer/orders/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setMessage({ type: 'success', text: '订单已拒绝' });
      } else {
        setMessage({ type: 'error', text: '拒绝订单失败' });
      }
    } catch (error) {
      console.error('Failed to reject order:', error);
      setMessage({ type: 'error', text: '拒绝订单失败，请重试' });
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!designNotes.trim()) {
      setMessage({ type: 'error', text: '请填写设计说明' });
      return;
    }

    try {
      setProcessing(true);
      setMessage(null);
      const response = await fetch(`/api/designer/orders/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit', designNotes }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setMessage({ type: 'success', text: '作品已提交' });
      } else {
        setMessage({ type: 'error', text: '提交作品失败' });
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      setMessage({ type: 'error', text: '提交作品失败，请重试' });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '待接受',
      accepted: '已接受',
      in_progress: '进行中',
      submitted: '已提交',
      completed: '已完成',
      rejected: '已拒绝',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
      accepted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
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
        <Link href="/designer/orders">
          <Button>返回订单列表</Button>
        </Link>
      </div>
    );
  }

  const canAccept = order.status === 'pending';
  const canReject = order.status === 'pending';
  const canSubmit = order.status === 'in_progress' || order.status === 'accepted';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/designer/orders">
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

      {/* Message Display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <span className="text-sm">{message.text}</span>
        </motion.div>
      )}

      {/* Customer & Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">客户信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">姓名</p>
                <p className="font-medium">{order.order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">邮箱</p>
                <p className="font-medium">{order.order.customerEmail}</p>
              </div>
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
              <CardTitle className="text-lg">订单信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">订单号</p>
                <p className="font-mono font-medium">{order.order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">订单金额</p>
                <p className="text-xl font-bold text-primary">${order.order.totalPrice}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Design Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>设计详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">产品</p>
                <p className="font-medium">{order.order.productName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">设计风格</p>
                <p className="font-medium">{order.order.styleName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">套餐类型</p>
                <p className="font-medium">{order.order.packageType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">设计尺寸</p>
                <p className="font-medium">{order.order.designSize}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">文件格式</p>
                <p className="font-medium">{order.order.fileFormat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已上传文件</p>
                <p className="font-medium">{order.order.uploadedFileCount} 个</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">设计需求</p>
              <p className="text-sm whitespace-pre-wrap">{order.order.requirements}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Design Notes */}
      {(canSubmit || designNotes) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>设计说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={designNotes}
                onChange={(e) => setDesignNotes(e.target.value)}
                placeholder="添加你的设计说明、方案描述等..."
                disabled={!canSubmit}
                className="w-full h-32 p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap gap-3"
      >
        {canAccept && (
          <Button
            onClick={handleAccept}
            disabled={processing}
            className="bg-green-600 hover:bg-green-700"
          >
            {processing ? '处理中...' : '接受订单'}
          </Button>
        )}
        {canReject && (
          <Button
            onClick={handleReject}
            disabled={processing}
            variant="outline"
          >
            {processing ? '处理中...' : '拒绝订单'}
          </Button>
        )}
        {canSubmit && (
          <Button
            onClick={handleSubmit}
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processing ? '提交中...' : '提交作品'}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
