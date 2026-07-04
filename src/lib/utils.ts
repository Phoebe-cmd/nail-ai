export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 30) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function buildPrompt(data: {
  name: string;
  characters: string;
  signatureSymbol: string;
  colorPalette: string[];
  styleTags: string[];
  techniques: string[];
}): string {
  const parts: string[] = [];
  if (data.name) parts.push(`主题：${data.name}`);
  if (data.characters) parts.push(`角色/元素：${data.characters}`);
  if (data.signatureSymbol) parts.push(`标志性符号：${data.signatureSymbol}`);
  if (data.colorPalette.length > 0) parts.push(`主色板：${data.colorPalette.join('、')}`);
  if (data.styleTags.length > 0) parts.push(`风格标签：${data.styleTags.join('、')}`);
  if (data.techniques.length > 0) parts.push(`工艺标签：${data.techniques.join('、')}`);
  return parts.join('；');
}

export const DIFFICULTY_STARS: string[] = ['★', '★★', '★★★', '★★★★', '★★★★★'];

export const DIFFICULTY_LABELS: string[] = ['入门', '简单', '中等', '困难', '大师级'];
