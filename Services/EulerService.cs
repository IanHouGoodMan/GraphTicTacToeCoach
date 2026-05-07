namespace GraphTicTacToeCoach.Services;

/// <summary>
/// 一笔画用的图题：顶点带坐标，边是无向、可重边（用于柯尼斯堡七桥）。
/// </summary>
public sealed class GraphPuzzle
{
    public string Id { get; init; } = "";
    public string Name { get; init; } = "";
    public string Story { get; init; } = "";
    public bool ExpectedDrawable { get; init; }
    /// <summary>顶点：x,y 在 0..360 / 0..240 viewBox 中。</summary>
    public List<Vertex> Vertices { get; init; } = new();
    /// <summary>边：两个顶点下标。允许重复（多重边）。</summary>
    public List<(int A, int B)> Edges { get; init; } = new();

    public sealed record Vertex(double X, double Y, string Label);
}

public sealed record EulerVerdict(
    bool Drawable,
    int OddCount,
    bool Connected,
    string Kind,
    int[] OddVertices,
    int[] StartCandidates);

public sealed record StepResult(bool Ok, string Message, bool Completed, int? UsedEdgeId);

public sealed class EulerService
{
    public IReadOnlyList<GraphPuzzle> Puzzles { get; }

    public EulerService() { Puzzles = BuildPuzzles(); }

    public GraphPuzzle GetById(string id) =>
        Puzzles.FirstOrDefault(p => p.Id == id) ?? Puzzles[0];

    public int[] Degrees(GraphPuzzle p)
    {
        var d = new int[p.Vertices.Count];
        foreach (var (a, b) in p.Edges) { d[a]++; d[b]++; }
        return d;
    }

    public List<List<(int Neighbor, int EdgeId)>> BuildAdj(GraphPuzzle p)
    {
        var adj = new List<List<(int, int)>>();
        for (var i = 0; i < p.Vertices.Count; i++) adj.Add(new());
        for (var e = 0; e < p.Edges.Count; e++)
        {
            var (a, b) = p.Edges[e];
            adj[a].Add((b, e));
            adj[b].Add((a, e));
        }
        return adj;
    }

    public bool IsConnected(GraphPuzzle p)
    {
        var n = p.Vertices.Count;
        var adj = BuildAdj(p);
        var start = -1;
        for (var i = 0; i < n; i++) if (adj[i].Count > 0) { start = i; break; }
        if (start < 0) return true;

        var seen = new bool[n];
        var stack = new Stack<int>();
        stack.Push(start); seen[start] = true;
        while (stack.Count > 0)
        {
            var v = stack.Pop();
            foreach (var (u, _) in adj[v])
                if (!seen[u]) { seen[u] = true; stack.Push(u); }
        }
        for (var i = 0; i < n; i++) if (adj[i].Count > 0 && !seen[i]) return false;
        return true;
    }

    public EulerVerdict Analyse(GraphPuzzle p)
    {
        var deg = Degrees(p);
        var odd = Enumerable.Range(0, deg.Length).Where(i => deg[i] % 2 == 1).ToArray();
        var connected = IsConnected(p);
        var drawable = connected && (odd.Length == 0 || odd.Length == 2);
        var kind = !connected
            ? "图不连通 → 不能一笔画"
            : odd.Length == 0
                ? "✅ 每个顶点都是偶度 → 欧拉回路（任意点出发，回到起点）"
                : odd.Length == 2
                    ? "✅ 正好 2 个奇度顶点 → 欧拉路径（必须从一个奇点走到另一个）"
                    : $"❌ 奇度顶点有 {odd.Length} 个，必须是 0 或 2 才能一笔画";
        var starts = odd.Length == 2
            ? odd
            : (odd.Length == 0
                ? Enumerable.Range(0, deg.Length).Where(i => deg[i] > 0).ToArray()
                : Array.Empty<int>());
        return new EulerVerdict(drawable, odd.Length, connected, kind, odd, starts);
    }

    /// <summary>Hierholzer 算法：返回一条欧拉路径/回路（顶点序列），不能时返回 null。</summary>
    public List<int>? FindTrail(GraphPuzzle p, int? start = null)
    {
        var v = Analyse(p);
        if (!v.Drawable) return null;
        var s = start ?? v.StartCandidates[0];

        var adj = BuildAdj(p);
        var used = new bool[p.Edges.Count];
        var iter = new int[p.Vertices.Count];
        var stack = new Stack<int>();
        var trail = new List<int>();
        stack.Push(s);

        while (stack.Count > 0)
        {
            var u = stack.Peek();
            while (iter[u] < adj[u].Count && used[adj[u][iter[u]].EdgeId]) iter[u]++;
            if (iter[u] == adj[u].Count) { trail.Add(u); stack.Pop(); }
            else
            {
                var (w, e) = adj[u][iter[u]++];
                used[e] = true;
                stack.Push(w);
            }
        }
        trail.Reverse();
        return trail;
    }

    /// <summary>给一条欧拉路径，返回经过的边 id 序列（按顺序）。</summary>
    public List<int> EdgesOfTrail(GraphPuzzle p, List<int> trail)
    {
        var result = new List<int>();
        var used = new bool[p.Edges.Count];
        for (var i = 0; i + 1 < trail.Count; i++)
        {
            var u = trail[i]; var v = trail[i + 1];
            for (var e = 0; e < p.Edges.Count; e++)
            {
                if (used[e]) continue;
                var (a, b) = p.Edges[e];
                if ((a == u && b == v) || (a == v && b == u))
                {
                    used[e] = true;
                    result.Add(e);
                    break;
                }
            }
        }
        return result;
    }

