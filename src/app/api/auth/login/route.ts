import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyPassword, setSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, email, name, avatar, password_hash
      FROM users WHERE email = ${email}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    const user = rows[0];
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    await setSessionCookie({ userId: user.id, email: user.email });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar || '' },
    });
  } catch (err) {
    console.error('[auth/login]', err);
    return NextResponse.json({ error: '登录失败，请重试' }, { status: 500 });
  }
}
