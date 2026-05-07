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
const minIntervalSeconds = 2;
const maxIntervalSeconds = 30;

export default function FloatingBalloons() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('graph-coach-balloons') !== 'off';
  });
  const [intervalSeconds, setIntervalSeconds] = useState(() => {
    if (typeof window === 'undefined') return 10;
    return clampInterval(Number(window.localStorage.getItem('graph-coach-balloon-interval') ?? 10));
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
    window.localStorage.setItem('graph-coach-balloon-interval', String(intervalSeconds));
  }, [intervalSeconds]);

  useEffect(() => {
    if (!enabled) {
      clearTimer(spawnTimer);
      clearTimer(popTimer);
      setBalloon(null);
      setPop(null);
      return;
    }

    if (balloon || spawnTimer.current !== null) return;

    const delay = started.current ? getSpawnDelay(intervalSeconds) : randomInt(1800, 4200);
    started.current = true;
    spawnTimer.current = window.setTimeout(() => {
      spawnTimer.current = null;
      setBalloon({
        id: Date.now(),
        x: randomInt(12, 88),
        color: pick(balloonColors),
        duration: randomInt(19000, 26000),
        size: randomInt(58, 78)
      });
    }, delay);

    return () => clearTimer(spawnTimer);
  }, [enabled, balloon, pop, intervalSeconds]);

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
      <div className="balloon-controls">
        <button
          className={'balloon-toggle' + (enabled ? ' on' : '')}
          type="button"
          onClick={() => setEnabled(v => !v)}
          aria-pressed={enabled}
          title={enabled ? '关闭气球飘飘' : '打开气球飘飘'}
        >
          🎈 {enabled ? '气球开' : '气球关'}
        </button>
        <label className="balloon-interval-control">
          <span>间隔 {intervalSeconds} 秒</span>
          <input
            type="range"
            min={minIntervalSeconds}
            max={maxIntervalSeconds}
            value={intervalSeconds}
            onChange={event => setIntervalSeconds(clampInterval(Number(event.currentTarget.value)))}
            aria-label="调整气球出现间隔"
          />
        </label>
      </div>

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

function clampInterval(value: number) {
  if (!Number.isFinite(value)) return 10;
  return Math.min(maxIntervalSeconds, Math.max(minIntervalSeconds, Math.round(value)));
}