    /// <summary>练习页：尝试从当前顶点走到 next。</summary>
    public StepResult TryStep(GraphPuzzle p, IReadOnlyList<int> path, bool[] usedEdges, int next)
    {
        if (path.Count == 0) return new(true, "起点已选好。", false, null);
        var current = path[^1];
        for (var e = 0; e < p.Edges.Count; e++)
        {
            if (usedEdges[e]) continue;
            var (a, b) = p.Edges[e];
            if ((a == current && b == next) || (b == current && a == next))
            {
                var willComplete = usedEdges.Count(x => x) + 1 == p.Edges.Count;
                return new(true, "👍 走过这条边。", willComplete, e);
            }
        }
        return new(false, "🚫 这两个点之间已经没有能走的边了。", false, null);
    }

    /// <summary>从当前顶点，是否还有任何能走的下一步。</summary>
    public bool HasAnyMove(GraphPuzzle p, int current, bool[] usedEdges)
    {
        for (var e = 0; e < p.Edges.Count; e++)
        {
            if (usedEdges[e]) continue;
            var (a, b) = p.Edges[e];
            if (a == current || b == current) return true;
        }
        return false;
    }

    // ================= 题库 =================
    private static List<GraphPuzzle> BuildPuzzles() => new()
    {
        new GraphPuzzle
        {
            Id = "triangle",
            Name = "🔺 三角形",
            Story = "最简单的一笔画。每个顶点都连两条边——刚刚好。",
            ExpectedDrawable = true,
            Vertices =
            {
                new(80, 200, "A"), new(280, 200, "B"), new(180, 60, "C")
            },
            Edges = { (0, 1), (1, 2), (2, 0) }
        },
        new GraphPuzzle
        {
            Id = "house",
            Name = "🏠 小房子",
            Story = "经典的「画房子」一笔画题。试试从哪里出发能成功？",
            ExpectedDrawable = true,
            Vertices =
            {
                new(80, 210, "左下"), new(280, 210, "右下"),
                new(80, 110, "左上"), new(280, 110, "右上"),
                new(180, 30, "屋顶")
            },
            Edges =
            {
                (0, 1), (1, 3), (3, 2), (2, 0), // 墙
                (2, 4), (4, 3)                  // 屋顶
            }
        },
        new GraphPuzzle
        {
            Id = "envelope",
            Name = "✉️ 信封",
            Story = "信封 = 房子 + 两条对角线。还能一笔画吗？",
            ExpectedDrawable = true,
            Vertices =
            {
                new(80, 210, "左下"), new(280, 210, "右下"),
                new(80, 110, "左上"), new(280, 110, "右上"),
                new(180, 30, "顶")
            },
            Edges =
            {
                (0, 1), (1, 3), (3, 2), (2, 0),
                (2, 4), (4, 3),
                (0, 3), (1, 2)                  // 两条对角线
            }
        },
        new GraphPuzzle
        {
            Id = "star5",
            Name = "⭐ 五角星",
            Story = "五个外角，每个连两条线。一口气能画完吗？",
            ExpectedDrawable = true,
            Vertices =
            {
                new(180, 30, "1"),
                new(310, 120, "2"),
                new(260, 220, "3"),
                new(100, 220, "4"),
                new(50,  120, "5")
            },
            // 五角星 = 把五个点按 1→3→5→2→4→1 连起来
            Edges = { (0, 2), (2, 4), (4, 1), (1, 3), (3, 0) }
        },
        new GraphPuzzle
        {
            Id = "figure8",
            Name = "♾️ 八字形",
            Story = "两个圈在中间打了个结。中间那个点连了 4 条线，是偶数哦。",
            ExpectedDrawable = true,
            Vertices =
            {
                new(180, 120, "中"),
                new(80, 50, "左上"), new(80, 190, "左下"),
                new(280, 50, "右上"), new(280, 190, "右下")
            },
            Edges =
            {
                (0, 1), (1, 2), (2, 0),
                (0, 3), (3, 4), (4, 0)
            }
        },
        new GraphPuzzle
        {
            Id = "k4",
            Name = "🔷 完全四边形 K₄",
            Story = "4 个点，两两都连一条线。每个点都连 3 条线——会怎样呢？",
            ExpectedDrawable = false,
            Vertices =
            {
                new(80, 60, "A"), new(280, 60, "B"),
                new(80, 200, "C"), new(280, 200, "D")
            },
            Edges =
            {
                (0, 1), (2, 3), (0, 2), (1, 3),
                (0, 3), (1, 2)
            }
        },
        new GraphPuzzle
        {
            Id = "double-x",
            Name = "❌ 正方形 + 双对角线",
            Story = "看起来很整齐，但每个角都连了 3 条边。能一笔画吗？",
            ExpectedDrawable = false,
            Vertices =
            {
                new(80, 60, "A"), new(280, 60, "B"),
                new(80, 200, "C"), new(280, 200, "D")
            },
            Edges =
            {
                (0, 1), (1, 3), (3, 2), (2, 0),
                (0, 3), (1, 2)
            }
        },
        new GraphPuzzle
        {
            Id = "konigsberg",
            Name = "🌉 柯尼斯堡七桥",
            Story = "1736 年，欧拉爷爷想：能不能走过 7 座桥，每座只过一次？\n这就是图论的开始！",
            ExpectedDrawable = false,
            Vertices =
            {
                new(180, 40, "北岸"),
                new(60,  120, "小岛"),
                new(300, 120, "东岛"),
                new(180, 210, "南岸")
            },
            // 七桥：北-小岛 ×2，南-小岛 ×2，北-东岛 ×1，南-东岛 ×1，小岛-东岛 ×1
            Edges =
            {
                (0, 1), (0, 1),
                (3, 1), (3, 1),
                (0, 2),
                (3, 2),
                (1, 2)
            }
        }
    };
}
