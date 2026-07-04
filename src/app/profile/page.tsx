'use client';

import React from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { useStore } from '@/lib/store';

export default function ProfilePage() {
  const { currentUser, designs } = useStore();
  const favDesigns = designs.filter((d) => currentUser.favorites.includes(d.id));
  const stats = [
    { label: '我的藏品', value: currentUser.favorites.length },
    { label: '发布帖子', value: currentUser.communityPosts.length },
    { label: '获赞总数', value: currentUser.followers },
    { label: '关注美甲师', value: currentUser.following.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-gold), #6b2fa0)', padding: '3px' }}>
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-3xl" style={{ background: 'var(--bg-card)', color: 'var(--accent-gold)' }}>{currentUser.avatar}</div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{currentUser.name}</h1>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>在暗夜中寻找美的碎片</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <GlassCard key={i} className="text-center">
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-gold)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{stat.label}</p>
            </GlassCard>
          ))}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>最近藏品</h2>
          {favDesigns.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {favDesigns.map((design) => (
                <Link key={design.id} href={`/design/${design.id}`}>
                  <div className="rounded-xl overflow-hidden border aspect-[3/4] transition-all hover:scale-105" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                    <img src={design.nails[0]?.image || '/nail_1.jpg'} alt={design.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <GlassCard className="text-center py-12">
              <p className="mb-4" style={{ color: 'var(--ink-muted)' }}>还没有藏品，去设计工坊创建你的第一个痛甲吧</p>
              <Link href="/design"><button className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer" style={{ background: 'linear-gradient(135deg, var(--accent-gold), #b8942e)', color: '#0a0a0f', border: 'none' }}>前往设计工坊</button></Link>
            </GlassCard>
          )}
        </div>
      </div>
  );
}
