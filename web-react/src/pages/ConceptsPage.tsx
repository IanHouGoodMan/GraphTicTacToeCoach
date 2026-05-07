import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

type Concept = {
  id: string;
  title: string;
  short: string;
  child: string;
  example: string;
  links?: { to: string; label: string }[];
};

const concepts: Concept[] = [
  {
    id: 'modeling',
    title: '建模 modeling',
    short: '把一个真实问题，翻译成数学能处理的样子。',
    child: '先不要急着算，先问：东西是什么？关系是什么？规则是什么？目标是什么？',
    example: '过河问题里，“左岸有几个人、船在哪边”就是状态；“划一次船”就是边。',
    links: [{ to: '/river', label: '过河问题' }, { to: '/leibniz', label: 'Calculemus 故事' }]
  },
  {
    id: 'vertex',
    title: '点 / 顶点 vertex',
    short: '图里的一个圆圈，代表一个对象、地点、局面或状态。',
    child: '点不一定是地图上的地点，也可以是一张棋盘、一次状态、一位小朋友。',
    example: '井字棋里，每一种棋盘局面都是一个点。',
    links: [{ to: '/basics', label: '图论基础' }]
  },
  {
    id: 'edge',
    title: '边 edge',
    short: '连接两个点的线，代表“有关系”或“能从一个状态走到另一个状态”。',
    child: '边像一座桥：如果两件事之间能一步到达，就画一条边。',
    example: '过河问题里，一次合法划船就是一条边。',
    links: [{ to: '/river', label: '状态图' }]
  },
  {
    id: 'degree',
    title: '度数 degree',
    short: '一个点连着几条边。',
    child: '数一数一个点身上伸出几根线，就是它的度数。',
    example: '一笔画规则只需要看奇数度点有几个。',
    links: [{ to: '/euler', label: '一笔画练习' }, { to: '/proofs', label: '握手定理证明' }]
  },
  {
    id: 'path',
    title: '路径 path',
    short: '沿着边从一个点走到另一个点，经过的一串点和边。',
    child: '像走迷宫：一步一步沿线走出来的路线，就是路径。',
    example: '过河问题的答案，就是从开局状态到目标状态的一条路径。',
    links: [{ to: '/river', label: '找过河路径' }]
  },
  {
    id: 'connected',
    title: '连通 connected',
    short: '如果两个点之间能找到路径，它们就是连通的。',
    child: '如果能沿着线走过去，就叫走得通。',
    example: '过河目标和开局连通，说明这个题有解。',
    links: [{ to: '/basics', label: '连通图例子' }]
  },
  {
    id: 'tree',
    title: '树 tree',
    short: '连通而且没有圈的图。',
    child: '从根开始分叉，越走越多，但不会绕回来。',
    example: '井字棋从空棋盘往下展开，就是一棵有限的局面树。',
    links: [{ to: '/vs-computer', label: '井字棋搜索' }]
  },
  {
    id: 'directed',
    title: '有向图 directed graph',
    short: '边带箭头，只能按箭头方向走。',
    child: '有些路是单行道，能从 A 到 B，不代表能从 B 到 A。',
    example: '网页链接常常是有向图：A 页面链接到 B，B 不一定链接回 A。',
    links: [{ to: '/basics', label: '有向图例子' }]
  },
  {
    id: 'weighted',
    title: '加权图 weighted graph',
    short: '每条边上带一个数字，表示距离、时间、费用或风险。',
    child: '不是每条路都一样长，所以要给边贴上数字标签。',
    example: '家到学校的路，每条边的数字表示要走几分钟。',
    links: [{ to: '/basics', label: '加权图例子' }]
  },
  {
    id: 'shortest-path',
    title: '最短路径 shortest path',
    short: '从起点到终点，总代价最小的路径。',
    child: '如果每条边都算 1 步，就是步数最少；如果边有时间，就是总时间最少。',
    example: '过河问题里，每次划船都算 1 步，所以找最少划几次。',
    links: [{ to: '/river', label: '过河最短路径' }]
  },
  {
    id: 'bfs',
    title: '广度优先搜索 BFS',
    short: '从起点开始，先看 1 步能到哪里，再看 2 步能到哪里，再看 3 步……',
    child: '像水波一圈一圈向外扩散。第一次碰到目标时，走的步数一定最少（前提是每条边都算 1 步）。',
    example: '过河问题的每次划船都算 1 步，所以 BFS 第一次找到目标，就是最少划船次数。',
    links: [{ to: '/river', label: '在过河题中看 BFS' }]
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra 算法',
    short: '在加权图里找最短路径的经典算法。',
    child: '如果不同道路长短不同，就不能只数“几步”，还要比较目前累计花费最小的路线。',
    example: '家到学校，7+3=10 分钟，4+5=9 分钟，所以第二条更短。',
    links: [{ to: '/basics', label: '加权最短路例子' }]
  },
  {
    id: 'state-space',
    title: '状态空间 state space',
    short: '所有可能状态组成的集合。把状态当点，就得到状态图。',
    child: '每一张“现在是什么样子”的卡片，都是一个状态。所有卡片放在一起，就是状态空间。',
    example: '过河题共有 16 个合法状态。',
    links: [{ to: '/river', label: '完整状态图' }]
  },
  {
    id: 'minimax',
    title: 'minimax 极小化极大',
    short: '两人理性对弈时，从终局倒推，自己选最好，对手也会选对自己最不利的那步。',
    child: '你不能只想“我想赢”，还要想“对方也会认真防守”。',
    example: '井字棋中，X 选最大分，O 选最小分。',
    links: [{ to: '/proofs', label: 'minimax 证明' }, { to: '/vs-computer', label: '算法对战' }]
  },
  {
    id: 'vector',
    title: '向量 vector',
    short: '一串有顺序的数字，可以表示方向、位置，也可以表示文字的特征。',
    child: '把一句话变成很多数字，计算机就能比较它和另一句话像不像。',
    example: '现代语言模型常把词语或句子表示成向量，再用线性代数和概率统计来计算。',
    links: [{ to: '/leibniz', label: '历史轴' }]
  },
  {
    id: 'linear-algebra',
    title: '线性代数 linear algebra',
    short: '研究向量、矩阵和变换的数学。',
    child: '当一个问题被表示成一排排数字，线性代数就像操作这些数字的工具箱。',
    example: '图也可以用矩阵表示；自然语言也可以先变成向量再计算。',
    links: [{ to: '/leibniz', label: '从符号到向量' }]
  },
  {
    id: 'probability',
    title: '概率统计 probability & statistics',
    short: '研究不确定性、频率、可能性和从数据中学习规律。',
    child: '有些问题不是“百分百确定”，而是“哪种可能性最大”。',
    example: '现代语言计算常要估计：下一个词最可能是什么？',
    links: [{ to: '/leibniz', label: '现代语言计算' }]
  }
];

export default function ConceptsPage() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }, [location]);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">术语地图 · 点开就能查</p>
        <h1>图论小词典 📚</h1>
        <p className="lead">
          这里把网站里出现的术语集中放在一起。遇到不懂的词，不用硬背，先看例子，
          再回到一笔画、井字棋、过河问题里亲手试。
        </p>
      </section>

      <section className="concept-index panel">
        <h2>快速跳转</h2>
        <div className="concept-chip-list">
          {concepts.map(c => <a key={c.id} href={`#${c.id}`}>{c.title}</a>)}
        </div>
      </section>

      <section className="concept-grid">
        {concepts.map(c => (
          <article className="concept-card" id={c.id} key={c.id}>
            <h2>{c.title}</h2>
            <p className="concept-short">{c.short}</p>
            <p><strong>给小朋友的话：</strong>{c.child}</p>
            <p><strong>本网站里的例子：</strong>{c.example}</p>
            {c.links && (
              <p className="concept-links">
                {c.links.map(l => <Link key={l.to + l.label} to={l.to}>{l.label}</Link>)}
              </p>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
