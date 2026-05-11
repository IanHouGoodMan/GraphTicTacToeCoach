import { useMemo, useState } from 'react';
import {
  buildWGCGraph, wgcInitial, wgcGoal, wgcKey, wgcLegalMoves,
  WGC_ICONS, WGC_PASSENGER_LABELS,
  type WGCState, type WGCPassenger
} from '../engine/wolfGoatCabbage';
import { BfsWaveVisualizer } from '../components/BfsWaveVisualizer';

function BankScene({ side, state }: { side: 'L' | 'R'; state: WGCState }) {
  const items: Array<'wolf' | 'goat' | 'cab'> = ['wolf', 'goat', 'cab'];
  const present = items.filter(it => state[it] === side);
  const farmerHere = state.boat === side;
  return (
    <div className="wgc-bank">
      <div className="wgc-bank-label">{side === 'L' ? '左岸' : '右岸'}</div>
      <div className="wgc-icons">
        {farmerHere && <span className="wgc-icon">🧑‍🌾</span>}
        {present.map(it => (
          <span key={it} className="wgc-icon">{WGC_ICONS[it]}</span>
        ))}
        {!farmerHere && present.length === 0 && <span className="wgc-empty">（空）</span>}
      </div>
    </div>
  );
}

function BoatScene({ state }: { state: WGCState }) {
  return (
    <div className="wgc-river">
      <div className="wgc-river-label">🌊 河流</div>
      <div className={`wgc-boat ${state.boat === 'L' ? 'boat-left' : 'boat-right'}`}>
        <span>🚤 农夫</span>
      </div>
    </div>
  );
}

export default function WolfGoatPage() {
  const graph = useMemo(() => buildWGCGraph(), []);

  const bfsNodes = useMemo(() =>
    graph.nodes.map(s => ({
      label: `${WGC_ICONS.wolf}${s.wolf} ${WGC_ICONS.goat}${s.goat} ${WGC_ICONS.cab}${s.cab}`,
      sublabel: s.boat === 'L' ? '🧑‍🌾左' : '🧑‍🌾右',
    }))
  , [graph]);

  // Find optimal path
  const optimalPath = useMemo<WGCState[]>(() => {
    const goalKey = wgcKey(wgcGoal);
    if (!graph.parent.has(goalKey)) return [];
    const path: WGCState[] = [];
    let cur = goalKey;
    while (graph.parent.has(cur)) {
      const nodeIdx = graph.nodes.findIndex(n => wgcKey(n) === cur);
      if (nodeIdx >= 0) path.unshift(graph.nodes[nodeIdx]);
      cur = graph.parent.get(cur)!.prev;
    }
    // add initial
    const startIdx = graph.nodes.findIndex(n => wgcKey(n) === wgcKey(wgcInitial));
    if (startIdx >= 0) path.unshift(graph.nodes[startIdx]);
    return path;
  }, [graph]);

  const [history, setHistory] = useState<WGCState[]>([wgcInitial]);
  const current = history[history.length - 1];
  const isDone = wgcKey(current) === wgcKey(wgcGoal);
  const moves = useMemo(() => wgcLegalMoves(current), [current]);

  function makeMove(passenger: WGCPassenger, next: WGCState) {
    setHistory(h => [...h, next]);
  }
  function reset() { setHistory([wgcInitial]); }
  function undo()  { if (history.length > 1) setHistory(h => h.slice(0, -1)); }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">图论谜题 · BFS 搜索</p>
        <h1>🐺 狼·羊·白菜 过河</h1>
        <p className="lead">
          农夫要把<strong>狼 🐺、羊 🐑、白菜 🥬</strong>从左岸全部带到右岸。
          小船每次最多只能带 <strong>1 样东西</strong>（农夫每次必须在船上）。
          规则：农夫不在的时候，狼和羊不能单独在一起，羊和白菜也不能单独在一起。
        </p>
      </section>

      <section className="panel">
        <h2>🎮 动手玩一玩</h2>
        <div className="wgc-scene">
          <BankScene side="L" state={current} />
          <BoatScene state={current} />
          <BankScene side="R" state={current} />
        </div>

        {isDone ? (
          <div className="success-banner">
            🎉 成功！所有人都过河了！共走了 <strong>{history.length - 1}</strong> 步。
            {history.length - 1 > 7 && <span>（最短只需 7 步，试试能不能找到？）</span>}
          </div>
        ) : (
          <div className="wgc-moves">
            <p>选一次摆渡动作：</p>
            <div className="move-pills">
              {moves.map(({ passenger, next }) => (
                <button
                  key={passenger}
                  className="btn accent"
                  onClick={() => makeMove(passenger, next)}
                >
                  {WGC_PASSENGER_LABELS[passenger]}
                </button>
              ))}
              {moves.length === 0 && <span className="muted">没有合法移动，请撤回</span>}
            </div>
          </div>
        )}

        <div className="game-controls">
          <button className="btn outline btn-sm" onClick={undo} disabled={history.length <= 1}>↩ 撤回</button>
          <button className="btn outline btn-sm" onClick={reset}>🔄 重来</button>
        </div>
      </section>

      <section className="panel">
        <h2>🌊 BFS 广度优先搜索演示</h2>
        <p className="lead">
          农夫所有可能的状态组成一张图。BFS 从初始状态向外一圈圈扩展，
          第一次到达目标就是最短路径——<strong>7 步</strong>。
        </p>
        <BfsWaveVisualizer
          nodes={bfsNodes}
          layers={graph.layers}
          edges={graph.edges}
          isGoal={i => wgcKey(graph.nodes[i]) === wgcKey(wgcGoal)}
          title="狼羊白菜 · 所有状态的 BFS 扩散"
        />
      </section>

      <section className="panel">
        <h2>✅ 一条最短解（7 步）</h2>
        <ol>
          {optimalPath.slice(1).map((next, i) => {
            const prev = optimalPath[i];
            const passengerKey = graph.parent.get(wgcKey(next))?.passenger ?? 'none';
            const from = prev.boat === 'L' ? '左岸' : '右岸';
            const to   = next.boat === 'L' ? '左岸' : '右岸';
            return (
              <li key={i}>
                从 <strong>{from}</strong> 到 <strong>{to}</strong>：{WGC_PASSENGER_LABELS[passengerKey]}
              </li>
            );
          })}
        </ol>
        <p className="proof-note">
          这道题有两条对称的最短解（7 步）。这是比传教士过河更古老的谜题，
          最早记录来自 8 世纪学者<strong>阿尔昆（Alcuin of York）</strong>的著作。
        </p>
      </section>
    </>
  );
}
