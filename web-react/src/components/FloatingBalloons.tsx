import { useEffect, useRef, useState } from 'react';

type QuoteMoment = {
  kind: 'quote';
  text: string;
  people: PeopleKind;
};

type SceneMoment = {
  kind: 'scene';
  scene: SceneKind;
};

type Moment = QuoteMoment | SceneMoment;

type PeopleKind = 'little' | 'sister' | 'mom' | 'mom-sister' | 'dad';
type SceneKind = 'paris' | 'hokkaido' | 'osaka' | 'tokyo' | 'hiking' | 'english-class' | 'coding-night' | 'heidegger' | 'hiphop';

type BalloonState = {
  id: number;
  x: number;
  color: string;
  duration: number;
  size: number;
};

type PopState = {
  id: number;
  x: number;
  item: Moment;
};

const moments: Moment[] = [
  { kind: 'quote', text: '有道理，有道理', people: 'little' },
  { kind: 'quote', text: '春风沉醉的晚上，他从我读初二就开始讲，讲到现在', people: 'sister' },
  { kind: 'quote', text: '怎么有点扯，能从这个扯到那个？', people: 'mom-sister' },
  { kind: 'quote', text: '孩子的屁你都觉得是香的啦', people: 'mom' },
  { kind: 'quote', text: '维特根斯坦，看了一半怎么只讲一个人，另一个人呢？', people: 'little' },
  { kind: 'scene', scene: 'paris' },
  { kind: 'scene', scene: 'hokkaido' },
  { kind: 'scene', scene: 'osaka' },
  { kind: 'scene', scene: 'tokyo' },
  { kind: 'scene', scene: 'hiking' },
  { kind: 'scene', scene: 'english-class' },
  { kind: 'scene', scene: 'coding-night' },
  { kind: 'scene', scene: 'heidegger' },
  { kind: 'quote', text: '要认真读书', people: 'dad' },
  { kind: 'quote', text: '优秀', people: 'dad' },
  { kind: 'quote', text: '请阅郁达夫', people: 'dad' },
  { kind: 'quote', text: '请阅读哲学', people: 'dad' },
  { kind: 'quote', text: '变形记', people: 'dad' },
  { kind: 'scene', scene: 'hiphop' }
];

const balloonColors = ['#ff7e9f', '#ffd166', '#74c0fc', '#95d5b2', '#b197fc', '#ffb86b'];

export default function FloatingBalloons() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('graph-coach-balloons') !== 'off';
  });
  const [balloon, setBalloon] = useState<BalloonState | null>(null);
  const [pop, setPop] = useState<PopState | null>(null);
  const started = useRef(false);
  const spawnTimer = useRef<number | null>(null);
  const popTimer = useRef<number | null>(null);

  useEffect(() => {
    window.localStorage.setItem('graph-coach-balloons', enabled ? 'on' : 'off');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      clearTimer(spawnTimer);
      clearTimer(popTimer);
      setBalloon(null);
      setPop(null);
      return;
    }

    if (balloon || pop || spawnTimer.current !== null) return;

    const delay = started.current ? randomInt(8000, 14000) : randomInt(1800, 4200);
    started.current = true;
    spawnTimer.current = window.setTimeout(() => {
      spawnTimer.current = null;
      setBalloon({
        id: Date.now(),
        x: randomInt(12, 88),
        color: pick(balloonColors),
        duration: randomInt(13000, 18000),
        size: randomInt(58, 78)
      });
    }, delay);

    return () => clearTimer(spawnTimer);
  }, [enabled, balloon, pop]);

  useEffect(() => {
    if (!balloon) return;
    const timer = window.setTimeout(() => setBalloon(null), balloon.duration + 800);
    return () => window.clearTimeout(timer);
  }, [balloon]);

  useEffect(() => () => {
    clearTimer(spawnTimer);
    clearTimer(popTimer);
  }, []);

  const puncture = () => {
    if (!balloon) return;
    const item = pick(moments);
    setPop({ id: balloon.id, x: balloon.x, item });
    setBalloon(null);
    clearTimer(popTimer);
    popTimer.current = window.setTimeout(() => {
      popTimer.current = null;
      setPop(null);
    }, 4300);
  };

  return (
    <div className="balloon-layer" aria-live="polite">
      <button
        className={'balloon-toggle' + (enabled ? ' on' : '')}
        type="button"
        onClick={() => setEnabled(v => !v)}
        aria-pressed={enabled}
        title={enabled ? '关闭气球飘飘' : '打开气球飘飘'}
      >
        🎈 {enabled ? '气球开' : '气球关'}
      </button>

      {enabled && balloon && (
        <button
          className="floating-balloon"
          type="button"
          onClick={puncture}
          aria-label="戳破气球"
          style={{
            left: `${balloon.x}%`,
            width: balloon.size,
            height: balloon.size * 1.18,
            '--balloon-color': balloon.color,
            '--float-duration': `${balloon.duration}ms`
          } as React.CSSProperties}
        >
          <span className="balloon-shine" />
          <span className="balloon-knot" />
          <span className="balloon-string" />
        </button>
      )}

      {enabled && pop && (
        <aside className="balloon-pop-card" style={{ left: `clamp(1rem, ${pop.x}%, calc(100vw - 19rem))` }}>
          <Illustration item={pop.item} />
        </aside>
      )}
    </div>
  );
}

