import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BOAT_CAP, TOTAL_BIG, TOTAL_KID,
  buildGraph, goalState, initialState, key, legalMoves, rb, rk,
  shortestPath, tryMove, type State
} from '../engine/riverCrossing';

// 传教士与野人过河
// - 一条小船最多坐 2 个人
// - 任何一岸如果有传教士，「野人的人数」就不能超过「传教士的人数」
// - 目标：把所有人都送到右岸

export default function RiverCrossingPage() {
  const graph = useMemo(() => buildGraph(), []);
  const optimal = useMemo(() => shortestPath(graph) ?? [], [graph]);
  const optimalMoves = useMemo(() => {
    return optimal.slice(1).map((next, index) => {
      const prev = optimal[index];
      return {
        b: Math.abs(prev.lb - next.lb),
        k: Math.abs(prev.lk - next.lk),
        from: prev.boat === 'L' ? '左岸' : '右岸',
        to: next.boat === 'L' ? '左岸' : '右岸'
      };
    });
  }, [optimal]);

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
      setMessage({ kind: 'bad', text: '这么走完之后，会有一岸的「野人比传教士还多」，不行哦～' });
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
        <h1>传教士与野人过河 🚣</h1>
        <p className="lead">
          有 3 个<strong>传教士</strong>和 3 个<strong>野人</strong>要过河，只有一条小船，
          最多坐 <strong>{BOAT_CAP}</strong> 个人。规则：
          <strong>任何一岸只要有传教士，野人的人数就不能超过传教士</strong>
          （否则传教士会有危险）。船每次至少要 1 个人划；在这个版本里，
          <strong>不管是传教士还是野人，都可以划船</strong>。
        </p>
        <p className="lead">
          这是一个非常经典的「<Link to="/concepts#modeling">把现实问题变成图</Link>」的例子：每一种「左岸有几个传教士、几个野人、船在哪边」就是一张「状态卡」，
          一次合法的划船就把这张卡连到下一张卡。问题就变成「从开局这张卡，沿着边走到目标卡」。
        </p>
        <p className="proof-note">
          这个经典谜题在大学的数据结构、算法分析和人工智能课程里，常被称作“传教士与野人问题”
          （Missionaries and Cannibals）。更早的历史版本还包括“吃醋的丈夫”一类过河谜题；
          这里采用大学教材里更常见的名字，但重点不是故事本身，而是学习怎样把故事变成状态图。
        </p>
      </section>

      <section className="panel">
        <h2>先把题目读清楚</h2>
        <ul>
          <li>开局是：左岸有 3 个传教士、3 个野人，右岸没人，船在左岸。</li>
          <li>每一步只做一件事：让 1 个人或 2 个人坐船，从船所在的这一岸划到另一岸。</li>
          <li>经典教材里的这个版本默认：传教士能划船，野人也能划船；如果额外规定“某个人不会划”，那就是另一种变体题了。</li>
          <li>检查规则时，要同时看两岸。只要某一岸还有传教士，野人数量就不能比传教士多。</li>
          <li>如果某一岸没有传教士了，比如 0 个传教士 + 2 个野人，这是允许的，因为只有野人的岸不会发生“吃掉传教士”的问题。</li>
        </ul>
        <p className="lead">
          所以像「2 个传教士 + 3 个野人在同一岸」是<strong>违规状态</strong>，不能出现；
          但「0 个传教士 + 3 个野人在同一岸」是<strong>合法状态</strong>。
          这也是这道题最容易绕住人的地方。
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
              <span className="river-counter-label"><RoleAvatar kind="missionary" /> 传教士 × {boatSel.b}</span>
              <button className="btn outline" onClick={() => adjustBoat('b', +1)}>+</button>
            </div>
            <div className="river-counter">
              <button className="btn outline" onClick={() => adjustBoat('k', -1)} disabled={boatSel.k === 0}>−</button>
              <span className="river-counter-label"><RoleAvatar kind="cannibal" /> 野人 × {boatSel.k}</span>
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
          下面这张大图是<strong>所有合法状态</strong>。每个圆圈是一种「左岸有几个传教士/几个野人 + 船在哪」，
          有连线表示「划一次船就能从一边到另一边」。
          蓝色圆是 <strong>开局</strong>，金色圆是 <strong>目标</strong>。
          你<strong>已经走过的路径</strong>用橘色高亮，<strong>最优最短路径</strong>是 11 步，用淡绿色描出来作参考。
        </p>
        <StateGraphView graph={graph} history={history} optimal={optimal} />
        <p className="proof-note" style={{ marginTop: '.6rem' }}>
          💡 想一想：本来「3 个传教士 + 3 个野人 + 一条船」听起来很复杂，可是一旦把「状态」画成点、把「划船」画成边，
          它就变成一个我们熟悉的<Link to="/concepts#shortest-path">找最短路径</Link>的图论问题了。这就是数学家解决问题的常用招数：
          <strong>给问题换个表示方式</strong>。
        </p>
        <p className="proof-note">
          小挑战：先别看答案，试着只从开局出发，列出<strong>1 步</strong>能到的所有合法状态；
          再从这些状态继续列出<strong>2 步</strong>能到的合法状态。你正在做的，就是广度优先遍历。
        </p>
      </section>

      <section className="panel">
        <h2>📚 这道题里出现的图论概念</h2>
        <ul>
          <li><Link to="/concepts#state-space">状态空间</Link>：所有合法状态合在一起就是 16 张状态卡，正好是图的 16 个点。</li>
          <li><Link to="/concepts#connected">连通性</Link>：从开局出发能不能走到目标？这等于问「目标点和开局点连通吗？」答案是：连通。</li>
          <li><Link to="/concepts#shortest-path">最短路径</Link>：用 <Link to="/concepts#bfs">BFS（广度优先搜索）</Link>从开局向外一层层扩展，第一次碰到目标时的步数就是最短步数。</li>
          <li><Link to="/concepts#directed">有向 / 无向</Link>：这道题里每一步都可以撤回，所以可以当成<strong>无向图</strong>。</li>
          <li><Link to="/concepts#weighted">加权图</Link>：如果不同的「划船」有不同代价（比如划得久、划得短），就要给边加上权重，最短路径就要用 <Link to="/concepts#dijkstra">Dijkstra</Link> 这种算法了。</li>
        </ul>
        <p className="lead">
          这道题展示的正是 <Link to="/leibniz">Calculemus</Link> 的精神：
          把「过河怎么走」写成状态图，让数学帮我们一步步检查、一步步算清楚。
        </p>

        <h3>这是不是用广度优先遍历图来解决？</h3>
        <p className="lead">
          对，就是 BFS，也叫<strong>广度优先搜索 / 广度优先遍历</strong>。做法像一圈一圈扩大的水波：
          先找开局 1 步能到哪些状态，再找 2 步能到哪些状态，再找 3 步能到哪些状态。
          因为每次划船都算 1 步，所以 BFS 第一次碰到目标时，走的一定是最少步数。
        </p>
        <ul>
          <li>把每张状态卡当成一个点。</li>
          <li>把每一次合法划船当成一条边。</li>
          <li>从开局点开始一层一层往外看。</li>
          <li>第一次看见目标点，就知道最少要划几次船。</li>
        </ul>

        <h3>一条最短解，为什么是 11 步？</h3>
        <p className="lead">
          电脑把所有合法状态连成图后，用 BFS 一层一层找，第一次走到目标时正好是第 11 步，
          所以这不是“碰巧试出来”的答案，而是已经验证过的最短解。
        </p>
        <ol>
          {optimalMoves.map((move, index) => (
            <li key={index}>
              从 <strong>{move.from}</strong>带 <strong>{move.b}</strong> 个传教士和 <strong>{move.k}</strong> 个野人到 <strong>{move.to}</strong>。
            </li>
          ))}
        </ol>
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
      {Array.from({ length: bigs }, (_, i) => <RoleAvatar key={'b' + i} kind="missionary" />)}
      {Array.from({ length: kids }, (_, i) => <RoleAvatar key={'k' + i} kind="cannibal" />)}
      {bigs === 0 && kids === 0 && <span className="person empty">（空）</span>}
    </div>
  );
}

