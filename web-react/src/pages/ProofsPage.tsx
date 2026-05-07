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
            一条边有两个端点。数度数时，每条边都会被数两次：左端点数一次，右端点数一次。
          </p>
          <div className="proof-box">
            <strong>证明：</strong>
            假设图里有 E 条边。每条边贡献 2 个“边头”，所以所有点的度数总和是 2E。
            因为 2E 一定是偶数，所以度数总和一定是偶数。∎
          </div>
          <p className="proof-note">
            小结论：奇数度的点个数也一定是偶数。因为偶数度的点加起来还是偶数，
            若奇数度点有奇数个，总和就会变成奇数，和上面的结论矛盾。
          </p>
        </article>

        <article className="proof-card">
          <p className="proof-tag">定理 2 · 一笔画判定</p>
          <h2>连通图能一笔画，当且仅当奇数度点是 0 个或 2 个</h2>
          <p>
            “一笔画”要求：不抬笔、不重复边、把所有边都走完。图论里叫欧拉路。
          </p>
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
          <p><Link to="/euler">去一笔画练习验证 →</Link></p>
        </article>

        <article className="proof-card">
          <p className="proof-tag">定理 3 · 井字棋可以变成树</p>
          <h2>每个局面是点，每一步是边，整盘棋是一棵有限树</h2>
          <p>
            空棋盘是树根。下一步有几个选择，就长出几个孩子节点。最多下 9 步，
            所以这棵树很大，但不是无限大。
          </p>
          <div className="proof-box">
            <strong>证明：</strong>
            每走一步，棋盘上的空格会少 1 个。空格最多从 9 个减少到 0 个，因此路径长度最多 9。
            同一个父局面走不同空格，会得到不同的子局面；子局面只比父局面多一个棋子，
            不能再回到父局面，所以不会形成圈。有限、无圈、从空棋盘展开，就是一棵树。∎
          </div>
          <p className="proof-note">
            走廊视图展示的就是这棵树里已经选中的一条主路，以及旁边被放弃的兄弟分支。
          </p>
        </article>

        <article className="proof-card">
          <p className="proof-tag">定理 4 · minimax 为什么能选出最稳的棋</p>
          <h2>从叶子往上打分，能得到双方都认真下棋时的结果</h2>
          <p>
            给最后的棋盘打分：X 赢记 +1，O 赢记 -1，和局记 0。然后从树叶往树根倒着算。
          </p>
          <div className="proof-box">
            <strong>归纳证明：</strong>
            只剩 0 步时，结果已经知道，分数正确。假设“还剩 k 步”的所有子局面分数都正确。
            那么轮到 X 时，X 会选分数最大的子局面；轮到 O 时，O 会选分数最小的子局面。
            所以“还剩 k+1 步”的父局面也能得到正确分数。由数学归纳法，根局面的分数正确。∎
          </div>
          <p><Link to="/vs-computer">去看搜索算法对战 →</Link></p>
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
          </p>
        </article>
      </section>
    </>
  );
}
