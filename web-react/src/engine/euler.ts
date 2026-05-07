// 一笔画 / Euler 路径引擎与题库。
export interface VertexPos { x: number; y: number; label?: string; }
export interface Edge { a: number; b: number; }
export interface GraphPuzzle {
  id: string;
  title: string;
  description: string;
  drawable: boolean; // 期望答案：是否可一笔画
  vertices: VertexPos[];
  edges: Edge[];
}

export function degrees(p: GraphPuzzle): number[] {
  const d = Array(p.vertices.length).fill(0);
  for (const e of p.edges) { d[e.a]++; d[e.b]++; }
  return d;
}

export function oddVertices(p: GraphPuzzle): number[] {
  return degrees(p).map((d, i) => ({ d, i })).filter(x => x.d % 2 === 1).map(x => x.i);
}

export function isConnected(p: GraphPuzzle): boolean {
  if (p.edges.length === 0) return p.vertices.length <= 1;
  const adj: number[][] = p.vertices.map(() => []);
  for (const e of p.edges) { adj[e.a].push(e.b); adj[e.b].push(e.a); }
  const used = new Set<number>();
  for (let i = 0; i < p.vertices.length; i++) {
    if (adj[i].length > 0) { used.add(i); break; }
  }
  if (used.size === 0) return false;
  const stack = [...used];
  while (stack.length) {
    const v = stack.pop()!;
    for (const u of adj[v]) if (!used.has(u)) { used.add(u); stack.push(u); }
  }
  for (let i = 0; i < p.vertices.length; i++) {
    if (adj[i].length > 0 && !used.has(i)) return false;
  }
  return true;
}

export type Verdict = {
  drawable: boolean;
  reason: string;
  odd: number[];
};

export function analyse(p: GraphPuzzle): Verdict {
  const odd = oddVertices(p);
  if (!isConnected(p)) return { drawable: false, reason: '图不是连通的，没法用一笔画到所有边。', odd };
  if (odd.length === 0) return { drawable: true, reason: '所有点都是偶数度，存在欧拉回路：可以一笔画，而且能回到起点。', odd };
  if (odd.length === 2) return { drawable: true, reason: '正好有两个奇数度的点，存在欧拉路径：可以从一个奇点出发，走到另一个奇点。', odd };
  return { drawable: false, reason: `奇数度的点有 ${odd.length} 个，超过 2 个时无法一笔画。`, odd };
}

/** 找出某条边在 edges 中的索引（无向匹配）。 */
export function findEdgeIndex(p: GraphPuzzle, a: number, b: number, used: Set<number>): number {
  for (let i = 0; i < p.edges.length; i++) {
    if (used.has(i)) continue;
    const e = p.edges[i];
    if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) return i;
  }
  return -1;
}

/** 题库：故意混合了「能画」与「不能画」。 */
export function buildPuzzles(): GraphPuzzle[] {
  return [
    {
      id: 'envelope',
      title: '信封 ✉️',
      description: '有名的信封图。猜猜能不能一笔画？',
      drawable: true,
      vertices: [
        { x: 80,  y: 240, label: 'A' },
        { x: 280, y: 240, label: 'B' },
        { x: 280, y: 80,  label: 'C' },
        { x: 80,  y: 80,  label: 'D' },
        { x: 180, y: 20,  label: 'E' }
      ],
      edges: [
        { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 },
        { a: 0, b: 2 }, { a: 1, b: 3 },
        { a: 3, b: 4 }, { a: 2, b: 4 }
      ]
    },
    {
      id: 'square-with-x',
      title: '田字 ✕',
      description: '正方形加两条对角线。注意奇点的数量。',
      drawable: false,
      vertices: [
        { x: 80,  y: 80,  label: 'A' },
        { x: 280, y: 80,  label: 'B' },
        { x: 280, y: 240, label: 'C' },
        { x: 80,  y: 240, label: 'D' }
      ],
      edges: [
        { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 },
        { a: 0, b: 2 }, { a: 1, b: 3 }
      ]
    },
    {
      id: 'house',
      title: '房子 🏠',
      description: '小朋友爱画的「房子图」，能一笔画吗？',
      drawable: true,
      vertices: [
        { x: 80,  y: 240, label: 'A' },
        { x: 280, y: 240, label: 'B' },
        { x: 280, y: 140, label: 'C' },
        { x: 80,  y: 140, label: 'D' },
        { x: 180, y: 60,  label: 'E' }
      ],
      edges: [
        { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 },
        { a: 3, b: 4 }, { a: 2, b: 4 }
      ]
    },
    {
      id: 'k5',
      title: '五点全连 K₅',
      description: '五个点两两相连。所有点的度数都是 4。',
      drawable: true,
      vertices: [
        { x: 180, y: 30 },
        { x: 320, y: 130 },
        { x: 270, y: 270 },
        { x: 90,  y: 270 },
        { x: 40,  y: 130 }
      ],
      edges: [
        {a:0,b:1},{a:0,b:2},{a:0,b:3},{a:0,b:4},
        {a:1,b:2},{a:1,b:3},{a:1,b:4},
        {a:2,b:3},{a:2,b:4},
        {a:3,b:4}
      ]
    },
    {
      id: 'konigsberg',
      title: '七桥 🌉',
      description: '哥尼斯堡七桥，欧拉就是从这里发现规律的。',
      drawable: false,
      vertices: [
        { x: 60,  y: 150, label: 'A' },
        { x: 180, y: 60,  label: 'B' },
        { x: 180, y: 240, label: 'C' },
        { x: 300, y: 150, label: 'D' }
      ],
      edges: [
        {a:0,b:1},{a:0,b:1},
        {a:0,b:2},{a:0,b:2},
        {a:0,b:3},
        {a:1,b:3},
        {a:2,b:3}
      ]
    }
  ];
}
