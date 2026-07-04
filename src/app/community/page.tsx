'use client';

import React, { useEffect, useState, useRef } from 'react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import Tag from '@/components/Tag';
import SectionTitle from '@/components/SectionTitle';
import { useStore } from '@/lib/store';
import { MOCK_POSTS } from '@/lib/mock-data';
import { generateId, formatDate } from '@/lib/utils';
import type { CommunityPost, Comment } from '@/lib/types';

const CATEGORIES = ['全部', '动漫IP', '表情包', '专辑主题', '渐变', '手绘', '哥特'];

export default function CommunityPage() {
  const { posts, toggleLike, addPost, addComment, currentUser } = useStore();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize mock posts once - force init on first render
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // Always check current store state after hydration
      const timer = setTimeout(() => {
        // Re-read from zustand to check if posts were loaded
        useStore.getState().posts.forEach((p, i) => {
          // If somehow empty after timeout, add mock data
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Also directly render MOCK_POSTS if store is empty (hydration-safe approach)
  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;

  const filteredPosts = activeCategory === '全部' ? displayPosts : displayPosts.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory));

  const handleCreatePost = () => {
    if (!newTitle.trim()) return;
    const post: CommunityPost = {
      id: generateId(), authorId: currentUser.id, authorName: currentUser.name, authorAvatar: '',
      images: newImage ? [newImage] : ['/community_default.jpg'],
      title: newTitle, description: newDesc, tags: newTags, likes: 0, liked: false, comments: [],
      createdAt: new Date().toISOString(), category: newTags[0] || '全部',
    };
    addPost(post);
    setShowCreateModal(false);
    setNewTitle(''); setNewDesc(''); setNewTags([]); setNewImage(null);
  };

  const handleComment = () => {
    if (!selectedPost || !commentText.trim()) return;
    const c: Comment = { id: generateId(), authorId: currentUser.id, authorName: currentUser.name, authorAvatar: '', content: commentText, createdAt: new Date().toISOString(), likes: 0 };
    addComment(selectedPost.id, c);
    setCommentText('');
    const updated = posts.find((p) => p.id === selectedPost.id);
    if (updated) setSelectedPost(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setNewImage(reader.result as string); reader.readAsDataURL(file); }
  };

  return (
    <div className="max-w-6xl mx-auto px-10 py-8">
        <SectionTitle>灵感社区</SectionTitle>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (<Tag key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>{cat}</Tag>))}
        </div>

        <div className="columns-3 gap-4">
          {filteredPosts.map((post) => (
            <GlassCard key={post.id} className="mb-4 break-inside-avoid cursor-pointer" onClick={() => setSelectedPost(post)}>
              <div className="rounded-lg overflow-hidden mb-3" style={{ background: 'var(--bg-surface)' }}>
                <img src={post.images[0]} alt={post.title} className="w-full object-cover" style={{ aspectRatio: '3/4' }} />
              </div>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--ink)' }}>{post.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}><img src={post.authorAvatar} alt="" className="w-full h-full object-cover" /></div>
                <span className="text-xs" style={{ color: 'var(--ink-secondary)' }}>{post.authorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {post.tags.slice(0, 2).map((tag: string) => (<span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--ink-muted)' }}>{tag}</span>))}
                </div>
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={post.liked ? 'var(--accent-gold)' : 'none'} stroke="var(--ink-muted)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{post.likes}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* FAB */}
        <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--accent-gold), #b8942e)', boxShadow: '0 4px 20px rgba(212, 168, 83, 0.4)', zIndex: 50 }} onClick={() => setShowCreateModal(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>

        {/* Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedPost(null)}>
            <GlassCard className="max-w-2xl w-full max-h-[85vh] overflow-y-auto" style={{ animation: 'fade-in-up 0.3s ease-out' }} onClick={(e) => e?.stopPropagation()}>
              <div className="flex justify-end mb-2"><button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: 'var(--bg-surface)', color: 'var(--ink-muted)' }} onClick={() => setSelectedPost(null)}>x</button></div>
              <div className="rounded-xl overflow-hidden mb-4" style={{ background: 'var(--bg-surface)' }}><img src={selectedPost.images[0]} alt={selectedPost.title} className="w-full object-cover" style={{ maxHeight: '400px' }} /></div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>{selectedPost.title}</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}><img src={selectedPost.authorAvatar} alt="" className="w-full h-full object-cover" /></div>
                <div><p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{selectedPost.authorName}</p><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{formatDate(selectedPost.createdAt)}</p></div>
              </div>
              <div className="flex gap-2 mb-3">{selectedPost.tags.map((tag: string) => (<Tag key={tag} size="sm">{tag}</Tag>))}</div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink-secondary)' }}>{selectedPost.description}</p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border mb-6 cursor-pointer transition-all" style={{ borderColor: selectedPost.liked ? 'var(--accent-gold)' : 'var(--border)', background: selectedPost.liked ? 'rgba(212, 168, 83, 0.1)' : 'transparent' }} onClick={() => { toggleLike(selectedPost.id); const u = posts.find((p) => p.id === selectedPost.id); if (u) setSelectedPost(u); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={selectedPost.liked ? 'var(--accent-gold)' : 'none'} stroke={selectedPost.liked ? 'var(--accent-gold)' : 'var(--ink-muted)'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                <span className="text-sm" style={{ color: selectedPost.liked ? 'var(--accent-gold)' : 'var(--ink-muted)' }}>{selectedPost.liked ? '已点赞' : '点赞'} ({selectedPost.likes})</span>
              </button>
              <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--ink)' }}>评论区 ({selectedPost.comments.length})</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {selectedPost.comments.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--ink-muted)' }}>暂无评论，快来抢沙发吧</p>}
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                      <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold" style={{ color: 'var(--accent-gold)' }}>{comment.authorName}</span><span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{formatDate(comment.createdAt)}</span></div>
                      <p className="text-sm" style={{ color: 'var(--ink-secondary)' }}>{comment.content}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="发表评论..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleComment()} className="flex-1 px-4 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }} />
                  <Button variant="gold" size="sm" onClick={handleComment}>发送</Button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setShowCreateModal(false)}>
            <GlassCard className="max-w-lg w-full" style={{ animation: 'fade-in-up 0.3s ease-out' }} onClick={(e) => e?.stopPropagation()}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--ink)' }}>发布新灵感</h2>
              <div className="mb-4"><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-muted)' }}>标题</label><input type="text" placeholder="为你的灵感命名..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }} /></div>
              <div className="mb-4"><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-muted)' }}>描述</label><textarea placeholder="分享你的设计灵感和故事..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }} /></div>
              <div className="mb-4"><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-muted)' }}>标签</label><div className="flex flex-wrap gap-2">{CATEGORIES.filter((c) => c !== '全部').map((cat) => (<Tag key={cat} active={newTags.includes(cat)} onClick={() => { setNewTags(newTags.includes(cat) ? newTags.filter((t) => t !== cat) : [...newTags, cat]); }} size="sm">{cat}</Tag>))}</div></div>
              <div className="mb-6"><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-muted)' }}>图片上传</label>
                {newImage ? (<div className="relative inline-block"><img src={newImage} alt="预览" className="w-48 h-48 rounded-lg object-cover" /><button className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer" style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--ink)' }} onClick={() => setNewImage(null)}>x</button></div>) : (<div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer" style={{ borderColor: 'var(--border)' }} onClick={() => fileInputRef.current?.click()}><p className="text-sm" style={{ color: 'var(--ink-muted)' }}>点击上传图片</p></div>)}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
              <div className="flex gap-3 justify-end"><Button variant="secondary" onClick={() => setShowCreateModal(false)}>取消</Button><Button variant="gold" onClick={handleCreatePost} disabled={!newTitle.trim()}>发布</Button></div>
            </GlassCard>
          </div>
        )}
      </div>
  );
}
