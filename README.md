# react-particle-backgrounds

一个基于 [tsparticles](https://particles.js.org/)、Three.js 和 Canvas 2D 的 React 粒子背景组件库，提供 **8 种精美粒子背景主题**。

开发与发布相关说明（Vite 库模式搭建、npm 发布、面试要点）见仓库内 [docs 目录](./docs/README.md)（该目录仅随 Git 维护，**不会**随 `npm install` 的包体发布）。

## 本地调试 Demo

在仓库根目录执行：

```bash
pnpm demo:dev
```

会安装 `examples/demo` 依赖并启动 Vite（默认 `http://localhost:5173`）。Demo 通过别名直接引用根目录 `src/index.ts`，改库源码后保存即可热更新。说明见 [examples/demo/README.md](./examples/demo/README.md)。

## 主题一览

| 主题 | ID | 描述 |
|------|----|------|
| ✨ 星链 | `starline` | 经典粒子连线效果 |
| ❄️ 飘雪 | `snow` | 浪漫飘落雪花 |
| 🫧 气泡 | `bubble` | 梦幻上升气泡 |
| ⭐ 繁星 | `stars` | 闪烁星空效果 |
| 🪲 萤火虫 | `firefly` | 温暖的萤火虫光效 |
| 🔷 几何 | `geometry` | 漂浮的抽象几何图形 |
| 🌊 粒子海洋 | `wave` | 3D 粒子波浪（Three.js） |
| 🌊 轻量波浪 | `wave2d` | 轻量级粒子波浪（Canvas 2D） |
| 🚫 无 | `none` | 关闭粒子效果 |

## 安装

```bash
# 基础安装
pnpm add @xdy-npm/react-particle-backgrounds

# 必须安装：如果使用 tsparticles 主题（starline/snow/bubble/stars/firefly/geometry）
pnpm add @tsparticles/react @tsparticles/slim @tsparticles/engine

# 可选安装：如果使用 Three.js 主题（wave）
pnpm add three
```

**轻量波浪**（`wave2d`）主题使用 Canvas 2D，无需额外依赖。

## 快速开始

### 基础用法（Props 方式）

```tsx
import { ParticlesBackground } from '@xdy-npm/react-particle-backgrounds';

function App() {
  return (
    <div>
      <ParticlesBackground theme="starline" isDark />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <h1>My App</h1>
      </main>
    </div>
  );
}
```

### 配合主题选择器（Context 方式）

```tsx
import {
  ParticleProvider,
  ParticlesBackground,
  ThemeSelector,
} from '@xdy-npm/react-particle-backgrounds';

function App() {
  return (
    <ParticleProvider defaultTheme="snow" isDark>
      <ParticlesBackground />
      <ThemeSelector position="bottom-right" accentColor="#3b82f6" />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <h1>My App</h1>
      </main>
    </ParticleProvider>
  );
}
```

### 编程式切换主题

```tsx
import {
  ParticleProvider,
  ParticlesBackground,
  useParticleTheme,
} from '@xdy-npm/react-particle-backgrounds';

function ThemeButton() {
  const { themeId, setTheme } = useParticleTheme();

  return (
    <button onClick={() => setTheme('firefly')}>
      当前：{themeId} — 切换到萤火虫
    </button>
  );
}

function App() {
  return (
    <ParticleProvider>
      <ParticlesBackground />
      <ThemeButton />
    </ParticleProvider>
  );
}
```

## API

### `<ParticlesBackground />`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `theme` | `ThemeId \| string` | `'starline'` | 主题 ID（会覆盖 Provider 中的设置） |
| `isDark` | `boolean` | `true` | 深色模式开关 |
| `onLoaded` | `(container?) => void` | — | 粒子加载完成的回调 |
| `className` | `string` | — | CSS 类名 |
| `style` | `CSSProperties` | — | 行内样式 |

### `<ParticleProvider />`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `defaultTheme` | `ThemeId \| string` | `'starline'` | 初始主题 |
| `isDark` | `boolean` | `true` | 深色模式状态 |
| `persist` | `boolean` | `true` | 是否持久化到 localStorage |
| `children` | `ReactNode` | — | 子组件 |

### `<ThemeSelector />`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | 按钮位置 |
| `accentColor` | `string` | `'#3b82f6'` | 激活状态颜色 |

### `useParticleTheme()`

用于访问主题状态的 Hook（必须在 `<ParticleProvider>` 内使用）。

```ts
const { themeId, isDark, setTheme, setDark } = useParticleTheme();
```

### 主题对象

访问单个主题配置：

```ts
import { starlineTheme, particleThemes, getThemeById } from '@xdy-npm/react-particle-backgrounds';

const theme = getThemeById('snow');
const options = theme.options(true); // 获取深色模式下的 tsparticles 配置
```

## 自定义主题

你可以创建自己的主题并直接传入：

```tsx
import type { ParticleTheme } from '@xdy-npm/react-particle-backgrounds';
import { baseConfig } from '@xdy-npm/react-particle-backgrounds';

const myTheme: ParticleTheme = {
  id: 'custom',
  name: '我的主题',
  icon: '🎨',
  description: '一个自定义粒子主题',
  options: (isDark) => ({
    ...baseConfig,
    particles: {
      color: { value: isDark ? '#ffffff' : '#000000' },
      number: { value: 50 },
      move: { enable: true, speed: 2 },
      shape: { type: 'circle' },
      size: { value: 3 },
    },
  }),
};
```

## 许可证

MIT
