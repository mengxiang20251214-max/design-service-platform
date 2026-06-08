# 🔐 环境变量配置清单

完整的环境变量配置指南和安全最佳实践。

## 📋 变量清单

### 核心配置

| 变量 | 类型 | 示例值 | 必需 | 说明 |
|------|------|--------|------|------|
| `NODE_ENV` | string | `production` | ✅ | 运行环境：development/production |
| `DATABASE_URL` | string | `postgresql://...` | ✅ | 数据库连接字符串 |
| `JWT_SECRET` | string | `base64-encoded-key` | ✅ | JWT 签名密钥（最少 32 字符） |

### 应用配置

| 变量 | 类型 | 示例值 | 必需 | 说明 |
|------|------|--------|------|------|
| `NEXT_PUBLIC_APP_URL` | string | `https://app.example.com` | ✅ | 应用访问 URL |
| `NEXT_PUBLIC_SOCKET_URL` | string | `https://app.example.com` | ✅ | WebSocket 连接 URL |
| `LOG_LEVEL` | string | `info` | ❌ | 日志级别：debug/info/warn/error |
| `API_TIMEOUT` | number | `30000` | ❌ | API 超时时间（毫秒） |

### Stripe 支付配置

| 变量 | 类型 | 说明 | 必需 |
|------|------|------|------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | string | Stripe 公钥（前端可见） | ✅ |
| `STRIPE_SECRET_KEY` | string | Stripe 私钥（仅后端） | ✅ |
| `STRIPE_WEBHOOK_SECRET` | string | Webhook 签名密钥 | ✅ |

### 邮件服务配置（可选）

| 变量 | 类型 | 示例值 | 必需 |
|------|------|--------|------|
| `SMTP_HOST` | string | `smtp.gmail.com` | ❌ |
| `SMTP_PORT` | number | `587` | ❌ |
| `SMTP_USER` | string | `your-email@gmail.com` | ❌ |
| `SMTP_PASSWORD` | string | `app-password` | ❌ |
| `SMTP_FROM` | string | `noreply@example.com` | ❌ |

### 文件上传配置

| 变量 | 类型 | 示例值 | 必需 | 说明 |
|------|------|--------|------|------|
| `MAX_UPLOAD_SIZE` | number | `10485760` | ❌ | 最大上传大小（字节）10MB |
| `UPLOAD_DIR` | string | `/tmp/uploads` | ❌ | 上传文件存储目录 |

### 缓存配置

| 变量 | 类型 | 示例值 | 必需 | 说明 |
|------|------|--------|------|------|
| `CACHE_TTL` | number | `3600` | ❌ | 缓存有效期（秒）1小时 |
| `REDIS_URL` | string | `redis://localhost:6379` | ❌ | Redis 连接（可选） |

### 监控和分析（可选）

| 变量 | 类型 | 说明 | 必需 |
|------|------|------|------|
| `SENTRY_DSN` | string | Sentry 错误追踪 | ❌ |
| `NEXT_PUBLIC_ANALYTICS_ID` | string | Google Analytics | ❌ |
| `DATADOG_API_KEY` | string | Datadog 监控 | ❌ |

---

## 🔑 密钥生成指南

### 生成 JWT_SECRET

**使用 OpenSSL：**
```bash
openssl rand -base64 32
```

**使用 Node.js：**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**使用 Python：**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**示例输出：**
```
h9K8/L2m+X7pQ1vN5jW8kJ3B4zY0aF6gH8J9K0L1M2N3O4
```

### 获取 Stripe 密钥

1. 访问 https://dashboard.stripe.com
2. 登录账户
3. 进入 "API Keys" 部分
4. 找到：
   - **Publishable Key**: `pk_live_...` 或 `pk_test_...`
   - **Secret Key**: `sk_live_...` 或 `sk_test_...`
5. 创建 Webhook Endpoint：
   - 点击 "Webhooks"
   - 选择 "Add endpoint"
   - URL: `https://your-domain.com/api/payments/webhook`
   - 事件: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - 复制 Webhook Secret: `whsec_...`

