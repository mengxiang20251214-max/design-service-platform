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

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  featured: boolean;
  rating: number;
  reviews: number;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedStyles, setRelatedStyles] = useState<Style[]>([]);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  async function fetchProduct() {
    setLoading(true);
    try {
      // First, fetch all products to find the one with matching slug
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        const found = products.find((p: Product) => p.slug === slug);
        if (found) {
          setProduct(found);
          // Fetch related products from same category
          const categoryResponse = await fetch(`/api/products?categoryId=${found.categoryId}`);
          if (categoryResponse.ok) {
            const categoryProducts = await categoryResponse.json();
            setRelatedProducts(
              categoryProducts.filter((p: Product) => p.id !== found.id).slice(0, 3)
            );
          }
          // Fetch related styles from same category
          const stylesResponse = await fetch(`/api/styles?categoryId=${found.categoryId}`);
          if (stylesResponse.ok) {
            const categoryStyles = await stylesResponse.json();
            setRelatedStyles(categoryStyles.slice(0, 3));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
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
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
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
          <p className="text-lg text-muted-foreground mb-4">Product not found</p>
          <Link href="/products">
            <Button>Back to Products</Button>
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
        <Link href="/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-screen-2xl mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 aspect-square flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl">{product.category.icon || '🎨'}</div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{product.category.name}</Badge>
                {product.featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price and Purchase */}
            <div className="space-y-4">
              <div className="text-5xl font-bold text-primary">${product.price}</div>
              <Button size="lg" className="w-full gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Product Details</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="font-medium">{product.rating.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviews:</span>
                  <span className="font-medium">{product.reviews}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Styles */}
        {relatedStyles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Recommended Design Styles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedStyles.map((style) => (
                <Link key={style.id} href={`/styles/${style.slug}`}>
                  <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-t-lg overflow-hidden flex items-center justify-center">
                      {style.coverImage ? (
                        <img
                          src={style.coverImage}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-3xl">🎨</div>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold line-clamp-2 mb-1">{style.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{style.category.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${style.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{style.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/products/${related.slug}`}>
                  <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                    <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-t-lg overflow-hidden flex items-center justify-center">
                      {related.image ? (
                        <img
                          src={related.image}
                          alt={related.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-3xl">{related.category.icon || '🎨'}</div>
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
