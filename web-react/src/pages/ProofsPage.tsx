import { Link } from 'react-router-dom';

export default function ProofsPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">第 2 课 · 会说明理由的数学</p>
        <h1>图论证明课：为什么一定对？🔎</h1>
        <p className="lead">
          好的数学不只是“试试看”，还要能说清楚：为什么这件事一定成立。
          这一页用三年级能听懂的语言，配上稍微前瞻一点的严格证明结构。
        </p>
      </section>

      <section className="proof-grid">
        <article className="proof-card">
          <p className="proof-tag">定理 1 · 握手定理</p>
          <h2>所有点的度数加起来，一定是偶数</h2>
          <p>
            一条<Link to="/concepts#edge">边</Link>有两个端点。数<Link to="/concepts#degree">度数</Link>时，每条边都会被数两次：左端点数一次，右端点数一次。
          </p>
          <HandshakeDiagram />
          <div className="proof-box">
            <strong>证明：</strong>
            设这张图的边数是 E。对第 i 个点，记它的度数为 dᵢ。
            当我们把 d₁+d₂+⋯+dₙ 加起来时，每条边的两个端点各被数一次，
            所以总和正好等于 2E。因此 ∑dᵢ = 2E，是偶数。∎
          </div>
          <p className="proof-note">
            说明：这叫“握手定理”，像数班里同学握手。一次握手会让两个人的“握手次数”各加 1，
            所以全班握手次数总和一定是 2 的倍数。小结论：奇数度的点个数也一定是偶数。因为偶数度的点加起来还是偶数，
            若奇数度点有奇数个，总和就会变成奇数，和上面的结论矛盾。
          </p>
        </article>

        <article className="proof-card">
          <p className="proof-tag">定理 2 · 一笔画判定</p>
          <h2>连通图能一笔画，当且仅当奇数度点是 0 个或 2 个</h2>
          <p>
            “一笔画”要求：不抬笔、不重复边、把所有边都走完。图论里叫欧拉路。
            这个定理只讨论<Link to="/concepts#connected">连通</Link>的图，因为如果图断成两块，笔当然走不过去。
          </p>
          <EulerProofSketch />
          <div className="proof-box">
            <strong>必要性：</strong>
            走到一个中间点时，必须“进来一次，再出去一次”，边总是成对出现，所以中间点度数是偶数。
            只有起点和终点可以少配一半：如果起点和终点不同，它们是两个奇数度点；
            如果最后回到起点，所有点都是偶数度。
          </div>
          <div className="proof-box">
            <strong>充分性：</strong>
            如果所有点都是偶数度，可以从任意点出发沿没走过的边一直走；每到一个点，
            只要不是所有边都用完，就还能找到一条没用过的边出去，最后会回到起点。
            若正好两个奇数度点，就从一个奇点出发、到另一个奇点结束。若中间还剩没走过的圈，
            把圈接到已有路线里，就能把所有边接成一笔。∎
          </div>
          <p className="proof-note">
            说明：必要性像“门票配对”——中间点每进一次就要出一次；充分性稍深，核心是：
            偶数度保证不会在半路被困住，剩下的小圈可以接回主路线。
          </p>
          <p><Link to="/euler">去一笔画练习验证 →</Link></p>
        </article>

        <article className="proof-card">
          <p className="proof-tag">定理 3 · 井字棋可以变成树</p>
          <h2>每个局面是点，每一步是边，整盘棋是一棵有限树</h2>
          <p>
            空棋盘是<Link to="/concepts#tree">树</Link>根。下一步有几个选择，就长出几个孩子节点。最多下 9 步，
            所以这棵树很大，但不是无限大。
          </p>
          <GameTreeSketch />
          <div className="proof-box">
            <strong>证明：</strong>
            每走一步，棋盘上的空格会少 1 个。空格最多从 9 个减少到 0 个，因此路径长度最多 9。
            同一个父局面走不同空格，会得到不同的子局面；子局面只比父局面多一个棋子，
            不能再回到父局面，所以不会形成圈。有限、无圈、从空棋盘展开，就是一棵树。∎
          </div>
          <p className="proof-note">
            说明：这棵树之所以有限，是因为棋盘只有 9 个格子。它之所以没有圈，是因为每走一步棋子只会增加，
            不会回到更早的空格数。走廊视图展示的就是这棵树里已经选中的一条主路，以及旁边被放弃的兄弟分支。
          </p>
        </article>

        <article className="proof-card">
          <p className="proof-tag">定理 4 · minimax 为什么能选出最稳的棋</p>
          <h2>从叶子往上打分，能得到双方都认真下棋时的结果</h2>
          <p>
            给最后的棋盘打分：X 赢记 +1，O 赢记 -1，和局记 0。然后从树叶往树根倒着算。
          </p>
          <MinimaxSketch />
          <div className="proof-box">
            <strong>归纳证明：</strong>
            只剩 0 步时，结果已经知道，分数正确。假设“还剩 k 步”的所有子局面分数都正确。
            那么轮到 X 时，X 会选分数最大的子局面；轮到 O 时，O 会选分数最小的子局面。
            所以“还剩 k+1 步”的父局面也能得到正确分数。由数学归纳法，根局面的分数正确。∎
          </div>
          <p><Link to="/vs-computer">去看搜索算法对战 →</Link></p>
          <p className="proof-note">
            说明：这不是“电脑聪明地猜”，而是把“我认真、对手也认真”写成一条清楚的规则：
            轮到我选对我最好的，轮到对手选对我最差的。术语见 <Link to="/concepts#minimax">minimax</Link>。
          </p>
        </article>

        <article className="proof-card wide">
          <p className="proof-tag">验收说明 · 井字棋最优结果</p>
          <h2>为什么说：双方都按最稳策略下，井字棋会和局？</h2>
          <p>
            这不是猜出来的。网站里的搜索算法会从当前局面开始，把所有合法后续都展开到终局，
            再用上面的 minimax 证明从叶子倒推。对空棋盘运行时，根局面的分数是 0，表示和局。
          </p>
          <ol className="check-list">
            <li>终局评分明确：X 胜、O 胜、和局三类。</li>
            <li>合法走法明确：只能下在空格里，X/O 轮流走。</li>
            <li>树是有限的：最多 9 步，所以一定能算完。</li>
            <li>倒推规则有证明：X 取最大，O 取最小。</li>
            <li>因此根分数为 0 可验收为“最优双方和局”。</li>
          </ol>
          <p className="proof-note">
            这就是“可验收”的含义：定义清楚、规则清楚、推理清楚，程序只是帮我们把有限但很多的分支算完。
            如果忘了术语，可以去 <Link to="/concepts">术语地图</Link> 查。
          </p>
        </article>
      </section>
    </>
  );
}

