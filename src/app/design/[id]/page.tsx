'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import { useStore } from '@/lib/store';
import { DIFFICULTY_STARS, DIFFICULTY_LABELS } from '@/lib/utils';
import type { NailDesign } from '@/lib/types';

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { designs, toggleFavorite, currentUser } = useStore();
  const [design, setDesign] = useState<NailDesign | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const found = designs.find((d) => d.id === id);
    setDesign(found || null);
  }, [params.id, designs]);

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <GlassCard className="text-center max-w-md">
            <p className="text-lg mb-4" style={{ color: 'var(--ink-muted)' }}>找不到该设计方案</p>
            <Button variant="gold" onClick={() => router.push('/design')}>返回设计工坊</Button>
          </GlassCard>
        </div>
      );
  }

  const isFaved = currentUser.favorites.includes(design.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Left Column 48% */}
          <div style={{ width: '48%' }}>
            <GlassCard className="mb-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>MediaPipe 贴合预览</h3>
              <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                <img src="/anime_hand.jpg" alt="贴合预览" className="w-full object-cover" style={{ aspectRatio: '4/5' }} />
              </div>
            </GlassCard>

            <GlassCard className="mb-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>AI 提示词</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>{design.prompt}</p>
            </GlassCard>

            <GlassCard className="mb-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>施工难度</h3>
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: 'var(--accent-gold)' }}>{DIFFICULTY_STARS[design.difficulty - 1]}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{DIFFICULTY_LABELS[design.difficulty - 1]}</span>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>材料清单</h3>
              <ul className="space-y-2">
                {design.materials.map((mat, i) => (
                  <li key={i} className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <span className="text-sm" style={{ color: 'var(--ink)' }}>{mat.name}</span>
                    <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{mat.quantity}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Right Column 52% */}
          <div style={{ width: '52%' }}>
            <GlassCard className="mb-4">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--accent-gold)' }}>适配评分</h3>
              <div className="flex items-end gap-6 mb-4">
                <div>
                  <span className="text-6xl font-bold" style={{ color: 'var(--accent-gold)' }}>{design.compatibilityScore}</span>
                  <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>综合评分</p>
                </div>
                <div className="flex gap-4 mb-2">
                  <div className="text-center"><div className="text-xl font-bold" style={{ color: design.compatibilityScore >= 90 ? 'var(--accent-gold)' : 'var(--ink)' }}>{design.compatibilityScore >= 95 ? 'A+' : design.compatibilityScore >= 90 ? 'A' : design.compatibilityScore >= 85 ? 'B+' : 'B'}</div><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>等级</p></div>
                  <div className="text-center"><div className="text-xl font-bold" style={{ color: 'var(--ink)' }}>{design.styleTags.length}</div><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>风格标签</p></div>
                  <div className="text-center"><div className="text-xl font-bold" style={{ color: 'var(--ink)' }}>{design.techniques.length}</div><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>工艺数</p></div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="mb-4">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--accent-gold)' }}>十指甲设计</h3>
              <div className="grid grid-cols-5 gap-3">
                {design.nails.map((nail, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border aspect-[3/4]" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                    <img src={nail.image} alt={nail.label} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="flex gap-3">
              <Button variant={isFaved ? 'secondary' : 'gold'} onClick={() => toggleFavorite(design.id)}>{isFaved ? '已收藏' : '保存到藏品'}</Button>
              <Button variant="secondary" onClick={() => router.push('/design')}>重新编辑</Button>
              <Button variant="glass">分享</Button>
            </div>
          </div>
        </div>
      </div>
  );
}
