import { Link } from 'react-router-dom';

export default function LeibnizStoryPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">历史故事 · 把争论变成计算</p>
        <h1>莱布尼茨的 “Calculemus!” 是什么意思？</h1>
        <p className="lead">
          这不是一句适合当成“逐字中文名言”的话，而是莱布尼茨一个真实、重要的梦想：
          如果我们能把概念、规则和推理写成足够清楚的符号，那么许多争论就不必只靠吵，
          可以像算术一样一步一步检查。
        </p>
      </section>

      <section className="panel story-panel">
        <h2>① 更准确的中英文写法</h2>
        <div className="quote-card">
          <p className="quote-mark">“Calculemus.”</p>
          <p><strong>中文：</strong>让我们来计算吧。</p>
          <p><strong>English:</strong> Let us calculate.</p>
        </div>
        <p className="lead">
          常见的英文转述是：当两位哲学家发生争论时，他们不必无休止争辩，
          只要拿起笔，坐到计算板前，说：<em>Let us calculate.</em>
        </p>
        <p className="proof-note">
          严谨说法：网站顶部那句“别吵了，将各方意见写下来，计算一下就知道结果”是给小朋友看的中文意译，
          不是莱布尼茨留下的逐字中文原话。它表达的是他的“普遍符号语言”和“推理演算”理想。
        </p>
      </section>

      <section className="panel story-panel">
        <h2>② 背后的历史故事</h2>
        <p className="lead">
          莱布尼茨（Gottfried Wilhelm Leibniz, 1646–1716）是德国数学家、哲学家，也独立发明了微积分。
          他不只想让人会“算数字”，还想让人把复杂的想法写成清楚的符号。
        </p>
        <div className="story-grid">
          <article className="story-card">
            <h3>他想要一种“思想的字母”</h3>
            <p>
              就像汉字和英文字母能组成句子，莱布尼茨希望找到一种符号系统，
              能把概念、关系和规则写下来。
            </p>
          </article>
          <article className="story-card">
            <h3>他想要一种“推理的算盘”</h3>
            <p>
              只写下来还不够，还要能按规则一步一步推。这样推理就像算术：
              每一步都能检查，错了也能找出来。
            </p>
          </article>
          <article className="story-card">
            <h3>今天的计算机继承了这个梦想</h3>
            <p>
              程序、逻辑、图论、搜索算法，都在做类似的事：先把问题变成形式化对象，
              再交给规则和计算去处理。
            </p>
          </article>
        </div>
      </section>

      <section className="panel story-panel">
        <h2>③ 为什么这和小朋友玩的三个问题有关？</h2>
        <p className="lead">
          这三个问题初看都不像“计算题”：一笔画像画画，井字棋像下棋，过河问题像故事。
          但它们的共同秘密是：<strong>先建模，再计算</strong>。
        </p>
        <div className="model-table">
          <div className="model-row head">
            <span>问题</span><span>先变成什么</span><span>再计算什么</span>
          </div>
          <div className="model-row">
            <span>✏️ 一笔画</span><span>点、边、度数</span><span>奇数度点有几个</span>
          </div>
          <div className="model-row">
            <span>♟️ 井字棋</span><span>局面树、胜负分数</span><span>哪条路保证最好结果</span>
          </div>
          <div className="model-row">
            <span>🚣 过河问题</span><span>状态图、合法边</span><span>到目标的最短路径</span>
          </div>
        </div>
      </section>

      <section className="panel story-panel">
        <h2>④ 给三年级小朋友的一句话</h2>
        <p className="lead">
          有些题目一开始看不出怎么算，这很正常。厉害的地方不是马上算出答案，
          而是先问：<strong>这里的“点”是什么？“边”是什么？规则是什么？目标是什么？</strong>
          问清楚以后，很多故事题、游戏题、路线题，就会慢慢变成可以探索、可以验证、可以计算的问题。
        </p>
        <p className="lead">
          <Link to="/">回到首页</Link>，从三个探索问题里任选一个试试看。
        </p>
      </section>
    </>
  );
}