function HandshakeDiagram() {
  const ns = [{ x: 60, y: 60, l: 'A' }, { x: 170, y: 45, l: 'B' }, { x: 230, y: 145, l: 'C' }, { x: 90, y: 155, l: 'D' }];
  const es = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];
  return <svg className="proof-svg" viewBox="0 0 290 210" aria-label="握手定理图示">
    {es.map(([a, b], i) => <line key={i} x1={ns[a].x} y1={ns[a].y} x2={ns[b].x} y2={ns[b].y} stroke="#8a6a3a" strokeWidth="3" />)}
    {ns.map(n => <g key={n.l}><circle cx={n.x} cy={n.y} r="22" fill="#fff3d6" stroke="#6b4f1f" strokeWidth="2" /><text x={n.x} y={n.y + 5} textAnchor="middle" fontWeight="800">{n.l}</text></g>)}
    <text x="145" y="200" textAnchor="middle" fontSize="13" fill="#6b5a43">5 条边 → 度数总和 = 10</text>
  </svg>;
}

function EulerProofSketch() {
  return <div className="proof-mini-grid">
    <div className="proof-mini-card">进入中间点一次<br />就要再出去一次<br /><strong>进/出配成一对</strong></div>
    <div className="proof-mini-card">起点可以多“出去”一次<br />终点可以多“进来”一次<br /><strong>所以奇点只能是 0 或 2</strong></div>
  </div>;
}

function GameTreeSketch() {
  return <svg className="proof-svg" viewBox="0 0 360 190" aria-label="井字棋局面树图示">
    <circle cx="180" cy="30" r="18" fill="#e7f5ff" stroke="#1864ab" strokeWidth="2" />
    <text x="180" y="35" textAnchor="middle" fontSize="12" fontWeight="800">空</text>
    {[80, 180, 280].map((x, i) => <g key={x}><line x1="180" y1="48" x2={x} y2="92" stroke="#8a6a3a" strokeWidth="2" /><circle cx={x} cy="105" r="18" fill="#fff3d6" stroke="#6b4f1f" strokeWidth="2" /><text x={x} y="110" textAnchor="middle" fontSize="12">第1步</text>{[x - 24, x + 24].map(xx => <g key={xx}><line x1={x} y1="123" x2={xx} y2="150" stroke="#d6c7a8" strokeWidth="2" /><circle cx={xx} cy="162" r="10" fill="#fff" stroke="#d6c7a8" /></g>)}</g>)}
    <text x="180" y="185" textAnchor="middle" fontSize="13" fill="#6b5a43">每一步减少一个空格，所以最多 9 层</text>
  </svg>;
}

function MinimaxSketch() {
  return <div className="minimax-sketch" aria-label="minimax 倒推图示">
    <div className="score-row"><span className="score win">+1</span><span className="score draw">0</span><span className="score lose">−1</span></div>
    <div className="score-arrow">叶子分数 ↑ 往上倒推</div>
    <div className="score-row"><span className="score draw">X 取最大：0</span><span className="score lose">O 取最小：−1</span></div>
  </div>;
}
