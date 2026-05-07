# 图论小学堂 — React + TypeScript 前端

面向小学三年级（适当前瞻）的图论学习 Web 应用。

## 内容

- 📐 **图论基础**：点 / 边 / 度数 / 路径 / 连通 / 树 / 一笔画 / 博弈树。
- 🧠 **算法对战**：电脑用 **minimax 搜索算法**（传统算法，不是 AI）下井字棋。
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

仓库根目录已经放好 `.github/workflows/azure-static-web-apps.yml`：

1. 在 Azure Portal 创建一个 **Static Web App**（Free 套餐即可），选择 `Custom` 部署源（不让它自动建工作流）。
2. 把它生成的 **deployment token** 加到 GitHub 仓库 Secrets，名称 `AZURE_STATIC_WEB_APPS_API_TOKEN`。
3. push 到 `main` 即可自动构建并发布。

`app_location = web-react`，`output_location = dist`。
