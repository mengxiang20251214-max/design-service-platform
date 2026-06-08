'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { label: '仪表盘', href: '/admin', icon: LayoutDashboard },
  { label: '用户管理', href: '/admin/users', icon: Users },
  { label: '订单管理', href: '/admin/orders', icon: ShoppingCart },
  { label: '系统设置', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!loading && user) {
      if (user.role === 'admin') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <div className="font-bold text-lg hover:opacity-80 transition-opacity">
              🎨 Design Platform
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-3 py-1 rounded-full">
              管理员
            </span>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              mobileMenuOpen ? 'block' : 'hidden md:block'
            } md:col-span-1`}
          >
            <div className="bg-background rounded-lg border border-border p-4 shadow-sm sticky top-24">
              {/* Admin Badge */}
              <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 rounded-lg border border-red-200 dark:border-red-900/50">
                <p className="text-xs text-red-700 dark:text-red-200 font-medium">管理员中心</p>
                <p className="font-bold text-lg text-red-800 dark:text-red-100 truncate">{user?.name}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full mt-6 gap-2"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </Button>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
