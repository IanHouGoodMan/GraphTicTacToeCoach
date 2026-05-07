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
        <h2>① 这句话本来在说什么</h2>
        <div className="quote-card">
          <p className="quote-mark">“Calculemus.”</p>
          <p><strong>中文：</strong>让我们来计算吧。</p>
          <p><strong>English:</strong> Let us calculate.</p>
        </div>
        <p className="lead">
          它打动人的地方，不是“算术很厉害”，而是一种很大胆的主张：
          如果能把问题里的对象、关系、规则、目标都写成清楚的符号，
          那么本来只能靠吵架、靠权威、靠感觉决定的事，
          原则上就能像算账一样，一步一步推、一步一步检查。
        </p>
        <p className="proof-note">
          给孩子的版本：<strong>先把话说清楚，变成符号和规则，再来计算。</strong>
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
        <h2>③ 从 Calculemus 到今天：一条主张分明的时间轴</h2>
        <p className="lead">
          这不是一份完整数学史，而是一条<strong>有立场</strong>的主线。我们的主张是：
          人类用了三百多年，才把莱布尼茨“让我们计算吧”这粒种子，
          沿着<strong>逻辑 → 图与算法 → 可计算性 → 信息与概率 → 向量与统计学习</strong>
          这条路，一步步真正变成今天的计算。每一步年份都按当时的关键著作或定理标注，
          不会用模糊的“1900s–今天”来回避时间。
        </p>
        <div className="timeline">
          {timeline.map(item => (
            <article className="timeline-item" key={item.year + item.name}>
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
        <p className="proof-note">
          注：每个人都做过很多事，这里只挑“把世界变得可计算”这条主线上最关键的那一步。
          年份取常被引用的代表性著作或论文，不是这个人一生工作的全部。
        </p>
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
    year: '1654',
    avatar: '🎲',
    name: '帕斯卡 与 费马 Pascal & Fermat',
    task: '通信讨论赌博问题，奠定古典概率的基础。',
    note: '“不确定的事”第一次被认真当成可以计算的对象。后来的概率统计就从这里出发。'
  },
  {
    year: '1666',
    avatar: '👨‍🦱',
    name: '莱布尼茨 Leibniz',
    task: '《论组合术》中提出“通用符号 + 推理演算”的设想。',
    note: '“Calculemus” 是这个梦想的口号：复杂争论如果能形式化，就能被检查和计算。'
  },
  {
    year: '1736',
    avatar: '🌉',
    name: '欧拉 Euler',
    task: '解决哥尼斯堡七桥问题，论文里第一次把“连接关系”单独研究。',
    note: '这就是图论的起点。本网站的一笔画练习，沿用的正是这一篇论文的判定思路。'
  },
  {
    year: '1854',
    avatar: '🔘',
    name: '布尔 Boole',
    task: '《思维规律》把“真/假”推理写成代数运算。',
    note: '逻辑第一次被当成可以像加减乘除一样运算的东西。后来的电路、0/1、搜索算法都受益。'
  },
  {
    year: '1858',
    avatar: '🟦',
    name: '凯莱 Cayley',
    task: '系统地建立矩阵代数，把“一组数”当成可以整体运算的对象。',
    note: '从此，向量和矩阵成为表示与计算的工具。今天图能用矩阵表示，文字能变成向量，根都在这里。'
  },
  {
    year: '1879',
    avatar: '📕',
    name: '弗雷格 Frege',
    task: '《概念文字》发明了真正的现代数理逻辑符号。',
    note: '推理第一次拥有像数学公式一样精确的写法，这是后来一切“形式化”的基础。'
  },
  {
    year: '1910–1913',
    avatar: '📘',
    name: '罗素 与 怀特海 Russell & Whitehead',
    task: '《数学原理》尝试把整门数学建立在严格的逻辑之上。',
    note: '“每一步都要能被检查”从此成为现代数学的标准。也是孩子学“严格证明”的精神来源。'
  },
  {
    year: '1921',
    avatar: '🧩',
    name: '维特根斯坦 Wittgenstein',
    task: '《逻辑哲学论》探讨语言、世界与逻辑形式的关系。',
    note: '他提醒大家：把语言变成符号并不简单，“怎么表示世界”本身就是一个深问题。'
  },
  {
    year: '1928',
    avatar: '♟️',
    name: '冯·诺依曼 von Neumann',
    task: '证明二人零和博弈的极小化极大定理。',
    note: '这就是井字棋页面用的 minimax 思想：自己取最大、对手取最小，结果有数学保证。'
  },
  {
    year: '1933',
    avatar: '📊',
    name: '柯尔莫哥洛夫 Kolmogorov',
    task: '《概率论基础》给出现代概率论的公理化定义。',
    note: '“可能性大小”从此有了像几何那样的严格地基，是后来统计学习和语言模型的基础。'
  },
  {
    year: '1936',
    avatar: '🤖',
    name: '图灵 Turing',
    task: '论文《论可计算数》定义图灵机，明确“可计算”到底是什么。',
    note: '这是计算机科学的根。一切“按规则一步步做”的过程，都可以追到这里。'
  },
  {
    year: '1945',
    avatar: '💾',
    name: '冯·诺依曼 von Neumann',
    task: 'EDVAC 报告确立“存储程序”计算机结构。',
    note: '从这里，数学上的“可计算”变成了真正的硬件。今天所有家用电脑都还在用这个结构。'
  },
  {
    year: '1948',
    avatar: '📡',
    name: '香农 Shannon',
    task: '《通信的数学理论》开创信息论。',
    note: '香农把“信息”“符号串”“概率”放在一起，是逻辑传统和概率传统真正合流的关键一步。'
  },
  {
    year: '1956',
    avatar: '🧭',
    name: '迪杰斯特拉 Dijkstra',
    task: '提出加权图最短路径算法（1959 年发表）。',
    note: '从这里开始，图不只是用来“看关系”，而是真正可以在上面跑算法。过河页面用的就是同类思想。'
  },
  {
    year: '1959',
    avatar: '🌳',
    name: '塞缪尔 Samuel',
    task: '在 IBM 上写出会下西洋棋的程序，使用搜索 + 评估函数。',
    note: '这是“电脑下棋”的起点，本网站的井字棋算法对战是它最简单的版本。'
  },
  {
    year: '2013',
    avatar: '🔤',
    name: 'Mikolov 等 · word2vec',
    task: '把每个词训练成一个向量，让“意思相近”变成“向量相近”。',
    note: '语言第一次大规模真正变成向量。线性代数和概率从这里开始大量参与处理人类语言。'
  },
  {
    year: '2017',
    avatar: '💬',
    name: 'Vaswani 等 · Transformer',
    task: '论文《Attention Is All You Need》提出 Transformer 架构。',
    note: '今天的大语言模型几乎都是它的后代：用矩阵和概率，把“下一个词最可能是什么”算出来。'
  },
  {
    year: '今天',
    avatar: '🌱',
    name: '回到 Calculemus',
    task: '把莱布尼茨的种子，重新放回小朋友手里。',
    note: '从七桥到井字棋，从概率到向量。这条线还在继续生长，本网站希望小朋友也能加入这条线。'
  }
];
