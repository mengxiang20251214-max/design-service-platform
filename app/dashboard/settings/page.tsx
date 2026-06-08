'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Lock, User } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: '姓名不能为空' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '个人信息已更新' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '更新失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '更新失败，请重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: '请填写所有字段' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码至少需要 6 个字符' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '密码已更新' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '更新失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '更新失败，请重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">账户设置</h1>
        <p className="text-muted-foreground">管理你的账户和隐私设置</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex gap-4 border-b border-border">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setMessage(null);
                }}
                className={`pb-3 px-4 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                个人信息
              </button>
              <button
                onClick={() => {
                  setActiveTab('password');
                  setMessage(null);
                }}
                className={`pb-3 px-4 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'password'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Lock className="w-4 h-4" />
                修改密码
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleUpdateProfile}
                className="space-y-6 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">邮箱</label>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">邮箱地址无法修改</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">姓名</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入你的姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">注册日期</label>
                  <Input
                    type="text"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? '更新中...' : '保存更改'}
                </Button>
              </motion.form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleChangePassword}
                className="space-y-6 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">当前密码</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="请输入当前密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">新密码</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码（至少 6 个字符）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">确认新密码</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入新密码"
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? '更新中...' : '更新密码'}
                </Button>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50 text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">💡 密码安全提示</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 至少使用 6 个字符</li>
                    <li>• 建议混合使用大小写字母、数字和特殊字符</li>
                    <li>• 定期修改密码以保护账户安全</li>
                  </ul>
                </div>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">账户状态</p>
                  <p className="font-medium">活跃</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">账户等级</p>
                  <p className="font-medium">普通用户</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
