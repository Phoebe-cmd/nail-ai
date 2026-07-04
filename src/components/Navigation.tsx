'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/design', label: '开始设计' },
  { href: '/community', label: '灵感社区' },
  { href: '/profile', label: '我的藏品' },
  { href: '/tips', label: '护甲知识' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        background: 'rgba(11,8,10,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        height: '60px',
        padding: '0 40px',
      }}
    >
      <Link href="/" className="flex items-center gap-2 no-underline">
        <img src="/nav-icon.png" alt="NailAI" style={{ height: '36px', width: 'auto' }} />
      </Link>
      <div className="flex gap-7">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="no-underline transition-colors duration-300 relative"
              style={{
                color: isActive ? 'var(--accent-gold)' : 'var(--ink-secondary)',
                fontSize: '13px',
              }}
            >
              {item.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-[1px]" style={{ background: 'var(--accent-gold)', opacity: 0.6 }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
