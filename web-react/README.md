# 图论小课堂 — React + TypeScript 前端

面向小学三年级（适当前瞻）的图论学习 Web 应用。

## 内容

- 📐 **图论基础**：点 / 边 / 度数 / 路径 / 连通 / 树 / 一笔画 / 博弈树。
- 🔎 **数学证明**：握手定理、一笔画判定、井字棋博弈树、minimax 正确性证明。
- 🧠 **算法对战**：电脑用 **minimax 搜索算法**（传统确定性算法）下井字棋。
  - 候选走法可视化、剪枝高亮、思考日志、走廊视图（未来如何收缩）。
- ✏️ **一笔画练习**：基于 SVG + Pointer Events，**iPad / iPhone 用手指或触控笔**直接画线。

## 本地开发

```bash
npm install
npm run dev
```

打开终端提示的 Local 地址；同 Wi-Fi 下用 iPad / iPhone 打开 Network 地址即可触屏体验。

## 构建

```bash
npm run build
```

产物在 `dist/`。

## 部署到 Azure Static Web Apps

站内产品名保持为：`图论小课堂`。

如果希望网址中包含 `ianhou`、`图论/graph`、`teaching/教学`、`love-kids/爱小朋友`，应通过 **Azure Static Web Apps 自定义域名** 来实现，而不是把这些字样放进首页标题。

仓库根目录包含 `azure.yaml` 和 `infra/main.bicep`，配置为**只发布 React + TypeScript 项目**：

- `project = ./web-react`
- `appLocation = web-react`
- `outputLocation = dist`

可用 Azure Developer CLI：

```bash
azd up
```

也可以继续使用 GitHub Actions：

仓库根目录已经放好 `.github/workflows/azure-static-web-apps.yml`：

1. 在 Azure Portal 创建一个 **Static Web App**（Free 套餐即可），选择 `Custom` 部署源（不让它自动建工作流）。
2. 把它生成的 **deployment token** 加到 GitHub 仓库 Secrets，名称 `AZURE_STATIC_WEB_APPS_API_TOKEN`。
3. push 到 `main` 即可自动构建并发布。

`app_location = web-react`，`output_location = dist`，不会发布旧的 .NET/Blazor 项目。
