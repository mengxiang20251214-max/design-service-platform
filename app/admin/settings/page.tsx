'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Bell, ToggleLeft } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">系统设置</h1>
        <p className="text-muted-foreground">配置平台系统和全局设置</p>
      </motion.div>

      {/* Platform Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              平台基本设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">平台名称</label>
              <Input
                value="Design Service Platform"
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">平台版本</label>
              <Input
                value="1.0.0"
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">支持邮箱</label>
              <Input
                type="email"
                value="support@designplatform.com"
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              安全设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">用户注册</p>
                <p className="text-sm text-muted-foreground">允许新用户注册账户</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                已启用
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">设计师申请</p>
                <p className="text-sm text-muted-foreground">允许用户申请成为设计师</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                已启用
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">订单创建</p>
                <p className="text-sm text-muted-foreground">允许用户创建新订单</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                已启用
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              通知设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">订单通知</p>
                <p className="text-sm text-muted-foreground">新订单创建时发送通知</p>
              </div>
              <ToggleLeft className="w-6 h-6 text-primary cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">支付通知</p>
                <p className="text-sm text-muted-foreground">支付成功时发送通知</p>
              </div>
              <ToggleLeft className="w-6 h-6 text-primary cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">用户注册通知</p>
                <p className="text-sm text-muted-foreground">新用户注册时发送通知</p>
              </div>
              <ToggleLeft className="w-6 h-6 text-primary cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">✅ 系统状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-green-800 dark:text-green-200">
            <div className="flex justify-between">
              <span>数据库连接</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                正常
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>支付网关</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                正常
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>邮件服务</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                正常
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Admin Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">🎯 测试信息</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              现在您以管理员身份访问此页面。 当前账户角色为 <Badge className="inline-block ml-2">管理员</Badge>
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              所有平台功能已在此后台可用。包括用户管理、订单管理和系统设置。
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
