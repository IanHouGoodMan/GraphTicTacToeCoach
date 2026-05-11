# 数学园地（React + TypeScript）

这是一个面向孩子的数学学习 Web 应用，当前从图论内容起步，后续可扩展到数论、分数等主题。

## 本地运行

```bash
cd web-react
npm install
npm run dev
```

## 构建发布文件

```bash
cd web-react
npm run build
```

静态站点输出目录：

- `web-react/dist`

## 部署到 Azure Static Web Apps

仓库根目录的 `azure.yaml` 指向 `./web-react`，发布产物为 `dist`。

```bash
azd up
```

## 教学结论

- 井字棋可以用图论和博弈搜索解决。
- 双方理性且最优时结果是平局。
- 后手最多逼平，但在先手失误时，后手可获得胜机。
