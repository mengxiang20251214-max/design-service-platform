'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { XCircle, ChevronLeft, Home } from 'lucide-react';

export default function CancelPage() {
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="flex justify-center mb-6"
          >
            <XCircle className="w-16 h-16 text-orange-600" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-orange-600 mb-2">支付已取消</h1>
            <p className="text-lg text-muted-foreground">您的支付过程已被中断</p>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">发生了什么?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-left space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                      ✓ 您的订单已保存
                    </p>
                    <p className="text-xs text-orange-800 dark:text-orange-200">
                      您可以随时返回继续支付您的订单
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      💡 支付可选项
                    </p>
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      我们接受多种支付方式，您可以选择最方便的方式
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reasons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">常见原因</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>卡片信息有误</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>卡片额度不足</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>银行拒绝了此交易</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>您主动取消了支付过程</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
              <CardHeader>
                <CardTitle className="text-lg text-green-900 dark:text-green-100">需要帮助？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-left">
                <p className="text-sm text-green-800 dark:text-green-200">
                  如果您需要支付方面的协助，请联系我们的客服团队：
                </p>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  📧 support@designplatform.com
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/checkout">
              <Button className="gap-2 px-6">
                <ChevronLeft className="w-4 h-4" />
                返回订单
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="gap-2 px-6">
                <Home className="w-4 h-4" />
                返回首页
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
