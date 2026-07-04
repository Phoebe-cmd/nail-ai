import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export const runtime = 'nodejs';

// POST 点赞，DELETE 取消点赞
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  try {
    await sql`
      INSERT INTO likes (user_id, post_id) VALUES (${user.id}, ${id})
      ON CONFLICT (user_id, post_id) DO NOTHING
    `;
    const cnt = await sql`SELECT COUNT(*)::int AS cnt FROM likes WHERE post_id = ${id}`;
    return NextResponse.json({ liked: true, likes: cnt[0].cnt });
  } catch (err) {
    console.error('[like]', err);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  await sql`DELETE FROM likes WHERE user_id = ${user.id} AND post_id = ${id}`;
  const cnt = await sql`SELECT COUNT(*)::int AS cnt FROM likes WHERE post_id = ${id}`;
  return NextResponse.json({ liked: false, likes: cnt[0].cnt });
}
