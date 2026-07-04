'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { useStore } from '@/lib/store';

export default function DesignLoadingPage() {
  const router = useRouter();
  const { designs } = useStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + 2.5;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const latestDesign = designs[designs.length - 1];
      if (latestDesign) { router.push(`/design/${latestDesign.id}`); }
      else { router.push('/design'); }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [designs, router]);

  const latestDesign = designs[designs.length - 1];

  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="flex justify-center mb-8">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent', animation: 'spin-slow 2s linear infinite' }} />
              <div className="absolute inset-3 rounded-full border-4" style={{ borderColor: 'var(--ink-muted)', borderBottomColor: 'transparent', animation: 'spin-reverse 1.5s linear infinite' }} />
              <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'pulse-gold 2s ease-in-out infinite' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(212, 168, 83, 0.15)' }}>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>&#10022;</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--ink)' }}>AI正在解析你的灵感碎片</h2>

          <div className="mb-8">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
              <div className="h-full rounded-full transition-all duration-100" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent-gold), var(--accent))' }} />
            </div>
            <p className="text-center text-sm mt-2" style={{ color: 'var(--ink-muted)' }}>{Math.round(progress)}%</p>
          </div>

          {latestDesign && latestDesign.styleDNA && (
            <GlassCard style={{ animation: 'fade-in-up 0.6s ease-out' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--accent-gold)' }}>Style DNA 预览</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Mood</p><p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{latestDesign.styleDNA.mood}</p></div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Material</p><p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{latestDesign.styleDNA.material}</p></div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Palette</p><div className="flex gap-1.5 mt-1">{latestDesign.styleDNA.palette.map((color: string, i: number) => (<div key={i} className="w-5 h-5 rounded-full" style={{ background: color }} />))}</div></div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}><p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Vibe</p><p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{latestDesign.styleDNA.vibe}</p></div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
  );
}
