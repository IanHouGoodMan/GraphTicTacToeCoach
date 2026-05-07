// 过河问题（传教士与野人 / 大人与小朋友）状态图引擎
// 把现实问题变成「图」：每个合法状态 = 一个点；每个合法的一次划船 = 一条边。

export type Side = 'L' | 'R';

export interface State {
  // 左岸的大人 / 小朋友数量
  lb: number; // left bigs (0..3)
  lk: number; // left kids (0..3)
  boat: Side; // 船现在停在哪一岸
}

export const TOTAL_BIG = 3;
export const TOTAL_KID = 3;
export const BOAT_CAP = 2;

export const initialState: State = { lb: TOTAL_BIG, lk: TOTAL_KID, boat: 'L' };
export const goalState: State = { lb: 0, lk: 0, boat: 'R' };

export function rb(s: State): number { return TOTAL_BIG - s.lb; } // right bigs
export function rk(s: State): number { return TOTAL_KID - s.lk; } // right kids

export function key(s: State): string { return `${s.lb}-${s.lk}-${s.boat}`; }

/** 一岸合法的判定：若该岸还有大人，则小朋友数量不能超过大人数量。 */
export function sideOk(bigs: number, kids: number): boolean {
  if (bigs < 0 || kids < 0) return false;
  if (bigs > TOTAL_BIG || kids > TOTAL_KID) return false;
  return bigs === 0 || kids <= bigs;
}

export function isValidState(s: State): boolean {
  if (s.lb < 0 || s.lk < 0 || s.lb > TOTAL_BIG || s.lk > TOTAL_KID) return false;
  return sideOk(s.lb, s.lk) && sideOk(rb(s), rk(s));
}

/** 把 (b, k) 个人从 boat 所在岸划到对岸，返回新状态；若不合法返回 null。 */
export function tryMove(s: State, b: number, k: number): State | null {
  if (b < 0 || k < 0) return null;
  const total = b + k;
  if (total < 1 || total > BOAT_CAP) return null;
  // 船所在岸要有这么多人
  const fromB = s.boat === 'L' ? s.lb : rb(s);
  const fromK = s.boat === 'L' ? s.lk : rk(s);
  if (b > fromB || k > fromK) return null;
  const dir = s.boat === 'L' ? -1 : +1; // 从左到右：左岸减；从右到左：左岸加
  const next: State = {
    lb: s.lb + dir * b,
    lk: s.lk + dir * k,
    boat: s.boat === 'L' ? 'R' : 'L'
  };
  if (!isValidState(next)) return null;
  return next;
}

/** 列出当前状态所有合法的下一步（去重的 (b,k) 组合）。 */
export function legalMoves(s: State): { b: number; k: number; next: State }[] {
  const out: { b: number; k: number; next: State }[] = [];
  for (let b = 0; b <= BOAT_CAP; b++) {
    for (let k = 0; k <= BOAT_CAP - b; k++) {
      if (b + k === 0) continue;
      const n = tryMove(s, b, k);
      if (n) out.push({ b, k, next: n });
    }
  }
  return out;
}

export interface GraphData {
  nodes: State[];               // 所有可达状态
  edges: { a: number; b: number }[]; // 状态下标之间的边
  layers: number[][];           // BFS 分层（按距离 initial 的步数）
  distanceFromStart: Map<string, number>;
  parent: Map<string, { prev: string; b: number; k: number }>;
}

/** 从 initialState 做 BFS，得到全部可达状态、层次和最短路径父指针。 */
export function buildGraph(): GraphData {
  const nodes: State[] = [];
  const idx = new Map<string, number>();
  const dist = new Map<string, number>();
  const parent = new Map<string, { prev: string; b: number; k: number }>();
  const layers: number[][] = [];

  const add = (s: State, d: number) => {
    const k = key(s);
    if (idx.has(k)) return;
    idx.set(k, nodes.length);
    nodes.push(s);
    dist.set(k, d);
    while (layers.length <= d) layers.push([]);
    layers[d].push(idx.get(k)!);
  };

  add(initialState, 0);
  const queue: State[] = [initialState];
  const edgesSet = new Set<string>();
  const edges: { a: number; b: number }[] = [];
  while (queue.length) {
    const s = queue.shift()!;
    const sk = key(s);
    const d = dist.get(sk)!;
    for (const m of legalMoves(s)) {
      const nk = key(m.next);
      if (!idx.has(nk)) {
        add(m.next, d + 1);
        parent.set(nk, { prev: sk, b: m.b, k: m.k });
        queue.push(m.next);
      }
      const a = idx.get(sk)!, b2 = idx.get(nk)!;
      const eKey = a < b2 ? `${a}-${b2}` : `${b2}-${a}`;
      if (!edgesSet.has(eKey)) { edgesSet.add(eKey); edges.push({ a, b: b2 }); }
    }
  }
  return { nodes, edges, layers, distanceFromStart: dist, parent };
}

/** 还原从 initial 到目标的最短路径（状态序列）。 */
export function shortestPath(g: GraphData, target: State = goalState): State[] | null {
  const tk = key(target);
  if (!g.distanceFromStart.has(tk)) return null;
  const path: State[] = [];
  let curK = tk;
  while (curK !== key(initialState)) {
    const idx = g.nodes.findIndex(n => key(n) === curK);
    if (idx < 0) return null;
    path.push(g.nodes[idx]);
    const p = g.parent.get(curK);
    if (!p) return null;
    curK = p.prev;
  }
  path.push(initialState);
  return path.reverse();
}
