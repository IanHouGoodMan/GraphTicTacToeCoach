import type { Board } from '../engine/ticTacToe';

interface Props {
  board: Board;
  size?: number;
  highlight?: number[];
  fill?: string;
}

/** 9 格迷你棋盘 SVG，可以塞进卡片或图节点里。 */
export default function MiniBoard({ board, size = 90, highlight = [], fill = '#fffaf0' }: Props) {
  return (
    <svg viewBox="0 0 90 90" width={size} height={size} className="mini-board" role="img">
      <rect x="0" y="0" width="90" height="90" rx="10" fill={fill} stroke="#3a2c1f" strokeWidth="1.5" />
      <line x1="30" y1="6" x2="30" y2="84" stroke="#3a2c1f" strokeWidth="1.2" />
      <line x1="60" y1="6" x2="60" y2="84" stroke="#3a2c1f" strokeWidth="1.2" />
      <line x1="6"  y1="30" x2="84" y2="30" stroke="#3a2c1f" strokeWidth="1.2" />
      <line x1="6"  y1="60" x2="84" y2="60" stroke="#3a2c1f" strokeWidth="1.2" />
      {board.map((ch, i) => {
        const cx = (i % 3) * 30 + 15;
        const cy = Math.floor(i / 3) * 30 + 15;
        const hi = highlight.includes(i);
        return (
          <g key={i}>
            {hi && <rect x={cx-14} y={cy-14} width={28} height={28} rx={4} fill="#ffe680" />}
            {ch === 'X' && (
              <>
                <line x1={cx-9} y1={cy-9} x2={cx+9} y2={cy+9} stroke="#d6336c" strokeWidth={3} strokeLinecap="round" />
                <line x1={cx+9} y1={cy-9} x2={cx-9} y2={cy+9} stroke="#d6336c" strokeWidth={3} strokeLinecap="round" />
              </>
            )}
            {ch === 'O' && (
              <circle cx={cx} cy={cy} r={9} fill="none" stroke="#1c7ed6" strokeWidth={3} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
