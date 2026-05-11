/**
 * BfsWaveVisualizer - 广度优先搜索 动态演示组件
 *
 * 以「水波向外扩散」的方式，一层一层地展示 BFS 的探索过程。
 * 同时展示「队列」的状态变化，帮助理解 BFS 为什么必须用队列（先进先出 FIFO）。
 *
 * Props:
 *   nodes   - 所有节点，顺序和 layers 里的下标对应
 *   layers  - BFS 分层（layers[0] 是起点, layers[1] 是第 1 波发现的节点, ...）
 *   edges   - 所有边（节点下标对）
 *   isGoal  - 判断某节点是否为目标
 *   title   - 可选标题
 */

import { useEffect, useRef, useState } from 'react';

export interface BfsVisualizerNode {
  label: string;
  sublabel?: string;
}

interface Props {
  nodes: BfsVisualizerNode[];
  layers: number[][];
  edges: { a: number; b: number }[];
  isGoal: (idx: number) => boolean;
  title?: string;
}

type NodeState = 'undiscovered' | 'frontier' | 'visited' | 'goal-frontier' | 'goal-visited';

/** 队列面板：展示 BFS 队列在每一波的状态 */
function QueuePanel({ layers, wave, nodes, isGoal }: {
  layers: number[][];
  wave: number;
  nodes: BfsVisualizerNode[];
  isGoal: (idx: number) => boolean;
}) {
  const dequeued = layers.slice(0, wave).flat();
  const current  = layers[wave] ?? [];
  const inQueue  = wave + 1 < layers.length ? layers[wave + 1] : [];
  const showDequeuedFrom = Math.max(0, dequeued.length - 4);
  const showDequeued = dequeued.slice(showDequeuedFrom);
  const truncated = showDequeuedFrom > 0;

  function chip(ni: number, kind: 'dequeued' | 'processing' | 'in-queue') {
    return (
      <span key={ni} className={`queue-chip queue-chip-${kind}${isGoal(ni) ? ' queue-chip-goal' : ''}`}>
        {nodes[ni].label}
      </span>
    );
  }

  return (
    <div className="queue-panel">
      <div className="queue-header">
        <span className="queue-dir left">← 出队（已处理）</span>
        <span className="queue-title-label">📋 队列（先进先出 FIFO）</span>
        <span className="queue-dir right">入队（新发现）→</span>
      </div>
      <div className="queue-strip">
        {truncated && <span className="queue-chip queue-chip-dequeued queue-ellipsis">…</span>}
        {showDequeued.map(ni => chip(ni, 'dequeued'))}
        {dequeued.length > 0 && current.length > 0 && (
          <span className="queue-sep">▶</span>
        )}
        {current.map(ni => chip(ni, 'processing'))}
        {inQueue.length > 0 && (
          <span className="queue-sep">|</span>
        )}
        {inQueue.map(ni => chip(ni, 'in-queue'))}
        {inQueue.length === 0 && wave >= layers.length - 1 && (
          <span className="queue-empty">队列为空 ✓</span>
        )}
      </div>
      <div className="queue-legend">
        <span className="queue-chip queue-chip-dequeued">已出队</span>
        <span className="queue-chip queue-chip-processing">正在出队处理</span>
        <span className="queue-chip queue-chip-in-queue">在队列中等待</span>
      </div>
    </div>
  );
}

