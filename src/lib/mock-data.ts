import type { NailDesign, CommunityPost, Comment, StyleDNA, NailArt, Material } from './types';
import { generateId } from './utils';

// ===== Moods =====
export const MOODS: string[] = [
  '暗黑摇滚', '甜美少女', '赛博朋克', '哥特优雅', 'Y2K复古',
  '动漫热血', '学院风', '梦幻童话', '街头潮流', '浪漫法式',
];

// ===== Materials =====
export const MATERIALS: string[] = [
  '甲油胶', '延长胶', '建构胶', '封层', '闪粉', '贴钻',
  '手绘颜料', '贴纸', '金属箔', '猫眼胶', '渐变粉', '浮雕胶',
];

// ===== Vibes =====
export const VIBES: string[] = [
  '叛逆不羁', '精致优雅', '俏皮可爱', '神秘暗黑', '未来科技',
  '复古怀旧', '元气满满', '高冷疏离', '温柔治愈', '酷飒自信',
];

// ===== Color Palettes =====
export const PALETTE_PRESETS: string[][] = [
  ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#533483', '#2b2d42'],
  ['#ffd1dc', '#ffb6c1', '#ff69b4', '#c71585', '#8b0045', '#4a0020'],
  ['#00f5d4', '#00bbf9', '#9b5de5', '#f15bb5', '#fee440', '#00f5d4'],
  ['#2d1b2e', '#44224a', '#6b2fa0', '#9b59b6', '#d4a5e5', '#e8d5f5'],
  ['#ff0000', '#ff4500', '#ff6347', '#dc143c', '#b22222', '#8b0000'],
  ['#0d0d0d', '#1a1a1a', '#333333', '#666666', '#999999', '#cccccc'],
];

// ===== Style Tags =====
export const STYLE_TAGS: string[] = [
  '暗黑摇滚', '动漫表情包', 'Q版角色', '专辑封面风', '日系少女',
  '赛博朋克', '哥特洛丽塔', 'Y2K千禧',
];

// ===== Craft/Technique Tags =====
export const TECHNIQUE_TAGS: string[] = [
  '手绘', '渐变', '闪粉', '贴钻', '法式', '猫眼', '浮雕', '镜面',
];

const NAIL_POSITIONS = ['大拇指', '食指', '中指', '无名指', '小拇指'];

// ===== Generate Functions =====
export function generateStyleDNA(): StyleDNA {
  const paletteSet = PALETTE_PRESETS[Math.floor(Math.random() * PALETTE_PRESETS.length)];
  return {
    mood: MOODS[Math.floor(Math.random() * MOODS.length)],
    material: MATERIALS[Math.floor(Math.random() * MATERIALS.length)],
    palette: paletteSet.slice(0, 4),
    vibe: VIBES[Math.floor(Math.random() * VIBES.length)],
  };
}

export function generateNailArts(count: number = 10): NailArt[] {
  return Array.from({ length: count }, (_, i) => ({
    position: NAIL_POSITIONS[i % 5] + (i >= 5 ? ' (右)' : ' (左)'),
    image: `/nail_${i + 1}.jpg`,
    label: `指甲设计 ${i + 1}`,
  }));
}

export function generateCompatibilityScore(): number {
  return Math.floor(Math.random() * 15) + 85;
}

export function generateDifficulty(): number {
  return Math.floor(Math.random() * 4) + 1;
}

