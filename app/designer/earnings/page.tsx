'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, PlusCircle } from 'lucide-react';

interface Earning {
  id: string;
  amount: number;
  source: string;
  status: string;
  createdAt: string;
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEarnings();
  }, [currentPage]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const url = `/api/designer/earnings?page=${currentPage}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEarnings(data.earnings);
        setTotalEarnings(data.totalEarnings);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '待结算',
      paid: '已结算',
      withdrawn: '已提现',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
      paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      withdrawn: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">收入统计</h1>
        <p className="text-muted-foreground">查看和管理你的收入</p>
      </motion.div>

      {/* Total Earnings Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-900/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-1">总收入</p>
                  <p className="text-4xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-600 opacity-50" />
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
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">可提现余额</span>
                  <span className="text-2xl font-bold text-primary">$0.00</span>
                </div>
                <Button className="w-full gap-2" disabled>
                  <PlusCircle className="w-4 h-4" />
                  申请提现（开发中）
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Earnings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              收入明细
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : earnings.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">暂无收入记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {earnings.map((earning, index) => (
                  <motion.div
                    key={earning.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">设计订单</p>
                        <p className="text-sm text-muted-foreground">{earning.source}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">${earning.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(earning.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(earning.status)}>
                          {getStatusLabel(earning.status)}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && earnings.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  size="sm"
                >
                  上一页
                </Button>
                <span className="text-sm text-muted-foreground">
                  第 {currentPage} / {totalPages} 页
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  size="sm"
                >
                  下一页
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">💡 提现说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>• 每个月的 1-5 号可以申请提现</p>
            <p>• 最低提现金额为 $50</p>
            <p>• 提现通常在 5-7 个工作日内到账</p>
            <p>• 每笔提现会收取 2% 的手续费</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
