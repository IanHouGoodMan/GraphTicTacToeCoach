import { useMemo, useState } from 'react';
import {
  BOAT_CAP, TOTAL_BIG, TOTAL_KID,
  buildGraph, goalState, initialState, key, legalMoves, rb, rk,
  shortestPath, tryMove, type State
} from '../engine/riverCrossing';

// 大人和小朋友过河
// - 一条小船最多坐 2 个人
// - 任何一岸如果有大人，「小朋友的人数」就不能超过「大人的人数」（小朋友太多会调皮）
// - 目标：把所有人都送到右岸

export default function RiverCrossingPage() {
  const graph = useMemo(() => buildGraph(), []);
  const optimal = useMemo(() => shortestPath(graph) ?? [], [graph]);

  const [history, setHistory] = useState<State[]>([initialState]);
  const [boatSel, setBoatSel] = useState<{ b: number; k: number }>({ b: 0, k: 0 });
  const [message, setMessage] = useState<{ kind: 'info' | 'good' | 'bad'; text: string } | null>(null);

  const current = history[history.length - 1];
  const reachedGoal = current.lb === goalState.lb && current.lk === goalState.lk && current.boat === goalState.boat;
  const moves = useMemo(() => legalMoves(current), [current]);

  function reset() {
    setHistory([initialState]);
    setBoatSel({ b: 0, k: 0 });
    setMessage(null);
  }
  function undo() {
    if (history.length <= 1) return;
    setHistory(history.slice(0, -1));
    setBoatSel({ b: 0, k: 0 });
    setMessage(null);
  }

  function rowAt(side: 'L' | 'R') {
    return side === 'L'
      ? { bigs: current.lb, kids: current.lk }
      : { bigs: rb(current), kids: rk(current) };
  }

  function adjustBoat(kind: 'b' | 'k', delta: number) {
    setBoatSel(prev => {
      const next = { ...prev, [kind]: Math.max(0, prev[kind] + delta) };
      if (next.b + next.k > BOAT_CAP) return prev;
      const fromSide = rowAt(current.boat);
      if (next.b > fromSide.bigs) return prev;
      if (next.k > fromSide.kids) return prev;
      return next;
    });
    setMessage(null);
  }

  function go() {
    const total = boatSel.b + boatSel.k;
    if (total === 0) {
      setMessage({ kind: 'bad', text: '小船里至少要有 1 个人才能划走哦～' }); return;
    }
    if (total > BOAT_CAP) {
      setMessage({ kind: 'bad', text: `小船最多坐 ${BOAT_CAP} 个人。` }); return;
    }
    const next = tryMove(current, boatSel.b, boatSel.k);
    if (!next) {
      setMessage({ kind: 'bad', text: '这么走完之后，会有一岸的「小朋友比大人还多」，不行哦～' });
      return;
    }
    setHistory([...history, next]);
    setBoatSel({ b: 0, k: 0 });
    setMessage(null);
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">第 4 课 · 把生活问题变成图</p>
        <h1>过河问题：3 个大人 + 3 个小朋友 🚣</h1>
        <p className="lead">
          有 3 个<strong>大人</strong>和 3 个<strong>小朋友</strong>要过河，只有一条小船，
          最多坐 <strong>{BOAT_CAP}</strong> 个人。规则：
          <strong>任何一岸只要有大人，小朋友的人数就不能超过大人</strong>
          （否则小朋友会闹翻天 🙈）。船每次至少要 1 个人划。
        </p>
        <p className="lead">
          这是一个非常经典的「<strong>把现实问题变成图</strong>」的例子：每一种「左岸有几个大人、几个小朋友、船在哪边」就是一张「状态卡」，
          一次合法的划船就把这张卡连到下一张卡。问题就变成「从开局这张卡，沿着边走到目标卡」。
        </p>
      </section>

      <section className="panel">
        <h2>🚣 自己试一试</h2>
        <RiverScene state={current} />

        <div className="river-controls">
          <div className="river-boat">
            <p style={{ margin: 0, fontWeight: 700 }}>
              小船在 <strong>{current.boat === 'L' ? '左' : '右'}岸</strong>。挑一些人上船：
            </p>
            <div className="river-counter">
              <button className="btn outline" onClick={() => adjustBoat('b', -1)} disabled={boatSel.b === 0}>−</button>
              <span>👨 大人 × {boatSel.b}</span>
              <button className="btn outline" onClick={() => adjustBoat('b', +1)}>+</button>
            </div>
            <div className="river-counter">
              <button className="btn outline" onClick={() => adjustBoat('k', -1)} disabled={boatSel.k === 0}>−</button>
              <span>🧒 小朋友 × {boatSel.k}</span>
              <button className="btn outline" onClick={() => adjustBoat('k', +1)}>+</button>
            </div>
            <div className="actions">
              <button className="btn primary" onClick={go} disabled={reachedGoal}>🚣 划过去</button>
              <button className="btn outline" onClick={undo} disabled={history.length <= 1}>↩️ 撤一步</button>
              <button className="btn outline" onClick={reset}>🔄 全部重来</button>
            </div>
            {message && (
              <div className={`guess-result ${message.kind}`}>{message.text}</div>
            )}
            {reachedGoal && (
              <div className="guess-result good">
                🎉 大家都过去了！你用了 <strong>{history.length - 1}</strong> 步。
                数学家可以证明：<strong>最少 11 步</strong> 就能完成。
              </div>
            )}
          </div>

          <LegalMovesPanel moves={moves} />
        </div>

        <div style={{ marginTop: '.6rem' }}>
          <p style={{ fontWeight: 700, margin: '.4rem 0' }}>
            走过的状态（{history.length} 张「状态卡」）：
          </p>
          <div className="state-track">
            {history.map((s, i) => (
              <div key={i} className={'state-card' + (i === history.length - 1 ? ' current' : '')}>
                <div className="state-card-title">{i === 0 ? '开局' : `第 ${i} 步`}</div>
                <StateChip state={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>🗺️ 完整状态图（图论怎么看这个问题）</h2>
        <p className="lead">
          下面这张大图是<strong>所有合法状态</strong>。每个圆圈是一种「左岸有几个大人/几个小朋友 + 船在哪」，
          有连线表示「划一次船就能从一边到另一边」。
          蓝色圆是 <strong>开局</strong>，金色圆是 <strong>目标</strong>。
          你<strong>已经走过的路径</strong>用橘色高亮，<strong>最优最短路径</strong>是 11 步，用淡绿色描出来作参考。
        </p>
        <StateGraphView graph={graph} history={history} optimal={optimal} />
        <p className="proof-note" style={{ marginTop: '.6rem' }}>
          💡 想一想：本来「3 个大人 + 3 个小朋友 + 一条船」听起来很复杂，可是一旦把「状态」画成点、把「划船」画成边，
          它就变成一个我们熟悉的<strong>找最短路径</strong>的图论问题了。这就是数学家解决问题的常用招数：
          <strong>给问题换个表示方式</strong>。
        </p>
      </section>

      <section className="panel">
        <h2>📚 这道题里出现的图论概念</h2>
        <ul>
          <li><strong>状态空间</strong>：所有合法状态合在一起就是 16 张状态卡，正好是图的 16 个点。</li>
          <li><strong>连通性</strong>：从开局出发能不能走到目标？这等于问「目标点和开局点连通吗？」答案是：连通。</li>
          <li><strong>最短路径</strong>：用 <strong>BFS（广度优先搜索）</strong>从开局向外一层层扩展，第一次碰到目标时的步数就是最短步数。</li>
          <li><strong>有向 / 无向</strong>：这道题里每一步都可以撤回，所以可以当成<strong>无向图</strong>。</li>
          <li><strong>加权图</strong>：如果不同的「划船」有不同代价（比如划得久、划得短），就要给边加上权重，最短路径就要用 Dijkstra 这种算法了。</li>
        </ul>
        <p className="lead">
          <em>数学家莱布尼茨说过：「别吵了，把意见写下来，算一算就知道结果。」</em>
          这道题就是这样：把「过河怎么走」写成图，让数学帮我们一步步算清楚。
        </p>
      </section>
    </>
  );
}

function RiverScene({ state }: { state: State }) {
  return (
    <div className="river-scene" aria-label="过河场景">
      <div className="river-bank river-bank-l">
        <div className="river-bank-title">左岸</div>
        <BankPeople bigs={state.lb} kids={state.lk} />
      </div>
      <div className={'river-water ' + (state.boat === 'L' ? 'boat-left' : 'boat-right')}>
        <div className="river-boat-icon">🚣</div>
      </div>
      <div className="river-bank river-bank-r">
        <div className="river-bank-title">右岸</div>
        <BankPeople bigs={rb(state)} kids={rk(state)} />
      </div>
    </div>
  );
}

function BankPeople({ bigs, kids }: { bigs: number; kids: number }) {
  return (
    <div className="river-people">
      {Array.from({ length: bigs }, (_, i) => <span key={'b' + i} className="person big">👨</span>)}
      {Array.from({ length: kids }, (_, i) => <span key={'k' + i} className="person kid">🧒</span>)}
      {bigs === 0 && kids === 0 && <span className="person empty">（空）</span>}
    </div>
  );
}

function StateChip({ state }: { state: State }) {
  return (
    <div className="state-chip">
      <div className="state-chip-row">
        <span title="左岸大人">👨×{state.lb}</span>
        <span title="左岸小朋友">🧒×{state.lk}</span>
      </div>
      <div className="state-chip-mid">{state.boat === 'L' ? '🚣 ⇠' : '⇢ 🚣'}</div>
      <div className="state-chip-row">
        <span title="右岸大人">👨×{rb(state)}</span>
        <span title="右岸小朋友">🧒×{rk(state)}</span>
      </div>
    </div>
  );
}

function LegalMovesPanel({ moves }: { moves: { b: number; k: number; next: State }[] }) {
  return (
    <div className="river-legal">
      <p style={{ margin: 0, fontWeight: 700 }}>当前可以这样划：</p>
      {moves.length === 0 && <p>这一步好像谁都不能走了…试试 ↩️ 撤一步。</p>}
      <ul style={{ paddingLeft: '1.1rem', margin: '.3rem 0' }}>
        {moves.map((m, i) => (
          <li key={i}>
            带 <strong>{m.b}</strong> 个大人 + <strong>{m.k}</strong> 个小朋友划过去
          </li>
        ))}
      </ul>
      <p className="proof-note" style={{ margin: 0, fontSize: '.8rem' }}>
        每一种合法划船，都是图里从「当前点」到下一个点的一条边。
      </p>
    </div>
  );
}

// ===== 状态图可视化（按 BFS 层次摆放） =====
function StateGraphView({
  graph,
  history,
  optimal
}: {
  graph: ReturnType<typeof buildGraph>;
  history: State[];
  optimal: State[];
}) {
  const W = 720, H = 420;
  const PAD_X = 60, PAD_Y = 50;

  const positions = useMemo(() => {
    const pos = new Map<string, { x: number; y: number }>();
    const layers = graph.layers;
    const colCount = layers.length;
    layers.forEach((layer, ci) => {
      const x = PAD_X + (colCount === 1 ? 0 : (W - 2 * PAD_X) * ci / (colCount - 1));
      layer.forEach((nodeIdx, ri) => {
        const n = layer.length;
        const y = PAD_Y + (n === 1 ? (H - 2 * PAD_Y) / 2 : (H - 2 * PAD_Y) * ri / (n - 1));
        pos.set(key(graph.nodes[nodeIdx]), { x, y });
      });
    });
    return pos;
  }, [graph]);

  const historyKeys = new Set(history.map(key));
  const historyEdgeSet = new Set<string>();
  for (let i = 1; i < history.length; i++) {
    const a = key(history[i - 1]); const b = key(history[i]);
    historyEdgeSet.add(a < b ? `${a}|${b}` : `${b}|${a}`);
  }
  const optimalKeys = new Set(optimal.map(key));
  const optimalEdgeSet = new Set<string>();
  for (let i = 1; i < optimal.length; i++) {
    const a = key(optimal[i - 1]); const b = key(optimal[i]);
    optimalEdgeSet.add(a < b ? `${a}|${b}` : `${b}|${a}`);
  }

  return (
    <div className="state-graph-stage">
      <svg viewBox={`0 0 ${W} ${H}`}>
        {graph.edges.map((e, i) => {
          const a = graph.nodes[e.a]; const b = graph.nodes[e.b];
          const pa = positions.get(key(a))!; const pb = positions.get(key(b))!;
          const k1 = key(a), k2 = key(b);
          const eKey = k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
          const isHist = historyEdgeSet.has(eKey);
          const isOpt = optimalEdgeSet.has(eKey);
          let stroke = '#d6c7a8', sw = 1.5, opacity = 0.55;
          if (isOpt) { stroke = '#69db7c'; sw = 3; opacity = 0.85; }
          if (isHist) { stroke = '#ff7e5f'; sw = 4; opacity = 1; }
          return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                       stroke={stroke} strokeWidth={sw} opacity={opacity} />;
        })}
        {graph.nodes.map((n, i) => {
          const p = positions.get(key(n))!;
          const isStart = key(n) === key(initialState);
          const isGoal = key(n) === key(goalState);
          const isOnHist = historyKeys.has(key(n));
          const isOnOpt = optimalKeys.has(key(n));
          let fill = '#fffaf0', stroke = '#a08a5a';
          if (isOnOpt) { fill = '#ebfbee'; stroke = '#2b8a3e'; }
          if (isOnHist) { fill = '#fff1ea'; stroke = '#ff7e5f'; }
          if (isStart) { fill = '#e7f5ff'; stroke = '#1864ab'; }
          if (isGoal) { fill = '#fff3a3'; stroke = '#b46a1a'; }
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={20} fill={fill} stroke={stroke} strokeWidth={2} />
              <text x={p.x} y={p.y - 2} textAnchor="middle" fontSize="9" fontWeight="700" fill="#3a2c1f">
                {n.lb}/{n.lk}
              </text>
              <text x={p.x} y={p.y + 9} textAnchor="middle" fontSize="9" fill="#6b5a43">
                {n.boat === 'L' ? '🚣⇠' : '⇢🚣'}
              </text>
            </g>
          );
        })}
        <text x={PAD_X} y={H - 12} fontSize="11" fill="#6b5a43">
          每个圆圈：左岸大人 / 左岸小朋友（船在哪边）。共 {graph.nodes.length} 个合法状态。
        </text>
      </svg>
      <div className="legend" style={{ marginTop: '.4rem' }}>
        <span><span className="dot" style={{ background: '#1864ab' }} /> 开局</span>
        <span><span className="dot" style={{ background: '#b46a1a' }} /> 目标</span>
        <span><span className="dot" style={{ background: '#ff7e5f' }} /> 你走过的路径</span>
        <span><span className="dot" style={{ background: '#69db7c' }} /> 最短路径（11 步）</span>
        <span>共 {TOTAL_BIG} 个大人 + {TOTAL_KID} 个小朋友</span>
      </div>
    </div>
  );
}

// 状态图按 BFS 层次摆放
