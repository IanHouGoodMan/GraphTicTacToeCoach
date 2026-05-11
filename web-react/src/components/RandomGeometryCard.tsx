import { useMemo } from 'react';

type SceneKey =
  | 'skateboard'
  | 'plushDog'
  | 'blackSofa'
  | 'paris'
  | 'hokkaido'
  | 'tokyo'
  | 'kyoto'
  | 'amsterdam'
  | 'cologne'
  | 'dusseldorf'
  | 'yuDafuNight'
  | 'arabidopsisLab'
  | 'schoolBike'
  | 'liBai'
  | 'suDongpo';

interface Scene {
  key: SceneKey;
  title: string;
  note: string;
  bg: string;
  accent: string;
  render: (accent: string) => JSX.Element;
}

function citySun(x: number, y: number, color = '#f59e0b') {
  return <circle cx={x} cy={y} r="16" fill={color} opacity="0.9" />;
}

const scenes: Scene[] = [
  {
    key: 'skateboard',
    title: '滑滑板',
    note: '速度、平衡和几何弧线',
    bg: '#eef2ff',
    accent: '#4f46e5',
    render: accent => (
      <>
        <circle cx="82" cy="72" r="24" fill="#f97316" />
        <rect x="70" y="94" width="84" height="12" rx="6" fill={accent} transform="rotate(-10 112 100)" />
        <circle cx="88" cy="112" r="7" fill="#111827" />
        <circle cx="143" cy="103" r="7" fill="#111827" />
        <path d="M84 82 L111 96 L137 76" fill="none" stroke="#111827" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="82" cy="68" r="10" fill="#facc15" />
        <path d="M146 55 C170 70 180 96 170 116" fill="none" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'plushDog',
    title: '宜家风狗布娃娃',
    note: '柔软的形状，也能被拆成圆和椭圆',
    bg: '#f8fafc',
    accent: '#0f766e',
    render: accent => (
      <>
        <ellipse cx="112" cy="100" rx="50" ry="34" fill="#e5e7eb" />
        <circle cx="82" cy="70" r="26" fill="#f3f4f6" />
        <ellipse cx="63" cy="64" rx="13" ry="24" fill="#94a3b8" transform="rotate(-18 63 64)" />
        <ellipse cx="101" cy="65" rx="13" ry="24" fill="#94a3b8" transform="rotate(18 101 65)" />
        <circle cx="74" cy="70" r="3" fill="#111827" />
        <circle cx="91" cy="70" r="3" fill="#111827" />
        <circle cx="82" cy="80" r="5" fill="#111827" />
        <rect x="78" y="126" width="18" height="32" rx="9" fill="#cbd5e1" />
        <rect x="132" y="126" width="18" height="32" rx="9" fill="#cbd5e1" />
        <circle cx="154" cy="92" r="9" fill={accent} />
      </>
    ),
  },
  {
    key: 'blackSofa',
    title: '黑色三人皮沙发',
    note: '三个座位，三个相邻节点',
    bg: '#f1f5f9',
    accent: '#111827',
    render: accent => (
      <>
        <rect x="44" y="86" width="136" height="46" rx="8" fill={accent} />
        <rect x="38" y="74" width="148" height="32" rx="10" fill="#1f2937" />
        <rect x="52" y="84" width="36" height="44" rx="6" fill="#111827" stroke="#334155" />
        <rect x="94" y="84" width="36" height="44" rx="6" fill="#111827" stroke="#334155" />
        <rect x="136" y="84" width="36" height="44" rx="6" fill="#111827" stroke="#334155" />
        <rect x="34" y="96" width="18" height="38" rx="8" fill="#0f172a" />
        <rect x="172" y="96" width="18" height="38" rx="8" fill="#0f172a" />
        <rect x="56" y="133" width="18" height="12" rx="3" fill="#475569" />
        <rect x="150" y="133" width="18" height="12" rx="3" fill="#475569" />
      </>
    ),
  },
  {
    key: 'paris',
    title: '法国巴黎',
    note: '铁塔、桥和塞纳河',
    bg: '#eef6ff',
    accent: '#2563eb',
    render: accent => (
      <>
        {citySun(166, 52, '#f97316')}
        <path d="M112 42 L78 142 H146 Z" fill="none" stroke={accent} strokeWidth="6" strokeLinejoin="round" />
        <path d="M94 84 H130 M88 110 H136" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <rect x="36" y="138" width="152" height="10" rx="5" fill="#38bdf8" />
        <path d="M48 132 C68 116 88 116 108 132 C128 116 148 116 168 132" fill="none" stroke="#0f172a" strokeWidth="4" />
      </>
    ),
  },
  {
    key: 'hokkaido',
    title: '日本北海道',
    note: '雪山、农田和宽阔天空',
    bg: '#ecfeff',
    accent: '#0891b2',
    render: accent => (
      <>
        {citySun(172, 48, '#facc15')}
        <path d="M38 128 L82 58 L126 128 Z" fill="#c7d2fe" />
        <path d="M78 64 L92 88 L68 88 Z" fill="#ffffff" />
        <path d="M102 128 L142 74 L184 128 Z" fill="#93c5fd" />
        <path d="M140 78 L154 96 L126 96 Z" fill="#ffffff" />
        <rect x="34" y="130" width="154" height="18" fill="#a7f3d0" />
        <path d="M44 148 H178" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'tokyo',
    title: '东京',
    note: '高楼、列车和清晰的秩序',
    bg: '#f5f3ff',
    accent: '#7c3aed',
    render: accent => (
      <>
        {citySun(176, 44, '#fb7185')}
        <rect x="44" y="72" width="24" height="70" fill="#334155" />
        <rect x="78" y="52" width="30" height="90" fill={accent} />
        <rect x="120" y="82" width="28" height="60" fill="#0f766e" />
        <rect x="156" y="64" width="22" height="78" fill="#475569" />
        <rect x="36" y="134" width="150" height="18" rx="9" fill="#e2e8f0" />
        <rect x="52" y="138" width="72" height="10" rx="5" fill="#38bdf8" />
        <circle cx="58" cy="148" r="4" fill="#111827" />
        <circle cx="116" cy="148" r="4" fill="#111827" />
      </>
    ),
  },
  {
    key: 'kyoto',
    title: '京都',
    note: '鸟居、石径和安静的庭院',
    bg: '#fff7ed',
    accent: '#dc2626',
    render: accent => (
      <>
        <rect x="56" y="56" width="112" height="12" rx="2" fill={accent} />
        <rect x="66" y="42" width="92" height="10" rx="2" fill={accent} />
        <rect x="72" y="68" width="12" height="78" fill={accent} />
        <rect x="140" y="68" width="12" height="78" fill={accent} />
        <path d="M42 150 C70 130 154 130 182 150" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        <circle cx="48" cy="76" r="14" fill="#84cc16" />
        <circle cx="178" cy="86" r="18" fill="#22c55e" />
      </>
    ),
  },
  {
    key: 'amsterdam',
    title: '荷兰阿姆斯特丹',
    note: '运河、窄房子和自行车',
    bg: '#ecfeff',
    accent: '#0e7490',
    render: accent => (
      <>
        <rect x="42" y="70" width="26" height="58" fill="#f97316" />
        <path d="M42 70 L55 52 L68 70 Z" fill="#7c2d12" />
        <rect x="76" y="60" width="26" height="68" fill="#0369a1" />
        <path d="M76 60 L89 42 L102 60 Z" fill="#0f172a" />
        <rect x="110" y="76" width="26" height="52" fill="#65a30d" />
        <path d="M110 76 L123 58 L136 76 Z" fill="#365314" />
        <path d="M34 138 C62 130 92 146 124 138 C148 132 166 134 190 140" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />
        <circle cx="88" cy="146" r="8" fill="none" stroke="#111827" strokeWidth="3" />
        <circle cx="124" cy="146" r="8" fill="none" stroke="#111827" strokeWidth="3" />
        <path d="M88 146 L104 132 L124 146 M104 132 H118" stroke="#111827" strokeWidth="3" fill="none" />
      </>
    ),
  },
  {
    key: 'cologne',
    title: '德国科隆',
    note: '双塔大教堂和莱茵河',
    bg: '#f8fafc',
    accent: '#475569',
    render: accent => (
      <>
        <path d="M70 142 V66 L88 38 L106 66 V142" fill="none" stroke={accent} strokeWidth="6" strokeLinejoin="round" />
        <path d="M118 142 V66 L136 38 L154 66 V142" fill="none" stroke={accent} strokeWidth="6" strokeLinejoin="round" />
        <rect x="96" y="92" width="32" height="50" fill="#cbd5e1" stroke={accent} strokeWidth="4" />
        <path d="M36 152 C70 140 112 160 188 146" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'dusseldorf',
    title: '德国杜塞尔多夫',
    note: '莱茵塔、河岸和现代街区',
    bg: '#f1f5f9',
    accent: '#0f766e',
    render: accent => (
      <>
        <rect x="106" y="42" width="12" height="104" rx="6" fill={accent} />
        <circle cx="112" cy="68" r="18" fill="#38bdf8" stroke="#0f172a" strokeWidth="3" />
        <rect x="42" y="92" width="36" height="52" fill="#94a3b8" />
        <rect x="148" y="104" width="32" height="40" fill="#cbd5e1" />
        <path d="M36 152 C72 138 110 158 184 144" fill="none" stroke="#0891b2" strokeWidth="7" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'yuDafuNight',
    title: '郁达夫：春风沉醉的晚上',
    note: '夜色、窗光和一阵春风',
    bg: '#eef2ff',
    accent: '#312e81',
    render: accent => (
      <>
        <rect x="42" y="62" width="68" height="88" rx="4" fill={accent} />
        <rect x="58" y="78" width="16" height="18" fill="#fde68a" />
        <rect x="82" y="78" width="16" height="18" fill="#fef3c7" />
        <circle cx="164" cy="54" r="18" fill="#fef3c7" />
        <path d="M126 94 C150 76 170 84 186 66" fill="none" stroke="#0f766e" strokeWidth="5" strokeLinecap="round" />
        <path d="M120 120 C144 104 168 112 188 94" fill="none" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" />
        <path d="M54 150 H178" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'arabidopsisLab',
    title: '拟南芥实验室',
    note: '基因实验里的小小植物模型',
    bg: '#f0fdf4',
    accent: '#15803d',
    render: accent => (
      <>
        <rect x="48" y="126" width="128" height="18" rx="4" fill="#cbd5e1" />
        <rect x="60" y="80" width="32" height="48" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <rect x="132" y="70" width="28" height="58" rx="6" fill="#ecfccb" stroke={accent} strokeWidth="3" />
        <path d="M112 132 C108 106 110 82 112 56" stroke={accent} strokeWidth="4" fill="none" />
        <ellipse cx="98" cy="86" rx="18" ry="8" fill="#22c55e" transform="rotate(-25 98 86)" />
        <ellipse cx="126" cy="82" rx="18" ry="8" fill="#16a34a" transform="rotate(25 126 82)" />
        <ellipse cx="104" cy="62" rx="12" ry="6" fill="#84cc16" transform="rotate(-20 104 62)" />
        <ellipse cx="122" cy="58" rx="12" ry="6" fill="#65a30d" transform="rotate(20 122 58)" />
        <circle cx="152" cy="52" r="9" fill="#f97316" />
      </>
    ),
  },
  {
    key: 'schoolBike',
    title: '妈妈骑车送小朋友上学',
    note: '中间小座位，是每天的温柔路径',
    bg: '#eff6ff',
    accent: '#2563eb',
    render: accent => (
      <>
        <circle cx="66" cy="138" r="18" fill="none" stroke="#111827" strokeWidth="5" />
        <circle cx="154" cy="138" r="18" fill="none" stroke="#111827" strokeWidth="5" />
        <path d="M66 138 L100 98 L124 138 H66 M100 98 H134 L154 138" fill="none" stroke={accent} strokeWidth="5" strokeLinejoin="round" />
        <path d="M134 98 L150 82" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
        <circle cx="96" cy="62" r="11" fill="#f59e0b" />
        <path d="M96 74 L106 100 L86 114" stroke="#111827" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="116" cy="84" r="8" fill="#fb7185" />
        <rect x="108" y="94" width="18" height="20" rx="5" fill="#fb7185" />
        <rect x="106" y="106" width="24" height="8" rx="4" fill="#0f172a" />
      </>
    ),
  },
  {
    key: 'liBai',
    title: '李白',
    note: '月亮、酒壶和一笔长诗',
    bg: '#f8fafc',
    accent: '#1d4ed8',
    render: accent => (
      <>
        <circle cx="164" cy="50" r="22" fill="#fef3c7" />
        <path d="M92 66 C82 92 82 126 96 150 H130 C142 122 138 90 122 66 Z" fill="#dbeafe" stroke={accent} strokeWidth="4" />
        <circle cx="108" cy="54" r="14" fill="#facc15" />
        <path d="M90 48 C104 34 124 38 132 52" fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
        <path d="M136 102 C158 94 172 108 178 126" fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
        <rect x="154" y="118" width="18" height="26" rx="6" fill="#94a3b8" />
        <path d="M46 142 C72 128 98 132 120 144" fill="none" stroke="#0f766e" strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'suDongpo',
    title: '苏东坡',
    note: '竹、月、清风和从容的线条',
    bg: '#f0fdf4',
    accent: '#166534',
    render: accent => (
      <>
        <circle cx="166" cy="48" r="18" fill="#fef3c7" />
        <path d="M54 150 C68 110 66 72 58 44" stroke={accent} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M80 150 C92 104 88 74 82 48" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="72" cy="76" rx="24" ry="7" fill="#22c55e" transform="rotate(-24 72 76)" />
        <ellipse cx="94" cy="96" rx="24" ry="7" fill="#16a34a" transform="rotate(24 94 96)" />
        <path d="M118 72 C106 100 106 126 120 150 H148 C158 120 150 94 138 72 Z" fill="#dcfce7" stroke={accent} strokeWidth="4" />
        <circle cx="128" cy="58" r="12" fill="#facc15" />
        <path d="M42 152 H180" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
];

export default function RandomGeometryCard() {
  const scene = useMemo(() => scenes[Math.floor(Math.random() * scenes.length)], []);

  return (
    <figure className="random-geometry-card" aria-label={`随机几何图案：${scene.title}`}>
      <svg className="geo-art" viewBox="0 0 224 176" role="img" aria-labelledby={`geo-title-${scene.key}`}>
        <title id={`geo-title-${scene.key}`}>{scene.title}</title>
        <rect x="0" y="0" width="224" height="176" rx="0" fill={scene.bg} />
        <circle cx="28" cy="30" r="8" fill={scene.accent} opacity="0.28" />
        <rect x="188" y="126" width="18" height="18" fill={scene.accent} opacity="0.22" transform="rotate(12 197 135)" />
        <path d="M20 154 H204" stroke="#0f172a" strokeWidth="2" opacity="0.08" />
        {scene.render(scene.accent)}
      </svg>
      <figcaption>
        <strong>{scene.title}</strong>
        <span>{scene.note}</span>
      </figcaption>
    </figure>
  );
}
