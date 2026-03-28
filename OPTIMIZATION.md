# 优化总结

## 体积对比

### 优化前
- ESM: 226KB
- CJS: 168KB
- 总体积: 1.8MB (含 sourcemap)

### 优化后
- ESM: 31.42KB (gzip: 8.68KB) ⬇️ **86%**
- CJS: 21.96KB (gzip: 7.54KB) ⬇️ **87%**
- 总体积: 60KB ⬇️ **97%**

## 优化措施

### 1. 动态导入 tsparticles 依赖
- 将 `@tsparticles/react` 和 `@tsparticles/slim` 改为动态 import
- 仅在实际使用非 Three.js 主题时才加载
- 使用 React.lazy + Suspense 延迟加载 Particles 组件

### 2. 优化构建配置
- 移除 sourcemap (生产环境不需要)
- 将 tsparticles 相关包标记为 external
- 使用 esbuild 压缩 (更快)
- 移除 `@tsparticles/*` 从 dependencies 到 devDependencies

### 3. 依赖优化
- 将 `@tsparticles/react`、`@tsparticles/slim` 标记为可选 peer 依赖
- 用户按需安装，不使用粒子效果时无需安装

## 加载性能提升

### 初始加载
- **优化前**: 所有依赖立即加载
- **优化后**: 仅在渲染粒子背景时动态加载

### 运行时
- Three.js 主题 (wave/wave2d): 无需加载 tsparticles
- 其他主题: 首次渲染时异步加载 tsparticles
- 引擎初始化缓存: 多个实例共享同一引擎

## 使用建议

### 安装依赖
```bash
# 基础安装
pnpm add @xdy-npm/react-particle-backgrounds

# 如果使用 tsparticles 主题 (starline/snow/bubble/stars/firefly/geometry)
pnpm add @tsparticles/react @tsparticles/slim @tsparticles/engine

# 如果使用 Three.js 主题 (wave/wave2d)
pnpm add three
```

### 代码分割
组件已自动实现代码分割，无需额外配置。

## 兼容性

所有现有 API 保持不变，完全向后兼容。
