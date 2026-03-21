# 文档目录

本目录存放**仓库维护者**用的说明（不参与 npm 包 `files` 发布）。

**不会进入 npm 包**：根目录 `package.json` 中 `files` 仅为 `["dist"]`，因此 `npm publish` / `npm pack` 时 **不会** 把 `docs/` 打进安装包；`npm run build`（Vite）也 **不会** 把 `docs/` 写入 `dist/`。

## 文档列表

| 文档 | 说明 |
|------|------|
| [从0到1-Vite组件库与npm发布.md](./从0到1-Vite组件库与npm发布.md) | **主文档**：从 0 到 1 用 Vite 搭库、配置 package.json、发布 npm、消费方式与中高级面试话术（与本仓库 `vite.config.ts` 对照） |

根目录 [README.md](../README.md) 面向**最终使用者**介绍组件 API；开发与发布全流程见上表。
