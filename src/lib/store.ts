import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NailDesign, CommunityPost, User, ResonanceTheme, Comment } from './types';

// 手部照片记录（按拍摄时间存储，左右手分别管理）
export interface HandPhotoRecord {
  id: string;
  side: 'left' | 'right';
  image: string;            // base64
  takenAt: string;          // ISO 时间，拍摄/上传时间
  label?: string;           // 可选备注
}

// Resonance UI 主题预设
export const RESONANCE_THEMES: ResonanceTheme[] = [
  { id: 'default', name: '暗夜珍宝阁', primary: '#8B1A4A', gold: '#C9A84C', aurora: '冷调极光', deco: '哥特鸢尾花纹样', icon: '🌙' },
  { id: 'nana', name: '《NANA》', primary: '#722F37', gold: '#A0A0A0', aurora: '冷调酒红', deco: '锁链与银饰纹样', icon: '∞' },
  { id: 'sakura', name: '《魔卡少女樱》', primary: '#D484A0', gold: '#F5E6D3', aurora: '暖粉樱花', deco: '羽毛与星星纹样', icon: '🌸' },
  { id: 'bp', name: 'BLACKPINK', primary: '#FF69B4', gold: '#111111', aurora: '霓虹粉黑', deco: '镜面与网格纹样', icon: '◆' },
  { id: 'jujutsu', name: '《咒术回战》', primary: '#2D4A3E', gold: '#4A3B69', aurora: '冷紫墨绿', deco: '烟雾与结界纹样', icon: '☽' },
];

interface AppState {
  // 当前主题
  currentTheme: ResonanceTheme;
  setTheme: (themeId: string) => void;

  // 用户
  currentUser: User;
  updateUser: (updates: Partial<User>) => void;

  // 设计方案
  designs: NailDesign[];
  addDesign: (design: NailDesign) => void;
  removeDesign: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // 社区帖子
  posts: CommunityPost[];
  initPosts: (posts: CommunityPost[]) => void;
  addPost: (post: CommunityPost) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;

  // 当前正在设计的方案（工作台状态）
  currentDesign: Partial<NailDesign> | null;
  updateCurrentDesign: (updates: Partial<NailDesign>) => void;
  clearCurrentDesign: () => void;

  // 手部照片档案（护甲知识里维护，设计工作台引用）
  handPhotos: HandPhotoRecord[];
  addHandPhoto: (photo: HandPhotoRecord) => void;
  removeHandPhoto: (id: string) => void;

  // 当前设计选用的左右手照片（工作台整手一份，所有系列共用）
  selectedLeftHandId: string | null;
  selectedRightHandId: string | null;
  setSelectedLeftHand: (id: string | null) => void;
  setSelectedRightHand: (id: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentTheme: RESONANCE_THEMES[0],
      setTheme: (themeId: string) => {
        const theme = RESONANCE_THEMES.find(t => t.id === themeId) || RESONANCE_THEMES[0];
        set({ currentTheme: theme });
      },

      currentUser: {
        id: 'user-1',
        name: '收藏家·小夜',
        avatar: '✦',
        designs: [],
        favorites: [],
        communityPosts: [],
        following: [],
        followers: 42,
      },
      updateUser: (updates) => set((s) => ({ currentUser: { ...s.currentUser, ...updates } })),

      designs: [],
      addDesign: (design) => set((s) => ({ designs: [design, ...s.designs] })),
      removeDesign: (id) => set((s) => ({ designs: s.designs.filter(d => d.id !== id) })),
      toggleFavorite: (id) => set((s) => ({
        currentUser: {
          ...s.currentUser,
          favorites: s.currentUser.favorites.includes(id)
            ? s.currentUser.favorites.filter(f => f !== id)
            : [...s.currentUser.favorites, id],
        }
      })),

      posts: [],
      initPosts: (posts) => set((s) => (s.posts.length === 0 ? { posts } : {})),
      addPost: (post) => set((s) => ({ posts: [post, ...s.posts] })),
      toggleLike: (postId) => set((s) => ({
        posts: s.posts.map(p => p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
        )
      })),
      addComment: (postId, comment) => set((s) => ({
        posts: s.posts.map(p => p.id === postId
          ? { ...p, comments: [...p.comments, comment] }
          : p
        )
      })),

      currentDesign: null,
      updateCurrentDesign: (updates) => set((s) => ({
        currentDesign: s.currentDesign ? { ...s.currentDesign, ...updates } : updates
      })),
      clearCurrentDesign: () => set({ currentDesign: null }),

      handPhotos: [],
      addHandPhoto: (photo) => set((s) => ({ handPhotos: [photo, ...s.handPhotos] })),
      removeHandPhoto: (id) => set((s) => ({
        handPhotos: s.handPhotos.filter((p) => p.id !== id),
        selectedLeftHandId: s.selectedLeftHandId === id ? null : s.selectedLeftHandId,
        selectedRightHandId: s.selectedRightHandId === id ? null : s.selectedRightHandId,
      })),

      selectedLeftHandId: null,
      selectedRightHandId: null,
      setSelectedLeftHand: (id) => set({ selectedLeftHandId: id }),
      setSelectedRightHand: (id) => set({ selectedRightHandId: id }),
    }),
    {
      name: 'nail-ai-storage',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        currentUser: state.currentUser,
        designs: state.designs,
        posts: state.posts,
        handPhotos: state.handPhotos,
        selectedLeftHandId: state.selectedLeftHandId,
        selectedRightHandId: state.selectedRightHandId,
      }),
    }
  )
);
