# 本地调试 Demo

使用 Vite + React，通过 `vite.config.ts` 里的 `alias` 直接引用仓库根目录的 **`src/index.ts`**，改库代码后无需先执行根目录 `pnpm run build`。

## 启动

在**仓库根目录**执行（推荐）：

```bash
pnpm demo:dev
```

或进入本目录后：

```bash
pnpm install
pnpm dev
```

使用 npm 时：

```bash
cd examples/demo
npm install
npm run dev
```

浏览器默认打开 `http://localhost:5173`。

## 说明

- `persist: false`：避免 Demo 与线上站点共用 `localStorage` 里的主题 key。
- `wave` 主题依赖 `three`，本 demo 已安装 `three`。
