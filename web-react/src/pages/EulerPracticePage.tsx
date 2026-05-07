import { useEffect, useMemo, useRef, useState } from 'react';
import {
  analyse,
  buildPuzzles,
  degrees,
  findEdgeIndex,
  oddVertices,
  type GraphPuzzle
} from '../engine/euler';

const PUZZLES = buildPuzzles();
const STAGE_W = 360;
const STAGE_H = 300;
const VERTEX_R = 16;
const SNAP_R = 26; // 触屏吸附半径

export default function EulerPracticePage() {
  const [puzzleId, setPuzzleId] = useState(PUZZLES[0].id);
  const puzzle = useMemo(() => PUZZLES.find(p => p.id === puzzleId)!, [puzzleId]);

  const [path, setPath] = useState<number[]>([]);     // 顶点序列
  const [used, setUsed] = useState<Set<number>>(new Set()); // 已经画过的边的下标
  const [pointerXY, setPointerXY] = useState<{ x: number; y: number } | null>(null);
  const [guess, setGuess] = useState<null | boolean>(null);
  const [showHints, setShowHints] = useState(true);
  const [message, setMessage] = useState<{ kind: 'good' | 'bad' | 'info'; text: string } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  const verdict = useMemo(() => analyse(puzzle), [puzzle]);
  const odd = useMemo(() => oddVertices(puzzle), [puzzle]);
  const deg = useMemo(() => degrees(puzzle), [puzzle]);
  const totalEdges = puzzle.edges.length;
  const finished = used.size === totalEdges && totalEdges > 0;

  useEffect(() => {
    setPath([]); setUsed(new Set()); setGuess(null); setMessage(null);
  }, [puzzleId]);

  function svgPoint(e: React.PointerEvent): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const sx = STAGE_W / r.width;
    const sy = STAGE_H / r.height;
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  }

  function nearestVertex(p: { x: number; y: number }): number {
    let best = -1, bd = Infinity;
    for (let i = 0; i < puzzle.vertices.length; i++) {
      const v = puzzle.vertices[i];
      const d = Math.hypot(v.x - p.x, v.y - p.y);
      if (d < bd) { bd = d; best = i; }
    }
    return bd <= SNAP_R ? best : -1;
  }

  function startAt(v: number) {
    setPath([v]);
    setUsed(new Set());
    setGuess(null);
    setMessage(null);
  }

  function tryAdvanceTo(v: number) {
    if (path.length === 0) { startAt(v); return; }
    const last = path[path.length - 1];
    if (v === last) return;
    const ei = findEdgeIndex(puzzle, last, v, used);
    if (ei < 0) {
      setMessage({ kind: 'bad', text: '这条边走不了：可能两个点之间没有边，或者那条边已经画过了。' });
      return;
    }
    const newUsed = new Set(used); newUsed.add(ei);
    setUsed(newUsed);
    setPath([...path, v]);
    setMessage(null);
  }

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = svgPoint(e); if (!p) return;
    setPointerXY(p);
    const v = nearestVertex(p);
    dragging.current = true;
    if (v >= 0) {
      if (path.length === 0) startAt(v);
      else tryAdvanceTo(v);
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const p = svgPoint(e); if (!p) return;
    setPointerXY(p);
    const v = nearestVertex(p);
    if (v >= 0) {
      const last = path[path.length - 1];
      if (v !== last) tryAdvanceTo(v);
    }
  }
  function onPointerUp() {
    dragging.current = false;
    setPointerXY(null);
  }

  function undo() {
    if (path.length <= 1) { setPath([]); setUsed(new Set()); return; }
    const newPath = path.slice(0, -1);
    const a = path[path.length - 2];
    const b = path[path.length - 1];
    const newUsed = new Set(used);
    // 删除最后一条用过的、连接 a-b 的边
    for (const i of Array.from(newUsed).reverse()) {
      const e = puzzle.edges[i];
      if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) { newUsed.delete(i); break; }
    }
    setPath(newPath); setUsed(newUsed); setMessage(null);
  }

  function clearPath() { setPath([]); setUsed(new Set()); setMessage(null); }

  function submitGuess(g: boolean) {
    setGuess(g);
    setMessage({
      kind: g === verdict.drawable ? 'good' : 'bad',
      text: g === verdict.drawable
        ? `答对了！${verdict.reason}`
        : `不太对哦。${verdict.reason}`
    });
  }

  // 已用过的边（用于 hover 状态显示）
  const usedEdgeSet = used;

  return (
    <>
      <section className="hero">
        <p className="eyebrow">React + TypeScript · 触屏友好</p>
        <h1>一笔画 · 用手指画画 ✏️</h1>
        <p className="lead">
          按住一个点，<strong>不要松手</strong>，沿着线滑到下一个点。每条边只能画一次，
          画完所有边就成功啦！可以挑题、撤回、清空，也可以猜一下「能不能一笔画」。
        </p>
      </section>

      <section className="panel">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 700 }}>选题：</label>
          <select value={puzzleId} onChange={(e) => setPuzzleId(e.target.value)}>
            {PUZZLES.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button className="btn outline" onClick={undo} disabled={path.length === 0}>↩️ 撤一步</button>
          <button className="btn outline" onClick={clearPath} disabled={path.length === 0}>🧹 清空</button>
          <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
            <input type="checkbox" checked={showHints} onChange={(e) => setShowHints(e.target.checked)} />
            <span>显示度数提示</span>
          </label>
        </div>

        <p className="lead" style={{ margin: '.6rem 0' }}>
          <strong>{puzzle.title}</strong> · {puzzle.description}
        </p>

        <div className="graph-stage">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* 边 */}
            {puzzle.edges.map((e, i) => {
              const a = puzzle.vertices[e.a];
              const b = puzzle.vertices[e.b];
              // 处理重边：同样两点的多条边稍微弯一下
              const sameKey = `${Math.min(e.a,e.b)}-${Math.max(e.a,e.b)}`;
              const sameIdx = puzzle.edges
                .map((x, j) => ({ x, j }))
                .filter(({ x }) => `${Math.min(x.a,x.b)}-${Math.max(x.a,x.b)}` === sameKey)
                .findIndex(({ j }) => j === i);
              const sameTotal = puzzle.edges.filter(x => `${Math.min(x.a,x.b)}-${Math.max(x.a,x.b)}` === sameKey).length;
              const offset = (sameIdx - (sameTotal - 1) / 2) * 18;
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const dx = b.x - a.x, dy = b.y - a.y;
              const len = Math.hypot(dx, dy) || 1;
              const nx = -dy / len, ny = dx / len;
              const cx = mx + nx * offset;
              const cy = my + ny * offset;
              const isUsed = usedEdgeSet.has(i);
              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                  stroke={isUsed ? '#ff7e5f' : '#6b4f1f'}
                  strokeWidth={isUsed ? 6 : 3}
                  fill="none"
                  strokeLinecap="round"
                  opacity={isUsed ? 0.95 : 0.55}
                />
              );
            })}

            {/* 当前正在画的临时连线（手指还按着） */}
            {pointerXY && path.length > 0 && (
              (() => {
                const last = puzzle.vertices[path[path.length - 1]];
                return <line x1={last.x} y1={last.y} x2={pointerXY.x} y2={pointerXY.y}
                             stroke="#ff7e5f" strokeWidth={3} strokeDasharray="6 4" />;
              })()
            )}

            {/* 顶点 */}
            {puzzle.vertices.map((v, i) => {
              const isOdd = odd.includes(i);
              const isCurrent = path.length > 0 && path[path.length - 1] === i;
              return (
                <g key={i}>
                  <circle
                    cx={v.x} cy={v.y} r={VERTEX_R}
                    fill={isCurrent ? '#ffd97d' : (isOdd && showHints ? '#ffe3ec' : '#fffaf0')}
                    stroke={isOdd && showHints ? '#a61e4d' : '#3a2c1f'}
                    strokeWidth={isOdd && showHints ? 3 : 2}
                  />
                  {showHints && (
                    <text x={v.x} y={v.y + 4} textAnchor="middle"
                          fontSize="13" fontWeight="700"
                          fill={isOdd ? '#a61e4d' : '#3a2c1f'}>
                      {deg[i]}
                    </text>
                  )}
                  {v.label && (
                    <text x={v.x} y={v.y - VERTEX_R - 6} textAnchor="middle"
                          fontSize="12" fill="#6b4f1f">{v.label}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <p className="lead" style={{ margin: '.5rem 0' }}>
          已经画 <strong>{used.size}</strong> / {totalEdges} 条边
          {finished && '  ✅ 全部画完了！'}
        </p>

        <div className="legend">
          <span><span className="dot" style={{ background: '#a61e4d' }} />奇数度的点（粉色边框）</span>
          <span><span className="dot" style={{ background: '#ff7e5f' }} />已经画过的边</span>
          <span><span className="dot" style={{ background: '#6b4f1f' }} />还没画的边</span>
        </div>

        <div className="guess-bar">
          <button className="btn primary" onClick={() => submitGuess(true)} disabled={guess !== null}>✅ 我猜：能一笔画</button>
          <button className="btn outline" onClick={() => submitGuess(false)} disabled={guess !== null}>❌ 我猜：不能一笔画</button>
        </div>

        {message && (
          <div className={`guess-result ${message.kind === 'good' ? 'good' : message.kind === 'bad' ? 'bad' : ''}`}>
            {message.text}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>📚 欧拉的小规律</h2>
        <ul>
          <li>所有点的度数都是<strong>偶数</strong> → 能一笔画，而且回到起点（欧拉回路）。</li>
          <li>正好有<strong>两个奇数度</strong>的点 → 能一笔画，要从一个奇点出发，到另一个奇点结束。</li>
          <li>奇数度的点超过 2 个 → <strong>不能</strong>一笔画。</li>
        </ul>
      </section>
    </>
  );
}
