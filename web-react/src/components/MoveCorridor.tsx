import { useMemo } from 'react';
import MiniBoard from './MiniBoard';
import { type Board, type Player, empty, flip, getWinner, minimax } from '../engine/ticTacToe';

interface Props {
  board: Board;
  history: number[];
  firstPlayer?: Player;
}

interface Step {
  index: number;
  symbol: Player;
  boardAfter: Board;
  gamesRemaining: number;
  siblings: { index: number; boardAfter: Board; gamesRemaining: number; symbol: Player }[];
  verdict: { cls: string; badge: string; note: string };
}

const countMemo = new Map<string, number>();
function countPossibleGames(b: Board, turn: Player): number {
  if (getWinner(b) !== ' ') return 1;
  const k = b.join('') + ':' + turn;
  const c = countMemo.get(k); if (c !== undefined) return c;
  let s = 0;
  for (let i = 0; i < 9; i++) {
    if (b[i] !== ' ') continue;
    b[i] = turn;
    s += countPossibleGames(b, flip(turn));
    b[i] = ' ';
  }
  countMemo.set(k, s);
  return s;
}

function verdictFor(boardAfter: Board, mover: Player) {
  const w = getWinner(boardAfter);
  if (w === 'X') return { cls: 'win-x', badge: 'X 已经赢啦', note: '从这一步开始，比赛已经结束。' };
  if (w === 'O') return { cls: 'win-o', badge: 'O 已经赢啦', note: '从这一步开始，比赛已经结束。' };
  if (w === 'D') return { cls: 'draw', badge: '已经打平啦', note: '棋盘已满，谁都不能再赢啦。' };
  const next = flip(mover);
  const score = minimax(boardAfter.slice(), next);
  if (next === 'X' && score === 1)  return { cls: 'locked-x', badge: 'X 这时已稳稳会赢', note: '只要后面不乱下，X 一定能赢。' };
  if (next === 'X' && score === -1) return { cls: 'locked-o', badge: 'O 这时已稳稳会赢', note: '虽然轮到 X，可是 X 救不回来啦。' };
  if (next === 'O' && score === -1) return { cls: 'locked-o', badge: 'O 这时已稳稳会赢', note: '只要后面不乱下，O 一定能赢。' };
  if (next === 'O' && score === 1)  return { cls: 'locked-x', badge: 'X 这时已稳稳会赢', note: '虽然轮到 O，可是 O 救不回来啦。' };
  return { cls: 'locked-draw', badge: '这时已能保住平局', note: '只要两边都认真下，最后会打平。' };
}

const fmt = (n: number) => n.toLocaleString('en-US');

export default function MoveCorridor({ board: _board, history, firstPlayer = 'X' }: Props) {
  const data = useMemo(() => {
    const initial = countPossibleGames(empty(), firstPlayer);
    const working = empty();
    let turn: Player = firstPlayer;
    const steps: Step[] = [];
    for (const move of history) {
      const sibs: Step['siblings'] = [];
      const boardWinner = getWinner(working);
      if (boardWinner === ' ') {
        for (let i = 0; i < 9; i++) {
          if (i === move) continue;
          if (working[i] !== ' ') continue;
          working[i] = turn;
          const snap = working.slice() as Board;
          const rem = countPossibleGames(working, flip(turn));
          working[i] = ' ';
          sibs.push({ index: i, boardAfter: snap, gamesRemaining: rem, symbol: turn });
        }
      }
      working[move] = turn;
      const after = working.slice() as Board;
      const next = flip(turn);
      const remaining = getWinner(working) !== ' ' ? 1 : countPossibleGames(working, next);
      steps.push({
        index: move,
        symbol: turn,
        boardAfter: after,
        gamesRemaining: remaining,
        siblings: sibs,
        verdict: verdictFor(after, turn)
      });
      turn = next;
    }
    const current = steps.length === 0 ? initial : steps[steps.length - 1].gamesRemaining;
    return { initial, current, steps };
  }, [history, firstPlayer]);

  return (
    <div className="corridor">
      <div className="corridor-meta">
        <span className="corridor-pill">🌳 还剩 <strong>{fmt(data.current)}</strong> 种可能对局</span>
        {data.current < data.initial && (
          <span className="corridor-pill ghost">起点共 {fmt(data.initial)} 种</span>
        )}
      </div>

      <div className="corridor-track">
        <div className="corridor-step start">
          <div className="corridor-label">开局</div>
          <MiniBoard board={empty()} size={64} />
          <div className="corridor-count">{fmt(data.initial)} 种</div>
        </div>

        {data.steps.map((s, i) => (
          <Fragmented key={i}>
            <div className="corridor-arrow">→</div>
            <div className="corridor-step chosen">
              <div className="corridor-label">第 {i + 1} 步 · {s.symbol}</div>
              <MiniBoard board={s.boardAfter} size={64} />
              <div className="corridor-count">剩 {fmt(s.gamesRemaining)}</div>

              <div className={`corridor-verdict ${s.verdict.cls}`}>{s.verdict.badge}</div>
              <div className="corridor-verdict-note">{s.verdict.note}</div>

              {s.siblings.length > 0 && (
                <>
                  <div className="corridor-siblings" title="这些是当时没选的走法，整个分支都被剪掉了">
                    {s.siblings.map(sib => (
                      <div key={sib.index} className="corridor-sibling">
                        <MiniBoard board={sib.boardAfter} size={36} fill="#ececec" />
                        <span className="corridor-sibling-x">✕</span>
                      </div>
                    ))}
                  </div>
                  <div className="corridor-pruned">剪掉 {s.siblings.length} 种走法</div>
                </>
              )}
            </div>
          </Fragmented>
        ))}
      </div>
    </div>
  );
}

// 取代 React.Fragment 短写法以保留 key 行为
function Fragmented({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
