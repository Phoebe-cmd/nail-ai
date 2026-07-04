'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}

export default function Button({
  children,
  className = '',
  onClick,
  variant = 'gold',
  size = 'md',
  disabled = false,
  type = 'button',
  style,
}: ButtonProps) {
  const sizeStyles: Record<string, string> = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent-primary), #6B1438)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 20px var(--glow-primary)',
      borderRadius: '999px',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1px solid var(--border)',
      borderRadius: '999px',
    },
    glass: {
      background: 'rgba(255,255,255,0.04)',
      color: 'var(--ink-secondary)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(8px)',
      borderRadius: '999px',
    },
    gold: {
      background: 'linear-gradient(135deg, var(--accent-gold), #b8942e)',
      color: '#0B080A',
      border: 'none',
      borderRadius: '999px',
    },
  };

  return (
    <button
      type={type}
      className={`btn-glow inline-flex items-center justify-center gap-2 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed no-underline ${sizeStyles[size]} ${className}`}
      style={{ fontFamily: 'Inter, PingFang SC, sans-serif', ...variantStyles[variant], ...style }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
