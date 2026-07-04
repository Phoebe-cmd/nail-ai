import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export const runtime = 'nodejs';

// POST 收藏，DELETE 取消收藏
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  await sql`
    INSERT INTO favorites (user_id, post_id) VALUES (${user.id}, ${id})
    ON CONFLICT (user_id, post_id) DO NOTHING
  `;
  return NextResponse.json({ favorited: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  await sql`DELETE FROM favorites WHERE user_id = ${user.id} AND post_id = ${id}`;
  return NextResponse.json({ favorited: false });
}
