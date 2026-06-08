'use client';

import { motion } from 'framer-motion';
import { useCheckoutStore } from '@/lib/checkout-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Step3() {
  const { requirements, designSize, fileFormat, referenceUrl, setRequirements, setDesignSize, setFileFormat, setReferenceUrl } = useCheckoutStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold mb-4">填写设计需求</h2>

        {/* Requirements Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium mb-2">
            设计需求描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="请详细描述你的设计需求，包括设计目的、风格偏好、颜色喜好等..."
            className="w-full h-40 p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">最少 20 字</p>
        </motion.div>

        {/* Design Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium mb-2">
            设计尺寸 <span className="text-red-500">*</span>
          </label>
          <Input
            value={designSize}
            onChange={(e) => setDesignSize(e.target.value)}
            placeholder="例如: 1920x1080, 800x600"
            type="text"
          />
        </motion.div>

        {/* File Format */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium mb-2">
            文件格式要求 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {['PSD', 'PNG', 'JPG', 'SVG', 'PDF', 'AI'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFileFormat(fmt)}
                className={`px-3 py-1 rounded-full border transition-all ${
                  fileFormat === fmt
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
          <Input
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
            placeholder="或自定义格式"
            type="text"
          />
        </motion.div>

        {/* Reference URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-2">参考示例链接（可选）</label>
          <Input
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="https://example.com/reference"
            type="url"
          />
          <p className="text-xs text-muted-foreground mt-1">
            提供参考链接可以帮助设计师更好地理解你的需求
          </p>
        </motion.div>
      </div>

      {/* Form Summary */}
      {(requirements || designSize || fileFormat) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2"
        >
          <h3 className="font-medium">需求摘要：</h3>
          {requirements && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">需求：</span> {requirements.substring(0, 50)}...
            </p>
          )}
          {designSize && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">尺寸：</span> {designSize}
            </p>
          )}
          {fileFormat && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">格式：</span> {fileFormat}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
