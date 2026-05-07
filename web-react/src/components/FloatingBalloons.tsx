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
type SceneKind = 'paris' | 'hokkaido' | 'osaka' | 'tokyo' | 'hiking' | 'english-class' | 'coding-night' | 'heidegger' | 'nietzsche' | 'philosophy100' | 'life-book' | 'achang' | 'yugu-juan' | 'poetry-life' | 'suxin' | 'composition' | 'plant-lab' | 'math-wu' | 'three-hum' | 'ah-chang-ending' | 'yu-dafu-journey' | 'dad-talk-mom-snore' | 'mom-cooking' | 'mom-roses' | 'hiphop' | 'skateboard';

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
  { kind: 'scene', scene: 'nietzsche' },
  { kind: 'scene', scene: 'philosophy100' },
  { kind: 'scene', scene: 'life-book' },
  { kind: 'scene', scene: 'achang' },
  { kind: 'scene', scene: 'yugu-juan' },
  { kind: 'scene', scene: 'poetry-life' },
  { kind: 'scene', scene: 'suxin' },
  { kind: 'scene', scene: 'composition' },
  { kind: 'scene', scene: 'plant-lab' },
  { kind: 'scene', scene: 'math-wu' },
  { kind: 'scene', scene: 'three-hum' },
  { kind: 'scene', scene: 'ah-chang-ending' },
  { kind: 'scene', scene: 'yu-dafu-journey' },
  { kind: 'scene', scene: 'dad-talk-mom-snore' },
  { kind: 'scene', scene: 'mom-cooking' },
  { kind: 'scene', scene: 'mom-roses' },
  { kind: 'quote', text: '要认真读书', people: 'dad' },
  { kind: 'quote', text: '优秀', people: 'dad' },
  { kind: 'quote', text: '请阅读郁达夫', people: 'dad' },
  { kind: 'quote', text: '请阅读哲学', people: 'dad' },
  { kind: 'quote', text: '阅读好的书，听到了人话，再次回到了温暖的人间', people: 'dad' },
  { kind: 'quote', text: '变形记', people: 'dad' },
  { kind: 'scene', scene: 'hiphop' },
  { kind: 'scene', scene: 'skateboard' }
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
  const nextMomentIndex = useRef(0);
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
    const item = moments[nextMomentIndex.current];
    nextMomentIndex.current = (nextMomentIndex.current + 1) % moments.length;
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

