# 井字棋图论教学器 (C# Blazor)

这是一个面向小学数学融合班的图论教学网页：
- 把井字棋局面建模为图节点
- 用 Minimax 给出最优策略
- 可一键演示双方最优对局（结论为平局）

## 本地运行

```bash
dotnet restore
dotnet run
```

默认地址通常是：
- http://localhost:5000
- https://localhost:5001

## 构建发布文件

```bash
dotnet publish -c Release
```

静态站点输出目录：
- `bin/Release/net10.0/publish/wwwroot`

## 部署到 Azure Static Web Apps

1. 在 Azure 创建 Static Web App 资源。
2. 将本项目推送到 GitHub 仓库。
3. 在仓库 Secrets 中添加：
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. 确保工作流文件存在：
   - `.github/workflows/azure-static-web-apps.yml`
5. 推送到 `main` 分支后自动部署。

## 教学结论

- 井字棋可以用图论和博弈搜索解决。
- 双方理性且最优时结果是平局。
- 后手最多逼平，但在先手失误时，后手可获得胜机。
