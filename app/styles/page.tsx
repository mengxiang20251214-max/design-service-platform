'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

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
}

export default function StylesPage() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchStyles();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchStyles(selectedCategory);
    } else {
      fetchStyles();
    }
  }, [selectedCategory]);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function fetchStyles(categoryId?: string) {
    setLoading(true);
    try {
      const url = categoryId
        ? `/api/styles?categoryId=${categoryId}`
        : '/api/styles';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setStyles(data);
      }
    } catch (error) {
      console.error('Error fetching styles:', error);
    } finally {
      setLoading(false);
    }
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-screen-2xl mx-auto px-4 py-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Design Styles</h1>
          <p className="text-lg text-muted-foreground">
            Explore our collection of unique design styles and aesthetics
          </p>
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            All Styles
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </motion.div>

        {/* Styles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading styles...</p>
          </div>
        ) : styles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No styles found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {styles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/styles/${style.slug}`}>
                  <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                    {/* Style Cover Image */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-t-lg overflow-hidden">
                      {style.coverImage ? (
                        <img
                          src={style.coverImage}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🎨
                        </div>
                      )}
                      {style.featured && (
                        <Badge className="absolute top-3 right-3">Featured</Badge>
                      )}
                    </div>

                    {/* Style Info */}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2">{style.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {style.category.name}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Description */}
                        {style.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {style.description}
                          </p>
                        )}

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{style.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">
                              ({style.reviews} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Price and Button */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-2xl font-bold text-primary">
                            ${style.price}
                          </div>
                          <Button size="sm">View</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
