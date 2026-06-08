import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// 模拟用户数据库（实际应用应使用真实数据库）
const users = new Map<string, { id: string; email: string; password: string; name: string; createdAt: Date }>();

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function registerUser(email: string, password: string, name: string): Promise<{ success: boolean; message: string; user?: User }> {
  // 检查用户是否已存在
  for (const user of users.values()) {
    if (user.email === email) {
      return { success: false, message: 'Email already registered' };
    }
  }

  // 验证密码长度
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }

  const userId = Math.random().toString(36).substr(2, 9);
  const hashedPassword = await hashPassword(password);
  const createdAt = new Date();

  users.set(userId, {
    id: userId,
    email,
    password: hashedPassword,
    name,
    createdAt,
  });

  const user: User = { id: userId, email, name, createdAt };
  return { success: true, message: 'User registered successfully', user };
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
  // 在用户数据库中查找
  for (const user of users.values()) {
    if (user.email === email) {
      const isPasswordValid = await verifyPassword(password, user.password);
      if (isPasswordValid) {
        const token = generateToken(user.id, user.email);
        return {
          success: true,
          message: 'Login successful',
          user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
          token,
        };
      }
      return { success: false, message: 'Invalid password' };
    }
  }

  return { success: false, message: 'User not found' };
}

export function getUserById(userId: string): User | null {
  const user = users.get(userId);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}
