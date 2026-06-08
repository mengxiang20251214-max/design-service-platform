'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalDesigners: number;
  totalOrders: number;
  totalEarnings: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: '总用户数', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600' },
    { label: '设计师数', value: stats?.totalDesigners || 0, icon: Users, color: 'text-purple-600' },
    { label: '总订单数', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-green-600' },
    { label: '总收入', value: `$${(stats?.totalEarnings || 0).toFixed(2)}`, icon: DollarSign, color: 'text-yellow-600' },
    { label: '待处理订单', value: stats?.pendingOrders || 0, icon: AlertCircle, color: 'text-orange-600' },
    { label: '已完成订单', value: stats?.completedOrders || 0, icon: ShoppingCart, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">管理员仪表盘</h1>
        <p className="text-muted-foreground">管理平台的所有数据和用户</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">用户管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              查看和管理所有用户账户
            </p>
            <Link href="/admin/users">
              <Button className="w-full">前往用户管理</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">订单管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              查看和管理平台上的所有订单
            </p>
            <Link href="/admin/orders">
              <Button className="w-full">前往订单管理</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">系统设置</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              配置平台系统和权限设置
            </p>
            <Link href="/admin/settings">
              <Button className="w-full">前往设置</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">💡 系统提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• 定期检查待处理订单，及时处理用户问题</li>
              <li>• 监控平台收入，确保资金流动安全</li>
              <li>• 维护用户和设计师账户的安全性</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
