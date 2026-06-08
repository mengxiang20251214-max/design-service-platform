'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail } from 'lucide-react';

const messages = [
  {
    id: 1,
    sender: '客服团队',
    subject: '订单处理进度更新',
    content: '您的订单已进入设计阶段，设计师正在制作您的设计。预计将在 5 个工作日内完成。',
    timestamp: '2 天前',
    unread: false,
  },
  {
    id: 2,
    sender: '系统',
    subject: '订单支付成功',
    content: '您的订单已成功支付，订单号：ORD-1234-5678-AB。设计师将很快开始工作。',
    timestamp: '5 天前',
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">消息中心</h1>
        <p className="text-muted-foreground">查看来自客服和系统的所有消息</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              消息列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">暂无消息</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`p-4 border border-border rounded-lg cursor-pointer transition-colors ${
                      message.unread
                        ? 'bg-primary/5 hover:bg-primary/10'
                        : 'hover:bg-muted/50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className={`font-medium ${message.unread ? 'text-primary' : ''}`}>
                            {message.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">{message.sender}</p>
                        </div>
                        <p className="text-xs text-muted-foreground ml-4">{message.timestamp}</p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">需要帮助？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              如果您有任何问题或需要帮助，请通过以下方式联系我们：
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                📧 <span className="font-medium">邮箱：</span> support@designplatform.com
              </p>
              <p className="text-sm">
                💬 <span className="font-medium">客服：</span> 周一至周五 9:00 - 18:00
              </p>
              <p className="text-sm">
                🎯 <span className="font-medium">在线客服：</span> 点击下方按钮联系
              </p>
            </div>
            <Button className="w-full md:w-auto">
              <MessageSquare className="w-4 h-4 mr-2" />
              开始对话
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
