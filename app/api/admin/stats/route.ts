import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // 获取统计数据
    const [totalUsers, totalDesigners, totalOrders, totalEarnings, pendingOrders] = await Promise.all([
      prisma.user.count(),
      prisma.designer.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalPrice: true } }),
      prisma.order.count({ where: { status: 'pending' } }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalDesigners,
        totalOrders,
        totalEarnings: totalEarnings._sum.totalPrice || 0,
        pendingOrders,
        completedOrders: totalOrders - pendingOrders,
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
