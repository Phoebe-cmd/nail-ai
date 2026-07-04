// 设计方案
export interface NailDesign {
  id: string;
  name: string;
  theme: string;
  refImage?: string;
  characters: string;
  signatureSymbol: string;
  colorPalette: string[];
  styleTags: string[];
  techniques: string[];
  styleDNA: StyleDNA | null;
  nails: NailArt[];
  handImage?: string;
  compatibilityScore: number;
  difficulty: number;
  materials: Material[];
  prompt: string;
  createdAt: string;
  resonanceTheme: string;
}

export interface StyleDNA {
  mood: string;
  material: string;
  palette: string[];
  vibe: string;
}

export interface NailArt {
  position: string;
  image: string;
  label: string;
}

export interface Material {
  name: string;
  quantity: string;
}

// 社区帖子
export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  images: string[];
  title: string;
  description: string;
  tags: string[];
  likes: number;
  liked: boolean;
  comments: Comment[];
  createdAt: string;
  designId?: string;
  category?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

// 用户
export interface User {
  id: string;
  name: string;
  avatar: string;
  designs: string[];
  favorites: string[];
  communityPosts: string[];
  following: string[];
  followers: number;
}

// Resonance UI主题
export interface ResonanceTheme {
  id: string;
  name: string;
  primary: string;
  gold: string;
  aurora: string;
  deco: string;
  icon: string;
}
