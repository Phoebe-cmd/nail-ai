import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { mapRowToPost } from '@/lib/posts';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  const rows = await sql`
    SELECT p.*, u.name AS author_name, u.avatar AS author_avatar
    FROM posts p JOIN users u ON u.id = p.author_id
    WHERE p.id = ${id}
  `;
  if (rows.length === 0) {
    return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  }
  const post = await mapRowToPost(rows[0], viewer?.id ?? null);
  return NextResponse.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const rows = await sql`SELECT author_id FROM posts WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  if (rows[0].author_id !== user.id) {
    return NextResponse.json({ error: '无权删除他人帖子' }, { status: 403 });
  }
  await sql`DELETE FROM posts WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
