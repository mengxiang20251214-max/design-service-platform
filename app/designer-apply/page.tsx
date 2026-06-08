'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, CheckCircle2, Briefcase } from 'lucide-react';

export default function DesignerApplyPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return null;
  }

  const handleApply = async () => {
    try {
      setApplying(true);
      setMessage(null);

      // 模拟申请请求 - 实际应该调用 API
      setTimeout(() => {
        setStep(2);
        setApplying(false);
        router.push('/designer');
      }, 1500);
    } catch (error) {
      console.error('Apply failed:', error);
      setMessage({ type: 'error', text: '申请失败，请重试' });
      setApplying(false);
    }
  };

  const requirements = [
    '至少 2 年以上的设计经验',
    '拥有完整的设计作品集',
    '良好的沟通和理解能力',
    '遵守平台的服务规范',
    '及时完成客户订单',
    '保持良好的客户评价',
  ];

  const benefits = [
    '获得稳定的设计订单来源',
    '灵活的工作时间安排',
    '有竞争力的报酬',
    '专业的平台支持',
    '与其他设计师交流的机会',
    '提升个人品牌和知名度',
  ];

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
      <div className="container max-w-3xl mx-auto px-4 py-12">
        {step === 1 ? (
          <>
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Link href="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回首页
                </Button>
              </Link>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-12"
            >
              <div className="text-5xl mb-4">🎨</div>
              <h1 className="text-4xl font-bold mb-4">加入我们的设计师团队</h1>
              <p className="text-lg text-muted-foreground">
                展示你的设计才能，获得稳定的项目机会和丰厚的报酬
              </p>
            </motion.div>

            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Requirements Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">申请要求</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      加入我们的优势
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>确认申请用户</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">邮箱</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">姓名</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50 text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">💡 提示</p>
                    <p>
                      申请成功后，你将能够访问设计师后台，接收和处理设计订单。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-4 justify-center"
            >
              <Link href="/">
                <Button variant="outline">取消</Button>
              </Link>
              <Button
                onClick={handleApply}
                disabled={applying}
                className="px-8"
              >
                {applying ? '申请中...' : '申请成为设计师'}
              </Button>
            </motion.div>
          </>
        ) : (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-green-600 mb-2">申请成功！</h1>
            <p className="text-lg text-muted-foreground mb-8">
              欢迎加入我们的设计师团队
            </p>

            <Card className="max-w-md mx-auto mb-8">
              <CardContent className="pt-6 space-y-4">
                <div className="text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>账户已激活</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>可以访问设计师后台</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>可以接收订单</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Link href="/designer">
              <Button className="px-8">进入设计师后台</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
