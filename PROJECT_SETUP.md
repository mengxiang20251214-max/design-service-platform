# Design Service Platform - 项目设置指南

## 项目概览
这是一个使用 Next.js 15、TypeScript、TailwindCSS 和 Framer Motion 构建的现代设计服务平台。

## 技术栈

### 核心框架
- **Next.js 15** - React 框架，支持 App Router
- **React 19** - UI 库
- **TypeScript** - JavaScript 超集，提供类型安全

### 样式与UI
- **TailwindCSS** - 工具优先的 CSS 框架
- **Shadcn/UI** - 构建在 Radix UI 之上的组件库
- **Framer Motion** - React 动画库
- **Lucide React** - 图标库

### 主题与深色模式
- **next-themes** - Next.js 主题管理解决方案

### 工具类库
- **clsx** - 条件 CSS 类名组合
- **tailwind-merge** - Tailwind CSS 类名合并工具
- **class-variance-authority** - 组件变体管理

## 项目结构

```
design-service-platform/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局，包含主题提供者
│   ├── page.tsx             # 首页
│   ├── globals.css          # 全局样式
│   ├── favicon.ico          # 网站图标
│   └── providers.tsx        # Next-themes 提供者
├── components/              # React 组件
│   ├── ui/                  # Shadcn UI 组件
│   │   ├── button.tsx       # 按钮组件
│   │   ├── card.tsx         # 卡片组件
│   │   └── badge.tsx        # 徽章组件
│   ├── theme-toggle.tsx     # 主题切换器
│   └── ...                  # 其他业务组件
├── lib/                     # 工具函数
│   └── utils.ts            # 通用工具函数（如 cn 函数）
├── public/                  # 静态文件
├── tailwind.config.ts       # TailwindCSS 配置
├── tsconfig.json           # TypeScript 配置（严格模式）
├── next.config.ts          # Next.js 配置
├── eslint.config.mjs       # ESLint 配置
├── postcss.config.mjs      # PostCSS 配置
└── package.json            # 项目依赖
```

## 功能特性

### 1. 响应式设计
- 移动优先的设计理念
- 使用 TailwindCSS 的响应式工具类

### 2. 深色模式支持
- 基于 `next-themes` 的完整深色模式支持
- 支持系统偏好设置自动切换
- 主题切换按钮集成在导航栏

### 3. 类型安全
- 启用 TypeScript 严格模式
- 全部代码都使用 TypeScript 编写
- 强类型检查确保代码质量

### 4. 平滑动画
- 使用 Framer Motion 实现页面过渡动画
- 组件交互动画
- 支持 Spring 动画效果

### 5. 现代 UI 组件
- 可复用的 Shadcn/UI 组件
- 内置 Button、Card、Badge 等组件
- 易于扩展的组件系统

## 快速开始

### 1. 安装依赖
所有依赖已经安装完毕。如需更新：
```bash
npm install
```

### 2. 开发模式运行
```bash
npm run dev
```
应用将在 `http://localhost:3000` 启动

### 3. 构建生产版本
```bash
npm run build
```

### 4. 生产模式运行
```bash
npm run start
```

### 5. 代码检查
```bash
npm run lint
```

## 配置说明

### TypeScript 严格模式
在 `tsconfig.json` 中已启用严格模式：
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### TailwindCSS 配置
- 深色模式：`class` 方式
- 自定义颜色系统基于 CSS 变量
- 支持响应式前缀和伪类

### 主题系统
在 `globals.css` 中定义了完整的 CSS 变量系统：
- Light 模式颜色
- Dark 模式颜色
- 过渡效果配置

## 添加新组件

### 创建 UI 组件
1. 在 `components/ui/` 目录下创建新文件
2. 使用 TypeScript 编写组件
3. 使用 `cva` 管理组件变体
4. 导出组件供使用

### 创建业务组件
1. 在 `components/` 目录下创建新文件
2. 根据需要导入 UI 组件
3. 实现业务逻辑
4. 必要时使用 `'use client'` 指令标记客户端组件

## 环境变量
在项目根目录创建 `.env.local` 文件：
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

参考 `.env.example` 了解可用的环境变量。

## 最佳实践

### 1. 组件设计
- 优先使用函数式组件
- 使用 TypeScript 接口定义 Props
- 提取可复用的逻辑为 Hook

### 2. 样式
- 优先使用 TailwindCSS 工具类
- 对复杂样式使用 `@layer` 和 `@apply`
- 使用 CSS 变量进行主题定制

### 3. 性能
- 使用 Server Components（默认）
- 仅在必要时使用 `'use client'`
- 使用 Next.js Image 优化图片
- 注意防止 hydration mismatch

### 4. 代码组织
- 按功能模块组织文件
- 保持组件的单一职责
- 使用清晰的命名约定

## 常见问题

### 深色模式不工作
确保在 HTML 元素上有 `suppressHydrationWarning` 属性，并且 `<Providers>` 组件包装了页面内容。

### 样式加载不正确
检查 `tailwind.config.ts` 中的 `content` 配置是否包含所有相关文件。

### TypeScript 错误
运行 `npm run build` 查看完整的类型检查错误。

## 部署

### 部署到 Vercel
```bash
npm install -g vercel
vercel
```

### 部署到其他平台
Next.js 支持部署到多个平台：
- Docker
- Node.js 服务器
- 静态导出（仅限静态内容）

## 文档与资源
- [Next.js 文档](https://nextjs.org/docs)
- [TailwindCSS 文档](https://tailwindcss.com)
- [Shadcn/UI 文档](https://ui.shadcn.com)
- [Framer Motion 文档](https://www.framer.com/motion)
- [TypeScript 文档](https://www.typescriptlang.org)

## 许可证
MIT License

## 联系方式
如有问题，请提交 Issue 或 Pull Request。