function RoleAvatar({ kind }: { kind: 'missionary' | 'cannibal' }) {
  const label = kind === 'missionary' ? '传' : '野';
  const title = kind === 'missionary' ? '传教士' : '野人';

  return (
    <span className={`role-avatar ${kind}`} title={title} aria-label={title}>
      <span className="role-avatar-halo" />
      <span className="role-avatar-face">{label}</span>
    </span>
  );
}

function StateChip({ state }: { state: State }) {
  return (
    <div className="state-chip">
      <div className="state-chip-row">
        <span title="左岸传教士"><RoleAvatar kind="missionary" /> ×{state.lb}</span>
        <span title="左岸野人"><RoleAvatar kind="cannibal" /> ×{state.lk}</span>
      </div>
      <div className="state-chip-mid">{state.boat === 'L' ? '🚣 ⇠' : '⇢ 🚣'}</div>
      <div className="state-chip-row">
        <span title="右岸传教士"><RoleAvatar kind="missionary" /> ×{rb(state)}</span>
        <span title="右岸野人"><RoleAvatar kind="cannibal" /> ×{rk(state)}</span>
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
            带 <strong>{m.b}</strong> 个传教士 + <strong>{m.k}</strong> 个野人划过去
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
          每个圆圈：左岸传教士 / 左岸野人（船在哪边）。共 {graph.nodes.length} 个合法状态。
        </text>
      </svg>
      <div className="legend" style={{ marginTop: '.4rem' }}>
        <span><span className="dot" style={{ background: '#1864ab' }} /> 开局</span>
        <span><span className="dot" style={{ background: '#b46a1a' }} /> 目标</span>
        <span><span className="dot" style={{ background: '#ff7e5f' }} /> 你走过的路径</span>
        <span><span className="dot" style={{ background: '#69db7c' }} /> 最短路径（11 步）</span>
        <span>共 {TOTAL_BIG} 个传教士 + {TOTAL_KID} 个野人</span>
      </div>
    </div>
  );
}

// 状态图按 BFS 层次摆放
