'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import Tag from '@/components/Tag';
import { useStore } from '@/lib/store';
import { STYLE_TAGS, TECHNIQUE_TAGS, PALETTE_PRESETS, generateStyleDNA, generateNailArts, generateCompatibilityScore, generateDifficulty, generateMaterials } from '@/lib/mock-data';
import { generateId, buildPrompt } from '@/lib/utils';

type Mode = 'guided' | 'free';

// 10 个指位：左手 5 + 右手 5
const FINGER_POSITIONS = [
  { key: 'L1', label: '左·拇指' },
  { key: 'L2', label: '左·食指' },
  { key: 'L3', label: '左·中指' },
  { key: 'L4', label: '左·无名' },
  { key: 'L5', label: '左·小指' },
  { key: 'R1', label: '右·拇指' },
  { key: 'R2', label: '右·食指' },
  { key: 'R3', label: '右·中指' },
  { key: 'R4', label: '右·无名' },
  { key: 'R5', label: '右·小指' },
];

const FREE_PROMPT_TEMPLATE = `【画面描述】
（描述你想要的痛甲整体效果、主体内容、构图...）

【风格】
（如暗黑摇滚、赛博朋克、日系少女、专辑封面风...）

【细节】
（特殊元素、材质质感、氛围、点缀...）`;

interface Series {
  id: string;
  serial: number;          // 序号，不复用
  name: string;            // 可改名，默认 "系列{serial}"
  mode: Mode;              // 每系列各自的模式
  // 引导模式字段
  themeName: string;
  characters: string;
  signatureSymbol: string;
  palette: string[];
  styleTags: string[];
  techniques: string[];
  // 共用
  refImage: string | null;
  // 自由模式字段
  promptText: string;
  // 生成结果
  generated: boolean;
  nails: string[];         // 10 张图，对应 FINGER_POSITIONS
}

const MAX_SERIES = 10;

let seriesCounter = 0;
const createSeries = (): Series => {
  seriesCounter += 1;
  return {
    id: generateId(),
    serial: seriesCounter,
    name: `系列${seriesCounter}`,
    mode: 'guided',
    themeName: '',
    characters: '',
    signatureSymbol: '',
    palette: PALETTE_PRESETS[0],
    styleTags: [],
    techniques: [],
    refImage: null,
    promptText: FREE_PROMPT_TEMPLATE,
    generated: false,
    nails: Array(10).fill(''),
  };
};

// 组合区一个指位的选择：来自哪个系列的哪张图
interface ComboPick {
  seriesId: string;
  nailIndex: number;       // 0-9，该系列 nails 数组的下标
}

