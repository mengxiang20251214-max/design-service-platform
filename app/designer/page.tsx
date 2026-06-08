'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, DollarSign, CheckCircle2, Star } from 'lucide-react';

interface DesignerStats {
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  monthlyEarnings: number;
  rating: number;
}

export default function DesignerDashboard() {
  const [stats, setStats] = useState<DesignerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/designer/orders');
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];

        const statsData = {
          pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
          inProgressOrders: orders.filter((o: any) => o.status === 'in_progress').length,
          completedOrders: orders.filter((o: any) => o.status === 'completed').length,
          monthlyEarnings: Math.random() * 5000 + 1000, // 模拟数据
          rating: 4.8,
        };
        setStats(statsData);

        const recent = orders.slice(0, 5);
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
      pending: '待接受',
      in_progress: '进行中',
      completed: '已完成',
      accepted: '已接受',
      rejected: '已拒绝',
      submitted: '已提交',
    };
    return labels[status] || status;
  };

  const statCards = [
    { label: '待处理订单', value: stats?.pendingOrders || 0, icon: Briefcase, color: 'text-orange-600' },
    { label: '进行中', value: stats?.inProgressOrders || 0, icon: CheckCircle2, color: 'text-blue-600' },
    { label: '已完成', value: stats?.completedOrders || 0, icon: CheckCircle2, color: 'text-green-600' },
    { label: '本月收入', value: `$${Math.round(stats?.monthlyEarnings || 0)}`, icon: DollarSign, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">设计师仪表盘</h1>
        <p className="text-muted-foreground">管理你的订单和收入</p>
      </motion.div>

      {/* Stats Cards */}
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

      {/* Rating Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              评分与评价
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-5xl font-bold text-yellow-500">{stats?.rating || 0}</p>
                <p className="text-muted-foreground">平均评分</p>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${((stats?.rating || 0) / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">基于客户评价</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近订单</CardTitle>
              <Link href="/designer/orders">
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
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">暂无订单</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/designer/orders/${order.id}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{order.order.productName}</p>
                        <p className="text-sm text-muted-foreground">{order.order.orderNumber}</p>
                      </div>
                      <Badge>{getStatusLabel(order.status)}</Badge>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">待处理订单</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              查看需要您接受或拒绝的订单请求
            </p>
            <Link href="/designer/orders?status=pending">
              <Button className="w-full">查看订单</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">查看收入</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              查看详细的收入明细和提现记录
            </p>
            <Link href="/designer/earnings">
              <Button className="w-full">查看收入</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
