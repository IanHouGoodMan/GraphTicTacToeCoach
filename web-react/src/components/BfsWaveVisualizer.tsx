/**
 * BfsWaveVisualizer - 广度优先搜索 动态演示组件
 *
 * 以「水波向外扩散」的方式，一层一层地展示 BFS 的探索过程。
 * 可以用于任何图谜题（传教士过河、狼羊白菜、倒水问题……）。
 *
 * Props:
 *   nodes       - 所有节点，顺序和 layers 里的下标对应
 *   layers      - BFS 分层（layers[0] 是起点, layers[1] 是第 1 波发现的节点, ...）
 *   edges       - 所有边（节点下标对）
 *   labelOf     - 给每个节点返回显示文字
 *   isGoal      - 判断某节点是否为目标
 *   goalReached - 目标节点在第几层被发现（可选，用于显示提示文字）
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

export function BfsWaveVisualizer({ nodes, layers, edges, isGoal, title }: Props) {
  // waveFront: how many layers have been fully "expanded" (0 = only start visible)
  const [wave, setWave] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxWave = layers.length - 1;

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setWave(w => {
        if (w >= maxWave) { setPlaying(false); return w; }
        return w + 1;
      });
    }, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, wave, maxWave]);

  function reset() { setWave(0); setPlaying(false); }
  function step() { setWave(w => Math.min(w + 1, maxWave)); }
  function back() { setWave(w => Math.max(w - 1, 0)); }

  // Which layer each node belongs to
  const nodeLayer = new Array(nodes.length).fill(-1);
  layers.forEach((layer, li) => layer.forEach(ni => { nodeLayer[ni] = li; }));

  // Compute node visual state
  function nodeState(ni: number): NodeState {
    const li = nodeLayer[ni];
    if (li > wave) return 'undiscovered';
    const goal = isGoal(ni);
    if (li === wave) return goal ? 'goal-frontier' : 'frontier';
    return goal ? 'goal-visited' : 'visited';
  }

  // SVG layout: columns = layers, rows = nodes in layer
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

  // Edge visibility: both endpoints must be discovered
  function edgeVisible(a: number, b: number): boolean {
    return nodeLayer[a] <= wave && nodeLayer[b] <= wave;
  }

  // Color config
  const nodeColors: Record<NodeState, { fill: string; stroke: string; textFill: string }> = {
    undiscovered:   { fill: '#f1f5f9', stroke: '#cbd5e1', textFill: '#94a3b8' },
    frontier:       { fill: '#dbeafe', stroke: '#3b82f6', textFill: '#1d4ed8' },
    visited:        { fill: '#ede9fe', stroke: '#8b5cf6', textFill: '#5b21b6' },
    'goal-frontier':{ fill: '#fef3c7', stroke: '#f59e0b', textFill: '#92400e' },
    'goal-visited': { fill: '#fef9c3', stroke: '#ca8a04', textFill: '#78350f' },
  };

  // Find goal discovery layer
  const goalLayers = layers
    .map((layer, li) => ({ li, found: layer.some(ni => isGoal(ni)) }))
    .filter(x => x.found);
  const goalFoundAt = goalLayers[0]?.li ?? null;

  // Current layer info
  const currentLayerSize = layers[wave]?.length ?? 0;
  const totalDiscovered = layers.slice(0, wave + 1).flat().length;

  return (
    <div className="bfs-visualizer">
      {title && <h3 className="bfs-title">{title}</h3>}

      {/* Status bar */}
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

      {/* SVG canvas */}
      <div className="bfs-canvas-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {/* Wave rings (background circles) */}
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

          {/* Layer labels */}
          {layers.map((_, li) => {
            const x = PAD_X + (colCount <= 1 ? 0 : (W - 2 * PAD_X) * li / (colCount - 1));
            return (
              <text key={li} x={x} y={H - 8} textAnchor="middle"
                fontSize="10" fill={li <= wave ? '#6d28d9' : '#cbd5e1'} fontWeight="600">
                {li === 0 ? '起点' : `${li}步`}
              </text>
            );
          })}

          {/* Edges */}
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

          {/* Nodes */}
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

      {/* Controls */}
      <div className="bfs-controls">
        <button className="btn outline btn-sm" onClick={reset}>⏮ 重置</button>
        <button className="btn outline btn-sm" onClick={back} disabled={wave === 0}>← 上一波</button>
        <button className="btn outline btn-sm" onClick={step} disabled={wave >= maxWave}>下一波 →</button>
        <button
          className={`btn btn-sm ${playing ? 'outline' : 'primary'}`}
          onClick={() => { setPlaying(p => !p); }}
          disabled={wave >= maxWave}
        >
          {playing ? '⏸ 暂停' : '▶ 自动播放'}
        </button>
        <span className="bfs-progress">{wave} / {maxWave} 波</span>
      </div>

      {/* Legend */}
      <div className="legend" style={{ marginTop: '.5rem' }}>
        <span><span className="dot" style={{ background: '#f1f5f9', border: '2px solid #cbd5e1' }} /> 未发现</span>
        <span><span className="dot" style={{ background: '#dbeafe', border: '2px solid #3b82f6' }} /> 本波前沿</span>
        <span><span className="dot" style={{ background: '#ede9fe', border: '2px solid #8b5cf6' }} /> 已探索</span>
        <span><span className="dot" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }} /> 目标节点</span>
      </div>
    </div>
  );
}