export default function DesignPage() {
  const router = useRouter();
  const { addDesign, handPhotos, selectedLeftHandId, selectedRightHandId, setSelectedLeftHand, setSelectedRightHand, addHandPhoto } = useStore();
  const refInputRef = useRef<HTMLInputElement>(null);
  const newHandInputRef = useRef<HTMLInputElement>(null);

  // 手部照片选择弹窗：null | 'left' | 'right' | 'new-left' | 'new-right'
  const [handPicker, setHandPicker] = useState<'left' | 'right' | null>(null);
  // 临时记录"正在为哪只手新拍"，新拍后存入档案并自动选中
  const [newForSide, setNewForSide] = useState<'left' | 'right' | null>(null);

  // 系列列表 + 当前激活系列
  const [seriesList, setSeriesList] = useState<Series[]>(() => [createSeries()]);
  const [activeSeriesId, setActiveSeriesId] = useState<string>(() => seriesList[0]?.id ?? '');

  // 组合区：每个指位的选择
  const [combo, setCombo] = useState<Record<string, ComboPick | null>>({});

  // 指位选择弹窗
  const [pickerFor, setPickerFor] = useState<string | null>(null); // FINGER_POSITIONS.key

  const activeSeries = seriesList.find((s) => s.id === activeSeriesId) ?? seriesList[0];

  // 当前选中的左右手照片记录
  const leftHandPhoto = handPhotos.find((p) => p.id === selectedLeftHandId) || null;
  const rightHandPhoto = handPhotos.find((p) => p.id === selectedRightHandId) || null;
  const leftPhotos = handPhotos.filter((p) => p.side === 'left');
  const rightPhotos = handPhotos.filter((p) => p.side === 'right');

  // ===== 系列操作 =====
  const addSeries = () => {
    if (seriesList.length >= MAX_SERIES) {
      alert(`最多 ${MAX_SERIES} 个系列，可删除旧的再加新的`);
      return;
    }
    const s = createSeries();
    setSeriesList((prev) => [...prev, s]);
    setActiveSeriesId(s.id);
  };

  const removeSeries = (id: string) => {
    if (seriesList.length <= 1) {
      alert('至少保留 1 个系列');
      return;
    }
    setSeriesList((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeSeriesId === id) {
        setActiveSeriesId(next[0].id);
      }
      return next;
    });
    // 清掉组合区引用了这个系列的指位
    setCombo((prev) => {
      const next: Record<string, ComboPick | null> = {};
      Object.entries(prev).forEach(([k, v]) => {
        next[k] = v && v.seriesId === id ? null : v;
      });
      return next;
    });
  };

  const renameSeries = (id: string, name: string) => {
    setSeriesList((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const setSeriesMode = (id: string, mode: Mode) => {
    setSeriesList((prev) => prev.map((s) => (s.id === id ? { ...s, mode } : s)));
  };

  // 更新当前系列字段
  const updateActive = <K extends keyof Series>(key: K, value: Series[K]) => {
    setSeriesList((prev) => prev.map((s) => (s.id === activeSeriesId ? { ...s, [key]: value } : s)));
  };

  // ===== 文件上传 =====
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ===== 新拍手部照片：存入档案并自动选中 =====
  const handleNewHandUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newForSide) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const id = generateId();
      addHandPhoto({
        id,
        side: newForSide,
        image: reader.result as string,
        takenAt: new Date().toISOString(),
      });
      if (newForSide === 'left') setSelectedLeftHand(id);
      else setSelectedRightHand(id);
      setNewForSide(null);
      setHandPicker(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ===== 标签切换 =====
  const toggleTag = (tag: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  // ===== 单个系列生成 =====
  const handleGenerateSeries = (id: string) => {
    // mock：用现有 mock 数据填充 10 张图
    const arts = generateNailArts(10);
    setSeriesList((prev) => prev.map((s) => (s.id === id ? { ...s, generated: true, nails: arts.map((a) => a.image) } : s)));
  };

  // ===== 组合区 =====
  const getThumbForPick = (pick: ComboPick | null): string => {
    if (!pick) return '';
    const s = seriesList.find((x) => x.id === pick.seriesId);
    return s?.nails[pick.nailIndex] ?? '';
  };

  // 默认指位图：第一个已生成系列的同位指甲
  const defaultPickFor = (posKey: string, idx: number): ComboPick | null => {
    const first = seriesList.find((s) => s.generated);
    if (!first) return null;
    return { seriesId: first.id, nailIndex: idx };
  };

  const effectiveCombo = (posKey: string, idx: number): ComboPick | null => {
    if (combo[posKey]) return combo[posKey];
    return defaultPickFor(posKey, idx);
  };

  // ===== 生成整手 =====
  const handleGenerateFinal = () => {
    const generatedCount = seriesList.filter((s) => s.generated).length;
    if (generatedCount === 0) {
      alert('请至少先生成一个系列');
      return;
    }
    const s = activeSeries;
    const dna = generateStyleDNA();
    const design = {
      id: generateId(),
      name: s.themeName || s.name,
      theme: s.themeName || s.name,
      characters: s.characters,
      signatureSymbol: s.signatureSymbol,
      colorPalette: s.palette,
      styleTags: s.styleTags,
      techniques: s.techniques,
      refImage: s.refImage || undefined,
      handImage: leftHandPhoto?.image || rightHandPhoto?.image || undefined,
      styleDNA: dna,
      prompt: s.mode === 'free' ? s.promptText : buildPrompt({ name: s.themeName || s.name, characters: s.characters, signatureSymbol: s.signatureSymbol, colorPalette: s.palette, styleTags: s.styleTags, techniques: s.techniques }),
      difficulty: generateDifficulty(),
      materials: generateMaterials(),
      nails: generateNailArts(10),
      compatibilityScore: generateCompatibilityScore(),
      createdAt: new Date().toISOString(),
      resonanceTheme: 'default',
    };
    addDesign(design);
    router.push('/design/loading');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--ink)' }}>设计工作台</h1>

      {/* ═══ 模式 Tab（每系列各自） ═══ */}
      <div className="flex gap-2 mb-4">
        <button
          className="btn-glow px-5 py-2 rounded-lg text-sm font-medium"
          style={activeSeries.mode === 'guided'
            ? { background: 'var(--accent-gold)', color: '#0a0a0f' }
            : { background: 'var(--bg-surface)', color: 'var(--ink-secondary)', border: '1px solid var(--border)' }}
          onClick={() => setSeriesMode(activeSeries.id, 'guided')}
        >
          引导模式
        </button>
        <button
          className="btn-glow px-5 py-2 rounded-lg text-sm font-medium"
          style={activeSeries.mode === 'free'
            ? { background: 'var(--accent-gold)', color: '#0a0a0f' }
            : { background: 'var(--bg-surface)', color: 'var(--ink-secondary)', border: '1px solid var(--border)' }}
          onClick={() => setSeriesMode(activeSeries.id, 'free')}
        >
          自由模式
        </button>
      </div>

      {/* ═══ 系列 Tab ═══ */}
      <div className="flex gap-2 mb-6 flex-wrap items-center">
        {seriesList.map((s) => (
          <div
            key={s.id}
            className="flex items-center rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${activeSeriesId === s.id ? 'var(--accent-gold)' : 'var(--border)'}`,
              background: activeSeriesId === s.id ? 'rgba(212,168,83,0.1)' : 'var(--bg-surface)',
            }}
          >
            <button
              className="px-3 py-1.5 text-sm tap-highlight"
              style={{ color: activeSeriesId === s.id ? 'var(--accent-gold)' : 'var(--ink-secondary)' }}
              onClick={() => setActiveSeriesId(s.id)}
            >
              {s.name}{s.generated ? ' ✓' : ''}
            </button>
            <button
              className="px-2 py-1.5 text-xs"
              style={{ color: 'var(--ink-muted)' }}
              onClick={() => removeSeries(s.id)}
              title="删除系列"
            >×</button>
          </div>
        ))}
        {seriesList.length < MAX_SERIES && (
          <button
            className="px-3 py-1.5 rounded-lg text-sm border-dashed border"
            style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)' }}
            onClick={addSeries}
          >+ 新建系列</button>
        )}
      </div>

      <div className="flex gap-6">
        {/* ═══ 左栏（共享） ═══ */}
        <div className="flex-shrink-0" style={{ width: '260px' }}>
          {/* 手部照片选用（来自护甲知识档案） */}
          <GlassCard className="mb-4">
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>双手照片</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--ink-muted)' }}>来自护甲知识档案，整手共用</p>

            {/* 左手 */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: 'var(--ink-secondary)' }}>左手</span>
                <button className="text-xs" style={{ color: 'var(--accent-gold)' }} onClick={() => setHandPicker('left')}>
                  {leftHandPhoto ? '更换' : '选择'}
                </button>
              </div>
              {leftHandPhoto ? (
                <img src={leftHandPhoto.image} alt="左手" className="w-full rounded-lg" />
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>未选用</p>
                </div>
              )}
            </div>

            {/* 右手 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: 'var(--ink-secondary)' }}>右手</span>
                <button className="text-xs" style={{ color: 'var(--accent-gold)' }} onClick={() => setHandPicker('right')}>
                  {rightHandPhoto ? '更换' : '选择'}
                </button>
              </div>
              {rightHandPhoto ? (
                <img src={rightHandPhoto.image} alt="右手" className="w-full rounded-lg" />
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>未选用</p>
                </div>
              )}
            </div>

            {/* 缺失提醒 */}
            {(!leftHandPhoto || !rightHandPhoto) && (
              <p className="text-xs mt-3" style={{ color: '#e94560' }}>
                {!leftHandPhoto && !rightHandPhoto ? '请先选用左右手照片' : `请补充${!leftHandPhoto ? '左手' : '右手'}照片`}
              </p>
            )}
          </GlassCard>

          <GlassCard className="mb-4">
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>手型分析</h3>
            <p className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>（示例数据）</p>
            <div className="space-y-2">
              {['手型: 椭圆形', '甲床: 中等', '指尖: 适中', '推荐甲型: 方圆形'].map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--ink-muted)' }}>{item.split(':')[0]}</span>
                  <span style={{ color: 'var(--ink-secondary)' }}>{item.split(':')[1]?.trim()}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>拍摄指南</h3>
            <ul className="space-y-1.5">
              {['手掌自然展开，手指并拢', '在充足光线下拍摄', '保持相机与手部平行', '背景尽量简洁'].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ink-secondary)' }}><span style={{ color: 'var(--accent-gold)' }}>{i + 1}.</span>{tip}</li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* ═══ 右栏（当前系列编辑区） ═══ */}
        <div className="flex-1 min-w-0">
          {/* 系列名编辑 */}
          <GlassCard className="mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>系列名：</span>
              <input
                type="text"
                value={activeSeries.name}
                onChange={(e) => renameSeries(activeSeries.id, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border text-sm outline-none input-glow"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
              />
            </div>
          </GlassCard>

          {activeSeries.mode === 'guided' ? (
            <>
              {/* 引导模式 */}
              <GlassCard className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>1</span>
                  <h3 className="font-bold" style={{ color: 'var(--ink)' }}>主题名称</h3>
                </div>
                <input type="text" placeholder="为你的痛甲设计命名..." value={activeSeries.themeName} onChange={(e) => updateActive('themeName', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm mb-4 outline-none" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }} />
                <p className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>参考图上传（可选，本系列独立）</p>
                {activeSeries.refImage ? (
                  <div className="relative inline-block">
                    <img src={activeSeries.refImage} alt="参考图" className="w-32 h-32 rounded-lg object-cover" />
                    <button className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-pointer" style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--ink)' }} onClick={() => updateActive('refImage', null)}>x</button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer inline-block" style={{ borderColor: 'var(--border)' }} onClick={() => refInputRef.current?.click()}>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>点击上传参考图</p>
                  </div>
                )}
                <input ref={refInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (v) => updateActive('refImage', v))} />
              </GlassCard>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>2</span>
                    <h3 className="font-bold" style={{ color: 'var(--ink)' }}>角色/元素</h3>
                  </div>
                  <input type="text" placeholder="如：骷髅头、初音未来..." value={activeSeries.characters} onChange={(e) => updateActive('characters', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none input-glow" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }} />
                </GlassCard>
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>3</span>
                    <h3 className="font-bold" style={{ color: 'var(--ink)' }}>标志性符号</h3>
                  </div>
                  <input type="text" placeholder="如：闪电、樱花、十字架..." value={activeSeries.signatureSymbol} onChange={(e) => updateActive('signatureSymbol', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none input-glow" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)' }} />
                </GlassCard>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>4</span>
                    <h3 className="font-bold" style={{ color: 'var(--ink)' }}>主色板</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {PALETTE_PRESETS.map((p, pi) => (
                      <div key={pi} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => updateActive('palette', p)}>
                        <div className="flex gap-0.5 p-1 rounded-lg border-2 transition-all" style={{ borderColor: activeSeries.palette === p ? 'var(--accent-gold)' : 'var(--border)', boxShadow: activeSeries.palette === p ? '0 0 12px rgba(212, 168, 83, 0.3)' : 'none' }}>
                          {p.slice(0, 3).map((color: string, ci: number) => (
                            <div key={ci} className="w-5 h-5 rounded" style={{ background: color }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>5</span>
                    <h3 className="font-bold" style={{ color: 'var(--ink)' }}>风格标签</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {STYLE_TAGS.map((tag: string) => (
                      <Tag key={tag} active={activeSeries.styleTags.includes(tag)} onClick={() => toggleTag(tag, activeSeries.styleTags, (v) => updateActive('styleTags', v))} size="sm">{tag}</Tag>
                    ))}
                  </div>
                  <p className="text-xs mb-2 font-medium" style={{ color: 'var(--ink-muted)' }}>可选工艺</p>
                  <div className="flex flex-wrap gap-2">
                    {TECHNIQUE_TAGS.map((tag: string) => (
                      <Tag key={tag} active={activeSeries.techniques.includes(tag)} onClick={() => toggleTag(tag, activeSeries.techniques, (v) => updateActive('techniques', v))} size="sm">{tag}</Tag>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </>
          ) : (
            <>
              {/* 自由模式 */}
              <GlassCard className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>1</span>
                  <h3 className="font-bold" style={{ color: 'var(--ink)' }}>效果描述（Prompt）</h3>
                </div>
                <textarea
                  value={activeSeries.promptText}
                  onChange={(e) => updateActive('promptText', e.target.value)}
                  rows={12}
                  placeholder={FREE_PROMPT_TEMPLATE}
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none input-glow resize-y leading-relaxed"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--ink)', fontFamily: 'inherit' }}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--ink-muted)' }}>模板已预填，直接在上面修改/删除/编写即可。</p>
              </GlassCard>

              <GlassCard className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>2</span>
                  <h3 className="font-bold" style={{ color: 'var(--ink)' }}>可选工艺</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TECHNIQUE_TAGS.map((tag: string) => (
                    <Tag key={tag} active={activeSeries.techniques.includes(tag)} onClick={() => toggleTag(tag, activeSeries.techniques, (v) => updateActive('techniques', v))} size="sm">{tag}</Tag>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-gold)', color: '#0a0a0f' }}>3</span>
                  <h3 className="font-bold" style={{ color: 'var(--ink)' }}>参考图（可选）</h3>
                </div>
                {activeSeries.refImage ? (
                  <div className="relative inline-block">
                    <img src={activeSeries.refImage} alt="参考图" className="w-32 h-32 rounded-lg object-cover" />
                    <button className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-pointer" style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--ink)' }} onClick={() => updateActive('refImage', null)}>x</button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer inline-block" style={{ borderColor: 'var(--border)' }} onClick={() => refInputRef.current?.click()}>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>点击上传参考图</p>
                  </div>
                )}
                <input ref={refInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (v) => updateActive('refImage', v))} />
              </GlassCard>
            </>
          )}

          {/* 当前系列生成按钮 */}
          <div className="flex justify-end mb-6">
            <Button variant="glass" onClick={() => handleGenerateSeries(activeSeries.id)}>
              {activeSeries.generated ? '重新生成本系列' : '生成本系列（10指）'}
            </Button>
          </div>

          {/* 本系列 10 指预览 */}
          {activeSeries.generated && (
            <GlassCard className="mb-6">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>{activeSeries.name} · 10 指预览</h3>
              <div className="grid grid-cols-5 gap-3">
                {FINGER_POSITIONS.map((pos, i) => (
                  <div key={pos.key} className="text-center">
                    <div className="aspect-square rounded-lg overflow-hidden mb-1" style={{ background: 'var(--bg-surface)' }}>
                      {activeSeries.nails[i] && <img src={activeSeries.nails[i]} alt={pos.label} className="w-full h-full object-cover" />}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{pos.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* ═══ 组合预览区 ═══ */}
      <GlassCard className="mt-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ink)' }}>组合预览</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--ink-muted)' }}>点击指位，从已生成系列里任选一张图填入。未选的指位默认用第一个已生成系列的同位指甲。</p>

        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* 左手 */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-center" style={{ color: 'var(--ink-secondary)' }}>左手</h4>
            <div className="grid grid-cols-5 gap-3">
              {FINGER_POSITIONS.slice(0, 5).map((pos, i) => {
                const pick = effectiveCombo(pos.key, i);
                const img = getThumbForPick(pick);
                return (
                  <button key={pos.key} className="text-center cursor-pointer" onClick={() => setPickerFor(pos.key)}>
                    <div className="aspect-square rounded-lg overflow-hidden mb-1 border-2" style={{ borderColor: combo[pos.key] ? 'var(--accent-gold)' : 'var(--border)', background: 'var(--bg-surface)' }}>
                      {img ? <img src={img} alt={pos.label} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--ink-muted)' }}>+</div>}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{pos.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
          {/* 右手 */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-center" style={{ color: 'var(--ink-secondary)' }}>右手</h4>
            <div className="grid grid-cols-5 gap-3">
              {FINGER_POSITIONS.slice(5).map((pos, i) => {
                const idx = i + 5;
                const pick = effectiveCombo(pos.key, idx);
                const img = getThumbForPick(pick);
                return (
                  <button key={pos.key} className="text-center cursor-pointer" onClick={() => setPickerFor(pos.key)}>
                    <div className="aspect-square rounded-lg overflow-hidden mb-1 border-2" style={{ borderColor: combo[pos.key] ? 'var(--accent-gold)' : 'var(--border)', background: 'var(--bg-surface)' }}>
                      {img ? <img src={img} alt={pos.label} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--ink-muted)' }}>+</div>}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{pos.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="gold" size="lg" onClick={handleGenerateFinal}>生成我的痛甲</Button>
        </div>
      </GlassCard>

      {/* ═══ 指位选择弹窗 ═══ */}
      {pickerFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setPickerFor(null)}>
          <div className="rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold" style={{ color: 'var(--ink)' }}>选择图片 · {FINGER_POSITIONS.find((p) => p.key === pickerFor)?.label}</h3>
              <button className="text-sm" style={{ color: 'var(--ink-muted)' }} onClick={() => setPickerFor(null)}>关闭</button>
            </div>
            {seriesList.filter((s) => s.generated).length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--ink-muted)' }}>还没有已生成的系列，请先生成一个系列。</p>
            ) : (
              <div className="space-y-4">
                {seriesList.filter((s) => s.generated).map((s) => (
                  <div key={s.id}>
                    <p className="text-xs font-bold mb-2" style={{ color: 'var(--accent-gold)' }}>{s.name}</p>
                    <div className="grid grid-cols-5 gap-2">
                      {FINGER_POSITIONS.map((pos, ni) => (
                        <button
                          key={pos.key}
                          className="cursor-pointer rounded-lg overflow-hidden border-2"
                          style={{ borderColor: 'var(--border)' }}
                          onClick={() => {
                            setCombo((prev) => ({ ...prev, [pickerFor]: { seriesId: s.id, nailIndex: ni } }));
                            setPickerFor(null);
                          }}
                        >
                          <div className="aspect-square" style={{ background: 'var(--bg-surface)' }}>
                            {s.nails[ni] && <img src={s.nails[ni]} alt={pos.label} className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-[10px] py-0.5" style={{ color: 'var(--ink-muted)' }}>{pos.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {/* 清除选择 */}
                <button
                  className="w-full py-2 rounded-lg text-sm border"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)' }}
                  onClick={() => {
                    setCombo((prev) => ({ ...prev, [pickerFor]: null }));
                    setPickerFor(null);
                  }}
                >恢复默认</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ 手部照片选择弹窗 ═══ */}
      {handPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setHandPicker(null)}>
          <div className="rounded-xl p-6 max-w-xl w-full mx-4 max-h-[80vh] overflow-y-auto" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold" style={{ color: 'var(--ink)' }}>选择{handPicker === 'left' ? '左手' : '右手'}照片</h3>
              <button className="text-sm" style={{ color: 'var(--ink-muted)' }} onClick={() => setHandPicker(null)}>关闭</button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                className="flex-1 py-2 rounded-lg text-sm border-2 border-dashed"
                style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
                onClick={() => {
                  setNewForSide(handPicker);
                  setTimeout(() => newHandInputRef.current?.click(), 0);
                }}
              >+ 现在拍/传一张新的</button>
            </div>

            {(handPicker === 'left' ? leftPhotos : rightPhotos).length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: 'var(--ink-muted)' }}>还没有历史照片，请先拍/传一张</p>
            ) : (
              <>
                <p className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>从历史照片中选择：</p>
                <div className="grid grid-cols-3 gap-3">
                  {(handPicker === 'left' ? leftPhotos : rightPhotos).map((p) => {
                    const selected = (handPicker === 'left' ? selectedLeftHandId : selectedRightHandId) === p.id;
                    return (
                      <button
                        key={p.id}
                        className="cursor-pointer rounded-lg overflow-hidden border-2"
                        style={{ borderColor: selected ? 'var(--accent-gold)' : 'var(--border)' }}
                        onClick={() => {
                          if (handPicker === 'left') setSelectedLeftHand(p.id);
                          else setSelectedRightHand(p.id);
                          setHandPicker(null);
                        }}
                      >
                        <img src={p.image} alt="" className="w-full aspect-square object-cover" />
                        <p className="text-[10px] py-0.5" style={{ color: 'var(--ink-muted)' }}>
                          {new Date(p.takenAt).toLocaleDateString()}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {/* 取消选用 */}
                <button
                  className="w-full mt-4 py-2 rounded-lg text-sm border"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)' }}
                  onClick={() => {
                    if (handPicker === 'left') setSelectedLeftHand(null);
                    else setSelectedRightHand(null);
                    setHandPicker(null);
                  }}
                >取消选用</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 新拍手部照片的隐藏 input */}
      <input
        ref={newHandInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleNewHandUpload}
      />
    </div>
  );
}
