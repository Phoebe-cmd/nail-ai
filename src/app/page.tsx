'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

/* ─── 电影胶片画廊数据 ─── */
interface FilmCard {
  id: string;
  inspirationImg: string;
  nailResultImg: string;
  title: string;
  tag: string;
  ratio: number;  // origin 图的宽/高，用于按固定高度算宽度
}

const FILM_ROW_1: FilmCard[] = [
  { id: 'f1',  inspirationImg: '/samples/1_origin.jpg',  nailResultImg: '/samples/1_neil.png',  title: '灵感 01', tag: '作品', ratio: 1.000 },
  { id: 'f2',  inspirationImg: '/samples/2_origin.jpg',  nailResultImg: '/samples/2_neil.png',  title: '灵感 02', tag: '作品', ratio: 1.000 },
  { id: 'f3',  inspirationImg: '/samples/3_origin.jpg',  nailResultImg: '/samples/3_neil.png',  title: '灵感 03', tag: '作品', ratio: 1.000 },
  { id: 'f4',  inspirationImg: '/samples/4_origin.jpg',  nailResultImg: '/samples/4_neil.png',  title: '灵感 04', tag: '作品', ratio: 1.000 },
  { id: 'f5',  inspirationImg: '/samples/5_origin.png',  nailResultImg: '/samples/5_neil.jpeg', title: '灵感 05', tag: '作品', ratio: 1.492 },
  { id: 'f6',  inspirationImg: '/samples/6_origin.png',  nailResultImg: '/samples/6_neil.jpg',  title: '灵感 06', tag: '作品', ratio: 1.779 },
  { id: 'f7',  inspirationImg: '/samples/7_origin.png',  nailResultImg: '/samples/7_neil.jpeg', title: '灵感 07', tag: '作品', ratio: 1.122 },
];

const FILM_ROW_2: FilmCard[] = [
  { id: 'f8',  inspirationImg: '/samples/8_origin.jpg',  nailResultImg: '/samples/8_neil.jpeg', title: '灵感 08', tag: '作品', ratio: 0.873 },
  { id: 'f9',  inspirationImg: '/samples/9_origin.png',  nailResultImg: '/samples/9_neil.png',  title: '灵感 09', tag: '作品', ratio: 1.000 },
  { id: 'f10', inspirationImg: '/samples/10_origin.jpg', nailResultImg: '/samples/10_neil.jpg', title: '灵感 10', tag: '作品', ratio: 1.000 },
  { id: 'f11', inspirationImg: '/samples/11_origin.jpg', nailResultImg: '/samples/11_neil.png', title: '灵感 11', tag: '作品', ratio: 1.113 },
  { id: 'f12', inspirationImg: '/samples/12_origin.jpg', nailResultImg: '/samples/12_neil.png', title: '灵感 12', tag: '作品', ratio: 1.008 },
  { id: 'f13', inspirationImg: '/samples/13_origin.jpg', nailResultImg: '/samples/13_neil.png', title: '灵感 13', tag: '作品', ratio: 1.005 },
  { id: 'f14', inspirationImg: '/samples/14_origin.jpg', nailResultImg: '/samples/14_neil.jpg', title: '灵感 14', tag: '作品', ratio: 1.000 },
];

/* ─── 单张胶片帧（孔洞+图片+孔洞，一体滚动） ─── */
/* ─── 单张胶片帧（孔洞+图片+孔洞，一体滚动） ─── */
const FRAME_HEIGHT = 330;

