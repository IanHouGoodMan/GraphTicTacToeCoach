import { useState, useMemo, useCallback } from 'react';
import { scenes } from '../components/RandomGeometryCard';

interface Choice {
  title: string;
  correct: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(correctIdx: number): Choice[] {
  const correctTitle = scenes[correctIdx].title;
  const otherTitles = scenes
    .filter((_, i) => i !== correctIdx)
    .map(s => s.title);
  const wrong3 = shuffle(otherTitles).slice(0, 3);
  return shuffle([
    { title: correctTitle, correct: true },
    ...wrong3.map(t => ({ title: t, correct: false })),
  ]);
}

export default function GuessArtPage() {
  const [sceneIdx, setSceneIdx] = useState(() =>
    Math.floor(Math.random() * scenes.length)
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const scene = scenes[sceneIdx];
  const choices = useMemo(() => buildChoices(sceneIdx), [sceneIdx]);

  const nextScene = useCallback(() => {
    setSceneIdx(prev => {
      let next = Math.floor(Math.random() * scenes.length);
      if (scenes.length > 1) {
        while (next === prev) next = Math.floor(Math.random() * scenes.length);
      }
      return next;
    });
    setSelected(null);
    setRevealed(false);
  }, []);

  const confirm = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    setScore(s => ({
      correct: s.correct + (selected === scene.title ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const isCorrect = selected === scene.title;

  return (
    <div className="guess-art-page">
      <div className="guess-art-header">
        <div>
          <h2 className="guess-art-title">我画你猜</h2>
          <p className="guess-art-subtitle">看图选出你觉得画的是什么</p>
        </div>
        <div className={`guess-score-badge ${score.total > 0 ? 'active' : ''}`}>
          {score.total === 0 ? (
            <span>准备好了吗？</span>
          ) : (
            <>
              <span className="guess-score-num">{score.correct}</span>
              <span className="guess-score-sep">/</span>
              <span className="guess-score-total">{score.total}</span>
            </>
          )}
        </div>
      </div>

      <div className="guess-art-scene" style={{ background: scene.bg }}>
        <svg
          className="guess-art-svg"
          viewBox="0 0 224 176"
          role="img"
          aria-label="猜一猜这幅图画的是什么"
        >
          <rect x="0" y="0" width="224" height="176" fill={scene.bg} />
          <circle cx="28" cy="30" r="8" fill={scene.accent} opacity="0.28" />
          <rect
            x="188" y="126" width="18" height="18"
            fill={scene.accent} opacity="0.22"
            transform="rotate(12 197 135)"
          />
          <path d="M20 154 H204" stroke="#0f172a" strokeWidth="2" opacity="0.08" />
          {scene.render(scene.accent)}
        </svg>
      </div>

      {!revealed ? (
        <>
          <div className="guess-choices">
            {choices.map(c => (
              <button
                key={c.title}
                className={`guess-choice-btn${selected === c.title ? ' selected' : ''}`}
                onClick={() => setSelected(c.title)}
              >
                {c.title}
              </button>
            ))}
          </div>
          <div className="guess-actions">
            <button
              className="btn primary"
              onClick={confirm}
              disabled={!selected}
            >
              就是这个！
            </button>
            <button className="btn outline" onClick={nextScene}>
              跳过，下一幅 →
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={`guess-result-banner ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="guess-result-icon">{isCorrect ? '🎉' : '😅'}</div>
            <div className="guess-result-text">
              {isCorrect ? (
                <strong>答对了！就是「{scene.title}」</strong>
              ) : (
                <>
                  <strong>答案是「{scene.title}」</strong>
                  <span>你选的是「{selected}」</span>
                </>
              )}
              <em className="guess-result-note">{scene.note}</em>
            </div>
          </div>
          <div className="guess-actions">
            <button className="btn primary" onClick={nextScene}>
              下一幅 →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
