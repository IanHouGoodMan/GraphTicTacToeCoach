import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GraphBasicsPage from './pages/GraphBasicsPage';
import ProofsPage from './pages/ProofsPage';
import VsComputerPage from './pages/VsComputerPage';
import EulerPracticePage from './pages/EulerPracticePage';
import RiverCrossingPage from './pages/RiverCrossingPage';

const NAV = [
  { to: '/', label: '🏠 首页', end: true },
  { to: '/basics', label: '📐 图论基础' },
  { to: '/proofs', label: '🔎 数学证明' },
  { to: '/vs-computer', label: '🧠 算法对战' },
  { to: '/euler', label: '✏️ 一笔画练习' },
  { to: '/river', label: '🚣 过河问题' }
];

export default function App() {
  return (
    <div className="app-shell">
      <div className="leibniz-banner" title="莱布尼茨的梦想：把推理变成计算">
        “<em>Calculemus!</em>” · 莱布尼茨说：别吵了，将各方意见写下来，计算一下就知道结果。
      </div>
      <header className="topbar">
        <div className="brand">📐 图论小课堂</div>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => 'nav-pill' + (isActive ? ' active' : '')}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-main">
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/basics" element={<GraphBasicsPage />} />
            <Route path="/proofs" element={<ProofsPage />} />
            <Route path="/vs-computer" element={<VsComputerPage />} />
            <Route path="/euler" element={<EulerPracticePage />} />
            <Route path="/river" element={<RiverCrossingPage />} />
          </Routes>
        </div>
      </main>

      <footer className="page-footer">图论小课堂 · 用图论玩转小学数学</footer>
    </div>
  );
}
