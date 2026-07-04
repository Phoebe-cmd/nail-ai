'use client';

import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export default function Tag({ children, className = '', active = false, onClick, size = 'md' }: TagProps) {
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`tag-glow inline-flex items-center rounded-full font-medium cursor-pointer ${sizeStyle} ${onClick ? 'hover:opacity-90' : ''} ${className}`}
      style={{
        background: active ? 'rgba(212, 168, 83, 0.2)' : 'rgba(255,255,255,0.06)',
        color: active ? 'var(--accent-gold)' : 'var(--ink-secondary)',
        border: `1px solid ${active ? 'var(--accent-gold)' : 'var(--border)'}`,
        boxShadow: active ? '0 0 12px rgba(201,168,76,0.18)' : 'none',
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