function FilmStripFrame({ card, onHover }: { card: FilmCard; onHover?: (hovering: boolean) => void }) {
  const [hovered, setHovered] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const HOLE_COUNT = 12;

  const handleEnter = () => {
    setHovered(true);
    onHover?.(true);
  };
  const handleLeave = () => {
    setHovered(false);
    onHover?.(false);
  };

  // 实际宽度：按 origin 真实比例算，保证整张显示；未加载前用数据里的 ratio 兜底
  const ratio = natural ? natural.w / natural.h : card.ratio;
  const frameWidth = Math.round(FRAME_HEIGHT * ratio);

  return (
    <div
      className="flex-shrink-0 mx-2 cursor-pointer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        width: `${frameWidth}px`,
        transform: hovered ? 'perspective(800px) rotateY(0deg) scale(1.02)' : 'perspective(800px) rotateY(0deg) scale(1)',
        transition: 'transform 0.4s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ═══ 上排孔洞（均匀铺满） ═══ */}
      <div
        className="h-5 flex items-center justify-between px-3"
        style={{ background: '#0a0709', borderTop: '1px solid rgba(201,168,76,0.12)' }}
      >
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="w-[5px] h-[7px] rounded-[1px] flex-shrink-0"
            style={{ background: 'rgba(201, 168, 76, 0.3)' }}
          />
        ))}
      </div>

      {/* ═══ 图片卡片 ═══ */}
      <div className="relative" style={{ width: `${frameWidth}px`, height: `${FRAME_HEIGHT}px` }}>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            background: '#0a0709',
            borderLeft: '1px solid rgba(201, 168, 76, 0.15)',
            borderRight: '1px solid rgba(201, 168, 76, 0.15)',
            boxShadow: hovered
              ? '0 8px 40px rgba(139, 26, 74, 0.3), 0 0 24px rgba(201, 168, 76, 0.15)'
              : '0 4px 16px rgba(0, 0, 0, 0.5)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* 灵感来源图（底层，contain 完整显示） */}
          <img
            src={card.inspirationImg}
            alt={card.title}
            onLoad={(e) => {
              const img = e.currentTarget;
              setNatural({ w: img.naturalWidth, h: img.naturalHeight });
            }}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'contain',
              transition: 'opacity 0.5s ease',
              opacity: hovered ? 0 : 1,
            }}
          />

          {/* 美甲成品图（悬停层，cover 填满） */}
          <img
            src={card.nailResultImg}
            alt={`${card.title} 美甲效果`}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'cover',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1)' : 'scale(0.95)',
            }}
          />

          {/* 底部渐变遮罩 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{
              background: 'linear-gradient(transparent, rgba(11, 8, 10, 0.95))',
              pointerEvents: 'none',
            }}
          />

          {/* 标题 + 标签 */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5" style={{ zIndex: 2 }}>
            <div
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5"
              style={{
                background: 'rgba(139, 26, 74, 0.45)',
                color: 'var(--accent-gold)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
              }}
            >
              {card.tag}
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              {card.title}
            </p>
          </div>

          {/* 悬停提示标签 */}
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium"
            style={{
              background: 'rgba(11, 8, 10, 0.75)',
              backdropFilter: 'blur(8px)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(-6px)',
              transition: 'all 0.3s ease',
            }}
          >
            {hovered ? '✦ 美甲成品' : '✦ 灵感来源'}
          </div>
        </div>
      </div>

      {/* ═══ 下排孔洞（与上面对齐，均匀铺满） ═══ */}
      <div
        className="h-5 flex items-center justify-between px-3"
        style={{ background: '#0a0709', borderBottom: '1px solid rgba(201,168,76,0.12)' }}
      >
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="w-[5px] h-[7px] rounded-[1px] flex-shrink-0"
            style={{ background: 'rgba(201, 168, 76, 0.3)' }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 无限滚动胶片行（3D弯曲 + 拖尾 + 对齐孔洞） ─── */
function FilmStripRow({ cards, reverse = false }: { cards: FilmCard[]; reverse?: boolean }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...cards, ...cards];
  const animName = reverse ? 'scrollRight' : 'scrollLeft';

  const trackStyle: React.CSSProperties = {
    width: 'max-content',
    animation: `${animName} 45s linear infinite`,
    animationPlayState: paused ? 'paused' : 'running',
    willChange: 'transform',
  };

  // 拖尾阴影方向与滚动方向一致
  const trailFilter = reverse
    ? 'drop-shadow(-6px 0 0 rgba(201,168,76,0.07)) drop-shadow(-12px 0 0 rgba(201,168,76,0.04)) drop-shadow(-18px 0 0 rgba(201,168,76,0.02))'
    : 'drop-shadow(6px 0 0 rgba(201,168,76,0.07)) drop-shadow(12px 0 0 rgba(201,168,76,0.04)) drop-shadow(18px 0 0 rgba(201,168,76,0.02))';

  return (
    <div
      className="mb-6 select-none"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D弯曲的胶片轨道容器 */}
      <div
        style={{
          transform: 'rotateX(1.2deg) rotateY(-0.3deg)',
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 外层遮罩 + 拖尾 */}
        <div
          className="overflow-hidden"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)',
            filter: trailFilter,
          }}
        >
          {/* 滚动轨道 */}
          <div className="flex py-2" style={trackStyle}>
            {doubled.map((card, i) => (
              <FilmStripFrame
                key={`${card.id}-${i}`}
                card={card}
                onHover={(hovering) => setPaused(hovering)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 平台介绍：打印机效果 ─── */
const INTRO_LINES = [
  '指尖，是离心脏最近的艺术画布。',
  '上传你的灵感碎片——专辑封面、动漫截图、偶像舞台——',
  'AI 将为你打造独一无二的痛甲设计。',
  '先在自己的手上预览效果，再决定是否将它变为现实。',
  '每一枚指甲，都是一次对热爱的告白。',
];

function TypewriterIntro() {
  const fullText = INTRO_LINES.join('\n');
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let charIndex = 0;
    let typing: ReturnType<typeof setInterval>;
    let pause: ReturnType<typeof setTimeout>;
    let restart: ReturnType<typeof setTimeout>;
    let blink: ReturnType<typeof setInterval>;

    // 打字
    typing = setInterval(() => {
      charIndex += 1;
      setDisplayed(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(typing);
        // 打完后停留 2.5s，然后清空重新循环
        pause = setTimeout(() => {
          setDisplayed('');
          charIndex = 0;
          restart = setTimeout(() => {
            typing = setInterval(() => {
              charIndex += 1;
              setDisplayed(fullText.slice(0, charIndex));
              if (charIndex >= fullText.length) {
                clearInterval(typing);
              }
            }, 70);
          }, 400);
        }, 2500);
      }
    }, 70);

    // 光标闪烁
    blink = setInterval(() => setShowCursor((v) => !v), 500);

    return () => {
      clearInterval(typing);
      clearTimeout(pause);
      clearTimeout(restart);
      clearInterval(blink);
    };
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border)',
        padding: '40px 32px',
        position: 'relative',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
      <div className="flex items-center gap-2 mb-6">
        <span style={{ color: 'var(--accent-gold)', fontSize: '14px' }}>✦</span>
        <h2
          style={{
            fontFamily: 'Cinzel, Noto Serif SC, serif',
            fontSize: '22px',
            color: 'var(--ink)',
            fontWeight: 600,
          }}
        >
          NAIL AI
        </h2>
      </div>
      <pre
        className="whitespace-pre-wrap leading-loose"
        style={{
          fontFamily: 'Noto Serif SC, serif',
          fontSize: '17px',
          color: 'var(--ink-secondary)',
          margin: 0,
          minHeight: '9em',
          textShadow: '0 1px 10px rgba(0,0,0,0.4)',
        }}
      >
        {displayed}
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '1.1em',
          background: 'var(--accent-gold)',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          opacity: showCursor ? 1 : 0,
          transition: 'opacity 0.1s',
        }} />
      </pre>
    </div>
  );
}

