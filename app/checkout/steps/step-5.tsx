'use client';

import { motion } from 'framer-motion';
import { useCheckoutStore } from '@/lib/checkout-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Step5() {
  const {
    selectedProductName,
    selectedPackage,
    selectedStyleName,
    requirements,
    designSize,
    fileFormat,
    uploadedFiles,
    customerEmail,
    customerName,
    notes,
    setCustomerInfo,
    getTotalPrice,
    getOrderSummary,
  } = useCheckoutStore();

  const summary = getOrderSummary();
  const totalPrice = getTotalPrice();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold">确认订单</h2>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">订单摘要</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">产品</p>
                  <p className="font-medium">{selectedProductName}</p>
                </div>
                <Badge>{selectedPackage}</Badge>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">设计风格</p>
                  <p className="font-medium">{selectedStyleName}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">设计尺寸</p>
                  <p className="font-medium">{designSize || '未指定'}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">文件格式</p>
                  <p className="font-medium">{fileFormat || '未指定'}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已上传文件</p>
                  <p className="font-medium">{uploadedFiles.length} 个文件</p>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-lg">总费用</span>
                <span className="text-3xl font-bold text-primary">${totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">客户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerInfo(customerEmail, e.target.value, notes)}
                placeholder="请输入你的姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerInfo(e.target.value, customerName, notes)}
                placeholder="请输入你的邮箱"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">备注（可选）</label>
              <textarea
                value={notes}
                onChange={(e) => setCustomerInfo(customerEmail, customerName, e.target.value)}
                placeholder="有什么其他需要说明的吗？"
                className="w-full h-24 p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Design Requirements */}
      {requirements && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">设计需求</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">{requirements}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Confirmation Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900/50 space-y-3"
      >
        <h4 className="font-medium text-green-900 dark:text-green-100">确认清单</h4>
        <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="mt-0.5"
            />
            <span>已选择产品和套餐</span>
          </li>
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="mt-0.5"
            />
            <span>已选择设计风格</span>
          </li>
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={!!designSize}
              disabled
              className="mt-0.5"
            />
            <span>已填写设计尺寸</span>
          </li>
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={!!fileFormat}
              disabled
              className="mt-0.5"
            />
            <span>已选择文件格式</span>
          </li>
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={uploadedFiles.length > 0}
              disabled
              className="mt-0.5"
            />
            <span>已上传参考素材</span>
          </li>
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={!!customerName && !!customerEmail}
              disabled
              className="mt-0.5"
            />
            <span>已填写客户信息</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
