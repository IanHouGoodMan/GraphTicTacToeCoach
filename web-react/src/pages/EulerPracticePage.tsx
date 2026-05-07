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
const HIT_R = 34;          // 透明热区半径，把可点击范围放大
const SNAP_R = 40;         // 拖动时手指吸附到顶点的半径
const TAP_MAX_MOVE = 14;   // 视为「点击」而不是「拖动」的最大位移（SVG 坐标）

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
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const pointerStartVertex = useRef<number>(-1);
  const movedFar = useRef(false);
  const activePointerId = useRef<number | null>(null);
  // Refs that mirror state so imperative touch handlers always get fresh values
  const pathRef = useRef<number[]>([]);
  const usedRef = useRef<Set<number>>(new Set());
  // Updated every render so touch handlers always call the latest closures
  const handlersRef = useRef<{
    startAt: (v: number) => void;
    tryAdvanceTo: (v: number, from?: number, usedOverride?: Set<number>) => void;
    nearestVertex: (p: { x: number; y: number }, radius?: number) => number;
  }>(null!);

  const verdict = useMemo(() => analyse(puzzle), [puzzle]);
  const odd = useMemo(() => oddVertices(puzzle), [puzzle]);
  const deg = useMemo(() => degrees(puzzle), [puzzle]);
  const totalEdges = puzzle.edges.length;
  const finished = used.size === totalEdges && totalEdges > 0;

  useEffect(() => {
    pathRef.current = [];
    usedRef.current = new Set();
    setPath([]); setUsed(new Set()); setGuess(null); setMessage(null);
  }, [puzzleId]);

  // Register non-passive touch listeners for iOS Safari.
  // React synthetic touch events are passive (can't preventDefault), so iOS ignores them.
  // We register once and delegate to handlersRef so handlers always have fresh closures.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const coord = (t: Touch): { x: number; y: number } => {
      const r = svg.getBoundingClientRect();
      return { x: (t.clientX - r.left) * STAGE_W / r.width, y: (t.clientY - r.top) * STAGE_H / r.height };
    };
    const onStart = (e: TouchEvent) => {
      e.preventDefault(); // must be non-passive to work on iOS
      const p = coord(e.changedTouches[0]);
      pointerStart.current = p;
      pointerStartVertex.current = handlersRef.current.nearestVertex(p, HIT_R);
      movedFar.current = false;
      dragging.current = true;
      setPointerXY(p);
    };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!dragging.current) return;
      const p = coord(e.changedTouches[0]);
      setPointerXY(p);
      if (pointerStart.current) {
        if (Math.hypot(p.x - pointerStart.current.x, p.y - pointerStart.current.y) > TAP_MAX_MOVE)
          movedFar.current = true;
      }
      if (!movedFar.current) return;
      const v = handlersRef.current.nearestVertex(p);
      if (v < 0) return;
      if (pathRef.current.length === 0) {
        const start = pointerStartVertex.current >= 0 ? pointerStartVertex.current : v;
        handlersRef.current.startAt(start);
        if (v !== start) handlersRef.current.tryAdvanceTo(v, start, new Set());
      } else {
        const last = pathRef.current[pathRef.current.length - 1];
        if (v !== last) handlersRef.current.tryAdvanceTo(v);
      }
    };
    const onEnd = (e: TouchEvent) => {
      e.preventDefault();
      const wasDragging = dragging.current;
      dragging.current = false;
      setPointerXY(null);
      if (!wasDragging) return;
      if (!movedFar.current) {
        // Treat as tap: advance to nearest vertex
        const p = coord(e.changedTouches[0]);
        const v = handlersRef.current.nearestVertex(p, HIT_R);
        if (v >= 0) {
          if (pathRef.current.length === 0) handlersRef.current.startAt(v);
          else handlersRef.current.tryAdvanceTo(v);
        }
      }
      pointerStart.current = null;
      pointerStartVertex.current = -1;
      movedFar.current = false;
    };
    svg.addEventListener('touchstart', onStart, { passive: false });
    svg.addEventListener('touchmove',  onMove,  { passive: false });
    svg.addEventListener('touchend',   onEnd,   { passive: false });
    svg.addEventListener('touchcancel',onEnd,   { passive: false });
    return () => {
      svg.removeEventListener('touchstart', onStart);
      svg.removeEventListener('touchmove',  onMove);
      svg.removeEventListener('touchend',   onEnd);
      svg.removeEventListener('touchcancel',onEnd);
    };
  }, []); // register once; state accessed via refs

  function svgPoint(e: React.PointerEvent): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const sx = STAGE_W / r.width;
    const sy = STAGE_H / r.height;
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  }

  function nearestVertex(p: { x: number; y: number }, radius: number = SNAP_R): number {
    let best = -1, bd = Infinity;
    for (let i = 0; i < puzzle.vertices.length; i++) {
      const v = puzzle.vertices[i];
      const d = Math.hypot(v.x - p.x, v.y - p.y);
      if (d < bd) { bd = d; best = i; }
    }
    return bd <= radius ? best : -1;
  }

  function startAt(v: number) {
    const newPath = [v];
    pathRef.current = newPath;   // sync ref immediately for imperative handlers
    usedRef.current = new Set();
    setPath(newPath);
    setUsed(new Set());
    setGuess(null);
    if (odd.length === 2 && !odd.includes(v)) {
      setMessage({
        kind: 'info',
        text: '提示：这个图有 2 个奇数度的点（粉色边框）。如果想一次画完，应从其中一个奇点出发、到另一个奇点结束。当然你也可以先自由探索，看看从偶点开始会在哪里卡住～'
      });
    } else {
      setMessage(null);
    }
  }

  function tryAdvanceTo(v: number, fromVertex?: number, usedOverride?: Set<number>) {
    if (pathRef.current.length === 0 && fromVertex === undefined) { startAt(v); return; }
    const last = fromVertex ?? pathRef.current[pathRef.current.length - 1];
    if (v === last) return;
    const baseUsed = usedOverride ?? usedRef.current;
    const ei = findEdgeIndex(puzzle, last, v, baseUsed);
    if (ei < 0) {
      setMessage({ kind: 'bad', text: '这条边走不了：可能两个点之间没有边，或者那条边已经画过了。' });
      return;
    }
    const newUsed = new Set(baseUsed); newUsed.add(ei);
    const newPath = fromVertex === undefined ? [...pathRef.current, v] : [fromVertex, v];
    pathRef.current = newPath;   // sync ref immediately
    usedRef.current = newUsed;
    setUsed(newUsed);
    setPath(newPath);
    setMessage(null);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'touch') return; // iOS touch handled imperatively above
    e.preventDefault();
    svgRef.current?.setPointerCapture?.(e.pointerId);
    activePointerId.current = e.pointerId;
    const p = svgPoint(e); if (!p) return;
    pointerStart.current = p;
    pointerStartVertex.current = nearestVertex(p, HIT_R);
    movedFar.current = false;
    dragging.current = true;
    setPointerXY(p);
    // 注意：点击模式等 pointerup 决定；拖动模式会优先使用这里记录的起点。
  }
  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerType === 'touch') return;
    if (!dragging.current) return;
    const p = svgPoint(e); if (!p) return;
    setPointerXY(p);
    if (pointerStart.current) {
      const d = Math.hypot(p.x - pointerStart.current.x, p.y - pointerStart.current.y);
      if (d > TAP_MAX_MOVE) movedFar.current = true;
    }
    if (!movedFar.current) return; // 还在「点击」判定区，不做事
    const v = nearestVertex(p);
    if (v >= 0) {
      if (path.length === 0) {
        const start = pointerStartVertex.current >= 0 ? pointerStartVertex.current : v;
        startAt(start);
        if (v !== start) tryAdvanceTo(v, start, new Set());
        return;
      }
      const last = path[path.length - 1];
      if (v !== last) tryAdvanceTo(v);
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerType === 'touch') return;
    const wasDragging = dragging.current;
    dragging.current = false;
    setPointerXY(null);
    if (activePointerId.current !== null) {
      try { svgRef.current?.releasePointerCapture?.(activePointerId.current); } catch { /* ignore */ }
      activePointerId.current = null;
    }
    if (!wasDragging) return;
    if (!movedFar.current) {
      // 「轻点」：当作 tap 处理，吸附到最近顶点
      const p = svgPoint(e); if (p) {
        const v = nearestVertex(p, HIT_R);
        if (v >= 0) {
          if (path.length === 0) startAt(v);
          else tryAdvanceTo(v);
        }
      }
    }
    pointerStart.current = null;
    pointerStartVertex.current = -1;
    movedFar.current = false;
  }

  function undo() {
    if (pathRef.current.length <= 1) {
      pathRef.current = []; usedRef.current = new Set();
      setPath([]); setUsed(new Set()); return;
    }
    const newPath = pathRef.current.slice(0, -1);
    const a = pathRef.current[pathRef.current.length - 2];
    const b = pathRef.current[pathRef.current.length - 1];
    const newUsed = new Set(usedRef.current);
    for (const i of Array.from(newUsed).reverse()) {
      const e = puzzle.edges[i];
      if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) { newUsed.delete(i); break; }
    }
    pathRef.current = newPath; usedRef.current = newUsed;
    setPath(newPath); setUsed(newUsed); setMessage(null);
  }

  function clearPath() {
    pathRef.current = []; usedRef.current = new Set();
    setPath([]); setUsed(new Set()); setMessage(null);
  }

  function submitGuess(g: boolean) {
    setGuess(g);
    setMessage({
      kind: g === verdict.drawable ? 'good' : 'bad',
      text: g === verdict.drawable
        ? `答对了！${verdict.reason}`
        : `不太对哦。${verdict.reason}`
    });
  }

  // Keep handlersRef current on every render so imperative touch listeners always call fresh closures
  handlersRef.current = { startAt, tryAdvanceTo, nearestVertex };

  // 已用过的边（用于 hover 状态显示）
  const usedEdgeSet = used;

  return (
    <>
      <section className="hero">
        <p className="eyebrow">触屏友好 · iPad / iPhone</p>
        <h1>一笔画 · 手指画画 ✏️</h1>
        <p className="lead">
          有两种玩法：① <strong>点一下起点</strong>，再点下一个点，一格一格走；
          ② 也可以<strong>按住起点滑动</strong>，沿着线一气呵成。每条边只能画一次，
          画完所有边就成功啦！
        </p>
        <p className="lead" style={{ marginTop: '.4rem' }}>
          💡 <strong>起点很重要</strong>：如果图里有 2 个奇数度的点（<span style={{color:'#a61e4d',fontWeight:700}}>粉色边框</span>），
          必须<strong>从奇点出发</strong>，否则走几步就会卡住～例如「房子」要从屋檐边上的点开始。
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
            style={{ touchAction: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
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
                  {/* 透明大热区，方便手指点击 */}
                  <circle cx={v.x} cy={v.y} r={HIT_R} fill="transparent" />
                  <circle
                    cx={v.x} cy={v.y} r={VERTEX_R}
                    fill={isCurrent ? '#ffd97d' : (isOdd && showHints ? '#ffe3ec' : '#fffaf0')}
                    stroke={isOdd && showHints ? '#a61e4d' : '#3a2c1f'}
                    strokeWidth={isOdd && showHints ? 3 : 2}
                    pointerEvents="none"
                  />
                  {showHints && (
                    <text x={v.x} y={v.y + 4} textAnchor="middle"
                          fontSize="13" fontWeight="700"
                          pointerEvents="none"
                          fill={isOdd ? '#a61e4d' : '#3a2c1f'}>
                      {deg[i]}
                    </text>
                  )}
                  {v.label && (
                    <text x={v.x} y={v.y - VERTEX_R - 6} textAnchor="middle"
                          pointerEvents="none"
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
          <div className={`guess-result ${message.kind === 'good' ? 'good' : message.kind === 'bad' ? 'bad' : 'info'}`}>
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
