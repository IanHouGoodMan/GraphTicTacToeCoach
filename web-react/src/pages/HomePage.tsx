import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">给爱思考的小朋友</p>
        <h1>欢迎来到图论小学堂 ✨</h1>
        <p className="lead">
          这里把数学课里的<strong>图论</strong>变成三个小活动：先看一遍基础知识，
          再读懂一笔画和井字棋的数学证明，接着看电脑用「搜索算法」下井字棋，
          最后用手指在 iPad 上画一笔画。
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
      </section>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <h2>🔮 这个网站想说的一件事</h2>
        <p className="lead">
          很多看起来「需要争论」的问题，其实可以先<strong>把它写下来变成数</strong>，再让数学/算法去算。
          井字棋的 minimax 把胜负变成 +1 / 0 / −1；过河问题把「状态」变成图上的点；一笔画把「能不能画」
          变成「奇数度点有几个」。这就是莱布尼茨的那句口号：
          <em> Calculemus —— 让我们计算吧。</em>
        </p>
      </section>
    </>
  );
}
