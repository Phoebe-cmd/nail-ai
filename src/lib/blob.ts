import { put } from '@vercel/blob';

// 上传图片到 Vercel Blob，返回可公开访问的 url。
// 在服务端 route handler 中调用：传入 File/Blob + 文件名。
export async function uploadImage(file: Blob, filename: string): Promise<string> {
  const { url } = await put(filename, file, {
    access: 'public',
    addRandomSuffix: true, // 防重名
  });
  return url;
}
