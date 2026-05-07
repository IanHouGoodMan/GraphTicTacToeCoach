import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GraphBasicsPage from './pages/GraphBasicsPage';
import VsComputerPage from './pages/VsComputerPage';
import EulerPracticePage from './pages/EulerPracticePage';

const NAV = [
  { to: '/', label: '🏠 首页', end: true },
  { to: '/basics', label: '📐 图论基础' },
  { to: '/vs-computer', label: '🧠 算法对战' },
  { to: '/euler', label: '✏️ 一笔画练习' }
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">📐 图论小学堂</div>
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
            <Route path="/vs-computer" element={<VsComputerPage />} />
            <Route path="/euler" element={<EulerPracticePage />} />
          </Routes>
        </div>
      </main>

      <footer className="page-footer">用图论玩转小学数学 · React + TypeScript 版</footer>
    </div>
  );
}