function clearTimer(timer: React.MutableRefObject<number | null>) {
  if (timer.current !== null) {
    window.clearTimeout(timer.current);
    timer.current = null;
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function Illustration({ item }: { item: Moment }) {
  if (item.kind === 'scene') return <Scene scene={item.scene} />;
  return <Avatar people={item.people} />;
}

function Avatar({ people }: { people: PeopleKind }) {
  if (people === 'mom-sister') {
    return (
      <svg className="balloon-pop-art" viewBox="0 0 240 170" role="img" aria-label="家庭卡通头像">
        <rect width="240" height="170" rx="22" fill="#fff3d6" />
        <SinglePerson x={78} y={90} skin="#ffd8b5" hair="#3a2c1f" shirt="#dbeafe" kind="mom" />
        <SinglePerson x={162} y={90} skin="#ffd8b5" hair="#2b2118" shirt="#fde2e4" kind="sister" />
      </svg>
    );
  }

  return (
    <svg className="balloon-pop-art" viewBox="0 0 240 170" role="img" aria-label="家庭卡通头像">
      <rect width="240" height="170" rx="22" fill={people === 'dad' ? '#e7f5ff' : people === 'mom' ? '#eaf7ea' : '#fff3d6'} />
      <SinglePerson
        x={120}
        y={88}
        skin="#ffd8b5"
        hair={people === 'dad' ? '#2f2620' : '#3a2c1f'}
        shirt={people === 'dad' ? '#6c757d' : people === 'mom' ? '#b7e4c7' : people === 'sister' ? '#ffd6e0' : '#ffd97d'}
        kind={people}
      />
    </svg>
  );
}

function SinglePerson({ x, y, skin, hair, shirt, kind }: { x: number; y: number; skin: string; hair: string; shirt: string; kind: PeopleKind }) {
  const faceWidth = kind === 'dad' || kind === 'sister' ? 48 : 42;
  return (
    <g>
      {kind === 'little' && (
        <>
          <circle cx={x - 38} cy={y - 14} r="17" fill={hair} />
          <circle cx={x + 38} cy={y - 14} r="17" fill={hair} />
          <path d={`M${x - 54} ${y - 12} q-12 18 2 30`} stroke="#d6336c" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d={`M${x + 54} ${y - 12} q12 18 -2 30`} stroke="#d6336c" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      {kind === 'sister' && <ellipse cx={x + 35} cy={y - 22} rx="18" ry="26" fill={hair} />}
      <path d={`M${x - 48} ${y + 58} q48 -45 96 0 v20 h-96z`} fill={shirt} />
      <ellipse cx={x} cy={y - 22} rx={faceWidth / 2 + 7} ry="31" fill={hair} />
      {kind === 'dad' && <rect x={x - 30} y={y - 54} width="60" height="25" rx="12" fill={hair} />}
      <ellipse cx={x} cy={y - 16} rx={faceWidth / 2} ry="31" fill={skin} />
      {kind === 'mom' && <path d={`M${x - 27} ${y - 38} q27 -30 54 0 q-18 -10 -54 0`} fill={hair} />}
      {kind === 'little' && <path d={`M${x - 28} ${y - 39} q28 -27 56 0 q-20 -10 -56 0`} fill={hair} />}
      {kind === 'sister' && <path d={`M${x - 32} ${y - 43} q34 -24 66 8 q-18 -8 -66 -8`} fill={hair} />}
      {(kind === 'dad' || kind === 'sister') && <Glasses x={x} y={y - 15} />}
      <circle cx={x - 11} cy={y - 17} r="2.4" fill="#2f2620" />
      <circle cx={x + 11} cy={y - 17} r="2.4" fill="#2f2620" />
      <path d={`M${x - 10} ${y + 2} q10 9 20 0`} stroke="#a14c00" strokeWidth="3" fill="none" strokeLinecap="round" />
      {kind === 'mom' && <path d={`M${x - 33} ${y - 20} q-8 35 9 57`} stroke={hair} strokeWidth="8" fill="none" strokeLinecap="round" />}
    </g>
  );
}

function Glasses({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke="#343a40" strokeWidth="2.2">
      <circle cx={x - 12} cy={y} r="8" />
      <circle cx={x + 12} cy={y} r="8" />
      <path d={`M${x - 4} ${y} h8`} />
    </g>
  );
}

function Scene({ scene }: { scene: SceneKind }) {
  return (
    <svg className="balloon-pop-art" viewBox="0 0 240 170" role="img" aria-label="家庭回忆场景图">
      <rect width="240" height="170" rx="22" fill={sceneBackground(scene)} />
      <SceneBackdrop scene={scene} />
      <ScenePerson scene={scene} />
    </svg>
  );
}

function sceneBackground(scene: SceneKind) {
  if (scene === 'coding-night' || scene === 'heidegger') return '#1b263b';
  if (scene === 'hokkaido') return '#e7f5ff';
  if (scene === 'hiking') return '#eaf7ea';
  return '#fff3d6';
}

function SceneBackdrop({ scene }: { scene: SceneKind }) {
  switch (scene) {
    case 'paris':
      return <g><circle cx="192" cy="35" r="16" fill="#ffd43b" /><path d="M52 126 L92 34 L132 126 M74 78 h36 M64 104 h56" stroke="#6b4f1f" strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M42 126 h100" stroke="#6b4f1f" strokeWidth="6" strokeLinecap="round" /></g>;
    case 'hokkaido':
      return <g><path d="M0 110 q60 -55 120 0 t120 0 v60 h-240z" fill="#bde0fe" /><path d="M0 118 q65 -38 120 0 t120 0 v52 h-240z" fill="#ffffff" /><circle cx="198" cy="35" r="15" fill="#ffd43b" /></g>;
    case 'osaka':
      return <g><rect x="38" y="52" width="58" height="74" rx="8" fill="#f8f9fa" stroke="#6b4f1f" strokeWidth="3" /><path d="M32 57 h70 l-12 -20 h-46z" fill="#ffd97d" stroke="#6b4f1f" strokeWidth="3" /><circle cx="178" cy="72" r="30" fill="#ff6b6b" opacity=".25" /><text x="177" y="80" textAnchor="middle" fontSize="24" fontWeight="900" fill="#c92a2a">大阪</text></g>;
    case 'tokyo':
      return <g><circle cx="190" cy="35" r="15" fill="#ffd43b" /><path d="M55 126 L75 42 L95 126" fill="none" stroke="#e8590c" strokeWidth="7" strokeLinecap="round" /><path d="M45 78 h60 M38 106 h74" stroke="#e8590c" strokeWidth="5" strokeLinecap="round" /><rect x="144" y="78" width="52" height="48" fill="#bde0fe" stroke="#1864ab" strokeWidth="3" /></g>;
    case 'hiking':
      return <g><circle cx="200" cy="35" r="15" fill="#ffd43b" /><path d="M0 126 L62 62 L108 126 Z" fill="#95d5b2" /><path d="M54 70 l10 22 l12 -22" fill="#fff" /><path d="M86 126 L152 52 L220 126 Z" fill="#74c69d" /><path d="M143 62 l13 26 l16 -26" fill="#fff" /></g>;
    case 'english-class':
      return <g><rect x="32" y="35" width="176" height="82" rx="8" fill="#2b8a3e" /><text x="120" y="72" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">English</text><text x="120" y="99" textAnchor="middle" fontSize="16" fill="#d8f3dc">A B C</text></g>;
    case 'coding-night':
      return <g><circle cx="202" cy="32" r="13" fill="#ffd43b" /><circle cx="198" cy="28" r="13" fill="#1b263b" /><rect x="44" y="48" width="152" height="82" rx="8" fill="#0b132b" stroke="#74c0fc" strokeWidth="3" /><text x="120" y="82" textAnchor="middle" fontSize="16" fill="#95d5b2">&lt;code /&gt;</text><text x="120" y="106" textAnchor="middle" fontSize="12" fill="#ffd43b">late night</text></g>;
    case 'heidegger':
      return <g><circle cx="198" cy="35" r="13" fill="#ffd43b" /><rect x="58" y="46" width="78" height="90" rx="6" fill="#f8f1e4" stroke="#d6c7a8" strokeWidth="3" /><text x="97" y="82" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3a2c1f">海德格尔</text><text x="97" y="106" textAnchor="middle" fontSize="11" fill="#6b5a43">Being</text></g>;
    case 'hiphop':
      return <g><circle cx="190" cy="37" r="16" fill="#ffd43b" /><path d="M24 126 q40 -52 86 0 t98 0" fill="none" stroke="#b197fc" strokeWidth="8" strokeLinecap="round" /><text x="120" y="62" textAnchor="middle" fontSize="24" fontWeight="900" fill="#d6336c">HIPHOP</text></g>;
  }
}

function ScenePerson({ scene }: { scene: SceneKind }) {
  if (scene === 'coding-night' || scene === 'heidegger') {
    return <SinglePerson x={168} y={104} skin="#ffd8b5" hair="#2f2620" shirt="#6c757d" kind="dad" />;
  }
  if (scene === 'hiking' || scene === 'english-class') {
    return <SinglePerson x={174} y={104} skin="#ffd8b5" hair="#3a2c1f" shirt={scene === 'hiking' ? '#ffb86b' : '#dbeafe'} kind="mom" />;
  }
  return <SinglePerson x={170} y={104} skin="#ffd8b5" hair="#2b2118" shirt={scene === 'hiphop' ? '#b197fc' : '#ffd6e0'} kind="sister" />;
}
