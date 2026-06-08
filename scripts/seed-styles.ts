import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('./prisma/dev.db');

async function seed() {
  console.log('🌱 开始添加风格数据...\n');

  // 获取现有分类
  const categories = db.prepare('SELECT id FROM Category LIMIT 4').all() as any[];

  if (categories.length === 0) {
    console.log('❌ 未找到分类，请先运行产品种子脚本');
    db.close();
    return;
  }

  console.log(`✅ 找到 ${categories.length} 个分类\n`);

  // 风格数据
  const styles = [
    // Web Design 风格
    {
      name: 'Minimalist Modern',
      slug: 'minimalist-modern',
      description: 'Clean, simple and elegant design style with minimal elements',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 149,
      categoryId: categories[0].id,
      featured: true,
      rating: 4.8,
      reviews: 32,
    },
    {
      name: 'Dark Elegant',
      slug: 'dark-elegant',
      description: 'Sophisticated dark theme with gold accents',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 159,
      categoryId: categories[0].id,
      featured: true,
      rating: 4.9,
      reviews: 28,
    },
    {
      name: 'Vibrant Colorful',
      slug: 'vibrant-colorful',
      description: 'Bold colors and dynamic layouts for modern brands',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 169,
      categoryId: categories[0].id,
      featured: false,
      rating: 4.7,
      reviews: 25,
    },
    // UI/UX Design 风格
    {
      name: 'Glassmorphism',
      slug: 'glassmorphism',
      description: 'Modern glassmorphism design with frosted glass effects',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 179,
      categoryId: categories[1].id,
      featured: true,
      rating: 4.9,
      reviews: 35,
    },
    {
      name: 'Neumorphic Soft',
      slug: 'neumorphic-soft',
      description: 'Soft, extruded elements with subtle shadows',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 149,
      categoryId: categories[1].id,
      featured: false,
      rating: 4.6,
      reviews: 22,
    },
    {
      name: 'Brutalism Bold',
      slug: 'brutalism-bold',
      description: 'Raw, bold typography and geometric shapes',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 189,
      categoryId: categories[1].id,
      featured: true,
      rating: 4.8,
      reviews: 20,
    },
    // Branding 风格
    {
      name: 'Corporate Professional',
      slug: 'corporate-professional',
      description: 'Business-focused design with trust and stability',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 199,
      categoryId: categories[2].id,
      featured: true,
      rating: 4.8,
      reviews: 30,
    },
    {
      name: 'Creative Playful',
      slug: 'creative-playful',
      description: 'Fun, creative and expressive brand identity',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 189,
      categoryId: categories[2].id,
      featured: false,
      rating: 4.7,
      reviews: 26,
    },
    // Illustration 风格
    {
      name: 'Flat Vector Art',
      slug: 'flat-vector-art',
      description: 'Clean flat design illustrations with bold colors',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 179,
      categoryId: categories[3].id,
      featured: true,
      rating: 4.9,
      reviews: 27,
    },
    {
      name: '3D Isometric',
      slug: '3d-isometric',
      description: 'Modern 3D isometric illustrations',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      price: 199,
      categoryId: categories[3].id,
      featured: true,
      rating: 4.8,
      reviews: 24,
    },
  ];

  // 插入风格数据
  styles.forEach((style) => {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO Style (id, name, slug, description, coverImage, price, categoryId, featured, rating, reviews, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      style.name,
      style.slug,
      style.description,
      style.coverImage,
      style.price,
      style.categoryId,
      style.featured ? 1 : 0,
      style.rating,
      style.reviews,
      new Date().toISOString(),
      new Date().toISOString()
    );
  });

  console.log(`✅ 添加 ${styles.length} 个风格\n`);
  console.log('🎉 风格数据添加完成！');
  db.close();
}

seed().catch((e) => {
  console.error('❌ 错误:', e);
  process.exit(1);
});
