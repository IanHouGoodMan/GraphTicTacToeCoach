import { useEffect, useMemo, useRef, useState } from 'react';
import MiniBoard from '../components/MiniBoard';
import MoveCorridor from '../components/MoveCorridor';
import {
  bestMoves,
  candidates,
  cellName,
  empty,
  getWinner,
  type Board,
  type Candidate,
  type Player,
  winningLine
} from '../engine/ticTacToe';

type ThinkState = {
  step: number;
  evaluated: Candidate[];
  best: number[];
  log: { kind: 'eval' | 'prune' | 'pick'; text: string }[];
  done: boolean;
  pickedIndex?: number;
};

const HUMAN: Player = 'X';
const COMPUTER: Player = 'O';

export default function VsComputerPage() {
  const [board, setBoard] = useState<Board>(empty());
  const [history, setHistory] = useState<number[]>([]);
  const [turn, setTurn] = useState<Player>(HUMAN);
  const [think, setThink] = useState<ThinkState | null>(null);
  const timerRef = useRef<number | null>(null);

  const winner = getWinner(board);
  const winLine = useMemo(() => winningLine(board), [board]);
  const isOver = winner !== ' ';

  function play(i: number) {
    if (isOver || turn !== HUMAN || board[i] !== ' ') return;
    const next = board.slice();
    next[i] = HUMAN;
    setBoard(next);
    setHistory([...history, i]);
    setTurn(COMPUTER);
  }

  function reset() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setBoard(empty());
    setHistory([]);
    setTurn(HUMAN);
    setThink(null);
  }

  useEffect(() => {
    if (turn !== COMPUTER || isOver) return;
    const all = candidates(board, COMPUTER);
    const top = bestMoves(board, COMPUTER);
    const t: ThinkState = {
      step: 0,
      evaluated: [],
      best: top,
      log: [{ kind: 'eval', text: `轮到电脑（O）了。算法把 ${all.length} 种可走的位置全部展开成树的「子节点」，逐个打分。` }],
      done: false
    };
    setThink(t);

    let i = 0;
    const evaluated: Candidate[] = [];
    const tick = () => {
      if (i >= all.length) {
        const choice = top[Math.floor(Math.random() * top.length)];
        const why = describeChoice(all.find(c => c.index === choice)!);
        const finished: ThinkState = {
          ...t,
          step: all.length,
          evaluated,
          done: true,
          pickedIndex: choice,
          log: [
            ...t.log,
            { kind: 'pick', text: `🎯 算法选择走 ${cellName(choice)}：${why}` }
          ]
        };
        setThink(finished);
        timerRef.current = window.setTimeout(() => {
          const next = board.slice();
          next[choice] = COMPUTER;
          setBoard(next);
          setHistory(h => [...h, choice]);
          setTurn(HUMAN);
        }, 900);
        return;
      }
      const c = all[i];
      evaluated.push(c);
      const tag = describeOutcome(c);
      const isBest = top.includes(c.index);
      t.log.push({
        kind: isBest ? 'eval' : 'prune',
        text: `· ${cellName(c.index)} → ${tag}${isBest ? '（候选最佳）' : '（不是最优，剪枝）'}`
      });
      setThink({ ...t, step: i + 1, evaluated: evaluated.slice() });
      i++;
      timerRef.current = window.setTimeout(tick, 320);
    };
    timerRef.current = window.setTimeout(tick, 400);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isOver]);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">第 3 课 · 算法在思考</p>
        <h1>算法对战 · 看电脑怎么搜索 🧠</h1>
        <p className="lead">
          这里的电脑没有训练过，也不会学习。它用的是图论里很经典的传统算法：
          <strong>minimax 搜索算法</strong>：把所有可能的下一步当作「树的子节点」展开，
          逐个打分，再把不好的那些<strong>剪掉</strong>。
        </p>
      </section>

      <section className="panel">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div>
              <span className={`status-pill ${winner === 'X' ? 'x' : winner === 'O' ? 'o' : winner === 'D' ? 'draw' : (turn === 'X' ? 'x' : 'o')}`}>
                {winner === 'X' ? '🎉 你（X）赢啦！' :
                 winner === 'O' ? '🤖 电脑（O）赢了。' :
                 winner === 'D' ? '🤝 和局！' :
                 turn === HUMAN ? '轮到你走（X）' : '电脑搜索中…（O）'}
              </span>
            </div>
            <div className="board" style={{ marginTop: '.6rem' }}>
              {board.map((ch, i) => (
                <button
                  key={i}
                  className={`cell ${ch === 'O' ? 'o' : ''} ${winLine.includes(i) ? 'win' : ''}`}
                  onClick={() => play(i)}
                  disabled={isOver || turn !== HUMAN || ch !== ' '}
                  aria-label={cellName(i)}
                >
                  {ch === ' ' ? '' : ch}
                </button>
              ))}
            </div>
            <div className="actions">
              <button className="btn primary" onClick={reset}>🔄 重新开始</button>
            </div>
          </div>

          <ThinkerPanel think={think} />
        </div>
      </section>

      <section className="panel">
        <h2>🛤️ 走廊视图：每走一步，未来都在收缩</h2>
        <p className="lead">
          下面这条「走廊」把你们已经下过的每一步都画出来了。每一步下面那些灰色小棋盘，是当时本来也可以走的<strong>兄弟</strong>，
          现在都被剪掉了。每个亮色棋盘上还会标注「这一步之后结果是不是已经定了」。
        </p>
        <MoveCorridor board={board} history={history} />
      </section>

      <section className="panel">
        <h2>📚 这就是图论里的「博弈树搜索」</h2>
        <ul>
          <li>每个棋盘的样子是图里的一个 <strong>节点</strong>。</li>
          <li>每走一步棋是从一个节点连到另一个节点的 <strong>边</strong>。</li>
          <li>井字棋整盘游戏是一棵<strong>巨大的树</strong>，根是空棋盘。</li>
          <li><strong>minimax</strong>：站在 X 的角度想最大分，站在 O 的角度想最小分，两边都最聪明地下棋时算结果。</li>
          <li><strong>剪枝</strong>：已经知道某条分支不会更好，就不再往下算了。</li>
        </ul>
      </section>
    </>
  );
}

