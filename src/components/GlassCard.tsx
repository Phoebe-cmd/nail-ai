'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent) => void;
}

export default function GlassCard({ children, className = '', style, onClick }: GlassCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 backdrop-blur-md transition-all ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${className}`}
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
