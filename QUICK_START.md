# 🚀 快速开始指南

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境
cp .env.example .env.local
# 编辑 .env.local，填入开发配置

# 3. 初始化数据库
npx prisma db push
npm run db:seed

# 4. 启动服务
npm run dev

# 访问 http://localhost:3000
```

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 构建生产版本
npm start               # 启动生产服务器

# 数据库
npm run db:push         # 同步数据库架构
npm run db:seed         # 导入示例数据
npm run db:studio       # 打开 Prisma Studio
npm run db:backup:dev   # 备份开发数据库
npm run db:backup:prod  # 备份生产数据库

# 部署
npm run build:prod      # 构建 + 迁移（生产）
npm run deploy          # 完整部署流程
npm run db:migrate:prod # 执行生产迁移

# 代码质量
npm run lint            # 代码检查
npm run type-check      # 类型检查
npm run diagnose        # 完整诊断
```

## 测试账户

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@designplatform.com | admin123 |
| 用户 | user1@example.com | password123 |
| 设计师 | designer@example.com | password123 |

## 快速部署

### Vercel (推荐)

```bash
# 1. 推送到 GitHub
git push origin main

# 2. 访问 https://vercel.com
# 3. 点击 Import 导入项目
# 4. 配置环境变量
# 5. 部署完成！
```

### 本地部署

```bash
# 1. 配置环境变量
cp .env.production .env.production.local

# 2. 备份数据库
npm run db:backup:prod

# 3. 运行迁移
npm run db:migrate:prod

# 4. 启动服务
npm run start:prod
```

## 文档

- 📖 [完整部署指南](./DEPLOYMENT.md)
- 🔐 [环境变量清单](./ENV_CHECKLIST.md)
- ✅ [部署检查清单](./DEPLOYMENT_CHECKLIST.md)

## 常见问题

**Q: 如何重置数据库？**
```bash
npx prisma db execute "DROP TABLE IF EXISTS \\"User\\""
# 或使用迁移恢复功能
```

**Q: 如何查看数据库？**
```bash
npm run db:studio
# 打开 http://localhost:5555
```

**Q: 如何生成 JWT_SECRET？**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Q: 如何处理部署失败？**
1. 检查日志：`tail -f logs/app.log`
2. 验证环境变量：`env | grep DATABASE_URL`
3. 恢复备份：`cp backups/db-backup-<timestamp>.db prisma/prod.db`
4. 查看详细文档：[故障排除](./DEPLOYMENT.md#故障排除)

## 支持

- 📧 Email: support@example.com
- 🐛 Issues: https://github.com/your-repo/issues
- 📚 Docs: https://docs.example.com
