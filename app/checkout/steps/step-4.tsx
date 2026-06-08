'use client';

import { motion } from 'framer-motion';
import { useCheckoutStore, UploadedFile } from '@/lib/checkout-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Upload, File, FileImage } from 'lucide-react';
import { useRef } from 'react';

export default function Step4() {
  const { uploadedFiles, addUploadedFile, removeUploadedFile } = useCheckoutStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        };
        addUploadedFile(uploadedFile);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold mb-4">上传素材和参考文件</h2>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-lg p-8 text-center cursor-pointer transition-all bg-primary/5 hover:bg-primary/10"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
          <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="font-medium mb-1">拖拽文件到此，或点击选择</h3>
          <p className="text-sm text-muted-foreground">
            支持图片、PDF、Word、Excel 等文件
          </p>
        </motion.div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6"
          >
            <h3 className="font-medium mb-3">已上传文件 ({uploadedFiles.length})</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {file.type.startsWith('image/') ? (
                      <FileImage className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <File className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadedFile(file.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preview for Images */}
        {uploadedFiles.some((f) => f.type.startsWith('image/')) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <h3 className="font-medium mb-3">图片预览</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedFiles
                .filter((f) => f.type.startsWith('image/'))
                .map((file) => (
                  <Card key={file.id} className="overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                    <CardContent className="p-2">
                      <p className="text-xs truncate text-muted-foreground">{file.name}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </motion.div>
        )}

        {/* Upload Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50"
        >
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">提示</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• 建议上传参考图片和相关素材</li>
            <li>• 单个文件大小不超过 50MB</li>
            <li>• 可以上传多个文件</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
