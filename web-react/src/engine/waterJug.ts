/**
 * 倒水问题（经典水壶谜题）
 * 有一个 3 升的壶和一个 5 升的壶，还有一个大水缸（水无限）。
 * 目标：量出恰好 4 升水（放在大壶里）。
 *
 * 操作：装满 / 倒空 / 从一个壶往另一个壶倒水。
 * 这是 BFS 解决「量水」类型谜题的经典示范。
 */

export interface JugState {
  s: number; // small jug（3 升）
  b: number; // big jug（5 升）
}

export const JUG_S = 3;
export const JUG_B = 5;
export const JUG_TARGET = 4; // 目标水量（放在大壶里）

export function jugKey(j: JugState): string { return `${j.s}-${j.b}`; }

export const jugInitial: JugState = { s: 0, b: 0 };

export function jugIsGoal(j: JugState): boolean {
  return j.s === JUG_TARGET || j.b === JUG_TARGET;
}

export type JugMove = 'fillS' | 'fillB' | 'emptyS' | 'emptyB' | 'pourSB' | 'pourBS';

export const JUG_MOVE_LABELS: Record<JugMove, string> = {
  fillS:  '装满小壶（3 升）',
  fillB:  '装满大壶（5 升）',
  emptyS: '倒空小壶',
  emptyB: '倒空大壶',
  pourSB: '把小壶倒进大壶',
  pourBS: '把大壶倒进小壶',
};

export function jugTryMove(j: JugState, move: JugMove): JugState | null {
  switch (move) {
    case 'fillS':  return j.s === JUG_S ? null : { ...j, s: JUG_S };
    case 'fillB':  return j.b === JUG_B ? null : { ...j, b: JUG_B };
    case 'emptyS': return j.s === 0 ? null : { ...j, s: 0 };
    case 'emptyB': return j.b === 0 ? null : { ...j, b: 0 };
    case 'pourSB': {
      if (j.s === 0 || j.b === JUG_B) return null;
      const pour = Math.min(j.s, JUG_B - j.b);
      return { s: j.s - pour, b: j.b + pour };
    }
    case 'pourBS': {
      if (j.b === 0 || j.s === JUG_S) return null;
      const pour = Math.min(j.b, JUG_S - j.s);
      return { s: j.s + pour, b: j.b - pour };
    }
  }
}

const ALL_MOVES: JugMove[] = ['fillS', 'fillB', 'emptyS', 'emptyB', 'pourSB', 'pourBS'];

export function jugLegalMoves(j: JugState): { move: JugMove; next: JugState }[] {
  return ALL_MOVES
    .map(m => ({ move: m, next: jugTryMove(j, m) }))
    .filter((x): x is { move: JugMove; next: JugState } => x.next !== null);
}

export interface JugGraph {
  nodes: JugState[];
  edges: { a: number; b: number }[];
  layers: number[][];
  distanceFromStart: Map<string, number>;
  parent: Map<string, { prev: string; move: JugMove }>;
}

export function buildJugGraph(): JugGraph {
  const nodes: JugState[] = [];
  const idx = new Map<string, number>();
  const dist = new Map<string, number>();
  const parent = new Map<string, { prev: string; move: JugMove }>();
  const layers: number[][] = [];
  const edgesSet = new Set<string>();
  const edges: { a: number; b: number }[] = [];

  const add = (s: JugState, d: number) => {
    const k = jugKey(s);
    if (idx.has(k)) return;
    idx.set(k, nodes.length);
    nodes.push(s);
    dist.set(k, d);
    while (layers.length <= d) layers.push([]);
    layers[d].push(idx.get(k)!);
  };

  add(jugInitial, 0);
  const queue: JugState[] = [jugInitial];
  while (queue.length) {
    const s = queue.shift()!;
    const sk = jugKey(s);
    const d = dist.get(sk)!;
    for (const m of jugLegalMoves(s)) {
      const nk = jugKey(m.next);
      if (!idx.has(nk)) {
        add(m.next, d + 1);
        parent.set(nk, { prev: sk, move: m.move });
        queue.push(m.next);
      }
      const a = idx.get(sk)!, b2 = idx.get(nk)!;
      const eKey = a < b2 ? `${a}-${b2}` : `${b2}-${a}`;
      if (!edgesSet.has(eKey)) { edgesSet.add(eKey); edges.push({ a, b: b2 }); }
    }
  }
  return { nodes, edges, layers, distanceFromStart: dist, parent };
}

export function jugShortestPath(g: JugGraph): JugState[] | null {
  let bestDist = Infinity;
  let bestKey: string | null = null;
  for (const n of g.nodes) {
    if (jugIsGoal(n)) {
      const d = g.distanceFromStart.get(jugKey(n)) ?? Infinity;
      if (d < bestDist) { bestDist = d; bestKey = jugKey(n); }
    }
  }
  if (!bestKey) return null;
  const path: JugState[] = [];
  let cur = bestKey;
  while (true) {
    const node = g.nodes.find(n => jugKey(n) === cur)!;
    path.unshift(node);
    const p = g.parent.get(cur);
    if (!p) break;
    cur = p.prev;
  }
  return path;
}
