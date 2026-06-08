'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TrendingUp, Clock, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';

interface OrderStats {
  pending: number;
  designing: number;
  completed: number;
  cancelled: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  productName: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/users/orders');
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];

        const statsData = {
          pending: orders.filter((o: any) => o.status === 'pending').length,
          designing: orders.filter((o: any) => o.status === 'paid').length,
          completed: orders.filter((o: any) => o.status === 'completed').length,
          cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
        };
        setStats(statsData);

        const recent = orders.slice(0, 5).map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          productName: order.productName,
          status: order.status,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
        }));
        setRecentOrders(recent);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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

  const statCards = [
    { label: '待支付', value: stats?.pending || 0, icon: AlertCircle, color: 'text-yellow-600' },
    { label: '设计中', value: stats?.designing || 0, icon: Clock, color: 'text-blue-600' },
    { label: '已完成', value: stats?.completed || 0, icon: CheckCircle2, color: 'text-green-600' },
    { label: '已取消', value: stats?.cancelled || 0, icon: TrendingUp, color: 'text-gray-600' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回到你的设计中心</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                最近订单
              </CardTitle>
              <Link href="/dashboard/orders">
                <Button variant="outline" size="sm">查看全部</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">暂无订单</p>
                <Link href="/checkout">
                  <Button className="mt-4">立即下单</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{order.productName}</p>
                        <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">${order.totalPrice}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">需要帮助？</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              有任何关于订单或服务的问题，请联系我们的客服团队。
            </p>
            <Button variant="outline" size="sm">联系客服</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">开始新订单</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              准备好创建新的设计订单了吗？
            </p>
            <Link href="/checkout">
              <Button size="sm" className="w-full">新建订单</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
