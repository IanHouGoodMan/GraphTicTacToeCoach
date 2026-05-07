namespace GraphTicTacToeCoach.Services;

/// <summary>
/// 井字棋核心引擎：胜负判定、minimax、最优走子。
/// 所有页面共享同一个实例，可以缓存搜索结果。
/// </summary>
public sealed class TicTacToeEngine
{
    public const char Empty = ' ';
    public const char X = 'X';
    public const char O = 'O';
    public const char Draw = 'D';

    public static readonly int[][] WinningLines =
    {
        new[] { 0, 1, 2 }, new[] { 3, 4, 5 }, new[] { 6, 7, 8 },
        new[] { 0, 3, 6 }, new[] { 1, 4, 7 }, new[] { 2, 5, 8 },
        new[] { 0, 4, 8 }, new[] { 2, 4, 6 }
    };

    private readonly Dictionary<string, int> _memo = new();
    private readonly Dictionary<string, long> _countMemo = new();

    public static char Flip(char p) => p == X ? O : X;

    public static char GetWinner(IReadOnlyList<char> b)
    {
        foreach (var l in WinningLines)
        {
            if (b[l[0]] != Empty && b[l[0]] == b[l[1]] && b[l[1]] == b[l[2]])
                return b[l[0]];
        }
        for (var i = 0; i < 9; i++) if (b[i] == Empty) return Empty;
        return Draw;
    }

    public static int[] WinningLine(IReadOnlyList<char> b)
    {
        foreach (var l in WinningLines)
        {
            if (b[l[0]] != Empty && b[l[0]] == b[l[1]] && b[l[1]] == b[l[2]])
                return l;
        }
        return Array.Empty<int>();
    }

    public int Minimax(char[] board, char turn)
    {
        var w = GetWinner(board);
        if (w == X) return 1;
        if (w == O) return -1;
        if (w == Draw) return 0;

        var key = new string(board) + ":" + turn;
        if (_memo.TryGetValue(key, out var cached)) return cached;

        var best = turn == X ? int.MinValue : int.MaxValue;
        for (var i = 0; i < 9; i++)
        {
            if (board[i] != Empty) continue;
            board[i] = turn;
            var s = Minimax(board, Flip(turn));
            board[i] = Empty;
            best = turn == X ? Math.Max(best, s) : Math.Min(best, s);
        }

        _memo[key] = best;
        return best;
    }

    public List<int> GetBestMoves(char[] board, char turn)
    {
        if (GetWinner(board) != Empty) return new();
        var bestScore = turn == X ? int.MinValue : int.MaxValue;
        var moves = new List<int>();
        for (var i = 0; i < 9; i++)
        {
            if (board[i] != Empty) continue;
            board[i] = turn;
            var s = Minimax(board, Flip(turn));
            board[i] = Empty;
            if (turn == X)
            {
                if (s > bestScore) { bestScore = s; moves.Clear(); moves.Add(i); }
                else if (s == bestScore) moves.Add(i);
            }
            else
            {
                if (s < bestScore) { bestScore = s; moves.Clear(); moves.Add(i); }
                else if (s == bestScore) moves.Add(i);
            }
        }
        return moves;
    }

    public List<MoveInfo> AnalyseMoves(char[] board, char turn)
    {
        var result = new List<MoveInfo>();
        if (GetWinner(board) != Empty) return result;

        var best = GetBestMoves(board, turn);
        for (var i = 0; i < 9; i++)
        {
            if (board[i] != Empty) continue;
            board[i] = turn;
            var s = Minimax(board, Flip(turn));
            var snapshot = (char[])board.Clone();
            board[i] = Empty;
            result.Add(new MoveInfo(i, turn, s, best.Contains(i), snapshot));
        }
        return result;
    }

    public static string CellName(int i) => $"第{i / 3 + 1}行第{i % 3 + 1}列";

    /// <summary>
    /// 从当前局面（轮到 turn 走）出发，所有合法对局的总数。
    /// 终局算 1 条对局。空棋盘 + X 先手时 = 255,168。
    /// </summary>
    public long CountPossibleGames(char[] board, char turn)
    {
        if (GetWinner(board) != Empty) return 1;
        var key = new string(board) + ":" + turn;
        if (_countMemo.TryGetValue(key, out var cached)) return cached;
        long sum = 0;
        for (var i = 0; i < 9; i++)
        {
            if (board[i] != Empty) continue;
            board[i] = turn;
            sum += CountPossibleGames(board, Flip(turn));
            board[i] = Empty;
        }
        _countMemo[key] = sum;
        return sum;
    }

    public static string ScoreLabel(int score) => score switch
    {
        1 => "X 必胜",
        -1 => "O 必胜",
        _ => "和局"
    };

    /// <summary>给一个分数从 turn 视角看的友好标签。</summary>
    public static string OutcomeFor(char turn, int score) =>
        (turn, score) switch
        {
            (X, 1) => "我（X）赢",
            (X, -1) => "我（X）输",
            (O, -1) => "我（O）赢",
            (O, 1) => "我（O）输",
            _ => "和局"
        };
}

public sealed record MoveInfo(int Index, char Symbol, int Score, bool IsOptimal, char[] ResultingBoard);

/// <summary>
/// 棋谱中的一步：谁下、下在哪、之后的棋盘、走完之后还剩多少种可能对局。
/// 用于「走廊视图」里展示「剪枝」效果。
/// </summary>
public sealed record GameStep(int Index, char Symbol, char[] BoardAfter, long GamesRemaining);
