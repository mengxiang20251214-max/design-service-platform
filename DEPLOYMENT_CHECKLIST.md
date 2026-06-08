# ✅ 部署前检查清单

完整的生产部署前验证清单，确保所有环节就绪。

## 📋 部署前 7 天

### 周一-周三：代码审查与测试

- [ ] 所有功能测试通过
- [ ] 代码审查完成
- [ ] 没有未解决的 Bug
- [ ] 性能基准测试完成
- [ ] 安全审计通过

### 周四-周五：配置与环境

- [ ] `.env.production` 已准备
- [ ] 所有密钥已生成（JWT_SECRET, Stripe Keys 等）
- [ ] 数据库连接字符串已验证
- [ ] SSL 证书已申请/更新
- [ ] 域名 DNS 已配置

### 周末：备份与恢复计划

- [ ] 生产数据库备份策略已制定
- [ ] 备份脚本已测试
- [ ] 恢复流程已演练
- [ ] 灾难恢复计划已文档化
- [ ] 关键人员已通知

---

## 🔍 部署前 24 小时

### 代码检查

```bash
# 类型检查
npm run type-check

# 代码质量
npm run lint

# 构建验证
npm run build

# 大小检查
npm run build
# 检查 .next/static 目录大小
```

- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 构建成功（< 5 分钟）
- [ ] 构建大小合理（< 50MB）

### 环境验证

```bash
# 验证环境变量
env | grep -E "DATABASE_URL|JWT_SECRET|STRIPE" | wc -l
# 应该返回 ≥ 5

# 测试数据库连接
npm run db:validate

# 备份数据库
npm run db:backup:prod
```

- [ ] 所有必需环境变量已设置
- [ ] 数据库连接正常
- [ ] 当前数据库已备份
- [ ] 备份文件可验证

### 依赖检查

```bash
# 检查安全漏洞
npm audit

# 检查过时包
npm outdated

# 检查许可证合规
npm ls --all
```

- [ ] 无已知安全漏洞
- [ ] 无关键过时包
- [ ] 许可证合规（MIT/Apache 优先）

### 性能测试

- [ ] 首屏加载时间 < 3s
- [ ] API 响应时间 < 500ms
- [ ] 数据库查询 < 200ms
- [ ] 静态资源压缩率 > 50%

### 安全检查

```bash
# 扫描敏感信息
grep -r "sk_live" .
grep -r "password" .
grep -r "secret" . --exclude-dir=.git
```

- [ ] 无硬编码的密钥
- [ ] 无密码在代码中
- [ ] `.env.local` 不在 Git 中
- [ ] `.env.production` 只在安全环境中

---

## 🚀 部署流程（实时检查）

### 部署前 1 小时

- [ ] 通知所有团队成员
- [ ] 禁用自动部署流程
- [ ] 准备回滚方案
- [ ] 打开监控仪表板

### 部署执行

```bash
# 1. 最终构建
npm run build

# 2. 数据库迁移（备份已做）
npm run db:migrate:prod

# 3. 部署应用
# Vercel: git push (自动部署)
# 或手动: npm run deploy

# 4. 健康检查
curl -i https://yourdomain.com/api/auth/verify
```

- [ ] 构建成功完成
- [ ] 数据库迁移成功
- [ ] 应用部署成功
- [ ] 健康检查通过

### 部署后 30 分钟

```bash
# 监控应用日志
tail -f logs/production.log

# 检查错误率
# 访问监控面板

# 验证主要功能
# 1. 登录流程
# 2. 创建订单
# 3. 支付处理
```

- [ ] 错误率正常（< 0.1%）
- [ ] 用户能成功登录
- [ ] 订单能正常创建
- [ ] 支付流程正常
- [ ] API 响应时间正常
- [ ] 数据库连接稳定

### 部署后 2 小时

- [ ] 性能指标正常
- [ ] 错误日志无异常
- [ ] 用户反馈收集中
- [ ] 监控告警未触发

### 部署后 24 小时

- [ ] 所有功能经过用户验证
- [ ] 没有报告的 Bug
- [ ] 性能指标稳定
- [ ] 数据库查询性能良好

---

## 🔄 回滚方案

如果需要回滚：

### 快速回滚（≤ 5 分钟）

```bash
# 1. 立即停止应用
npm stop

# 2. 恢复数据库备份
cp backups/db-backup-<previous-timestamp>.db prisma/prod.db

# 3. 部署上一个版本
git checkout <previous-tag>
npm run build
npm start

# 4. 验证
curl https://yourdomain.com
```

- [ ] 应用已停止
- [ ] 备份已恢复
- [ ] 上一版本已部署
- [ ] 功能验证通过

### 事后分析

- [ ] 记录失败原因
- [ ] 分析根本原因
- [ ] 制定改进方案
- [ ] 更新文档和流程

---

## 📊 部署日志模板

```
=== 部署日志 ===

日期: 2024-06-08
版本: v1.0.0
部署者: [Your Name]
环境: production

构建信息:
- 构建时间: [Time]
- 构建大小: [Size]
- 构建状态: ✅ 成功

数据库:
- 迁移前备份: [Backup File]
- 迁移脚本: migrate-prod.js
- 迁移状态: ✅ 成功
- 数据库验证: ✅ 通过

部署:
- 部署时间: [Time]
- 部署方式: [Vercel/Docker/Manual]
- 部署状态: ✅ 成功

验证:
- 健康检查: ✅ 通过
- API 测试: ✅ 通过
- 功能测试: ✅ 通过
- 性能测试: ✅ 通过

监控:
- 错误率: 0.01%
- API 响应时间: 123ms
- 数据库查询: 45ms
- 内存使用: 512MB/2GB

备注:
[任何其他相关信息]
```

---

## 🚨 常见问题与解决

### 构建失败

```bash
# 1. 清除缓存
rm -rf .next node_modules package-lock.json

# 2. 重新安装依赖
npm install

# 3. 重新构建
npm run build

# 4. 检查错误
npm run type-check
npm run lint
```

### 数据库迁移失败

```bash
# 1. 查看迁移状态
npx prisma migrate status

# 2. 查看失败原因
npx prisma migrate resolve --rolled-back <migration-name>

# 3. 恢复备份
cp backups/db-backup-<timestamp>.db prisma/prod.db

# 4. 联系支持
# 提供 error log 和 prisma/migrations 内容
```

### 应用无法启动

```bash
# 1. 检查环境变量
env | grep DATABASE_URL

# 2. 验证数据库
npm run db:validate

# 3. 检查日志
tail -f logs/production.log

# 4. 检查端口占用
lsof -i :3000
```

### 性能问题

```bash
# 1. 检查数据库查询
# 启用 Prisma 日志
DATABASE_TRACE=true npm start

# 2. 分析内存使用
node --expose-gc app.js
clinic doctor -- npm start

# 3. 优化建议
# - 添加数据库索引
# - 启用缓存
# - 使用 CDN
```

---

## 📞 应急联系

| 角色 | 姓名 | 电话 | 邮箱 |
|------|------|------|------|
| 技术负责人 | [Name] | [Phone] | [Email] |
| 数据库管理员 | [Name] | [Phone] | [Email] |
| 系统管理员 | [Name] | [Phone] | [Email] |
| 支持团队负责人 | [Name] | [Phone] | [Email] |

---

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md)
- [环境变量配置](./ENV_CHECKLIST.md)
- [故障排除](./DEPLOYMENT.md#故障排除)
- [监控和维护](./DEPLOYMENT.md#监控和维护)

---

**最后更新**: 2024-06-08
**版本**: 1.0.0
