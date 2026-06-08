#!/usr/bin/env node

/**
 * 数据库备份脚本
 * 用法: node scripts/backup-db.js [环境]
 *
 * 例子:
 *   node scripts/backup-db.js prod   # 备份生产数据库
 *   node scripts/backup-db.js dev    # 备份开发数据库
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const env = process.argv[2] || 'dev';
const BACKUP_DIR = path.join(__dirname, '../backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

console.log(`📦 ${env.toUpperCase()} 环境数据库备份\n` + '='.repeat(50));

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('✅ 已创建备份目录:', BACKUP_DIR);
}

try {
  // 确定数据库路径
  let dbPath;
  switch (env.toLowerCase()) {
    case 'prod':
    case 'production':
      dbPath = process.env.DATABASE_URL?.replace('file:', '') || 'prisma/prod.db';
      break;
    case 'dev':
    case 'development':
      dbPath = process.env.DATABASE_URL?.replace('file:', '') || 'prisma/dev.db';
      break;
    default:
      dbPath = `prisma/${env}.db`;
  }

  // 检查数据库是否存在
  if (!fs.existsSync(dbPath)) {
    console.error('❌ 数据库文件不存在:', dbPath);
    process.exit(1);
  }

  // 获取数据库文件信息
  const stats = fs.statSync(dbPath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMB = (fileSizeInBytes / 1024 / 1024).toFixed(2);

  console.log('\n📊 数据库信息:');
  console.log('   路径:', dbPath);
  console.log('   大小:', fileSizeInMB, 'MB');
  console.log('   最后修改:', stats.mtime.toISOString());

  // 创建备份
  console.log('\n1️⃣ 正在备份...');
  const backupPath = path.join(BACKUP_DIR, `db-${env}-backup-${TIMESTAMP}.db`);
  fs.copyFileSync(dbPath, backupPath);
  console.log('✅ 备份完成');

  // 创建元数据文件
  const metadata = {
    environment: env,
    timestamp: TIMESTAMP,
    sourcePath: dbPath,
    backupPath: backupPath,
    fileSize: fileSizeInBytes,
    createdAt: new Date().toISOString(),
    notes: `Database backup for ${env} environment`,
  };

  const metadataPath = backupPath.replace('.db', '.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log('✅ 元数据已保存:', metadataPath);

  console.log('\n' + '='.repeat(50));
  console.log('✅ 备份成功！\n');
  console.log('📋 备份详情:');
  console.log('   备份文件:', backupPath);
  console.log('   文件大小:', fileSizeInMB, 'MB');
  console.log('   创建时间:', new Date().toISOString());

  console.log('\n💡 恢复方法:');
  console.log('   1. 备份当前数据库: cp', dbPath, dbPath + '.current');
  console.log('   2. 恢复备份:', 'cp', backupPath, dbPath);
  console.log('   3. 验证数据库: npm run db:validate');

  // 列出最近的备份
  console.log('\n📚 最近的备份:');
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.db'))
    .sort()
    .reverse()
    .slice(0, 5);

  files.forEach((file, index) => {
    const filePath = path.join(BACKUP_DIR, file);
    const fileStats = fs.statSync(filePath);
    const fileSizeMB = (fileStats.size / 1024 / 1024).toFixed(2);
    console.log(`   ${index + 1}. ${file} (${fileSizeMB} MB) - ${fileStats.mtime.toISOString()}`);
  });

  process.exit(0);
} catch (error) {
  console.error('\n❌ 备份失败:', error.message);
  console.log('\n💡 故障排除:');
  console.log('   1. 确认数据库文件存在且可访问');
  console.log('   2. 检查磁盘空间是否充足');
  console.log('   3. 确认备份目录的写入权限');
  process.exit(1);
}