export function BfsWaveVisualizer({ nodes, layers, edges, isGoal, title }: Props) {
  const [wave, setWave] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxWave = layers.length - 1;

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setWave(w => {
        if (w >= maxWave) { setPlaying(false); return w; }
        return w + 1;
      });
    }, 900);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, wave, maxWave]);

  function reset() { setWave(0); setPlaying(false); }
  function step() { setWave(w => Math.min(w + 1, maxWave)); }
  function back() { setWave(w => Math.max(w - 1, 0)); }

  const nodeLayer = new Array(nodes.length).fill(-1);
  layers.forEach((layer, li) => layer.forEach(ni => { nodeLayer[ni] = li; }));

  function nodeState(ni: number): NodeState {
    const li = nodeLayer[ni];
    if (li > wave) return 'undiscovered';
    const goal = isGoal(ni);
    if (li === wave) return goal ? 'goal-frontier' : 'frontier';
    return goal ? 'goal-visited' : 'visited';
  }

  const W = 700, H = 340;
  const PAD_X = 48, PAD_Y = 40;
  const colCount = layers.length;
  const positions: { x: number; y: number }[] = new Array(nodes.length);
  layers.forEach((layer, ci) => {
    const x = PAD_X + (colCount <= 1 ? 0 : (W - 2 * PAD_X) * ci / (colCount - 1));
    layer.forEach((ni, ri) => {
      const n = layer.length;
      const y = PAD_Y + (n <= 1 ? (H - 2 * PAD_Y) / 2 : (H - 2 * PAD_Y) * ri / (n - 1));
      positions[ni] = { x, y };
    });
  });

  function edgeVisible(a: number, b: number): boolean {
    return nodeLayer[a] <= wave && nodeLayer[b] <= wave;
  }

  const nodeColors: Record<NodeState, { fill: string; stroke: string; textFill: string }> = {
    undiscovered:    { fill: '#f1f5f9', stroke: '#cbd5e1', textFill: '#94a3b8' },
    frontier:        { fill: '#dbeafe', stroke: '#3b82f6', textFill: '#1d4ed8' },
    visited:         { fill: '#ede9fe', stroke: '#8b5cf6', textFill: '#5b21b6' },
    'goal-frontier': { fill: '#fef3c7', stroke: '#f59e0b', textFill: '#92400e' },
    'goal-visited':  { fill: '#fef9c3', stroke: '#ca8a04', textFill: '#78350f' },
  };

  const goalLayers = layers
    .map((layer, li) => ({ li, found: layer.some(ni => isGoal(ni)) }))
    .filter(x => x.found);
  const goalFoundAt = goalLayers[0]?.li ?? null;

  const currentLayerSize = layers[wave]?.length ?? 0;
  const totalDiscovered = layers.slice(0, wave + 1).flat().length;

  return (
    <div className="bfs-visualizer">
      {title && <h3 className="bfs-title">{title}</h3>}

      <div className="bfs-status-bar">
        <span className="bfs-wave-badge">第 {wave} 波</span>
        <span className="bfs-stat">
          本波新发现 <strong>{currentLayerSize}</strong> 个状态，
          累计已知 <strong>{totalDiscovered}</strong> / {nodes.length} 个
        </span>
        {goalFoundAt !== null && wave >= goalFoundAt && (
          <span className="bfs-goal-found">
            🎯 目标！在第 <strong>{goalFoundAt}</strong> 波找到，最短步数 = <strong>{goalFoundAt}</strong>
          </span>
        )}
      </div>

      <div className="bfs-canvas-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {layers.map((_, li) => {
            if (li > wave) return null;
            const layerX = PAD_X + (colCount <= 1 ? 0 : (W - 2 * PAD_X) * li / (colCount - 1));
            const opacity = li === wave ? 0.12 : 0.04;
            const r = 24 + (H / 2 - 30) * 0.9;
            return (
              <ellipse key={li} cx={layerX} cy={H / 2} rx={18} ry={r}
                fill={li === wave ? '#3b82f6' : '#8b5cf6'} opacity={opacity} />
            );
          })}
          {layers.map((_, li) => {
            const x = PAD_X + (colCount <= 1 ? 0 : (W - 2 * PAD_X) * li / (colCount - 1));
            return (
              <text key={li} x={x} y={H - 8} textAnchor="middle"
                fontSize="10" fill={li <= wave ? '#6d28d9' : '#cbd5e1'} fontWeight="600">
                {li === 0 ? '起点' : `${li}步`}
              </text>
            );
          })}
          {edges.map((e, i) => {
            if (!edgeVisible(e.a, e.b)) return null;
            const pa = positions[e.a]; const pb = positions[e.b];
            const isNewEdge = nodeLayer[e.a] === wave || nodeLayer[e.b] === wave;
            return (
              <line key={i}
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={isNewEdge ? '#93c5fd' : '#c4b5fd'}
                strokeWidth={isNewEdge ? 2 : 1.2}
                opacity={isNewEdge ? 0.9 : 0.45}
              />
            );
          })}
          {nodes.map((node, ni) => {
            const p = positions[ni];
            const st = nodeState(ni);
            const col = nodeColors[st];
            const isFrontier = st === 'frontier' || st === 'goal-frontier';
            return (
              <g key={ni}>
                {isFrontier && (
                  <circle cx={p.x} cy={p.y} r={26} fill={st === 'goal-frontier' ? '#fde68a' : '#bfdbfe'}
                    opacity={0.5} />
                )}
                <circle cx={p.x} cy={p.y} r={20} fill={col.fill} stroke={col.stroke} strokeWidth={2} />
                <text x={p.x} y={p.y - 2} textAnchor="middle" fontSize="9"
                  fontWeight="700" fill={col.textFill}>
                  {node.label}
                </text>
                {node.sublabel && (
                  <text x={p.x} y={p.y + 9} textAnchor="middle" fontSize="8"
                    fill={col.textFill} opacity={0.85}>
                    {node.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Queue panel */}
      <QueuePanel layers={layers} wave={wave} nodes={nodes} isGoal={isGoal} />

      {/* Controls */}
      <div className="bfs-controls" style={{ marginTop: '.5rem' }}>
        <button className="btn outline btn-sm" onClick={reset}>⏮ 重置</button>
        <button className="btn outline btn-sm" onClick={back} disabled={wave === 0}>← 上一波</button>
        <button className="btn outline btn-sm" onClick={step} disabled={wave >= maxWave}>下一波 →</button>
        <button
          className={`btn btn-sm ${playing ? 'outline' : 'primary'}`}
          onClick={() => setPlaying(p => !p)}
          disabled={wave >= maxWave}
        >
          {playing ? '⏸ 暂停' : '▶ 自动播放'}
        </button>
        <span className="bfs-progress">{wave} / {maxWave} 波</span>
      </div>

      <div className="legend" style={{ marginTop: '.5rem' }}>
        <span><span className="dot" style={{ background: '#f1f5f9', border: '2px solid #cbd5e1' }} /> 未发现</span>
        <span><span className="dot" style={{ background: '#dbeafe', border: '2px solid #3b82f6' }} /> 本波前沿</span>
        <span><span className="dot" style={{ background: '#ede9fe', border: '2px solid #8b5cf6' }} /> 已探索</span>
        <span><span className="dot" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }} /> 目标节点</span>
      </div>

      {/* BFS vs DFS explanation */}
      <details className="bfs-dfs-explainer">
        <summary>💡 为什么 BFS 用队列，DFS 用堆栈？</summary>
        <div className="bfs-dfs-compare">
          <div className="compare-col bfs-col">
            <div className="compare-col-title">🌊 BFS 广度优先 · 队列（先进先出 FIFO）</div>
            <p>
              把邻居加到<strong>队尾</strong>，每次从<strong>队首</strong>取出一个处理。
              离起点近的节点先进队，所以先被处理——搜索一圈一圈向外扩。
            </p>
            <div className="compare-queue-demo">
              <span className="cq-label">队首→</span>
              <span className="cq-chip cq-old">起点</span>
              <span className="cq-chip cq-processed">1步A</span>
              <span className="cq-chip cq-processed">1步B</span>
              <span className="cq-chip cq-next">2步…</span>
              <span className="cq-label">←队尾</span>
            </div>
            <p className="compare-note">✅ 保证找到<strong>最短路径</strong></p>
          </div>
          <div className="compare-col dfs-col">
            <div className="compare-col-title">🌲 DFS 深度优先 · 堆栈（后进先出 LIFO）</div>
            <p>
              把邻居压到<strong>栈顶</strong>，每次从<strong>栈顶</strong>取出一个处理。
              最新发现的邻居立刻被探索——搜索一头扎深，到底再回溯。
            </p>
            <div className="compare-queue-demo">
              <span className="cq-label">栈顶↓</span>
              <span className="cq-chip cq-next">深层X</span>
              <span className="cq-chip cq-next">深层Y</span>
              <span className="cq-chip cq-processed">1步A</span>
              <span className="cq-chip cq-old">起点</span>
            </div>
            <p className="compare-note">❌ 不保证最短，但内存占用少</p>
          </div>
        </div>
      </details>
    </div>
  );
}