export function generateMaterials(): Material[] {
  const all: Material[] = [
    { name: '黑色甲油胶', quantity: '1瓶' },
    { name: '红色甲油胶', quantity: '1瓶' },
    { name: '建构胶', quantity: '1瓶' },
    { name: '封层', quantity: '1瓶' },
    { name: '闪粉', quantity: '适量' },
    { name: '贴钻', quantity: '20颗' },
    { name: '手绘颜料套装', quantity: '1套' },
    { name: '金属箔', quantity: '1张' },
    { name: '猫眼胶', quantity: '1瓶' },
    { name: '浮雕胶', quantity: '1瓶' },
  ];
  const count = Math.floor(Math.random() * 4) + 4;
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ===== Mock Comments helper =====
function makeComment(id: string, authorName: string, content: string, createdAt: string): Comment {
  return {
    id,
    authorId: `author_${id}`,
    authorName,
    authorAvatar: `/avatar_${id}.jpg`,
    content,
    createdAt,
    likes: 0,
  };
}

// ===== Mock Posts =====
export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorId: 'user_1',
    authorName: '暗夜美甲师',
    authorAvatar: '/avatar_1.jpg',
    images: ['/community_1.jpg'],
    title: '暗黑摇滚骷髅美甲',
    description: '灵感来自J-Rock专辑封面，融合骷髅元素和暗黑金属色系，每根指甲都是一件微型艺术品。使用黑色打底，配以银色手绘骷髅和红色细节点缀。',
    tags: ['暗黑摇滚', '手绘', '贴钻'],
    likes: 128,
    liked: false,
    comments: [
      makeComment('c1', '小红', '太酷了！想问下用的什么甲油胶？', '2025-06-01T10:00:00Z'),
      makeComment('c2', '美甲爱好者', '骷髅画得太精细了！', '2025-06-02T08:30:00Z'),
    ],
    createdAt: '2025-05-28T12:00:00Z',
    category: '暗黑摇滚',
  },
  {
    id: 'post_2',
    authorId: 'user_2',
    authorName: '萌萌哒',
    authorAvatar: '/avatar_2.jpg',
    images: ['/community_2.jpg'],
    title: '动漫表情包系列',
    description: '把最爱的动漫表情包搬到指甲上！10根指甲10个不同表情，萌到爆炸。适合喜欢二次元文化的姐妹们。',
    tags: ['动漫表情包', '手绘', 'Q版角色'],
    likes: 256,
    liked: false,
    comments: [
      makeComment('c3', '二次元少女', '想要同款！', '2025-06-03T15:00:00Z'),
    ],
    createdAt: '2025-05-30T09:00:00Z',
    category: '动漫IP',
  },
  {
    id: 'post_3',
    authorId: 'user_3',
    authorName: '未来美甲师',
    authorAvatar: '/avatar_3.jpg',
    images: ['/community_3.jpg'],
    title: '赛博朋克霓虹光效',
    description: '赛博朋克风格的霓虹光效美甲，在UV灯下呈现出超酷的发光效果。主色调为深紫和荧光蓝，搭配银色金属线条。',
    tags: ['赛博朋克', '渐变', '猫眼'],
    likes: 89,
    liked: false,
    comments: [],
    createdAt: '2025-06-02T14:00:00Z',
    category: '赛博朋克',
  },
  {
    id: 'post_4',
    authorId: 'user_4',
    authorName: '洛丽塔女王',
    authorAvatar: '/avatar_4.jpg',
    images: ['/community_4.jpg'],
    title: '哥特洛丽塔蕾丝美甲',
    description: '精致的哥特洛丽塔风格，黑色蕾丝花纹搭配暗红色宝石，优雅而神秘。每根指甲都是精心设计的蕾丝图案。',
    tags: ['哥特洛丽塔', '贴钻', '手绘'],
    likes: 167,
    liked: false,
    comments: [
      makeComment('c4', '蕾丝控', '蕾丝是怎么做的？好精致！', '2025-06-04T11:00:00Z'),
      makeComment('c5', '美甲初学者', '难度系数是多少呀？', '2025-06-04T14:00:00Z'),
    ],
    createdAt: '2025-05-25T18:00:00Z',
    category: '哥特',
  },
  {
    id: 'post_5',
    authorId: 'user_5',
    authorName: '摇滚美甲师',
    authorAvatar: '/avatar_5.jpg',
    images: ['/community_5.jpg'],
    title: '专辑封面风复古美甲',
    description: '致敬经典摇滚专辑封面，用指甲重现那些经典的设计元素。从Pink Floyd到Nirvana，每个设计都是一段音乐记忆。',
    tags: ['专辑封面风', '手绘', '暗黑摇滚'],
    likes: 203,
    liked: false,
    comments: [
      makeComment('c6', '摇滚迷', 'Nirvana那张太经典了！', '2025-06-05T09:00:00Z'),
    ],
    createdAt: '2025-06-01T20:00:00Z',
    category: '专辑主题',
  },
  {
    id: 'post_6',
    authorId: 'user_6',
    authorName: '樱花妹',
    authorAvatar: '/avatar_6.jpg',
    images: ['/community_6.jpg'],
    title: '日系少女樱花渐变',
    description: '温柔的粉色樱花渐变美甲，从指甲根部的白色过渡到指尖的粉色，点缀手绘樱花花瓣。适合春天的约会造型。',
    tags: ['日系少女', '渐变', '手绘', '法式'],
    likes: 312,
    liked: false,
    comments: [
      makeComment('c7', '粉红少女心', '好温柔好喜欢！', '2025-06-03T10:00:00Z'),
      makeComment('c8', '美甲达人', '渐变过渡做得真好', '2025-06-03T12:00:00Z'),
    ],
    createdAt: '2025-05-27T16:00:00Z',
    category: '手绘',
  },
  {
    id: 'post_7',
    authorId: 'user_7',
    authorName: '千禧宝贝',
    authorAvatar: '/avatar_7.jpg',
    images: ['/community_7.jpg'],
    title: 'Y2K千禧闪粉炸弹',
    description: 'Y2K风格的全闪粉美甲，搭配金属星星和爱心装饰。在阳光下闪耀得像迪斯科球一样，回头率200%。',
    tags: ['Y2K千禧', '闪粉', '贴钻'],
    likes: 178,
    liked: false,
    comments: [
      makeComment('c9', '闪粉控', '也太闪了吧！', '2025-06-04T16:00:00Z'),
    ],
    createdAt: '2025-06-03T11:00:00Z',
    category: '渐变',
  },
  {
    id: 'post_8',
    authorId: 'user_8',
    authorName: '动漫小画家',
    authorAvatar: '/avatar_8.jpg',
    images: ['/community_8.jpg'],
    title: 'Q版动漫角色合集',
    description: '在指甲上绘制各种Q版动漫角色，从初音未来到鬼灭之刃，每个角色都萌化人心。手绘难度较高但效果惊艳。',
    tags: ['Q版角色', '动漫表情包', '手绘'],
    likes: 445,
    liked: false,
    comments: [
      makeComment('c10', '动漫迷', '初音未来那根最好看！', '2025-06-05T14:00:00Z'),
      makeComment('c11', '画手', '请问用的什么笔画的？', '2025-06-05T16:00:00Z'),
      makeComment('c12', '路人甲', '手也太巧了吧', '2025-06-06T08:00:00Z'),
    ],
    createdAt: '2025-05-29T13:00:00Z',
    category: '动漫IP',
  },
  {
    id: 'post_9',
    authorId: 'user_9',
    authorName: '暗黑水晶',
    authorAvatar: '/avatar_9.jpg',
    images: ['/community_9.jpg'],
    title: '哥特暗黑系水晶美甲',
    description: '深色基底搭配不规则水晶贴片，在光线折射下呈现出暗黑而华丽的质感。适合喜欢神秘风格的女生。',
    tags: ['哥特洛丽塔', '贴钻', '闪粉', '浮雕'],
    likes: 134,
    liked: false,
    comments: [
      makeComment('c13', '水晶爱好者', '水晶是哪里买的？', '2025-06-06T10:00:00Z'),
    ],
    createdAt: '2025-06-04T17:00:00Z',
    category: '哥特',
  },
];

