'use client';

export default function AuroraBackground() {
  return (
    <>
      {/* Aurora glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 70% 30%, rgba(91,142,200,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 70%, rgba(139,26,74,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 80% 80%, rgba(123,104,176,0.05) 0%, transparent 50%)
          `,
          animation: 'auroraBreathe 8s ease-in-out infinite',
        }}
      />
      {/* Floating butterfly 1 */}
      <svg className="fixed z-[1] pointer-events-none" width="32" height="32" viewBox="0 0 32 32" fill="none"
        style={{ top: '15%', left: '8%', opacity: 0.12, animation: 'floatUpDown 6s ease-in-out infinite' }}>
        <path d="M16 8C16 8 10 2 6 4C2 6 6 12 12 12" stroke="var(--accent-gold)" strokeWidth="0.8" fill="none"/>
        <path d="M16 8C16 8 22 2 26 4C30 6 26 12 20 12" stroke="var(--accent-gold)" strokeWidth="0.8" fill="none"/>
        <path d="M16 8V24" stroke="var(--accent-gold)" strokeWidth="0.8"/>
        <path d="M16 16C16 16 12 20 8 22C6 23 8 19 12 17" stroke="var(--accent-gold)" strokeWidth="0.6" fill="none"/>
        <path d="M16 16C16 16 20 20 24 22C26 23 24 19 20 17" stroke="var(--accent-gold)" strokeWidth="0.6" fill="none"/>
      </svg>
      {/* Floating butterfly 2 */}
      <svg className="fixed z-[1] pointer-events-none" width="28" height="28" viewBox="0 0 32 32" fill="none"
        style={{ top: '60%', right: '10%', opacity: 0.12, animation: 'floatUpDown 7s ease-in-out 3s infinite' }}>
        <path d="M16 8C16 8 10 2 6 4C2 6 6 12 12 12" stroke="var(--aurora-pink)" strokeWidth="0.8" fill="none"/>
        <path d="M16 8C16 8 22 2 26 4C30 6 26 12 20 12" stroke="var(--aurora-pink)" strokeWidth="0.8" fill="none"/>
        <path d="M16 8V24" stroke="var(--aurora-pink)" strokeWidth="0.8"/>
      </svg>
    </>
  );
}
