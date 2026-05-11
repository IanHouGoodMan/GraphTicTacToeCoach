import { useMemo, useState } from 'react';
import {
  buildJugGraph, jugInitial, jugIsGoal, jugKey, jugLegalMoves,
  JUG_MOVE_LABELS, JUG_S, JUG_B,
  type JugState, type JugMove
} from '../engine/waterJug';
import { BfsWaveVisualizer } from '../components/BfsWaveVisualizer';

function JugSvg({ label, current, capacity, color }: {
  label: string; current: number; capacity: number; color: string;
}) {
  const fillH = 60;
  const waterH = Math.round((current / capacity) * fillH);
  return (
    <div className="jug-wrap">
      <div className="jug-label">{label}</div>
      <svg width="60" height="80" viewBox="0 0 60 80">
        <rect x="5" y="10" width="50" height="65" rx="4" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
        {waterH > 0 && (
          <rect x="5" y={75 - waterH} width="50" height={waterH} rx="2" fill={color} opacity="0.8" />
        )}
        <text x="30" y="50" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
          {current}L
        </text>
        <text x="30" y="70" textAnchor="middle" fontSize="9" fill="#64748b">/{capacity}L</text>
      </svg>
    </div>
  );
}

export default function WaterJugPage() {
  const graph = useMemo(() => buildJugGraph(), []);

  const bfsNodes = useMemo(() =>
    graph.nodes.map(s => ({
      label: `${s.s}-${s.b}`,
      sublabel: jugIsGoal(s) ? '🎯' : undefined,
    }))
  , [graph]);

  // Optimal path to first goal found
  const optimalPath = useMemo<JugState[]>(() => {
    const goalNode = graph.nodes.find(n => jugIsGoal(n) && graph.parent.has(jugKey(n)));
    if (!goalNode) return [];
    const path: JugState[] = [];
    let cur = jugKey(goalNode);
    while (graph.parent.has(cur)) {
      const nodeIdx = graph.nodes.findIndex(n => jugKey(n) === cur);
      if (nodeIdx >= 0) path.unshift(graph.nodes[nodeIdx]);
      cur = graph.parent.get(cur)!.prev;
    }
    path.unshift(jugInitial);
    return path;
  }, [graph]);

  const [history, setHistory] = useState<JugState[]>([jugInitial]);
  const current = history[history.length - 1];
  const isDone = jugIsGoal(current);
  const moves = useMemo(() => jugLegalMoves(current), [current]);

  function makeMove(_move: JugMove, next: JugState) {
    setHistory(h => [...h, next]);
  }
  function reset() { setHistory([jugInitial]); }
  function undo()  { if (history.length > 1) setHistory(h => h.slice(0, -1)); }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">图论谜题 · BFS 搜索</p>
        <h1>🪣 倒水问题</h1>
        <p className="lead">
          有一个 <strong>{JUG_S} 升的小壶</strong>和一个 <strong>{JUG_B} 升的大壶</strong>，
          还有无限量的水（大水缸）。目标：用这两个壶量出恰好 <strong>4 升</strong>水。
          没有刻度，每次只能<em>装满 / 倒空 / 从一个壶倒进另一个壶</em>。
        </p>
      </section>

      <section className="panel">
        <h2>🎮 动手玩一玩</h2>
        <div className="jug-scene">
          <JugSvg label="小壶（3L）" current={current.s} capacity={JUG_S} color="#6366f1" />
          <JugSvg label="大壶（5L）" current={current.b} capacity={JUG_B} color="#0891b2" />
        </div>

        {isDone ? (
          <div className="success-banner">
            🎉 成功！{current.b === 4 ? `大壶有 ${current.b}L` : `小壶有 ${current.s}L`}，共走了 <strong>{history.length - 1}</strong> 步。
            {history.length - 1 > 6 && <span>（最短只需 6 步）</span>}
          </div>
        ) : (
          <div className="jug-moves">
            <div className="move-pills move-pills-col">
              {moves.map(({ move, next }) => (
                <button
                  key={move}
                  className="btn accent btn-sm"
                  onClick={() => makeMove(move, next)}
                >
                  {JUG_MOVE_LABELS[move]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="game-controls">
          <button className="btn outline btn-sm" onClick={undo} disabled={history.length <= 1}>↩ 撤回</button>
          <button className="btn outline btn-sm" onClick={reset}>🔄 重来</button>
        </div>
      </section>

      <section className="panel">
        <h2>🗺️ 状态格（所有可能的水量）</h2>
        <p className="lead">
          每个格子代表「小壶 s 升，大壶 b 升」的状态。绿色是目标状态（有 4L 水）。
        </p>
        <div className="jug-grid-wrap">
          <table className="jug-grid">
            <thead>
              <tr>
                <th>小壶↓ / 大壶→</th>
                {Array.from({ length: JUG_B + 1 }, (_, b) => <th key={b}>{b}L</th>)}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: JUG_S + 1 }, (_, s) => (
                <tr key={s}>
                  <th>{s}L</th>
                  {Array.from({ length: JUG_B + 1 }, (_, b) => {
                    const state = { s, b };
                    const inHistory = history.some(h => h.s === s && h.b === b);
                    const isCurrentState = current.s === s && current.b === b;
                    const isGoalState = jugIsGoal(state);
                    const isStart = s === 0 && b === 0;
                    return (
                      <td
                        key={b}
                        className={[
                          'jug-cell',
                          isCurrentState ? 'jug-current' : '',
                          isGoalState ? 'jug-goal' : '',
                          inHistory && !isCurrentState ? 'jug-visited' : '',
                          isStart ? 'jug-start' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {isCurrentState ? '📍' : isGoalState ? '🎯' : `${s},${b}`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>🌊 BFS 广度优先搜索演示</h2>
        <p className="lead">
          {JUG_S + 1}×{JUG_B + 1} = {(JUG_S + 1) * (JUG_B + 1)} 个可能状态，并非每个都可达。
          BFS 从 (0,0) 出发，<strong>6 步</strong>找到第一个目标状态。
        </p>
        <BfsWaveVisualizer
          nodes={bfsNodes}
          layers={graph.layers}
          edges={graph.edges}
          isGoal={i => jugIsGoal(graph.nodes[i])}
          title="倒水问题 · BFS 扩散（节点标注「小壶-大壶」升数）"
        />
      </section>

      <section className="panel">
        <h2>✅ 一条最短解（{optimalPath.length - 1} 步）</h2>
        <ol>
          {optimalPath.slice(1).map((next, i) => {
            const moveLabel = graph.parent.get(jugKey(next))?.move;
            return (
              <li key={i}>
                <strong>{moveLabel ? JUG_MOVE_LABELS[moveLabel] : '？'}</strong>
                {' → '}小壶 {next.s}L，大壶 {next.b}L
                {jugIsGoal(next) && ' 🎯'}
              </li>
            );
          })}
        </ol>
        <p className="proof-note">
          这道题因电影《虎胆龙威 3》中的场景而广为人知，
          但它其实是数论中<strong>裴蜀定理（Bézout's identity）</strong>的直接应用：
          只要两壶容量互质（最大公约数 = 1），就一定能量出 1 到两壶容量之间的任意整数升数。
        </p>
      </section>
    </>
  );
}
