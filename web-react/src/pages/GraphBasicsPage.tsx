import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function GraphBasicsPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">第 1 课 · 看得见的数学</p>
        <h1>什么是图论？📐</h1>
        <p className="lead">
          「图论」里的「图」，不是画画的图，而是<Link to="/concepts#vertex">点</Link>和<Link to="/concepts#edge">线</Link>组成的关系图。
          只要能用「谁和谁有关系」来描述的事情，都可以画成一张图。
        </p>
      </section>

      <section className="panel">
        <h2>① 点（顶点）和 边</h2>
        <p className="lead">
          每个圆圈是一个<Link to="/concepts#vertex">点</Link>（也叫顶点 vertex），把两个点连起来的线叫做一条<Link to="/concepts#edge">边</Link>（edge）。
          下面这张图里，4 个小朋友谁认识谁，就用边连起来。
        </p>
        <FriendsGraph />
        <ul>
          <li>小红和小明、小亮、小美都认识 → 小红连了 3 条边。</li>
          <li>「一个点上长出几条边」叫做这个点的 <strong>度数</strong>。小红的度数是 3。</li>
        </ul>
      </section>

      <section className="panel">
        <h2>② 路径 与 连通</h2>
        <p className="lead">
          沿着边一直走，从一个点走到另一个点，走过的边连起来就是一条<Link to="/concepts#path">路径</Link>（path）。
          如果图里任意两个点都有路径连通，这张图就是<Link to="/concepts#connected">连通的</Link>。
        </p>
        <PathDemo />
        <ul>
          <li>左边那张图，A 能不能走到 D？沿着边走一走就知道。</li>
          <li>右边那张图被分成了两块，叫做<strong>不连通</strong>。</li>
        </ul>
      </section>

      <section className="panel">
        <h2>③ 树：没有圈圈的连通图 🌳</h2>
        <p className="lead">
          如果一张连通的图里，怎么走都没办法绕回到同一个点，那就叫做一棵<Link to="/concepts#tree">树</Link>。
          家谱图、文件夹结构、井字棋的「下一步、再下一步」展开图，都是树。
        </p>
        <TreeDemo />
      </section>

      <section className="panel">
        <h2>④ 一笔画：欧拉的发现 ✏️</h2>
        <p className="lead">
          能不能不抬笔、不重复画一条边、把所有边都画完？这叫<strong>一笔画</strong>。
          数学家欧拉发现：只要数一数有几个点是<Link to="/concepts#degree">奇数度</Link>，就能马上判断。
        </p>
        <ul>
          <li>所有点都是偶数度 → 能一笔画，而且能回到起点。</li>
          <li>正好两个奇数度的点 → 能一笔画，要从一个奇点出发，到另一个奇点结束。</li>
          <li>奇数度的点超过 2 个 → <strong>不能</strong>一笔画。</li>
        </ul>
        <p className="lead">去 <a href="#/euler">一笔画练习</a> 自己画画看吧。</p>
      </section>

      <section className="panel">
        <h2>⑤ 有向图、加权图 与 最短路径 🛣️</h2>
        <p className="lead">
          前面说的边都是双向的：A 能到 B，B 也能到 A。但是有些关系是<strong>单向</strong>的，比如「A 妈妈是 B」。
          这种边带个箭头的图，叫做<Link to="/concepts#directed">有向图</Link>。
        </p>
        <p className="lead">
          有时候每条边还要标上「走这条要花多少钱」「走这条要多少分钟」，这叫做<Link to="/concepts#weighted">加权图</Link>。
          下面这张图，标在边上的数字就是「走这条边要花多少分钟」。
        </p>
        <WeightedDemo />
        <ul>
          <li>从 <strong>家</strong> 走到 <strong>学校</strong>，最快要多少分钟？这就是<Link to="/concepts#shortest-path">最短路径问题</Link>。</li>
          <li>把每条路想成一段时间，最短路径就是「加起来时间最少的那条」。</li>
          <li>电脑可以用一个叫 <Link to="/concepts#dijkstra">Dijkstra</Link> 的算法，从起点一层一层往外算，谁先被算到，谁就是最近的。</li>
        </ul>
        <p className="proof-note">
          💡 在 <a href="#/river">过河问题</a> 里也用了这个思路：把每种过河状态看成一个点，每次划船看成一条边，
          然后问「从开局到大家都过去，最少要划几次船？」 —— 这就是最短路径！
        </p>
      </section>

      <section className="panel">
        <h2>⑥ 把井字棋变成一张大图 ♟️</h2>
        <p className="lead">
          每一种棋盘的样子（局面）都可以看成一个<Link to="/concepts#vertex">点</Link>，每走一步棋就是从一个点走到另一个点的<Link to="/concepts#edge">边</Link>。
          这样井字棋整盘游戏就变成了一棵<Link to="/concepts#tree">巨大的树</Link>：根是空棋盘，往下分叉很多很多次。
        </p>
        <p className="lead">
          电脑玩井字棋，就是在这棵树上「往前看几步」，挑出最好的那条路走。
          这个方法叫 <Link to="/concepts#minimax">minimax</Link>（极小化极大），它是一个传统的<strong>搜索算法</strong>，
          不需要训练，靠的就是把所有可能想清楚。先去 <a href="#/proofs">数学证明</a> 看为什么可靠，
          再去 <a href="#/vs-computer">算法对战</a> 看它怎么思考。
        </p>
      </section>

      <section className="panel">
        <h2>📚 小词典</h2>
        <dl className="glossary">
          <dt>点（顶点 / vertex）</dt><dd>图里的一个圆圈。代表「一个东西」。</dd>
          <dt>边（edge）</dt><dd>把两个点连起来的线。代表「有关系 / 能走过去」。</dd>
          <dt>度数（degree）</dt><dd>一个点上有几条边。</dd>
          <dt>路径（path）</dt><dd>沿着边一直走出来的一串点。</dd>
          <dt>连通（connected）</dt><dd>任意两个点之间都能走通。</dd>
          <dt>树（tree）</dt><dd>连通的、没有圈圈的图。</dd>
          <dt>搜索算法</dt><dd>把可能的情况一个一个看过去，挑最好的。井字棋里的 minimax 就是。</dd>
          <dt>有向图</dt><dd>边带箭头，只能照着箭头走的图。</dd>
          <dt>加权图</dt><dd>每条边上写着一个数字（比如时间、距离），走过去要花这么多。</dd>
          <dt>最短路径</dt><dd>从一个点走到另一个点，「加起来最小」的那条路。</dd>
        </dl>
      </section>
    </>
  );
}

