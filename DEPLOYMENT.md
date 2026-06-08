# 🚀 设计服务平台 - 部署指南

完整的项目部署、配置和运维文档。

## 📑 目录

1. [快速开始](#快速开始)
2. [环境要求](#环境要求)
3. [本地开发](#本地开发)
4. [部署前准备](#部署前准备)
5. [生产部署](#生产部署)
6. [数据库迁移](#数据库迁移)
7. [常见问题](#常见问题)
8. [监控和维护](#监控和维护)
9. [故障排除](#故障排除)

---

## 快速开始

### 开发环境启动

```bash
# 1. 克隆项目
git clone <repository-url>
cd design-service-platform

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入开发配置

# 4. 初始化数据库
npx prisma db push
npx prisma db seed  # 可选：导入示例数据

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 环境要求

### 最小要求

| 组件 | 最低版本 | 推荐版本 |
|------|---------|--------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 8.0.0 | 10.x |
| SQLite | 3.8+ | 最新版 |

### 推荐配置（生产环境）

| 资源 | 最小 | 推荐 |
|------|------|------|
| CPU | 1 核 | 2+ 核 |
| 内存 | 512 MB | 2+ GB |
| 存储 | 2 GB | 10+ GB |
| 带宽 | 不限 | 100+ Mbps |

---

## 本地开发

### 项目结构

```
design-service-platform/
├── app/                    # Next.js 应用
│   ├── api/               # API 路由
│   ├── admin/             # 管理后台
│   ├── dashboard/         # 用户中心
│   ├── designer/          # 设计师后台
│   └── layout.tsx         # 根布局
├── components/            # React 组件
├── lib/                   # 工具库和服务
├── prisma/               # 数据库配置和迁移
├── public/               # 静态资源
├── scripts/              # 工具脚本
├── .env.example          # 环境变量示例
├── .env.production       # 生产环境变量
├── next.config.ts        # Next.js 配置
├── tailwind.config.ts    # Tailwind CSS 配置
├── prisma.config.ts      # Prisma 配置
└── package.json          # 项目依赖
```

### 常用命令

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 运行测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format

# 数据库相关
npx prisma db push          # 同步数据库架构
npx prisma db seed         # 导入示例数据
npx prisma studio          # 打开 Prisma Studio
npx prisma migrate dev     # 创建新的迁移

# 数据库迁移脚本
node scripts/migrate-prod.js  # 生产迁移
node scripts/backup-db.js dev # 备份开发数据库
node scripts/backup-db.js prod # 备份生产数据库
```

---

## 部署前准备

### ✅ 清单

- [ ] 通过所有测试
- [ ] 代码审查完成
- [ ] 环境变量已配置
- [ ] 数据库已备份
- [ ] SSL 证书已准备
- [ ] 域名已解析
- [ ] CDN 已配置（可选）
- [ ] 监控和告警已设置

### 环境变量配置

#### 必需变量

```env
# 数据库（使用 PostgreSQL 推荐用于生产）
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# JWT 安全密钥（生成: openssl rand -base64 32）
JWT_SECRET="your-secret-key-here"

# 应用地址
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

#### Stripe 配置（支付功能）

```env
# 从 Stripe Dashboard 获取
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

#### 可选变量

```env
# 日志和分析
LOG_LEVEL="info"
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"

# 邮件服务
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="app-password"

# 文件上传
MAX_UPLOAD_SIZE="10485760"  # 10MB

# 缓存
CACHE_TTL="3600"  # 1小时
```

---

## 生产部署

### 方案 1: Vercel（推荐）

#### 步骤

1. **准备项目**
   ```bash
   git push origin main  # 推送到 GitHub
   ```

2. **连接 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账户登录
   - 选择 "Import Project"
   - 选择此仓库

3. **配置环境变量**
   ```
   Settings → Environment Variables → 添加
   ```

   添加以下变量：
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

4. **部署**
   ```
   点击 "Deploy" 按钮
   ```

5. **配置域名**
   ```
   Settings → Domains → 添加自定义域名
   ```

### 方案 2: Docker + Heroku

#### 创建 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 构建
COPY . .
RUN npm run build

# 启动
EXPOSE 3000
CMD ["npm", "start"]
```

#### 部署

```bash
# 1. 登录 Heroku
heroku login

# 2. 创建应用
heroku create your-app-name

# 3. 设置环境变量
heroku config:set DATABASE_URL="..."
heroku config:set JWT_SECRET="..."
# ... 其他变量

# 4. 部署
git push heroku main

# 5. 查看日志
heroku logs --tail
```

### 方案 3: Docker + 自托管

#### 构建和运行

```bash
# 构建镜像
docker build -t design-platform:latest .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  -e NEXT_PUBLIC_APP_URL="..." \
  --name design-platform \
  design-platform:latest

# 查看日志
docker logs -f design-platform
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://user:password@db:5432/designdb"
      JWT_SECRET: "your-secret"
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: designdb
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  db_data:
```

---

## 数据库迁移

### 初始迁移（首次部署）

```bash
# 1. 备份现有数据库（如有）
node scripts/backup-db.js prod

# 2. 运行迁移
node scripts/migrate-prod.js

# 3. 验证迁移
npm run db:validate  # 如果配置了此命令
```

### 增量迁移（后续更新）

```bash
# 1. 查看待定迁移
npx prisma migrate status

# 2. 备份
node scripts/backup-db.js prod

# 3. 运行待定迁移
npx prisma migrate deploy

# 4. 验证
npm run db:validate
```

### 数据库恢复

如果需要恢复到备份版本：

```bash
# 1. 找到备份文件
ls -la backups/

# 2. 恢复备份
cp backups/db-backup-<timestamp>.db prisma/prod.db

# 3. 重新启动应用
npm start
```

---

## 常见问题

### Q: 如何生成 JWT_SECRET？

```bash
# 使用 OpenSSL
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Q: 数据库迁移失败怎么办？

```bash
# 1. 检查 Prisma 状态
npx prisma migrate status

# 2. 查看错误详情
npx prisma db execute --stdin < migration-log.sql

# 3. 恢复到备份
cp backups/db-backup-<timestamp>.db prisma/prod.db

# 4. 联系支持
# 提供：prisma/migrations 目录内容和错误日志
```

### Q: 如何处理 SSL 证书？

对于 Let's Encrypt（推荐免费方案）：

```bash
# 使用 Certbot
sudo certbot certonly --standalone -d your-domain.com

# 配置 Nginx/Apache 使用证书
# 证书位置：/etc/letsencrypt/live/your-domain.com/
```

### Q: 如何扩展应用？

**水平扩展（多实例）：**
- 使用负载均衡器（如 Nginx）
- 配置会话存储（Redis）
- 使用分布式缓存

**垂直扩展（更多资源）：**
- 增加 CPU 核心
- 增加内存
- 使用更快的存储（SSD）

---

## 监控和维护

### 性能监控

```bash
# 1. 启用性能日志
export LOG_LEVEL=debug

# 2. 监控数据库
npx prisma studio

# 3. 检查应用日志
tail -f logs/app.log
```

### 自动备份

设置 cron 任务定期备份：

```bash
# 每天午夜备份
0 0 * * * cd /path/to/app && node scripts/backup-db.js prod
```

### 安全更新

```bash
# 检查依赖更新
npm outdated

# 更新依赖
npm update

# 审计安全漏洞
npm audit

# 修复漏洞
npm audit fix
```

---

## 故障排除

### 应用无法启动

```bash
# 1. 检查环境变量
env | grep DATABASE_URL

# 2. 检查数据库连接
npx prisma db execute --stdin < /dev/null

# 3. 查看详细错误
DEBUG=* npm start

# 4. 检查日志
tail -f .next/logs/*
```

### 数据库连接问题

```bash
# 1. 测试连接
node -e "require('@prisma/client').PrismaClient()"

# 2. 检查连接字符串
echo $DATABASE_URL

# 3. 验证数据库是否运行
# SQLite: ls -la prisma/prod.db
# PostgreSQL: psql -U user -d dbname -h host

# 4. 增加连接超时
DATABASE_URL="${DATABASE_URL}?connection_limit=5"
```

### 高内存占用

```bash
# 1. 检查进程内存
ps aux | grep node

# 2. 启用垃圾回收日志
node --expose-gc app.js

# 3. 调整 Node 堆大小
NODE_OPTIONS="--max-old-space-size=2048" npm start

# 4. 分析内存泄漏
# 使用 clinic.js: npm install -g clinic
clinic doctor -- npm start
```

### API 响应缓慢

```bash
# 1. 检查数据库查询
# 启用 Prisma 日志
DATABASE_TRACE=true npm start

# 2. 检查 API 响应时间
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/products

# 3. 优化数据库查询
# 添加索引、缓存热点数据

# 4. 启用 CDN 缓存
# 配置静态资源的 Cache-Control 头
```

---

## 联系和支持

- 📧 Email: support@your-domain.com
- 🐛 Bug Report: https://github.com/your-repo/issues
- 📚 文档: https://docs.your-domain.com
- 💬 讨论: https://github.com/your-repo/discussions

---

**最后更新**: 2024-06-08
**版本**: 1.0.0
