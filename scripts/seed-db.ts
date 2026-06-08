import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const db = new Database('./prisma/dev.db');

async function seed() {
  console.log('🌱 开始种植数据库...\n');

  // 清空表
  db.exec('DELETE FROM Product');
  db.exec('DELETE FROM Category');
  db.exec('DELETE FROM User');

  // 创建用户
  const userId = randomUUID();
  const hashedPassword = await bcrypt.hash('password123', 10);

  db.prepare(`
    INSERT INTO User (id, email, name, password, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, 'demo@example.com', 'Demo User', hashedPassword, new Date().toISOString(), new Date().toISOString());
  console.log('✅ 创建用户');

  // 创建分类
  const categories = [
    { name: 'Web Design', slug: 'web-design', icon: '🌐', description: 'Beautiful and modern web designs' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', icon: '🎨', description: 'User interface and experience designs' },
    { name: 'Branding', slug: 'branding', icon: '🏷️', description: 'Brand identity and logo design' },
    { name: 'Illustration', slug: 'illustration', icon: '🖼️', description: 'Custom illustrations and artworks' },
  ];

  const categoryIds = categories.map((cat) => {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO Category (id, name, slug, icon, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, cat.name, cat.slug, cat.icon, cat.description, new Date().toISOString(), new Date().toISOString());
    return { ...cat, id };
  });
  console.log(`✅ 创建 ${categoryIds.length} 个分类\n`);

  // 创建产品
  const products = [
    // Web Design
    {
      name: 'Modern Landing Page Design',
      slug: 'modern-landing-page-design',
      description: 'A stunning modern landing page design with responsive layout and smooth animations.',
      price: 299,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[0].id,
      featured: true,
      rating: 4.8,
      reviews: 24,
    },
    {
      name: 'E-Commerce Website',
      slug: 'ecommerce-website',
      description: 'Complete e-commerce website design with shopping cart and checkout flow.',
      price: 599,
      image: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=500&h=500&fit=crop',
      categoryId: categoryIds[0].id,
      featured: true,
      rating: 4.9,
      reviews: 42,
    },
    {
      name: 'SaaS Dashboard Design',
      slug: 'saas-dashboard-design',
      description: 'Professional SaaS dashboard design with analytics and data visualization.',
      price: 449,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop',
      categoryId: categoryIds[0].id,
      featured: false,
      rating: 4.7,
      reviews: 18,
    },
    // UI/UX Design
    {
      name: 'Mobile App UI Kit',
      slug: 'mobile-app-ui-kit',
      description: 'Comprehensive mobile app UI kit with 200+ components and screens.',
      price: 349,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[1].id,
      featured: true,
      rating: 4.9,
      reviews: 38,
    },
    {
      name: 'Design System Components',
      slug: 'design-system-components',
      description: 'Reusable design system with detailed component documentation.',
      price: 199,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[1].id,
      featured: false,
      rating: 4.6,
      reviews: 15,
    },
    {
      name: 'User Experience Flow Design',
      slug: 'user-experience-flow-design',
      description: 'Complete UX flow design for complex applications.',
      price: 399,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[1].id,
      featured: true,
      rating: 4.8,
      reviews: 22,
    },
    // Branding
    {
      name: 'Complete Brand Identity Package',
      slug: 'complete-brand-identity-package',
      description: 'Logo, color palette, typography, and brand guidelines.',
      price: 799,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[2].id,
      featured: true,
      rating: 4.9,
      reviews: 34,
    },
    {
      name: 'Logo Design Service',
      slug: 'logo-design-service',
      description: 'Custom logo design with multiple concepts and revisions.',
      price: 249,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[2].id,
      featured: false,
      rating: 4.7,
      reviews: 28,
    },
    // Illustration
    {
      name: 'Character Illustration Set',
      slug: 'character-illustration-set',
      description: '50 unique character illustrations for your project.',
      price: 499,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[3].id,
      featured: true,
      rating: 4.8,
      reviews: 19,
    },
    {
      name: 'Icon Illustration Library',
      slug: 'icon-illustration-library',
      description: '100+ custom icon illustrations in various styles.',
      price: 349,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      categoryId: categoryIds[3].id,
      featured: false,
      rating: 4.6,
      reviews: 12,
    },
  ];

  products.forEach((product) => {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO Product (id, name, slug, description, price, image, categoryId, featured, rating, reviews, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      product.name,
      product.slug,
      product.description,
      product.price,
      product.image,
      product.categoryId,
      product.featured ? 1 : 0,
      product.rating,
      product.reviews,
      new Date().toISOString(),
      new Date().toISOString()
    );
  });
  console.log(`✅ 创建 ${products.length} 个产品\n`);

  console.log('🎉 数据库种子数据创建完成！');
  db.close();
}

seed().catch((e) => {
  console.error('❌ 错误:', e);
  process.exit(1);
});