function SinglePerson({ x, y, skin, hair, shirt, kind, roleProps = true }: { x: number; y: number; skin: string; hair: string; shirt: string; kind: PeopleKind; roleProps?: boolean }) {
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
      {kind === 'mom' && roleProps && (
        <g>
          <rect x={x - 45} y={y + 39} width="30" height="22" rx="3" fill="#ffe8a3" stroke="#6b4f1f" strokeWidth="2" />
          <path d={`M${x - 40} ${y + 47} h20 M${x - 40} ${y + 54} h15`} stroke="#6b4f1f" strokeWidth="1.7" strokeLinecap="round" />
          <path d={`M${x + 31} ${y + 39} l22 -14`} stroke="#6b4f1f" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {kind === 'sister' && roleProps && (
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
  if (scene === 'coding-night' || scene === 'heidegger' || scene === 'nietzsche' || isDadReadingScene(scene)) return '#1b263b';
  if (scene === 'hokkaido' || scene === 'plant-lab') return '#e7f5ff';
  if (scene === 'hiking' || scene === 'skateboard' || scene === 'mom-cooking' || scene === 'mom-roses') return '#eaf7ea';
  return '#fff3d6';
}

function SceneBackdrop({ scene }: { scene: SceneKind }) {
  switch (scene) {
    case 'paris':
      return <g><circle cx="192" cy="35" r="16" fill="#ffd43b" /><path d="M52 126 L92 34 L132 126 M74 78 h36 M64 104 h56" stroke="#6b4f1f" strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M42 126 h100" stroke="#6b4f1f" strokeWidth="6" strokeLinecap="round" /><text x="90" y="145" textAnchor="middle" fontSize="16" fontWeight="900" fill="#6b4f1f">Paris</text></g>;
    case 'hokkaido':
      return <g><path d="M0 110 q60 -55 120 0 t120 0 v60 h-240z" fill="#bde0fe" /><path d="M0 118 q65 -38 120 0 t120 0 v52 h-240z" fill="#ffffff" /><circle cx="198" cy="35" r="15" fill="#ffd43b" /><text x="90" y="145" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1864ab">Hokkaido</text></g>;
    case 'osaka':
      return <g><rect x="38" y="52" width="58" height="74" rx="8" fill="#f8f9fa" stroke="#6b4f1f" strokeWidth="3" /><path d="M32 57 h70 l-12 -20 h-46z" fill="#ffd97d" stroke="#6b4f1f" strokeWidth="3" /><circle cx="178" cy="72" r="30" fill="#ff6b6b" opacity=".25" /><circle cx="178" cy="72" r="20" fill="none" stroke="#c92a2a" strokeWidth="4" opacity=".65" /><circle cx="178" cy="72" r="8" fill="#ff8787" opacity=".9" /><text x="68" y="144" textAnchor="middle" fontSize="16" fontWeight="900" fill="#c92a2a">Osaka 大阪</text></g>;
    case 'tokyo':
      return <g><circle cx="190" cy="35" r="15" fill="#ffd43b" /><path d="M55 126 L75 42 L95 126" fill="none" stroke="#e8590c" strokeWidth="7" strokeLinecap="round" /><path d="M45 78 h60 M38 106 h74" stroke="#e8590c" strokeWidth="5" strokeLinecap="round" /><rect x="144" y="78" width="52" height="48" fill="#bde0fe" stroke="#1864ab" strokeWidth="3" /><text x="75" y="145" textAnchor="middle" fontSize="17" fontWeight="900" fill="#e8590c">Tokyo</text></g>;
    case 'hiking':
      return <g><circle cx="200" cy="35" r="15" fill="#ffd43b" /><path d="M0 126 L62 62 L108 126 Z" fill="#95d5b2" /><path d="M54 70 l10 22 l12 -22" fill="#fff" /><path d="M86 126 L152 52 L220 126 Z" fill="#74c69d" /><path d="M143 62 l13 26 l16 -26" fill="#fff" /><text x="68" y="145" textAnchor="middle" fontSize="16" fontWeight="900" fill="#2b8a3e">Hiking</text></g>;
    case 'english-class':
      return <g><rect x="24" y="30" width="154" height="78" rx="8" fill="#2b8a3e" /><text x="92" y="56" textAnchor="middle" fontSize="17" fontWeight="900" fill="#fff">English Class</text><path d="M48 76 h86 M48 94 h58" stroke="#d8f3dc" strokeWidth="5" strokeLinecap="round" opacity=".9" /><rect x="34" y="126" width="42" height="15" rx="4" fill="#ffd8a8" stroke="#8a6a3a" strokeWidth="2" /><rect x="88" y="126" width="42" height="15" rx="4" fill="#ffd8a8" stroke="#8a6a3a" strokeWidth="2" /><path d="M152 76 l24 -16" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></g>;
    case 'coding-night':
      return <g><circle cx="202" cy="32" r="13" fill="#ffd43b" /><circle cx="198" cy="28" r="13" fill="#1b263b" /><rect x="44" y="48" width="152" height="82" rx="8" fill="#0b132b" stroke="#74c0fc" strokeWidth="3" /><text x="120" y="68" textAnchor="middle" fontSize="13" fontWeight="900" fill="#ffd43b">late night</text><path d="M78 83 l-18 14 l18 14 M162 83 l18 14 l-18 14 M112 76 l-18 46" stroke="#95d5b2" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="130" cy="98" r="5" fill="#ffd43b" /></g>;
    case 'heidegger':
      return <g><circle cx="198" cy="35" r="13" fill="#ffd43b" /><rect x="48" y="44" width="88" height="92" rx="6" fill="#f8f1e4" stroke="#d6c7a8" strokeWidth="3" /><text x="92" y="72" textAnchor="middle" fontSize="14" fontWeight="900" fill="#3a2c1f">Heidegger</text><text x="92" y="95" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1864ab">Being</text><path d="M66 113 h52 M66 126 h38" stroke="#6b5a43" strokeWidth="4" strokeLinecap="round" opacity=".7" /><path d="M58 50 v82" stroke="#d6c7a8" strokeWidth="3" /></g>;
    case 'nietzsche':
      return <g><circle cx="198" cy="35" r="13" fill="#ffd43b" /><path d="M22 128 L76 58 L122 128 Z" fill="#495057" /><path d="M70 64 l8 23 l14 -23" fill="#f8f9fa" opacity=".9" /><rect x="54" y="44" width="92" height="92" rx="6" fill="#fff4d6" stroke="#d6c7a8" strokeWidth="3" /><text x="100" y="69" textAnchor="middle" fontSize="14" fontWeight="900" fill="#3a2c1f">Nietzsche</text><text x="100" y="94" textAnchor="middle" fontSize="18" fontWeight="900" fill="#c92a2a">OVERMAN</text><path d="M92 103 l-10 19 l18 -9 l-9 18 l24 -30" stroke="#ffd43b" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M64 50 v82" stroke="#d6c7a8" strokeWidth="3" /></g>;
    case 'philosophy100':
      return <BookBackdrop lines={['哲学的', '100个基本']} accent="#74c0fc" />;
    case 'life-book':
      return <BookBackdrop lines={['WHAT DO', 'YOU WANT', 'OUT OF LIFE']} accent="#ffd43b" english />;
    case 'achang':
      return <BookBackdrop lines={['阿长与', '山海经']} accent="#ffb86b" />;
    case 'yugu-juan':
      return <BookBackdrop lines={['与古为徒', '娟娟发屋']} accent="#b197fc" />;
    case 'poetry-life':
      return <BookBackdrop lines={['人间烟火', '皆是诗']} accent="#95d5b2" />;
    case 'suxin':
      return <BookBackdrop lines={['苏辛词说']} accent="#ff7e9f" />;
    case 'composition':
      return <LittleBookBackdrop lines={['如何写好', '作文']} accent="#ffb86b" note="日本作者" />;
    case 'plant-lab':
      return <g><rect x="24" y="38" width="150" height="84" rx="8" fill="#f8f9fa" stroke="#74c0fc" strokeWidth="3" /><text x="99" y="60" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1864ab">Plant Gene Edit</text><path d="M50 92 c16 -28 34 -28 50 0 c16 -28 34 -28 50 0" stroke="#845ef7" strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M56 76 h16 M76 91 h16 M101 76 h16 M121 91 h16" stroke="#845ef7" strokeWidth="3" strokeLinecap="round" /><rect x="34" y="124" width="156" height="10" rx="4" fill="#adb5bd" /><path d="M54 124 v-26 M46 98 h16 M50 107 h8" stroke="#2b8a3e" strokeWidth="4" strokeLinecap="round" /><path d="M150 124 v-35 M136 99 q14 -20 28 0 M140 112 q10 -16 22 0" stroke="#2b8a3e" strokeWidth="4" fill="none" strokeLinecap="round" /><text x="72" y="145" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2b8a3e">植物培育</text></g>;
    case 'math-wu':
      return <LittleBookBackdrop lines={['小学数学', '伍鸿熙']} accent="#74c0fc" note="UC Berkeley" thick />;
    case 'three-hum':
      return <g><rect x="38" y="42" width="100" height="86" rx="7" fill="#fff8df" stroke="#d6c7a8" strokeWidth="3" /><path d="M50 49 v74" stroke="#d6c7a8" strokeWidth="3" /><text x="89" y="69" textAnchor="middle" fontSize="16" fontWeight="900" fill="#3a2c1f">朝花夕拾</text><text x="89" y="94" textAnchor="middle" fontSize="15" fontWeight="900" fill="#a14c00">阿长</text><text x="89" y="115" textAnchor="middle" fontSize="15" fontWeight="900" fill="#a14c00">山海经</text><path d="M142 70 q18 -18 36 0 v29 q-18 18 -36 0z" fill="#fff" stroke="#d6336c" strokeWidth="3" /><text x="160" y="91" textAnchor="middle" fontSize="14" fontWeight="900" fill="#d6336c">三哼经</text><text x="70" y="146" textAnchor="middle" fontSize="14" fontWeight="900" fill="#d6336c">妹妹笑了</text></g>;
    case 'ah-chang-ending':
      return <g><rect x="36" y="40" width="106" height="92" rx="7" fill="#fff8df" stroke="#d6c7a8" strokeWidth="3" /><path d="M49 47 v80" stroke="#d6c7a8" strokeWidth="3" /><text x="89" y="64" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3a2c1f">朝花夕拾</text><text x="89" y="86" textAnchor="middle" fontSize="13" fontWeight="900" fill="#a14c00">阿长与</text><text x="89" y="104" textAnchor="middle" fontSize="13" fontWeight="900" fill="#a14c00">山海经</text><path d="M65 119 h48" stroke="#6b5a43" strokeWidth="3" strokeLinecap="round" opacity=".55" /><path d="M154 66 q16 -18 32 0 q16 -18 32 0 q-8 27 -32 42 q-24 -15 -32 -42z" fill="#ffe3ec" stroke="#d6336c" strokeWidth="3" /><path d="M178 108 q-7 12 0 23 q8 -11 0 -23z" fill="#74c0fc" /><text x="76" y="146" textAnchor="middle" fontSize="14" fontWeight="900" fill="#d6336c">几乎要哭了</text></g>;
    case 'yu-dafu-journey':
      return <g><rect x="36" y="42" width="104" height="88" rx="7" fill="#fff8df" stroke="#d6c7a8" strokeWidth="3" /><path d="M49 49 v76" stroke="#d6c7a8" strokeWidth="3" /><text x="88" y="68" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3a2c1f">郁达夫</text><text x="88" y="92" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1864ab">远一程</text><text x="88" y="113" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1864ab">再远一程</text><path d="M150 124 q18 -58 56 -76" stroke="#74c0fc" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="8 8" /><path d="M182 59 l25 -13 l-8 27" fill="none" stroke="#74c0fc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="205" cy="45" r="12" fill="#ffd43b" /><text x="78" y="146" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1864ab">继续远行</text></g>;
    case 'dad-talk-mom-snore':
      return <g><rect x="122" y="95" width="94" height="42" rx="14" fill="#ffd8a8" stroke="#8a6a3a" strokeWidth="3" /><rect x="126" y="82" width="42" height="22" rx="8" fill="#fff3bf" /><path d="M18 48 q19 -19 55 0 v30 q-36 19 -55 0z" fill="#fff" stroke="#6b4f1f" strokeWidth="3" /><text x="45" y="68" textAnchor="middle" fontSize="13" fontWeight="900" fill="#6b4f1f">爸爸说话</text><text x="178" y="62" textAnchor="middle" fontSize="22" fontWeight="900" fill="#845ef7">Zzz</text><text x="176" y="148" textAnchor="middle" fontSize="14" fontWeight="900" fill="#8a6a3a">妈妈打呼噜</text></g>;
    case 'mom-cooking':
      return <g><rect x="28" y="42" width="130" height="78" rx="10" fill="#fff" stroke="#d6c7a8" strokeWidth="3" /><rect x="44" y="88" width="78" height="46" rx="6" fill="#adb5bd" /><circle cx="68" cy="104" r="10" fill="#495057" opacity=".85" /><circle cx="98" cy="104" r="10" fill="#495057" opacity=".85" /><rect x="68" y="74" width="48" height="24" rx="7" fill="#ffd8a8" stroke="#8a6a3a" strokeWidth="3" /><path d="M75 71 h34" stroke="#8a6a3a" strokeWidth="4" strokeLinecap="round" /><path d="M78 66 q-8 -14 3 -24 M96 66 q-8 -14 3 -24 M112 66 q-8 -14 3 -24" stroke="#ced4da" strokeWidth="4" fill="none" strokeLinecap="round" /><text x="70" y="148" textAnchor="middle" fontSize="15" fontWeight="900" fill="#d9480f">妈妈做饭</text></g>;
    case 'mom-roses':
      return <g><path d="M30 127 h180" stroke="#d6c7a8" strokeWidth="8" strokeLinecap="round" /><rect x="28" y="56" width="58" height="70" rx="6" fill="#fff" stroke="#8a6a3a" strokeWidth="3" /><path d="M42 56 v70 M72 56 v70" stroke="#d6c7a8" strokeWidth="2" /><path d="M124 124 l36 -58 M132 128 l47 -56 M140 129 l59 -45" stroke="#2b8a3e" strokeWidth="4" strokeLinecap="round" /><circle cx="161" cy="63" r="8" fill="#e03131" /><circle cx="180" cy="70" r="8" fill="#f03e3e" /><circle cx="199" cy="82" r="8" fill="#c2255c" /><path d="M151 82 q13 -12 26 0 M165 95 q12 -11 24 0" stroke="#2b8a3e" strokeWidth="3" fill="none" strokeLinecap="round" /><text x="76" y="148" textAnchor="middle" fontSize="14" fontWeight="900" fill="#c2255c">买玫瑰回家</text></g>;
    case 'hiphop':
      return <g><circle cx="190" cy="37" r="16" fill="#ffd43b" /><path d="M24 126 q40 -52 86 0 t98 0" fill="none" stroke="#b197fc" strokeWidth="8" strokeLinecap="round" /><text x="118" y="54" textAnchor="middle" fontSize="24" fontWeight="900" fill="#d6336c">HIPHOP</text><circle cx="82" cy="78" r="11" fill="none" stroke="#d6336c" strokeWidth="5" /><circle cx="150" cy="75" r="11" fill="none" stroke="#d6336c" strokeWidth="5" /><path d="M94 78 q26 -22 44 -2" stroke="#d6336c" strokeWidth="5" fill="none" strokeLinecap="round" /><text x="47" y="72" fontSize="22" fontWeight="900" fill="#845ef7">♪</text><text x="184" y="88" fontSize="20" fontWeight="900" fill="#845ef7">♫</text></g>;
    case 'skateboard':
      return <g><circle cx="198" cy="35" r="15" fill="#ffd43b" /><path d="M0 132 h240 v38 h-240z" fill="#b7e4c7" /><path d="M34 123 q42 -32 88 0 t84 0" fill="none" stroke="#74c0fc" strokeWidth="8" strokeLinecap="round" /><text x="64" y="58" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1864ab">SKATE</text><path d="M42 94 h24 M32 109 h36 M176 97 h22" stroke="#74c0fc" strokeWidth="4" strokeLinecap="round" opacity=".75" /><text x="184" y="76" fontSize="18" fontWeight="900" fill="#ff7e9f">✦</text></g>;
  }
}

function BookBackdrop({ lines, accent, english = false }: { lines: string[]; accent: string; english?: boolean }) {
  const fontSize = english ? 12 : lines.length === 1 ? 20 : 17;

  return (
    <g>
      <circle cx="198" cy="35" r="13" fill="#ffd43b" />
      <circle cx="193" cy="31" r="13" fill="#1b263b" />
      <path d="M24 128 q50 -42 100 0 t94 0" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" opacity=".45" />
      <rect x="42" y="42" width="104" height="94" rx="7" fill="#fff8df" stroke="#d6c7a8" strokeWidth="3" />
      <path d="M54 48 v82" stroke="#d6c7a8" strokeWidth="3" />
      <rect x="64" y="56" width="64" height="60" rx="6" fill={accent} opacity=".18" />
      {lines.map((line, index) => (
        <text key={line} x="96" y={74 + index * (english ? 17 : 22)} textAnchor="middle" fontSize={fontSize} fontWeight="900" fill={english ? '#f8f9fa' : '#3a2c1f'}>
          {line}
        </text>
      ))}
      <path d="M70 122 h50" stroke="#6b5a43" strokeWidth="3" strokeLinecap="round" opacity=".55" />
    </g>
  );
}

function LittleBookBackdrop({ lines, accent, note, thick = false }: { lines: string[]; accent: string; note: string; thick?: boolean }) {
  return (
    <g>
      <circle cx="198" cy="35" r="15" fill="#ffd43b" />
      <path d="M24 132 h192" stroke="#d6c7a8" strokeWidth="8" strokeLinecap="round" />
      {thick && <rect x="45" y="51" width="104" height="90" rx="7" fill="#d8e9ff" opacity=".65" />}
      {thick && <rect x="40" y="47" width="104" height="90" rx="7" fill="#edf6ff" opacity=".85" />}
      <rect x="34" y="42" width="104" height="90" rx="7" fill="#fff8df" stroke="#d6c7a8" strokeWidth="3" />
      <path d="M47 48 v78" stroke="#d6c7a8" strokeWidth="3" />
      <rect x="58" y="56" width="62" height="50" rx="6" fill={accent} opacity=".2" />
      {lines.map((line, index) => (
        <text key={line} x="89" y={76 + index * 24} textAnchor="middle" fontSize="18" fontWeight="900" fill="#3a2c1f">
          {line}
        </text>
      ))}
      {note === '日本作者' && <g><circle cx="90" cy="116" r="9" fill="#fff" stroke="#adb5bd" strokeWidth="1.5" /><circle cx="90" cy="116" r="4.3" fill="#e03131" /></g>}
      <text x="89" y="126" textAnchor="middle" fontSize="11" fontWeight="900" fill="#6b5a43">{note}</text>
    </g>
  );
}

function isDadReadingScene(scene: SceneKind) {
  return scene === 'philosophy100' || scene === 'life-book' || scene === 'achang' || scene === 'yugu-juan' || scene === 'poetry-life' || scene === 'suxin';
}

function isLittleReadingScene(scene: SceneKind) {
  return scene === 'composition' || scene === 'math-wu' || scene === 'three-hum' || scene === 'ah-chang-ending' || scene === 'yu-dafu-journey';
}

function ScenePerson({ scene }: { scene: SceneKind }) {
  if (scene === 'dad-talk-mom-snore') {
    return <g><SinglePerson x={70} y={105} skin="#ffd8b5" hair="#2f2620" shirt="#f8f9fa" kind="dad" roleProps={false} /><SinglePerson x={170} y={105} skin="#ffd8b5" hair="#2f241c" shirt="#212529" kind="mom" roleProps={false} /></g>;
  }
  if (scene === 'coding-night' || scene === 'heidegger' || scene === 'nietzsche' || isDadReadingScene(scene)) {
    return <SinglePerson x={168} y={104} skin="#ffd8b5" hair="#2f2620" shirt="#f8f9fa" kind="dad" />;
  }
  if (scene === 'plant-lab') {
    return <SinglePerson x={170} y={104} skin="#ffd8b5" hair="#2b2118" shirt="#dbeafe" kind="sister" />;
  }
  if (scene === 'hiking' || scene === 'english-class' || scene === 'mom-cooking' || scene === 'mom-roses') {
    return <SinglePerson x={174} y={104} skin="#ffd8b5" hair="#3a2c1f" shirt={scene === 'hiking' ? '#ffb86b' : scene === 'english-class' ? '#dbeafe' : '#212529'} kind="mom" roleProps={scene === 'english-class'} />;
  }
  if (scene === 'skateboard') {
    return <SkaterLittlePerson />;
  }
  if (isLittleReadingScene(scene)) {
    return <SinglePerson x={134} y={96} skin="#ffd8b5" hair="#2f241c" shirt="#f7e6d0" kind="little" />;
  }
  return <SinglePerson x={170} y={104} skin="#ffd8b5" hair="#2b2118" shirt={scene === 'hiphop' ? '#b197fc' : '#ffd6e0'} kind="sister" />;
}

function SkaterLittlePerson() {
  const x = 135;
  const y = 75;
  const hair = '#2f241c';
  const skin = '#ffd8b5';

  return (
    <g transform={`rotate(-8 ${x} ${y + 35})`}>
      <ellipse cx={x - 25} cy={y + 4} rx="12" ry="17" fill={hair} />
      <ellipse cx={x + 25} cy={y + 4} rx="12" ry="17" fill={hair} />
      <path d={`M${x - 35} ${y + 8} q-14 16 0 30`} stroke={hair} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d={`M${x + 35} ${y + 8} q14 16 0 30`} stroke={hair} strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx={x - 35} cy={y + 8} r="3.6" fill="#ff7e9f" />
      <circle cx={x + 35} cy={y + 8} r="3.6" fill="#ff7e9f" />
      <ellipse cx={x} cy={y - 2} rx="26" ry="28" fill={hair} />
      <ellipse cx={x} cy={y + 3} rx="19" ry="25" fill={skin} />
      <path d={`M${x - 21} ${y - 19} q21 -21 42 0 q-16 -8 -42 0`} fill={hair} />
      <path d={`M${x - 12} ${y - 22} q6 14 -3 24 M${x + 3} ${y - 23} q5 14 -4 24`} stroke={hair} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx={x - 8} cy={y + 2} r="2.3" fill="#2f2620" />
      <circle cx={x + 8} cy={y + 2} r="2.3" fill="#2f2620" />
      <path d={`M${x - 8} ${y + 17} q8 8 16 0`} stroke="#a14c00" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d={`M${x - 24} ${y + 57} q24 -31 48 0 v26 h-48z`} fill="#f7e6d0" />
      <path d={`M${x - 21} ${y + 58} q-20 12 -34 32 M${x + 21} ${y + 58} q18 -2 34 -22`} stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d={`M${x - 12} ${y + 80} l-18 31 M${x + 12} ${y + 80} l30 22`} stroke="#495057" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d={`M${x - 42} ${y + 116} q38 12 82 0`} stroke="#343a40" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx={x - 28} cy={y + 123} r="5" fill="#495057" />
      <circle cx={x + 27} cy={y + 123} r="5" fill="#495057" />
    </g>
  );
}
