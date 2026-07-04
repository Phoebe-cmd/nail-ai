import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword, setSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: '邮箱、用户名、密码都不能为空' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 });
    }

    // 邮箱是否已注册
    const exists = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (exists.length > 0) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 });
    }

    const hash = await hashPassword(password);
    const rows = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${hash})
      RETURNING id, email, name, avatar
    `;
    const user = rows[0];

    await setSessionCookie({ userId: user.id, email: user.email });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar || '' },
    });
  } catch (err) {
    console.error('[auth/register]', err);
    return NextResponse.json({ error: '注册失败，请重试' }, { status: 500 });
  }
}
