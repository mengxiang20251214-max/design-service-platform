'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🎨</div>
            <span className="font-bold">Design Platform</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-screen-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-primary">{user.name}</span>!
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's your dashboard overview
            </p>
          </div>

          {/* User Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">{user.email}</p>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    User ID
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold font-mono text-primary">
                    {user.id.slice(0, 8)}...
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Available Features</CardTitle>
                <CardDescription>
                  Explore what you can do on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold mb-2">🎨 Design Gallery</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse and upload your design work
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold mb-2">👥 Collaboration</h3>
                    <p className="text-sm text-muted-foreground">
                      Work with other designers in real-time
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold mb-2">📊 Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your work and performance metrics
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold mb-2">⚙️ Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your account preferences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full md:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
