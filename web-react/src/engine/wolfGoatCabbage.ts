/**
 * 狼·羊·白菜 过河问题
 * 农夫要把「狼」「羊」「白菜」从左岸全部送到右岸。
 * 小船每次最多再带 1 样东西（农夫始终在船上）。
 * 规则：农夫不在场时，
 *   - 狼和羊不能单独在同一岸（狼会吃羊）
 *   - 羊和白菜不能单独在同一岸（羊会吃白菜）
 */

export type Side = 'L' | 'R';

export interface WGCState {
  wolf: Side;
  goat: Side;
  cab: Side;   // cabbage 白菜
  boat: Side;  // farmer + boat
}

function isWGCValid(s: WGCState): boolean {
  // Left bank without farmer
  if (s.boat !== 'L') {
    if (s.wolf === 'L' && s.goat === 'L') return false;
    if (s.goat === 'L' && s.cab === 'L') return false;
  }
  // Right bank without farmer
  if (s.boat !== 'R') {
    if (s.wolf === 'R' && s.goat === 'R') return false;
    if (s.goat === 'R' && s.cab === 'R') return false;
  }
  return true;
}

export function wgcKey(s: WGCState): string {
  return `${s.wolf}${s.goat}${s.cab}${s.boat}`;
}

export const wgcInitial: WGCState = { wolf: 'L', goat: 'L', cab: 'L', boat: 'L' };
export const wgcGoal: WGCState    = { wolf: 'R', goat: 'R', cab: 'R', boat: 'R' };

export type WGCPassenger = 'none' | 'wolf' | 'goat' | 'cab';

export const WGC_PASSENGER_LABELS: Record<WGCPassenger, string> = {
  none: '只有农夫',
  wolf: '带着狼 🐺',
  goat: '带着羊 🐑',
  cab:  '带着白菜 🥬',
};

export const WGC_ICONS: Record<'wolf' | 'goat' | 'cab', string> = {
  wolf: '🐺',
  goat: '🐑',
  cab:  '🥬',
};

export function wgcTryMove(s: WGCState, passenger: WGCPassenger): WGCState | null {
  const dest: Side = s.boat === 'L' ? 'R' : 'L';
  if (passenger !== 'none' && s[passenger] !== s.boat) return null; // passenger not on farmer's side
  const next: WGCState = {
    wolf: passenger === 'wolf' ? dest : s.wolf,
    goat: passenger === 'goat' ? dest : s.goat,
    cab:  passenger === 'cab'  ? dest : s.cab,
    boat: dest,
  };
  return isWGCValid(next) ? next : null;
}

export function wgcLegalMoves(s: WGCState): { passenger: WGCPassenger; next: WGCState }[] {
  const result: { passenger: WGCPassenger; next: WGCState }[] = [];
  for (const p of ['none', 'wolf', 'goat', 'cab'] as WGCPassenger[]) {
    const n = wgcTryMove(s, p);
    if (n) result.push({ passenger: p, next: n });
  }
  return result;
}

export interface WGCGraph {
  nodes: WGCState[];
  edges: { a: number; b: number }[];
  layers: number[][];
  distanceFromStart: Map<string, number>;
  parent: Map<string, { prev: string; passenger: WGCPassenger }>;
}

export function buildWGCGraph(): WGCGraph {
  const nodes: WGCState[] = [];
  const idx = new Map<string, number>();
  const dist = new Map<string, number>();
  const parent = new Map<string, { prev: string; passenger: WGCPassenger }>();
  const layers: number[][] = [];
  const edgesSet = new Set<string>();
  const edges: { a: number; b: number }[] = [];

  const add = (s: WGCState, d: number) => {
    const k = wgcKey(s);
    if (idx.has(k)) return;
    idx.set(k, nodes.length);
    nodes.push(s);
    dist.set(k, d);
    while (layers.length <= d) layers.push([]);
    layers[d].push(idx.get(k)!);
  };

  add(wgcInitial, 0);
  const queue: WGCState[] = [wgcInitial];
  while (queue.length) {
    const s = queue.shift()!;
    const sk = wgcKey(s);
    const d = dist.get(sk)!;
    for (const m of wgcLegalMoves(s)) {
      const nk = wgcKey(m.next);
      if (!idx.has(nk)) {
        add(m.next, d + 1);
        parent.set(nk, { prev: sk, passenger: m.passenger });
        queue.push(m.next);
      }
      const a = idx.get(sk)!, b2 = idx.get(nk)!;
      const eKey = a < b2 ? `${a}-${b2}` : `${b2}-${a}`;
      if (!edgesSet.has(eKey)) { edgesSet.add(eKey); edges.push({ a, b: b2 }); }
    }
  }
  return { nodes, edges, layers, distanceFromStart: dist, parent };
}

export function wgcShortestPath(g: WGCGraph): WGCState[] | null {
  const tk = wgcKey(wgcGoal);
  if (!g.distanceFromStart.has(tk)) return null;
  const path: WGCState[] = [];
  let cur = tk;
  while (true) {
    const node = g.nodes.find(n => wgcKey(n) === cur)!;
    path.unshift(node);
    const p = g.parent.get(cur);
    if (!p) break;
    cur = p.prev;
  }
  return path;
}
