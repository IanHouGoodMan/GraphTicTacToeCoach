import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BOAT_CAP, TOTAL_BIG, TOTAL_KID,
  buildGraph, goalState, initialState, key, legalMoves,
  shortestPath, tryMove, type State
} from '../engine/riverCrossing';
import { RiverScene, RoleAvatar } from '../components/river/RiverScene';
import { StateChip, LegalMovesPanel } from '../components/river/RiverControls';
import { StateGraphView } from '../components/river/StateGraphView';
import { BfsWaveVisualizer } from '../components/BfsWaveVisualizer';

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
        to:   next.boat === 'L' ? '左岸' : '右岸',
      };
    });
  }, [optimal]);

  const [history, setHistory] = useState<State[]>([initialState]);
  const [boatSel, setBoatSel] = useState<{ b: number; k: number }>({ b: 0, k: 0 });
  const [message, setMessage] = useState<{ kind: 'info' | 'good' | 'bad'; text: string } | null>(null);

  const current = history[history.length - 1];
  const reachedGoal = key(current) === key(goalState);
  const moves = useMemo(() => legalMoves(current), [current]);

  function reset() { setHistory([initialState]); setBoatSel({ b: 0, k: 0 }); setMessage(null); }
  function undo()  { if (history.length <= 1) return; setHistory(h => h.slice(0, -1)); setBoatSel({ b: 0, k: 0 }); setMessage(null); }

  function adjustBoat(kind: 'b' | 'k', delta: number) {
    setBoatSel(prev => {
      const fromSide = current.boat === 'L'
        ? { bigs: current.lb, kids: current.lk }
        : { bigs: TOTAL_BIG - current.lb, kids: TOTAL_KID - current.lk };
      const next = { ...prev, [kind]: Math.max(0, prev[kind] + delta) };
      if (next.b + next.k > BOAT_CAP) return prev;
      if (next.b > fromSide.bigs) return prev;
      if (next.k > fromSide.kids) return prev;
      return next;
    });
    setMessage(null);
  }

  function go() {
    const total = boatSel.b + boatSel.k;
    if (total === 0) { setMessage({ kind: 'bad', text: '小船里至少要有 1 个人才能划走哦～' }); return; }
    const next = tryMove(current, boatSel.b, boatSel.k);
    if (!next) { setMessage({ kind: 'bad', text: '这么走完之后，会有一岸的「野人比传教士还多」，不行哦～' }); return; }
    setHistory(h => [...h, next]);
    setBoatSel({ b: 0, k: 0 });
    setMessage(null);
  }

  const bfsNodes = useMemo(() =>
    graph.nodes.map(n => ({
      label: `${n.lb}/${n.lk}`,
      sublabel: n.boat === 'L' ? '🚣⇠' : '⇢🚣',
    })),
  [graph]);

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
              <button className="btn outline btn-sm" onClick={() => adjustBoat('b', -1)} disabled={boatSel.b === 0}>−</button>
              <span className="river-counter-label"><RoleAvatar kind="missionary" /> 传教士 × {boatSel.b}</span>
              <button className="btn outline btn-sm" onClick={() => adjustBoat('b', +1)}>+</button>
            </div>
            <div className="river-counter">
              <button className="btn outline btn-sm" onClick={() => adjustBoat('k', -1)} disabled={boatSel.k === 0}>−</button>
              <span className="river-counter-label"><RoleAvatar kind="cannibal" /> 野人 × {boatSel.k}</span>
              <button className="btn outline btn-sm" onClick={() => adjustBoat('k', +1)}>+</button>
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
        <h2>🌊 BFS 广度优先搜索 · 动态演示</h2>
        <p className="lead">
          BFS 就像向外扩散的水波：先找开局能直接到达的状态（第 1 波），
          再从这些状态继续向外扩（第 2 波）……第一次碰到目标状态，走的就是<strong>最少步数</strong>。
        </p>
        <BfsWaveVisualizer
          nodes={bfsNodes}
          layers={graph.layers}
          edges={graph.edges}
          isGoal={i => key(graph.nodes[i]) === key(goalState)}
          title="传教士与野人 · 16 个状态的 BFS 扩散"
        />
      </section>

      <section className="panel">
        <h2>🗺️ 完整状态图</h2>
        <p className="lead">16 个合法状态之间的所有边。橘色 = 你走过的路径，绿色 = 最优 11 步路径。</p>
        <StateGraphView graph={graph} history={history} optimal={optimal} />
      </section>

      <section className="panel">
        <h2>📚 图论概念回顾</h2>
        <ul>
          <li><Link to="/concepts#state-space">状态空间</Link>：16 个合法状态 = 图的 16 个节点。</li>
          <li><Link to="/concepts#connected">连通性</Link>：开局和目标连通，所以问题可解。</li>
          <li><Link to="/concepts#bfs">BFS</Link>：按步数一层层探索，保证找到最短路径（11 步）。</li>
        </ul>
        <h3>最短解（11 步）：</h3>
        <ol>
          {optimalMoves.map((move, i) => (
            <li key={i}>
              从 <strong>{move.from}</strong> 带 <strong>{move.b}</strong> 个传教士、<strong>{move.k}</strong> 个野人到 <strong>{move.to}</strong>
            </li>
          ))}
        </ol>
        <p className="proof-note">
          这道题在 AI 课本里叫「Missionaries and Cannibals」，是 BFS 状态空间搜索的经典示范。
        </p>
      </section>
    </>
  );
}
