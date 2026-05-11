import type { State } from '../../engine/riverCrossing';
import { rb, rk } from '../../engine/riverCrossing';

export function RoleAvatar({ kind }: { kind: 'missionary' | 'cannibal' }) {
  const label = kind === 'missionary' ? '传' : '野';
  const title = kind === 'missionary' ? '传教士' : '野人';
  return (
    <span className={`role-avatar ${kind}`} title={title} aria-label={title}>
      <span className="role-avatar-halo" />
      <span className="role-avatar-face">{label}</span>
    </span>
  );
}

function BankPeople({ bigs, kids }: { bigs: number; kids: number }) {
  return (
    <div className="river-people">
      {Array.from({ length: bigs }, (_, i) => <RoleAvatar key={'b' + i} kind="missionary" />)}
      {Array.from({ length: kids }, (_, i) => <RoleAvatar key={'k' + i} kind="cannibal" />)}
      {bigs === 0 && kids === 0 && <span className="person empty">（空）</span>}
    </div>
  );
}

export function RiverScene({ state }: { state: State }) {
  return (
    <div className="river-scene" aria-label="过河场景">
      <div className="river-bank river-bank-l">
        <div className="river-bank-title">左岸</div>
        <BankPeople bigs={state.lb} kids={state.lk} />
      </div>
      <div className={'river-water ' + (state.boat === 'L' ? 'boat-left' : 'boat-right')}>
        <div className="river-boat-icon">🚣</div>
      </div>
      <div className="river-bank river-bank-r">
        <div className="river-bank-title">右岸</div>
        <BankPeople bigs={rb(state)} kids={rk(state)} />
      </div>
    </div>
  );
}
