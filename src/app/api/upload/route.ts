import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { uploadImage } from '@/lib/blob';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 });
    }

    // 简单校验类型与大小（10MB 上限）
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只能上传图片' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '图片不能超过 10MB' }, { status: 400 });
    }

    const filename = `community/${user.id}-${file.name}`;
    const url = await uploadImage(file, filename);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[upload]', err);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