### 获取数据库连接字符串

**SQLite（开发环境）：**
```
file:./prisma/dev.db
```

**PostgreSQL（生产环境）：**
```
postgresql://username:password@localhost:5432/dbname?schema=public
```

**MySQL（可选）：**
```
mysql://username:password@localhost:3306/dbname
```

---

## 🔒 安全最佳实践

### ✅ 做法

- ✅ 使用强随机密钥（最少 32 字符）
- ✅ 将秘密信息存储在环境变量中
- ✅ 在 Git 中排除 `.env.local` 和 `.env.production`
- ✅ 在不同环境使用不同密钥
- ✅ 定期轮换密钥
- ✅ 使用密钥管理服务（如 AWS Secrets Manager）
- ✅ 监控密钥使用情况
- ✅ 限制密钥访问权限

### ❌ 禁止

- ❌ 在代码中硬编码密钥
- ❌ 在 Git 提交中包含秘密信息
- ❌ 在日志中打印敏感数据
- ❌ 通过不安全的通道传输密钥
- ❌ 在公共仓库中暴露密钥
- ❌ 使用易猜测的密钥
- ❌ 跨环境共享密钥

---

## 📦 环境文件结构

### 开发环境（`.env.local`）

```env
NODE_ENV=development
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=dev-secret-key-not-for-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxx
LOG_LEVEL=debug
```

### 生产环境（`.env.production`）

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/designdb
JWT_SECRET=<use-secure-random-key>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_live_xxx
LOG_LEVEL=info
CACHE_TTL=3600
```

### 预发布环境（`.env.staging`）

```env
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db:5432/designdb
JWT_SECRET=<different-secure-random-key>
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxx
LOG_LEVEL=debug
```

---

## 🔄 密钥轮换流程

当需要更新密钥时的安全流程：

### 步骤

1. **生成新密钥**
   ```bash
   openssl rand -base64 32
   ```

2. **更新环境变量**
   - 在生产环境配置中添加新密钥
   - 保持旧密钥可用（24 小时）

3. **验证新密钥**
   ```bash
   # 使用新密钥在测试环境验证
   JWT_SECRET=<new-key> npm test
   ```

4. **部署变更**
   ```bash
   git add .env.production
   git commit -m "chore: rotate JWT secret"
   git push
   # 部署到生产环境
   ```

5. **监控**
   - 监控错误日志中的认证失败
   - 确认应用正常运行

6. **删除旧密钥**
   - 24 小时后删除旧密钥
   - 更新记录

---

## 🚨 紧急处理

### 如果密钥被泄露

1. **立即行动**
   ```bash
   # 立即停止应用
   npm stop
   
   # 生成新密钥
   openssl rand -base64 32
   ```

2. **更新密钥**
   - 在所有环境中更新被泄露的密钥
   - 检查密钥使用日志
   - 撤销旧的 API 凭证

3. **审计和验证**
   - 检查是否有未授权访问
   - 重置用户会话
   - 更新日志和监控告警

4. **通知团队**
   - 通知所有开发者
   - 更新密钥访问清单
   - 举行安全审查会议

---

## 📊 验证清单

部署前确认以下项目：

### 开发环境

- [ ] `.env.local` 已配置
- [ ] 数据库连接正常
- [ ] 应用启动成功
- [ ] API 测试通过
- [ ] 登录功能正常

### 生产环境

- [ ] `.env.production` 已配置
- [ ] 所有密钥已替换为生产值
- [ ] 数据库备份已创建
- [ ] SSL 证书有效
- [ ] 应用构建成功
- [ ] 监控和告警已设置
- [ ] 备份策略已实施
- [ ] 灾难恢复计划已准备

---

## 📞 支持

如有问题或需要密钥管理方面的帮助，请：

1. 查看应用日志：`tail -f logs/app.log`
2. 检查环境变量：`env | grep -v PASSWORD`
3. 运行诊断：`npm run diagnose`
4. 联系支持：support@example.com

---

**最后更新**: 2024-06-08
**版本**: 1.0.0
