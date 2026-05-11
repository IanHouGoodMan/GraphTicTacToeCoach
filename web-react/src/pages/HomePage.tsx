import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">给爱思考的小朋友</p>
        <h1>欢迎来到数学园地 ✨</h1>
        <p className="lead">
          这里不是把孩子提前推进刷题，而是父女一起练一种很重要的本领：
          <strong>把看起来不像计算题的问题，先变成对象、关系、状态、路径和规则，再慢慢推理。</strong>
          现在先从图论起步，后面也可以加入数论、分数和更多适合动手探索的数学主题。
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h3>📐 图论基础</h3>
          <p>认识点、边、度数、路径、连通和树。看明白了再去玩，会更有意思。</p>
          <p><Link to="/basics">开始学习 →</Link></p>
        </article>
        <article className="card">
          <h3>🔎 数学证明 · 说清楚为什么</h3>
          <p>用握手定理证明一笔画规则；用有限博弈树和 minimax 证明井字棋搜索为什么可靠。</p>
          <p><Link to="/proofs">看证明 →</Link></p>
        </article>
        <article className="card">
          <h3>🧠 算法对战 · 看电脑思考</h3>
          <p>电脑用经典的 <strong>minimax 搜索算法</strong>下井字棋，这是传统确定性算法。
            它会把每个候选走法摆出来，告诉你哪些被剪枝、最终为什么选那一手；
            走廊视图还能让你一眼看出未来如何收缩。</p>
          <p><Link to="/vs-computer">去对战 →</Link></p>
        </article>
        <article className="card">
          <h3>✏️ 一笔画 · 手指画画</h3>
          <p>挑一张图，按住起点不松手，沿着边滑到下一个点。iPad、iPhone 用手指或触控笔都可以。</p>
          <p><Link to="/euler">去画画 →</Link></p>
        </article>
        <article className="card">
          <h3>🚣 传教士与野人 · 把故事变成图</h3>
          <p>3 个传教士 + 3 个野人，1 条小船，怎么全部过河？把每种状态画成点，每次划船画成边，
            问题就变成「找一条最短路径」。</p>
          <p><Link to="/river">去过河 →</Link></p>
        </article>
        <article className="card">
          <h3>🔢 数论启蒙 · 从整除开始</h3>
          <p>数论很适合优秀的三年级孩子前瞻接触：奇偶、倍数、余数、质数，都能用游戏和证明来学，不必停留在算术速度。</p>
        </article>
        <article className="card">
          <h3>💡 莱布尼茨 · 让我们计算吧</h3>
          <p>从 “Calculemus!” 这颗种子出发，看人类怎样把思想、规则、图、机器、向量和概率一步步连起来。</p>
          <p><Link to="/leibniz">看历史故事 →</Link></p>
        </article>
        <article className="card">
          <h3>📚 术语地图 · 遇到名词不害怕</h3>
          <p>点、边、状态空间、BFS、minimax、向量……都放在一个小词典里，用例子慢慢解释。</p>
          <p><Link to="/concepts">查术语 →</Link></p>
        </article>
      </section>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <h2>🔮 这个网站想说的一件事</h2>
        <p className="lead">
          是的，现在的三个探索问题都在做同一件事：<strong>建模 → 计算 → 验证</strong>。
          一笔画把“能不能画”变成数奇数度点；井字棋把“哪一步好”变成局面树上的分数；
          过河问题把故事变成状态图，再找最短路径。它们共同使用的工具，是图论；
          以后加入数论时，也会继续保留这种“先看结构，再做推理”的味道。
        </p>
        <p className="lead">
          中间最重要的一步是<strong>翻译</strong>：不是直接算，而是先把问题翻译成能思考的样子。
          在图论里先看见点和边；在数论里先看见整除、余数和结构；最后才让计算帮忙。
          这也是 <Link to="/leibniz">莱布尼茨 “Calculemus”</Link> 最值得给孩子讲的地方。
        </p>
      </section>
    </>
  );
}
