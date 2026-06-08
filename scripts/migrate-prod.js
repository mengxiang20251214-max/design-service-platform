#!/usr/bin/env node

/**
 * 生产环境数据库迁移脚本
 * 用法: node scripts/migrate-prod.js
 *
 * 这个脚本将：
 * 1. 备份现有数据库
 * 2. 运行 Prisma 迁移
 * 3. 验证迁移成功
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '../backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

console.log('📦 生产环境数据库迁移脚本\n' + '='.repeat(50));

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('✅ 已创建备份目录:', BACKUP_DIR);
}

try {
  // 1. 备份数据库
  console.log('\n1️⃣ 备份现有数据库...');
  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || 'prisma/prod.db';
  const backupPath = path.join(BACKUP_DIR, `db-backup-${TIMESTAMP}.db`);

  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, backupPath);
    console.log('✅ 数据库已备份到:', backupPath);
  } else {
    console.log('⚠️  数据库文件不存在，跳过备份');
  }

  // 2. 运行迁移
  console.log('\n2️⃣ 运行数据库迁移...');
  console.log('   执行: npx prisma db push');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ 迁移完成');

  // 3. 生成 Prisma Client
  console.log('\n3️⃣ 生成 Prisma Client...');
  console.log('   执行: npx prisma generate');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client 已生成');

  // 4. 验证数据库连接
  console.log('\n4️⃣ 验证数据库连接...');
  const verifyScript = `
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    (async () => {
      try {
        await prisma.$queryRaw\`SELECT 1\`;
        console.log('✅ 数据库连接正常');
        process.exit(0);
      } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        process.exit(1);
      } finally {
        await prisma.$disconnect();
      }
    })();
  `;

  fs.writeFileSync('.verify-db.js', verifyScript);
  execSync('node .verify-db.js', { stdio: 'inherit' });
  fs.unlinkSync('.verify-db.js');

  console.log('\n' + '='.repeat(50));
  console.log('✅ 迁移成功完成！');
  console.log('\n📊 迁移信息:');
  console.log('   时间戳:', TIMESTAMP);
  console.log('   备份路径:', backupPath);
  console.log('\n⚠️  重要提示:');
  console.log('   - 备份文件已保存，如需恢复可使用此文件');
  console.log('   - 建议在应用部署前运行此脚本');
  console.log('   - 确保有足够的磁盘空间用于备份');

  process.exit(0);
} catch (error) {
  console.error('\n❌ 迁移失败:', error.message);
  console.log('\n💡 故障排除:');
  console.log('   1. 检查数据库连接字符串是否正确');
  console.log('   2. 确认数据库文件是否存在或可创建');
  console.log('   3. 检查磁盘空间是否充足');
  console.log('   4. 查看 Prisma 错误日志了解详细信息');

  process.exit(1);
}
