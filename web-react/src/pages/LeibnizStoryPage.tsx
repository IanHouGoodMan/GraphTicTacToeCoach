import { Link } from 'react-router-dom';

export default function LeibnizStoryPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">历史故事 · 把争论变成计算</p>
        <h1>Calculemus!<br />中文：让我们来计算吧。<br />English: Let us calculate.</h1>
        <p className="lead">
          这三个探索题本来都不是算术题：一笔画像画画，井字棋像游戏，过河问题像故事。
          但借助<strong>图论</strong>，我们可以先把它们变成<strong>点、边、状态、路径</strong>，
          再让规则和计算发挥作用。不是直接算，而是<strong>先建模，才变得可计算</strong>。
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
          这句话最打动人的地方，不是“算术很厉害”，而是它提醒我们：
          如果能把问题里的对象、关系、规则和目标写清楚，很多原本只能凭感觉争论的事情，
          就能一步一步检查、推理、计算。
        </p>
        <p className="proof-note">
          给孩子的理解：<strong>先把话说清楚，变成可以操作的符号和规则，再来计算。</strong>
          本网站用图论做这件事：把画画、下棋、过河，翻译成点、边、状态、路径。
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
            <h3>今天的计算继承并扩展了这个梦想</h3>
            <p>
              逻辑、图论、算法让规则问题可计算；线性代数、概率统计和向量表示，
              又让声音、图片、自然语言这类“不像数字”的东西也能进入计算。
            </p>
          </article>
        </div>
      </section>

      <section className="panel story-panel">
        <h2>③ 从 Calculemus 到今天：一条思想时间轴</h2>
        <p className="lead">
          下面不是完整数学史，而是一条给孩子看的“主线”：人类怎样一步步把思想、关系、规则、机器、数据和语言变成可计算。
        </p>
        <div className="timeline">
          {timeline.map(item => (
            <article className="timeline-item" key={item.year}>
              <div className="timeline-avatar" aria-hidden="true">{item.avatar}</div>
              <div>
                <p className="timeline-year">{item.year}</p>
                <h3>{item.name}</h3>
                <p><strong>{item.task}</strong></p>
                <p>{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel story-panel">
        <h2>④ 为什么这和小朋友玩的三个问题有关？</h2>
        <p className="lead">
          这三个问题初看都不像“计算题”：一笔画像画画，井字棋像下棋，过河问题像故事。
          但它们的共同秘密是：<strong><Link to="/concepts#modeling">先建模</Link>，再计算</strong>。
        </p>
        <div className="model-table">
          <div className="model-row head">
            <span>问题</span><span>先变成什么</span><span>再计算什么</span>
          </div>
          <div className="model-row">
            <span>✏️ 一笔画</span><span><Link to="/concepts#vertex">点</Link>、<Link to="/concepts#edge">边</Link>、<Link to="/concepts#degree">度数</Link></span><span>奇数度点有几个</span>
          </div>
          <div className="model-row">
            <span>♟️ 井字棋</span><span>局面<Link to="/concepts#tree">树</Link>、胜负分数</span><span>哪条路保证最好结果</span>
          </div>
          <div className="model-row">
            <span>🚣 过河问题</span><span><Link to="/concepts#state-space">状态图</Link>、合法边</span><span>到目标的<Link to="/concepts#shortest-path">最短路径</Link></span>
          </div>
        </div>
      </section>

      <section className="panel story-panel">
        <h2>⑤ 给三年级小朋友的一句话</h2>
        <p className="lead">
          有些题目一开始看不出怎么算，这很正常。厉害的地方不是马上算出答案，
          而是先问：<strong>这里的“点”是什么？“边”是什么？规则是什么？目标是什么？</strong>
          问清楚以后，很多故事题、游戏题、路线题，就会慢慢变成可以探索、可以验证、可以计算的问题。
        </p>
        <p className="lead">
          <Link to="/">回到首页</Link>，从三个探索问题里任选一个试试看；遇到名词可以打开 <Link to="/concepts">术语地图</Link>。
        </p>
      </section>
    </>
  );
}

const timeline = [
  {
    year: '1666–1700s',
    avatar: '👨‍🦱',
    name: '莱布尼茨 Leibniz',
    task: '梦想：把思想写成符号，把推理变成演算。',
    note: '“Calculemus” 像一颗种子：复杂争论如果能形式化，就可能被检查和计算。'
  },
  {
    year: '1736',
    avatar: '🌉',
    name: '欧拉 Euler',
    task: '任务：把七桥问题变成点和边。',
    note: '这一步像本网站的一笔画：不是量桥有多长，而是看连接关系。图论由此发芽。'
  },
  {
    year: '1847–1854',
    avatar: '🔘',
    name: '布尔 Boole',
    task: '任务：把“真/假”推理变成代数。',
    note: '逻辑不只是语言，也可以用符号计算。现代计算机里的 0/1 逻辑和它关系很深。'
  },
  {
    year: '1879–1903',
    avatar: '📘',
    name: '弗雷格、罗素 Frege & Russell',
    task: '任务：给数学推理建立更严格的逻辑语言。',
    note: '罗素推动了数理逻辑。严格证明为什么重要？因为每一步都要能被检查。'
  },
  {
    year: '1921',
    avatar: '🧩',
    name: '维特根斯坦 Wittgenstein',
    task: '任务：思考语言、世界和逻辑形式的关系。',
    note: '他提醒我们：语言怎样表示世界，是很深的问题。自然语言要变成可计算，也绕不开“表示”。'
  },
  {
    year: '1936',
    avatar: '🤖',
    name: '图灵 Turing',
    task: '任务：说明什么叫“可计算”。',
    note: '图灵机把“按规则一步步做”刻画清楚，是现代计算机科学的根。'
  },
  {
    year: '1950s–1970s',
    avatar: '🧭',
    name: '搜索算法与图算法',
    task: '任务：在巨大的可能性里找路。',
    note: 'BFS、Dijkstra、minimax 都是在图或树上找路径、找最优选择。'
  },
  {
    year: '1900s–今天',
    avatar: '📐',
    name: '线性代数与向量',
    task: '任务：把对象表示成数字空间里的点和方向。',
    note: '图可以用矩阵表示；文字、图片、声音也可以变成向量，然后用矩阵运算处理。'
  },
  {
    year: '1900s–今天',
    avatar: '🎲',
    name: '概率统计',
    task: '任务：处理不确定性和从数据中学习。',
    note: '自然语言常常不是唯一答案，而是“哪个词、哪个意思更可能”。这就需要概率统计。'
  },
  {
    year: '今天',
    avatar: '💬',
    name: '自然语言计算',
    task: '任务：把文字变成向量、概率和规则共同处理的对象。',
    note: '从莱布尼茨的符号梦，到图灵的可计算，再到向量和概率，才慢慢走到今天。'
  }
];
