import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
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
  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // 验证密码长度
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user',
        status: 'active',
      },
    });

    return {
      success: true,
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
    };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: 'Registration failed' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.status === 'banned') {
      return { success: false, message: 'Account has been banned' };
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    const token = generateToken(user.id, user.email, user.role);
    return {
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
      token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
