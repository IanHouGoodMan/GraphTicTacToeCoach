import type { State } from '../../engine/riverCrossing';
import { rb, rk } from '../../engine/riverCrossing';
import { RoleAvatar } from './RiverScene';

export function StateChip({ state }: { state: State }) {
  return (
    <div className="state-chip">
      <div className="state-chip-row">
        <span title="左岸传教士"><RoleAvatar kind="missionary" /> ×{state.lb}</span>
        <span title="左岸野人"><RoleAvatar kind="cannibal" /> ×{state.lk}</span>
      </div>
      <div className="state-chip-mid">{state.boat === 'L' ? '🚣 ⇠' : '⇢ 🚣'}</div>
      <div className="state-chip-row">
        <span title="右岸传教士"><RoleAvatar kind="missionary" /> ×{rb(state)}</span>
        <span title="右岸野人"><RoleAvatar kind="cannibal" /> ×{rk(state)}</span>
      </div>
    </div>
  );
}

export function LegalMovesPanel({ moves }: { moves: { b: number; k: number; next: State }[] }) {
  return (
    <div className="river-legal">
      <p style={{ margin: 0, fontWeight: 700 }}>当前可以这样划：</p>
      {moves.length === 0 && <p>这一步好像谁都不能走了…试试 ↩️ 撤一步。</p>}
      <ul style={{ paddingLeft: '1.1rem', margin: '.3rem 0' }}>
        {moves.map((m, i) => (
          <li key={i}>
            带 <strong>{m.b}</strong> 个传教士 + <strong>{m.k}</strong> 个野人划过去
          </li>
        ))}
      </ul>
      <p className="proof-note" style={{ margin: 0, fontSize: '.8rem' }}>
        每一种合法划船，都是图里从「当前点」到下一个点的一条边。
      </p>
    </div>
  );
}