function getSpawnDelay(intervalSeconds: number) {
  const base = intervalSeconds * 1000;
  const wobble = base * 0.1;
  return randomInt(Math.round(base - wobble), Math.round(base + wobble));
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function Illustration({ item }: { item: Moment }) {
  if (item.kind === 'scene') return <Scene scene={item.scene} />;
  return <QuoteAvatar item={item} />;
}

function QuoteAvatar({ item }: { item: QuoteMoment }) {
  return (
    <div className="balloon-quote-moment">
      <p className="balloon-quote-text">“{item.text}”</p>
      <Avatar people={item.people} />
    </div>
  );
}

function Avatar({ people }: { people: PeopleKind }) {
  if (people === 'mom-sister') {
    return (
      <svg className="balloon-pop-art" viewBox="0 0 240 170" role="img" aria-label="家庭卡通头像">
        <rect width="240" height="170" rx="22" fill="#fff3d6" />
        <SinglePerson x={78} y={90} skin="#ffd8b5" hair="#2f241c" shirt="#212529" kind="mom" />
        <SinglePerson x={162} y={90} skin="#ffd8b5" hair="#3a2418" shirt="#f8f9fa" kind="sister" />
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
        hair={people === 'dad' ? '#1f1a17' : people === 'sister' ? '#3a2418' : '#2f241c'}
        shirt={people === 'dad' ? '#f8f9fa' : people === 'mom' ? '#212529' : people === 'sister' ? '#f8f9fa' : '#f7e6d0'}
        kind={people}
      />
    </svg>
  );
}

function SinglePerson({ x, y, skin, hair, shirt, kind }: { x: number; y: number; skin: string; hair: string; shirt: string; kind: PeopleKind }) {
  const faceWidth = kind === 'dad' ? 50 : kind === 'sister' ? 46 : 42;
  return (
    <g>
      {kind === 'little' && (
        <>
          <ellipse cx={x - 36} cy={y - 13} rx="15" ry="22" fill={hair} />
          <ellipse cx={x + 36} cy={y - 13} rx="15" ry="22" fill={hair} />
          <path d={`M${x - 47} ${y - 5} q-15 22 1 36`} stroke={hair} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d={`M${x + 47} ${y - 5} q15 22 -1 36`} stroke={hair} strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx={x - 47} cy={y - 4} r="4" fill="#ff7e9f" />
          <circle cx={x + 47} cy={y - 4} r="4" fill="#ff7e9f" />
        </>
      )}
      {kind === 'sister' && (
        <>
          <ellipse cx={x + 34} cy={y - 24} rx="16" ry="27" fill={hair} />
          <path d={`M${x + 44} ${y - 28} q17 -10 27 1`} stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx={x + 25} cy={y - 29} r="4" fill="#adb5bd" />
        </>
      )}
      {kind === 'mom' && (
        <>
          <ellipse cx={x + 31} cy={y - 18} rx="14" ry="27" fill={hair} />
          <path d={`M${x + 39} ${y - 25} q16 -8 26 4`} stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx={x + 22} cy={y - 29} r="4" fill="#74c0fc" />
        </>
      )}
      <path d={`M${x - 48} ${y + 58} q48 -45 96 0 v20 h-96z`} fill={shirt} />
      {kind === 'little' && (
        <g opacity=".9" stroke="#c7a17a" strokeWidth="1.5">
          <path d={`M${x - 32} ${y + 43} v35 M${x} ${y + 35} v43 M${x + 32} ${y + 43} v35`} />
          <path d={`M${x - 44} ${y + 56} h88 M${x - 46} ${y + 69} h92`} />
        </g>
      )}
      {kind === 'mom' && (
        <g>
          <rect x={x - 45} y={y + 39} width="30" height="22" rx="3" fill="#ffe8a3" stroke="#6b4f1f" strokeWidth="2" />
          <path d={`M${x - 40} ${y + 47} h20 M${x - 40} ${y + 54} h15`} stroke="#6b4f1f" strokeWidth="1.7" strokeLinecap="round" />
          <path d={`M${x + 31} ${y + 39} l22 -14`} stroke="#6b4f1f" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {kind === 'sister' && (
        <g>
          <path d={`M${x - 42} ${y + 45} q13 -9 26 0 v27 h-26z`} fill="#74c0fc" opacity=".9" />
          <path d={`M${x - 36} ${y + 42} q-8 11 -7 29`} stroke="#495057" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x={x + 19} y={y + 43} width="24" height="18" rx="3" fill="#dbeafe" stroke="#1864ab" strokeWidth="2" />
          <path d={`M${x + 23} ${y + 51} h16`} stroke="#1864ab" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}
      <ellipse cx={x} cy={y - 22} rx={faceWidth / 2 + 7} ry="31" fill={hair} />
      {kind === 'dad' && (
        <>
          <rect x={x - 31} y={y - 55} width="62" height="25" rx="12" fill={hair} />
          <path d={`M${x - 29} ${y - 43} q29 -18 58 0`} stroke="#0f0d0b" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      )}
      <ellipse cx={x} cy={y - 16} rx={faceWidth / 2} ry="31" fill={skin} />
      {kind === 'mom' && (
        <>
          <path d={`M${x - 27} ${y - 38} q27 -28 54 0 q-18 -10 -54 0`} fill={hair} />
          <path d={`M${x - 15} ${y - 43} q5 18 -4 29 M${x - 3} ${y - 45} q4 17 -4 28 M${x + 9} ${y - 43} q2 16 -5 27`} stroke={hair} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {kind === 'little' && (
        <>
          <path d={`M${x - 28} ${y - 39} q28 -27 56 0 q-20 -10 -56 0`} fill={hair} />
          <path d={`M${x - 17} ${y - 42} q8 18 -3 30 M${x - 2} ${y - 44} q5 17 -5 30 M${x + 12} ${y - 41} q3 15 -5 27`} stroke={hair} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {kind === 'sister' && (
        <>
          <path d={`M${x - 32} ${y - 43} q34 -24 66 8 q-18 -8 -66 -8`} fill={hair} />
          <path d={`M${x - 18} ${y - 45} q6 19 -4 31 M${x - 4} ${y - 47} q5 18 -4 31 M${x + 10} ${y - 44} q4 17 -5 29`} stroke={hair} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {(kind === 'dad' || kind === 'sister') && <Glasses x={x} y={y - 15} />}
      <circle cx={x - 11} cy={y - 17} r="2.4" fill="#2f2620" />
      <circle cx={x + 11} cy={y - 17} r="2.4" fill="#2f2620" />
      {kind === 'dad' && <path d={`M${x - 12} ${y - 26} q7 -4 14 0 M${x + 10} ${y - 26} q7 -4 14 0`} stroke="#2f2620" strokeWidth="2" fill="none" strokeLinecap="round" />}
      <path d={`M${x - 10} ${y + 2} q10 9 20 0`} stroke="#a14c00" strokeWidth="3" fill="none" strokeLinecap="round" />
      {kind === 'sister' && <circle cx={x + 18} cy={y + 13} r="1.8" fill="#5c2b16" />}
      {kind === 'mom' && <path d={`M${x - 33} ${y - 20} q-8 35 9 57`} stroke={hair} strokeWidth="8" fill="none" strokeLinecap="round" />}
    </g>
  );
}

function Glasses({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke="#343a40" strokeWidth="2">
      <circle cx={x - 12} cy={y} r="8.5" />
      <circle cx={x + 12} cy={y} r="8.5" />
      <path d={`M${x - 3.5} ${y} h7`} />
      <path d={`M${x - 20.5} ${y - 1} h-8 M${x + 20.5} ${y - 1} h8`} strokeLinecap="round" />
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
      return <g><rect x="38" y="52" width="58" height="74" rx="8" fill="#f8f9fa" stroke="#6b4f1f" strokeWidth="3" /><path d="M32 57 h70 l-12 -20 h-46z" fill="#ffd97d" stroke="#6b4f1f" strokeWidth="3" /><circle cx="178" cy="72" r="30" fill="#ff6b6b" opacity=".25" /><circle cx="178" cy="72" r="20" fill="none" stroke="#c92a2a" strokeWidth="4" opacity=".65" /><circle cx="178" cy="72" r="8" fill="#ff8787" opacity=".9" /></g>;
    case 'tokyo':
      return <g><circle cx="190" cy="35" r="15" fill="#ffd43b" /><path d="M55 126 L75 42 L95 126" fill="none" stroke="#e8590c" strokeWidth="7" strokeLinecap="round" /><path d="M45 78 h60 M38 106 h74" stroke="#e8590c" strokeWidth="5" strokeLinecap="round" /><rect x="144" y="78" width="52" height="48" fill="#bde0fe" stroke="#1864ab" strokeWidth="3" /></g>;
    case 'hiking':
      return <g><circle cx="200" cy="35" r="15" fill="#ffd43b" /><path d="M0 126 L62 62 L108 126 Z" fill="#95d5b2" /><path d="M54 70 l10 22 l12 -22" fill="#fff" /><path d="M86 126 L152 52 L220 126 Z" fill="#74c69d" /><path d="M143 62 l13 26 l16 -26" fill="#fff" /></g>;
    case 'english-class':
      return <g><rect x="32" y="35" width="176" height="82" rx="8" fill="#2b8a3e" /><path d="M62 63 h96 M62 82 h120 M62 101 h74" stroke="#d8f3dc" strokeWidth="5" strokeLinecap="round" opacity=".9" /><circle cx="178" cy="63" r="10" fill="none" stroke="#fff" strokeWidth="3" /><path d="M174 78 l9 0 l-5 10 z" fill="#fff" opacity=".85" /></g>;
    case 'coding-night':
      return <g><circle cx="202" cy="32" r="13" fill="#ffd43b" /><circle cx="198" cy="28" r="13" fill="#1b263b" /><rect x="44" y="48" width="152" height="82" rx="8" fill="#0b132b" stroke="#74c0fc" strokeWidth="3" /><path d="M78 76 l-18 14 l18 14 M162 76 l18 14 l-18 14 M112 69 l-18 46" stroke="#95d5b2" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="130" cy="91" r="5" fill="#ffd43b" /></g>;
    case 'heidegger':
      return <g><circle cx="198" cy="35" r="13" fill="#ffd43b" /><rect x="58" y="46" width="78" height="90" rx="6" fill="#f8f1e4" stroke="#d6c7a8" strokeWidth="3" /><path d="M75 70 h44 M75 86 h34 M75 102 h40 M75 118 h28" stroke="#6b5a43" strokeWidth="4" strokeLinecap="round" opacity=".75" /><path d="M67 50 v82" stroke="#d6c7a8" strokeWidth="3" /></g>;
    case 'hiphop':
      return <g><circle cx="190" cy="37" r="16" fill="#ffd43b" /><path d="M24 126 q40 -52 86 0 t98 0" fill="none" stroke="#b197fc" strokeWidth="8" strokeLinecap="round" /><circle cx="86" cy="60" r="15" fill="none" stroke="#d6336c" strokeWidth="5" /><circle cx="142" cy="58" r="15" fill="none" stroke="#d6336c" strokeWidth="5" /><path d="M101 60 h26 M86 45 q24 -24 56 -2" stroke="#d6336c" strokeWidth="5" fill="none" strokeLinecap="round" /></g>;
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
