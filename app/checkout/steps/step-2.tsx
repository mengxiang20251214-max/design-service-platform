'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCheckoutStore } from '@/lib/checkout-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ExternalLink } from 'lucide-react';

interface Style {
  id: string;
  name: string;
  slug: string;
  price: number;
}

export default function Step2() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedStyleId, setStyle } = useCheckoutStore();

  useEffect(() => {
    async function fetchStyles() {
      try {
        const response = await fetch('/api/styles');
        if (response.ok) {
          const data = await response.json();
          setStyles(data.slice(0, 6)); // 显示前6个风格
        }
      } catch (error) {
        console.error('Error fetching styles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStyles();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Style Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">选择设计风格</h2>
          <Link href="/styles" target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              浏览更多
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setStyle(style.id, style.name, style.price)}
              >
                <Card
                  className={`cursor-pointer transition-all h-full ${
                    selectedStyleId === style.id
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">🎨</span>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-2">{style.name}</CardTitle>
                      {selectedStyleId === style.id && (
                        <Badge className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-primary">${style.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Info */}
      {selectedStyleId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-primary/10 rounded-lg border border-primary/20"
        >
          <p className="text-sm text-muted-foreground">
            已选择: <span className="font-bold text-foreground">{styles.find((s) => s.id === selectedStyleId)?.name}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
