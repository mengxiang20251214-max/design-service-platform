'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCheckoutStore } from '@/lib/checkout-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function Step1() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedProductId, selectedPackage, setProduct, setPackage } = useCheckoutStore();

  const packagePrices = {
    basic: 0,
    standard: 100,
    premium: 200,
  };

  const packageDescriptions = {
    basic: '基础版 - 基本设计需求',
    standard: '标准版 - 完整设计方案',
    premium: '高级版 - 完整方案 + 修改无限制',
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.slice(0, 3)); // 只显示前3个产品
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Product Selection */}
      <div>
        <h2 className="text-xl font-bold mb-4">选择产品</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setProduct(product.id, product.name, product.price)}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedProductId === product.id
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      {selectedProductId === product.id && (
                        <Badge className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          已选择
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Package Selection */}
      {selectedProductId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4">选择套餐</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(packagePrices).map(([pkg, modifier]) => (
              <motion.div
                key={pkg}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPackage(pkg as 'basic' | 'standard' | 'premium', modifier)}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedPackage === pkg
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base capitalize">{packageDescriptions[pkg as keyof typeof packageDescriptions]}</CardTitle>
                      {selectedPackage === pkg && (
                        <Badge className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      ${products.find((p) => p.id === selectedProductId)?.price || 0 + modifier}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pkg === 'basic' && '基本的设计需求和修改'}
                      {pkg === 'standard' && '完整的设计方案和有限次数修改'}
                      {pkg === 'premium' && '完整方案，修改和咨询无限制'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selected Info */}
      {selectedProductId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-primary/10 rounded-lg border border-primary/20"
        >
          <p className="text-sm text-muted-foreground">
            已选择: <span className="font-bold text-foreground">{products.find((p) => p.id === selectedProductId)?.name}</span> -
            <span className="font-bold text-primary ml-1 capitalize">{selectedPackage}</span> 套餐
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
