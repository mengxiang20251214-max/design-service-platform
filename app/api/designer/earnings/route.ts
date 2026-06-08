import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

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
      include: { designer: true },
    });

    if (!user || user.role !== 'designer' || !user.designer) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    const [earnings, total, stats] = await Promise.all([
      prisma.earning.findMany({
        where: { designerId: user.designer.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.earning.count({ where: { designerId: user.designer.id } }),
      prisma.earning.aggregate({
        where: { designerId: user.designer.id },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalEarnings = stats._sum.amount || 0;

    return NextResponse.json({
      earnings,
      totalEarnings,
      totalCount: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Earnings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
