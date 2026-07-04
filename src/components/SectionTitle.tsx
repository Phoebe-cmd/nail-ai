'use client';

import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export default function SectionTitle({ children, className = '', subtitle }: SectionTitleProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2
        className="text-2xl font-bold mb-1"
        style={{ color: 'var(--ink)' }}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
          {subtitle}
        </p>
      )}
      <div
        className="w-16 h-1 rounded-full mt-2"
        style={{ background: 'linear-gradient(90deg, var(--accent-gold), transparent)' }}
      />
    </div>
  );
}