// ===== Mock Designs =====
export const MOCK_DESIGNS: NailDesign[] = [
  {
    id: 'design_demo_1',
    name: '暗黑摇滚骷髅',
    theme: '暗黑摇滚骷髅',
    characters: '骷髅头',
    signatureSymbol: '交叉骨',
    colorPalette: ['#1a1a2e', '#e94560', '#533483'],
    styleTags: ['暗黑摇滚', '手绘'],
    techniques: ['手绘', '贴钻'],
    styleDNA: {
      mood: '暗黑摇滚',
      material: '手绘颜料',
      palette: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
      vibe: '叛逆不羁',
    },
    nails: Array.from({ length: 10 }, (_, i) => ({
      position: NAIL_POSITIONS[i % 5] + (i >= 5 ? ' (右)' : ' (左)'),
      image: `/nail_${i + 1}.jpg`,
      label: `指甲设计 ${i + 1}`,
    })),
    difficulty: 4,
    materials: [
      { name: '黑色甲油胶', quantity: '1瓶' },
      { name: '建构胶', quantity: '1瓶' },
      { name: '手绘颜料套装', quantity: '1套' },
      { name: '贴钻', quantity: '15颗' },
      { name: '封层', quantity: '1瓶' },
    ],
    prompt: '主题：暗黑摇滚骷髅；角色/元素：骷髅头；标志性符号：交叉骨；风格标签：暗黑摇滚、手绘；工艺标签：手绘、贴钻',
    compatibilityScore: 92,
    createdAt: '2025-06-01T10:00:00Z',
    resonanceTheme: 'default',
  },
  {
    id: 'design_demo_2',
    name: '赛博朋克霓虹',
    theme: '赛博朋克霓虹',
    characters: '机械手臂',
    signatureSymbol: '闪电',
    colorPalette: ['#00f5d4', '#00bbf9', '#9b5de5'],
    styleTags: ['赛博朋克', '猫眼'],
    techniques: ['渐变', '猫眼', '镜面'],
    styleDNA: {
      mood: '赛博朋克',
      material: '猫眼胶',
      palette: ['#00f5d4', '#00bbf9', '#9b5de5', '#f15bb5'],
      vibe: '未来科技',
    },
    nails: Array.from({ length: 10 }, (_, i) => ({
      position: NAIL_POSITIONS[i % 5] + (i >= 5 ? ' (右)' : ' (左)'),
      image: `/nail_${i + 11}.jpg`,
      label: `指甲设计 ${i + 1}`,
    })),
    difficulty: 3,
    materials: [
      { name: '透明甲油胶', quantity: '1瓶' },
      { name: '猫眼胶', quantity: '1瓶' },
      { name: '渐变粉', quantity: '适量' },
      { name: '金属箔', quantity: '1张' },
    ],
    prompt: '主题：赛博朋克霓虹；角色/元素：机械手臂；标志性符号：闪电；风格标签：赛博朋克、猫眼；工艺标签：渐变、猫眼、镜面',
    compatibilityScore: 88,
    createdAt: '2025-06-02T14:00:00Z',
    resonanceTheme: 'default',
  },
  {
    id: 'design_demo_3',
    name: '日系樱花少女',
    theme: '日系樱花少女',
    characters: '樱花精灵',
    signatureSymbol: '花瓣',
    colorPalette: ['#ffd1dc', '#ffb6c1', '#ff69b4'],
    styleTags: ['日系少女', '法式'],
    techniques: ['渐变', '手绘', '法式'],
    styleDNA: {
      mood: '甜美少女',
      material: '甲油胶',
      palette: ['#ffd1dc', '#ffb6c1', '#ff69b4', '#c71585'],
      vibe: '温柔治愈',
    },
    nails: Array.from({ length: 10 }, (_, i) => ({
      position: NAIL_POSITIONS[i % 5] + (i >= 5 ? ' (右)' : ' (左)'),
      image: `/nail_${i + 21}.jpg`,
      label: `指甲设计 ${i + 1}`,
    })),
    difficulty: 2,
    materials: [
      { name: '粉色甲油胶', quantity: '1瓶' },
      { name: '白色甲油胶', quantity: '1瓶' },
      { name: '手绘颜料套装', quantity: '1套' },
      { name: '封层', quantity: '1瓶' },
    ],
    prompt: '主题：日系樱花少女；角色/元素：樱花精灵；标志性符号：花瓣；风格标签：日系少女、法式；工艺标签：渐变、手绘、法式',
    compatibilityScore: 95,
    createdAt: '2025-06-03T09:00:00Z',
    resonanceTheme: 'default',
  },
];
