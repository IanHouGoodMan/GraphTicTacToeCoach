// 井字棋引擎 + 带「思考过程」的 minimax，用于传统搜索算法决策可视化。
export type Player = 'X' | 'O';
export type Cell = Player | ' ';
export type Board = Cell[]; // length 9

export const WIN_LINES: number[][] = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export const empty = (): Board => Array(9).fill(' ');
export const flip = (p: Player): Player => (p === 'X' ? 'O' : 'X');

export type Outcome = 'X' | 'O' | 'D' | ' ';

export function getWinner(b: Board): Outcome {
  for (const line of WIN_LINES) {
    const [a,c,d] = line;
    if (b[a] !== ' ' && b[a] === b[c] && b[c] === b[d]) return b[a] as Outcome;
  }
  return b.includes(' ') ? ' ' : 'D';
}

export function winningLine(b: Board): number[] {
  for (const line of WIN_LINES) {
    const [a,c,d] = line;
    if (b[a] !== ' ' && b[a] === b[c] && b[c] === b[d]) return line;
  }
  return [];
}

const memo = new Map<string, number>();
const key = (b: Board, t: Player) => b.join('') + ':' + t;

/** X 视角：+1 = X 胜，-1 = O 胜，0 = 和。 */
export function minimax(b: Board, turn: Player): number {
  const w = getWinner(b);
  if (w === 'X') return 1;
  if (w === 'O') return -1;
  if (w === 'D') return 0;
  const k = key(b, turn);
  const cached = memo.get(k);
  if (cached !== undefined) return cached;
  let best = turn === 'X' ? -2 : 2;
  for (let i = 0; i < 9; i++) {
    if (b[i] !== ' ') continue;
    b[i] = turn;
    const s = minimax(b, flip(turn));
    b[i] = ' ';
    best = turn === 'X' ? Math.max(best, s) : Math.min(best, s);
  }
  memo.set(k, best);
  return best;
}

export interface Candidate {
  index: number;
  score: number;        // X 视角
  outcomeForTurn: 'win' | 'lose' | 'draw';
  resultingBoard: Board;
}

export function candidates(b: Board, turn: Player): Candidate[] {
  const out: Candidate[] = [];
  for (let i = 0; i < 9; i++) {
    if (b[i] !== ' ') continue;
    const next = b.slice();
    next[i] = turn;
    const s = minimax(next.slice(), flip(turn));
    let oft: 'win' | 'lose' | 'draw' = 'draw';
    if (turn === 'X') oft = s === 1 ? 'win' : s === -1 ? 'lose' : 'draw';
    else oft = s === -1 ? 'win' : s === 1 ? 'lose' : 'draw';
    out.push({ index: i, score: s, outcomeForTurn: oft, resultingBoard: next });
  }
  return out;
}

/** 返回 turn 视角下「最好」的走法（可能多个并列）。 */
export function bestMoves(b: Board, turn: Player): number[] {
  const all = candidates(b, turn);
  if (all.length === 0) return [];
  const cmp = turn === 'X'
    ? (a: Candidate, b2: Candidate) => b2.score - a.score
    : (a: Candidate, b2: Candidate) => a.score - b2.score;
  all.sort(cmp);
  const top = all[0].score;
  return all.filter(c => c.score === top).map(c => c.index);
}

export const cellName = (i: number) => `第${Math.floor(i/3)+1}行第${i%3+1}列`;
