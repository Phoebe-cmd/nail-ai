'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '注册失败');
        setLoading(false);
        return;
      }
      router.push('/community');
      router.refresh();
    } catch {
      setError('网络错误，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--ink)' }}>注册</h1>
      <p className="text-center text-sm mb-8" style={{ color: 'var(--ink-muted)' }}>加入暗夜珍宝阁，分享你的灵感</p>

      <GlassCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-muted)' }}>用户名</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
              placeholder="你想被怎么称呼"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-muted)' }}>邮箱</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-muted)' }}>密码</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
              placeholder="至少 6 位"
            />
          </div>
          {error && <p className="text-sm" style={{ color: '#e94560' }}>{error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--ink-muted)' }}>
          已有账号？<Link href="/login" style={{ color: 'var(--accent-gold)' }}>去登录</Link>
        </p>
      </GlassCard>
    </div>
  );
}