function describeOutcome(c: Candidate): string {
  if (c.outcomeForTurn === 'win') return '电脑会赢 ✅';
  if (c.outcomeForTurn === 'lose') return '电脑会输 ❌';
  return '会和局 🤝';
}
function describeChoice(c: Candidate): string {
  if (c.outcomeForTurn === 'win') return '走这里电脑能赢。';
  if (c.outcomeForTurn === 'draw') return '赢不了的话，这一手能保住和局。';
  return '已经没办法不输了，挑一个走。';
}

function ThinkerPanel({ think }: { think: ThinkState | null }) {
  if (!think) {
    return (
      <div className="thinker" style={{ flex: 1, minWidth: 280 }}>
        <div className="panel" style={{ background: '#fff', margin: 0 }}>
          <p className="lead" style={{ margin: 0 }}>
            轮到你的时候这里会安静下来。轮到电脑时，会把每一种走法都摆出来给你看。
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="thinker" style={{ flex: 1, minWidth: 280 }}>
      <div>
        <h3 style={{ margin: '0 0 .4rem' }}>算法正在评估的走法</h3>
        <div className="candidate-grid">
          {think.evaluated.map((c, idx) => {
            const isCurrent = idx === think.evaluated.length - 1 && !think.done;
            const isBest = think.best.includes(c.index);
            const isPicked = think.done && think.pickedIndex === c.index;
            const cls =
              'candidate' +
              (isCurrent ? ' evaluating' : '') +
              (think.done && !isBest ? ' pruned' : '') +
              (isBest ? ' best' : '') +
              (isPicked ? ' chosen' : '');
            const tagCls =
              c.outcomeForTurn === 'win' ? 'win' :
              c.outcomeForTurn === 'lose' ? 'lose' : 'draw';
            return (
              <div key={c.index} className={cls}>
                <MiniBoard board={c.resultingBoard} size={68} />
                <span className={`candidate-tag ${tagCls}`}>
                  {c.outcomeForTurn === 'win' ? '电脑会赢' : c.outcomeForTurn === 'lose' ? '电脑会输' : '会和局'}
                </span>
                <small style={{ color: '#6b5a43' }}>{cellName(c.index)}</small>
              </div>
            );
          })}
        </div>
      </div>

      <div className="thought-log" aria-live="polite">
        {think.log.map((l, i) => (
          <p key={i} className={l.kind === 'pick' ? 'hl' : l.kind === 'prune' ? 'pr' : ''}>{l.text}</p>
        ))}
      </div>
    </div>
  );
}
