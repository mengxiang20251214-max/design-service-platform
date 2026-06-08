import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 基础验证
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing email or password' },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    // 设置 token 到 cookie
    const response = NextResponse.json(
      { success: true, message: result.message, user: result.user },
      { status: 200 }
    );

    response.cookies.set('auth_token', result.token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
