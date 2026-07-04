'use client';

import React from 'react';
import { useStore, RESONANCE_THEMES } from '@/lib/store';

export default function ResonanceThemeSwitcher() {
  const { currentTheme, setTheme } = useStore();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {RESONANCE_THEMES.map((theme) => {
        const isActive = currentTheme.id === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all cursor-pointer"
            style={{
              background: isActive ? 'rgba(212, 168, 83, 0.12)' : 'var(--bg-card)',
              borderColor: isActive ? 'var(--accent-gold)' : 'var(--border)',
              boxShadow: isActive ? '0 0 20px rgba(212, 168, 83, 0.15)' : 'none',
            }}
          >
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full" style={{ background: theme.primary }} />
              <div className="w-3 h-3 rounded-full" style={{ background: theme.gold }} />
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: isActive ? 'var(--accent-gold)' : 'var(--ink-secondary)' }}
            >
              {theme.icon} {theme.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
