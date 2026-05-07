import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">给爱思考的小朋友</p>
        <h1>欢迎来到图论小学堂 ✨</h1>
        <p className="lead">
          这里不是把图论硬塞进游戏里，而是父女一起练一种很重要的本领：
          <strong>用图论把看起来不像计算题的问题，先变成点、边、状态、路径和数字，再计算。</strong>
          一笔画、井字棋、过河问题，就是三个适合三年级小朋友亲手探索的例子。
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
          <h3>🚣 过河问题 · 把生活变成图</h3>
          <p>3 个大人 + 3 个小朋友，1 条小船，怎么全部过河？把每种状态画成点，每次划船画成边，
            问题就变成「找一条最短路径」。</p>
          <p><Link to="/river">去过河 →</Link></p>
        </article>
        <article className="card">
          <h3>💡 莱布尼茨 · 让我们计算吧</h3>
          <p>“Calculemus” 是真实的思想线索，但中文常见说法是意译。看看它和今天的图论、算法有什么关系。</p>
          <p><Link to="/leibniz">看历史故事 →</Link></p>
        </article>
      </section>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <h2>🔮 这个网站想说的一件事</h2>
        <p className="lead">
          是的，现在的三个探索问题都在做同一件事：<strong>建模 → 计算 → 验证</strong>。
          一笔画把“能不能画”变成数奇数度点；井字棋把“哪一步好”变成局面树上的分数；
          过河问题把故事变成状态图，再找最短路径。它们共同使用的工具，就是图论。
        </p>
        <p className="lead">
          这正是很多人一开始会觉得“有点跳”的地方：画画、下棋、讲故事，怎么突然变成计算了？
          所以这个网站要把中间那一步讲清楚：<strong>不是直接算，而是用图论先把问题翻译成能算的样子。</strong>
          这也是 <Link to="/leibniz">莱布尼茨 “Calculemus”</Link> 最值得给孩子讲的地方。
        </p>
      </section>
    </>
  );
}
