import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getFavoritedPosts } from '@/lib/favorites';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ posts: [] });
  const posts = await getFavoritedPosts(user.id);
  return NextResponse.json({ posts });
}
