import { useMemo } from 'react';
import type { State } from '../../engine/riverCrossing';
import { buildGraph, initialState, goalState, key } from '../../engine/riverCrossing';

interface Props {
  graph: ReturnType<typeof buildGraph>;
  history: State[];
  optimal: State[];
}

export function StateGraphView({ graph, history, optimal }: Props) {
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
          let stroke = '#cbd5e1', sw = 1.5, opacity = 0.55;
          if (isOpt) { stroke = '#10b981'; sw = 3; opacity = 0.85; }
          if (isHist) { stroke = '#f97316'; sw = 4; opacity = 1; }
          return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                       stroke={stroke} strokeWidth={sw} opacity={opacity} />;
        })}
        {graph.nodes.map((n, i) => {
          const p = positions.get(key(n))!;
          const isStart = key(n) === key(initialState);
          const isGoal = key(n) === key(goalState);
          const isOnHist = historyKeys.has(key(n));
          const isOnOpt = optimalKeys.has(key(n));
          let fill = '#f8faff', stroke = '#94a3b8';
          if (isOnOpt) { fill = '#d1fae5'; stroke = '#059669'; }
          if (isOnHist) { fill = '#ffedd5'; stroke = '#f97316'; }
          if (isStart) { fill = '#dbeafe'; stroke = '#2563eb'; }
          if (isGoal) { fill = '#fef3c7'; stroke = '#d97706'; }
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={20} fill={fill} stroke={stroke} strokeWidth={2} />
              <text x={p.x} y={p.y - 2} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">
                {n.lb}/{n.lk}
              </text>
              <text x={p.x} y={p.y + 9} textAnchor="middle" fontSize="9" fill="#475569">
                {n.boat === 'L' ? '🚣⇠' : '⇢🚣'}
              </text>
            </g>
          );
        })}
        <text x={PAD_X} y={H - 12} fontSize="11" fill="#64748b">
          每个圆圈：左岸传教士 / 左岸野人（船在哪边）。共 {graph.nodes.length} 个合法状态。
        </text>
      </svg>
      <div className="legend" style={{ marginTop: '.4rem' }}>
        <span><span className="dot" style={{ background: '#2563eb' }} /> 开局</span>
        <span><span className="dot" style={{ background: '#d97706' }} /> 目标</span>
        <span><span className="dot" style={{ background: '#f97316' }} /> 你走过的路径</span>
        <span><span className="dot" style={{ background: '#10b981' }} /> 最短路径（11 步）</span>
      </div>
    </div>
  );
}