function FriendsGraph() {
  const nodes = useMemo(() => [
    { x: 80,  y: 80,  label: '小红' },
    { x: 260, y: 80,  label: '小明' },
    { x: 260, y: 220, label: '小亮' },
    { x: 80,  y: 220, label: '小美' }
  ], []);
  const edges = [[0,1],[0,2],[0,3],[1,2]];
  return (
    <svg viewBox="0 0 340 280" style={{ maxWidth: 420, width: '100%' }}>
      {edges.map(([a,b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
              stroke="#6b4f1f" strokeWidth={3} opacity={0.7} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={26} fill="#fff3d6" stroke="#3a2c1f" strokeWidth={2} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={14} fontWeight={700}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function PathDemo() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 260 220" style={{ width: '100%', maxWidth: 320 }}>
        {[[0,1],[1,2],[2,3],[0,3]].map(([a,b], i) => {
          const ns = [{x:50,y:50},{x:210,y:50},{x:210,y:170},{x:50,y:170}];
          return <line key={i} x1={ns[a].x} y1={ns[a].y} x2={ns[b].x} y2={ns[b].y}
                       stroke="#1c7ed6" strokeWidth={3} opacity={0.7} />;
        })}
        {['A','B','C','D'].map((lab, i) => {
          const ns = [{x:50,y:50},{x:210,y:50},{x:210,y:170},{x:50,y:170}];
          return (
            <g key={i}>
              <circle cx={ns[i].x} cy={ns[i].y} r={22} fill="#e7f5ff" stroke="#1864ab" strokeWidth={2} />
              <text x={ns[i].x} y={ns[i].y + 5} textAnchor="middle" fontSize={14} fontWeight={700}>{lab}</text>
            </g>
          );
        })}
        <text x={130} y={210} textAnchor="middle" fontSize={13} fill="#1864ab">连通图 ✅</text>
      </svg>
      <svg viewBox="0 0 260 220" style={{ width: '100%', maxWidth: 320 }}>
        {[[0,1],[2,3]].map(([a,b], i) => {
          const ns = [{x:60,y:60},{x:140,y:60},{x:170,y:160},{x:240,y:160}];
          return <line key={i} x1={ns[a].x} y1={ns[a].y} x2={ns[b].x} y2={ns[b].y}
                       stroke="#a61e4d" strokeWidth={3} opacity={0.7} />;
        })}
        {['A','B','C','D'].map((lab, i) => {
          const ns = [{x:60,y:60},{x:140,y:60},{x:170,y:160},{x:240,y:160}];
          return (
            <g key={i}>
              <circle cx={ns[i].x} cy={ns[i].y} r={22} fill="#ffe3ec" stroke="#a61e4d" strokeWidth={2} />
              <text x={ns[i].x} y={ns[i].y + 5} textAnchor="middle" fontSize={14} fontWeight={700}>{lab}</text>
            </g>
          );
        })}
        <text x={150} y={210} textAnchor="middle" fontSize={13} fill="#a61e4d">不连通 ❌</text>
      </svg>
    </div>
  );
}

function TreeDemo() {
  const ns = [
    { x: 180, y: 30,  label: '根' },
    { x: 90,  y: 110, label: '左' },
    { x: 270, y: 110, label: '右' },
    { x: 40,  y: 200, label: '·' },
    { x: 140, y: 200, label: '·' },
    { x: 230, y: 200, label: '·' },
    { x: 320, y: 200, label: '·' }
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  return (
    <svg viewBox="0 0 380 240" style={{ width: '100%', maxWidth: 480 }}>
      {edges.map(([a,b], i) => (
        <line key={i} x1={ns[a].x} y1={ns[a].y} x2={ns[b].x} y2={ns[b].y}
              stroke="#2b8a3e" strokeWidth={3} opacity={0.7} />
      ))}
      {ns.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={20} fill="#ebfbee" stroke="#2b8a3e" strokeWidth={2} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2b8a3e">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function WeightedDemo() {
  // 家 → ... → 学校：演示有向 + 加权 + 最短路径
  const N = [
    { x: 50,  y: 130, label: '家',   color: '#1864ab' },
    { x: 180, y: 50,  label: '公园', color: '#3a2c1f' },
    { x: 180, y: 210, label: '便利店', color: '#3a2c1f' },
    { x: 320, y: 130, label: '学校', color: '#b46a1a' }
  ];
  // [from, to, weight, isShortest]
  const E: [number, number, number, boolean][] = [
    [0, 1, 7, false],
    [0, 2, 4, true],
    [1, 3, 3, false],
    [2, 3, 5, true],
    [1, 2, 2, false]
  ];
  const arrow = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const ex = x2 - ux * 24, ey = y2 - uy * 24;
    const px = -uy, py = ux;
    const a1x = ex - ux * 8 + px * 5, a1y = ey - uy * 8 + py * 5;
    const a2x = ex - ux * 8 - px * 5, a2y = ey - uy * 8 - py * 5;
    return { ex, ey, points: `${ex},${ey} ${a1x},${a1y} ${a2x},${a2y}` };
  };
  return (
    <div>
      <svg viewBox="0 0 380 260" style={{ width: '100%', maxWidth: 520 }}>
        {E.map(([a, b, w, hi], i) => {
          const A = N[a], B = N[b];
          const ar = arrow(A.x, A.y, B.x, B.y);
          const stroke = hi ? '#2b8a3e' : '#6b5a43';
          const sw = hi ? 4 : 2.5;
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
          return (
            <g key={i}>
              <line x1={A.x} y1={A.y} x2={ar.ex} y2={ar.ey} stroke={stroke} strokeWidth={sw} opacity={0.85} />
              <polygon points={ar.points} fill={stroke} />
              <circle cx={mx} cy={my} r={10} fill="#fffaf0" stroke={stroke} />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={stroke}>{w}</text>
            </g>
          );
        })}
        {N.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={22} fill="#fff3d6" stroke={n.color} strokeWidth={2.5} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={n.color}>{n.label}</text>
          </g>
        ))}
      </svg>
      <p className="proof-note" style={{ marginTop: '.4rem' }}>
        从家走到学校，<strong>家 → 便利店 → 学校 = 4 + 5 = 9 分钟</strong>，比经过公园的路（7 + 3 = 10 分钟）更快。
        所以绿色那条就是最短路径。
      </p>
    </div>
  );
}
