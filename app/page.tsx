'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user, logout } = useAuth();
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-bold text-lg hover:opacity-80 transition-opacity"
            >
              🎨 Design Platform
            </motion.div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <motion.div
        className="container max-w-screen-2xl mx-auto px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Design Service Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A modern, powerful platform built with Next.js 15, TypeScript, TailwindCSS, and Framer Motion.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              title: 'Fast & Modern',
              description: 'Built with Next.js 15 and React 19 for optimal performance',
              icon: '⚡',
            },
            {
              title: 'Type Safe',
              description: 'Full TypeScript support with strict type checking enabled',
              icon: '🔒',
            },
            {
              title: 'Beautiful UI',
              description: 'Shadcn/UI components with TailwindCSS styling',
              icon: '✨',
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ translateY: -4 }}
              className="p-6 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-4 justify-center">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}
