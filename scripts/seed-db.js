const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  }),
});

async function main() {
  console.log('🌱 开始导入测试数据...');

  // 清空现有数据
  await prisma.payment.deleteMany();
  await prisma.designerOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.earning.deleteMany();
  await prisma.designerApplication.deleteMany();
  await prisma.designer.deleteMany();
  await prisma.style.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ 已清空现有数据');

  // 创建分类
  const category1 = await prisma.category.create({
    data: {
      name: '品牌设计',
      slug: 'brand-design',
      description: '企业品牌视觉设计服务',
      icon: '🎨',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: '网站设计',
      slug: 'web-design',
      description: '网站UI/UX设计服务',
      icon: '🌐',
    },
  });

  console.log('✓ 已创建分类');

  // 创建产品
  const product1 = await prisma.product.create({
    data: {
      name: '企业标志设计',
      slug: 'logo-design',
      description: '专业的企业LOGO和品牌标识设计',
      price: 299,
      image: '/images/logo.jpg',
      categoryId: category1.id,
      featured: true,
      rating: 4.8,
      reviews: 125,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: '网站首页设计',
      slug: 'homepage-design',
      description: '现代化响应式网站首页设计',
      price: 799,
      image: '/images/homepage.jpg',
      categoryId: category2.id,
      featured: true,
      rating: 4.9,
      reviews: 89,
    },
  });

  console.log('✓ 已创建产品');

  // 创建风格
  const style1 = await prisma.style.create({
    data: {
      name: '现代简约',
      slug: 'modern-minimal',
      description: '简洁现代的设计风格',
      price: 0,
      categoryId: category1.id,
      featured: true,
    },
  });

  const style2 = await prisma.style.create({
    data: {
      name: '科技蓝',
      slug: 'tech-blue',
      description: '科技感的蓝色主题风格',
      price: 100,
      categoryId: category2.id,
      featured: true,
    },
  });

  console.log('✓ 已创建风格');

  // 创建管理员用户
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@designplatform.com',
      name: '管理员',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      status: 'active',
    },
  });

  // 创建普通用户
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: '张三',
      password: bcrypt.hashSync('password123', 10),
      role: 'user',
      status: 'active',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: '李四',
      password: bcrypt.hashSync('password123', 10),
      role: 'user',
      status: 'active',
    },
  });

  // 创建设计师用户
  const designerUser = await prisma.user.create({
    data: {
      email: 'designer@example.com',
      name: '设计师小王',
      password: bcrypt.hashSync('password123', 10),
      role: 'designer',
      status: 'active',
    },
  });

  console.log('✓ 已创建用户');

  // 创建设计师资料
  const designer = await prisma.designer.create({
    data: {
      userId: designerUser.id,
      bio: '资深UI/UX设计师，拥有5年设计经验',
      skills: JSON.stringify(['UI设计', 'UX设计', '品牌设计', '网页设计']),
      portfolioUrl: 'https://portfolio.example.com',
      rating: 4.8,
      completedOrders: 45,
      totalEarnings: 12000,
    },
  });

  console.log('✓ 已创建设计师');

  // 创建订单
  const order1 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-001`,
      userId: user1.id,
      customerName: '张三',
      customerEmail: 'user1@example.com',
      productName: product1.name,
      styleName: style1.name,
      packageType: 'standard',
      requirements: '我需要一个现代化的企业标志，体现科技感和专业性',
      designSize: '500x500',
      fileFormat: 'PNG',
      uploadedFileCount: 2,
      totalPrice: 299,
      status: 'in_progress',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-002`,
      userId: user2.id,
      customerName: '李四',
      customerEmail: 'user2@example.com',
      productName: product2.name,
      styleName: style2.name,
      packageType: 'premium',
      requirements: '设计一个现代化的企业网站首页，需要响应式设计',
      designSize: '1920x1080',
      fileFormat: 'PSD',
      uploadedFileCount: 3,
      totalPrice: 899,
      status: 'completed',
    },
  });

  console.log('✓ 已创建订单');

  // 创建支付记录
  await prisma.payment.create({
    data: {
      orderId: order1.id,
      stripePaymentId: 'pi_test_001',
      stripeClientSecret: 'secret_test_001',
      amount: 299,
      currency: 'usd',
      status: 'succeeded',
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order2.id,
      stripePaymentId: 'pi_test_002',
      stripeClientSecret: 'secret_test_002',
      amount: 899,
      currency: 'usd',
      status: 'succeeded',
    },
  });

  console.log('✓ 已创建支付记录');

  // 创建设计师订单关系
  await prisma.designerOrder.create({
    data: {
      orderId: order1.id,
      designerId: designer.id,
      status: 'in_progress',
      acceptedAt: new Date(),
    },
  });

  await prisma.designerOrder.create({
    data: {
      orderId: order2.id,
      designerId: designer.id,
      status: 'completed',
      acceptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(),
    },
  });

  console.log('✓ 已创建设计师订单');

  // 创建收入记录
  await prisma.earning.create({
    data: {
      designerId: designer.id,
      amount: 450,
      orderCount: 1,
      status: 'paid',
      source: order2.id,
    },
  });

  console.log('✓ 已创建收入记录');

  console.log('\n✅ 测试数据导入完成！\n');
  console.log('测试账户信息：');
  console.log('  管理员: admin@designplatform.com / admin123');
  console.log('  用户1: user1@example.com / password123');
  console.log('  用户2: user2@example.com / password123');
  console.log('  设计师: designer@example.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