/* ─── 主页 ─── */
export default function HomePage() {

  // 加载 UnicornStudio SDK
  useEffect(() => {
    const w = window as any;
    if (w.UnicornStudio && w.UnicornStudio.isInitialized) return;
    if (document.getElementById('us-sdk')) {
      if (w.UnicornStudio) w.UnicornStudio.init();
      return;
    }
    const i = document.createElement('script');
    i.id = 'us-sdk';
    i.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.6/dist/unicornStudio.umd.js';
    i.onload = () => {
      if (w.UnicornStudio) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => w.UnicornStudio.init());
        } else {
          w.UnicornStudio.init();
        }
      }
    };
    document.head.appendChild(i);
  }, []);

  return (
    <div className="relative">

      {/* ═══ HERO 区域（UnicornStudio 动态背景） ═══ */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ minHeight: '70vh' }}
      >
        {/* UnicornStudio 动态背景容器 */}
        <div
          className="absolute inset-0 z-0"
          style={{ width: '100%', height: '100%' }}
          data-us-project="kiNinczvWXOimBXZ2g88"
        />

        {/* 半透明遮罩层，让文字更清晰 */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(180deg, rgba(11,8,10,0.3) 0%, rgba(11,8,10,0.6) 60%, rgba(11,8,10,0.95) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* 主标题区 */}
        <div className="relative z-10 flex flex-col items-center text-center" style={{ maxWidth: '760px', animation: 'pageEnter 0.8s ease-out' }}>
          <h1
            className="mb-10 leading-[1.1]"
            style={{
              fontFamily: 'Cinzel, Noto Serif SC, serif',
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: 600,
              color: 'var(--ink)',
              letterSpacing: '1px',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            Where Inspiration Gathers.
          </h1>
          <div className="flex gap-4 justify-center">
            <Link href="/design">
              <Button variant="gold">上传灵感碎片</Button>
            </Link>
            <Link href="/community">
              <Button variant="glass">浏览藏品</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 电影胶片画廊 ═══ */}
      <section className="py-6">
        {/* 第一行：从左往右 */}
        <FilmStripRow cards={FILM_ROW_1} reverse={false} />
        {/* 第二行：从右往左 */}
        <FilmStripRow cards={FILM_ROW_2} reverse={true} />
      </section>

      {/* ═══ 平台介绍（打印机效果） ═══ */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <TypewriterIntro />
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="text-center py-8" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
          NailAI — 暗夜珍宝阁 · AI美学工作室 · Luxury first, fandom second.
        </p>
      </footer>
    </div>
  );
}
