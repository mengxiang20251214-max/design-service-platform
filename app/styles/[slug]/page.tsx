'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft, ShoppingCart } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface Style {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  price: number;
  featured: boolean;
  rating: number;
  reviews: number;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export default function StyleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [style, setStyle] = useState<Style | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedStyles, setRelatedStyles] = useState<Style[]>([]);

  useEffect(() => {
    fetchStyle();
  }, [slug]);

  async function fetchStyle() {
    setLoading(true);
    try {
      const response = await fetch('/api/styles');
      if (response.ok) {
        const styles = await response.json();
        const found = styles.find((s: Style) => s.slug === slug);
        if (found) {
          setStyle(found);
          const categoryResponse = await fetch(`/api/styles?categoryId=${found.categoryId}`);
          if (categoryResponse.ok) {
            const categoryStyles = await categoryResponse.json();
            setRelatedStyles(
              categoryStyles.filter((s: Style) => s.id !== found.id).slice(0, 3)
            );
          }
        }
      }
    } catch (error) {
      console.error('Error fetching style:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading style...</p>
        </div>
      </main>
    );
  }

  if (!style) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">Style not found</p>
          <Link href="/styles">
            <Button>Back to Styles</Button>
          </Link>
        </div>
      </main>
    );
  }

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

      {/* Breadcrumb */}
      <div className="container max-w-screen-2xl mx-auto px-4 py-4">
        <Link href="/styles" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Styles
        </Link>
      </div>

      {/* Style Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-screen-2xl mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Style Cover Image */}
          <div className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 aspect-square flex items-center justify-center">
            {style.coverImage ? (
              <img
                src={style.coverImage}
                alt={style.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl">🎨</div>
            )}
          </div>

          {/* Style Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{style.category.name}</Badge>
                {style.featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-2">{style.name}</h1>
              <p className="text-lg text-muted-foreground">{style.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(style.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {style.rating.toFixed(1)} ({style.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price and Purchase */}
            <div className="space-y-4">
              <div className="text-5xl font-bold text-primary">${style.price}</div>
              <Button size="lg" className="w-full gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            {/* Style Details */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Style Details</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{style.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="font-medium">{style.rating.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviews:</span>
                  <span className="font-medium">{style.reviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">${style.price}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Styles */}
        {relatedStyles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Styles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedStyles.map((related) => (
                <Link key={related.id} href={`/styles/${related.slug}`}>
                  <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-t-lg overflow-hidden flex items-center justify-center">
                      {related.coverImage ? (
                        <img
                          src={related.coverImage}
                          alt={related.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-3xl">🎨</div>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold line-clamp-2 mb-1">{related.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{related.category.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${related.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{related.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
