# 从 0 到 1：用 Vite 搭建 React 组件库并发布到 npm（中高级前端面试版）

本文档把「工具链选型、工程配置、包规范、发布流程、消费方式」串成一条可讲述的闭环，便于面试时说明**你如何把库交付给其他项目使用**。文中「本仓库」指当前项目 `react-particle-backgrounds`，配置以根目录 `vite.config.ts`、`package.json` 为准。

---

## 一、面试官在问什么（中高级常见考点）

1. **库与应用的区别**：库要同时考虑 ESM/CJS、类型声明、宿主依赖（React）不重复打包。
2. **构建工具**：为何用 Vite Library Mode（底层 Rollup）、`external` 怎么配、`vite-plugin-dts` 解决什么问题。
3. **package.json 规范**：`main` / `module` / `types` / `exports`、`files`、`peerDependencies`、版本号策略。
4. **发布与治理**：scope、公开包、`npm publish --access public`、2FA、Granular Access Token、发布前校验。
5. **消费方体验**：安装后如何 `import`、Tree-shaking、可选 peer（如 `three`）带来的行为。

---

## 二、从 0 开始：初始化一个「可发布」的库工程

### 2.1 创建目录与 package.json

```bash
mkdir my-react-lib && cd my-react-lib
npm init -y
```

建议尽早确定 **包名**：
- 无 scope：`my-react-lib`
- 有 scope（与 npm 用户名或组织一致）：`@your-scope/my-react-lib`  
  面试要点：**scope 必须与 npm 上可发布的命名空间一致**，否则会出现 `404 Not Found`。

### 2.2 安装开发依赖（TypeScript + Vite + React 插件 + 类型生成）

以本仓库为例，开发依赖包含：

- `typescript`：类型检查与声明生成的基础
- `vite`：开发与构建
- `@vitejs/plugin-react`：编译 TSX、使用 React 自动 JSX 运行时
- `vite-plugin-dts`：从源码生成合并后的 `dist/index.d.ts`（面试常问：**谁产出 .d.ts**）

```bash
npm install -D typescript vite @vitejs/plugin-react vite-plugin-dts
```

若库内有 TSX，还需：

```bash
npm install -D @types/react @types/react-dom react react-dom
```

**React 本体**在库里通常放在 `devDependencies`（本地开发、类型、测试用），同时通过 **`peerDependencies`** 声明「使用方必须提供 React」，避免包里再打一份 React。

### 2.3 推荐目录结构

```
├── src/
│   └── index.ts          # 唯一对外入口（barrel export）
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

本仓库在 `src/index.ts` 中集中导出组件、Context、主题工具等，**npm 消费者只依赖这一条公共 API**，便于维护与 semver。

---

## 三、Vite 库模式（Library Mode）核心配置

### 3.1 目标产物（与 npm 生态对齐）

典型要产出：

| 产物 | 用途 |
|------|------|
| `dist/index.mjs` | 现代打包器 / ESM `import` |
| `dist/index.js` | Node / 旧工具链 `require` |
| `dist/index.d.ts` | TypeScript 类型 |
| `*.map`（可选） | 便于调试 |

`package.json` 中与本仓库一致地写上：

- `module` → `dist/index.mjs`
- `main` → `dist/index.js`
- `types` → `dist/index.d.ts`
- `exports` → 为 `import` / `require` / `types` 分别指定路径（见本仓库 `package.json`）

### 3.2 `vite.config.ts` 要点（对照本仓库）

1. **`build.lib`**  
   - `entry`：库入口，例如 `src/index.ts`  
   - `formats: ['es', 'cjs']`：同时打 ESM 与 CJS  
   - `fileName`：让 ESM 为 `index.mjs`、CJS 为 `index.js`，与 `package.json` 字段一致  

2. **`rollupOptions.external`**  
   不要把 **宿主依赖**打进包里，否则易出现：
   - 包体积膨胀  
   - **多份 React** 导致 Hooks 报错  

   本仓库 external：`react`、`react-dom`、`react/jsx-runtime`、`three`（`three` 为可选能力时使用方按需安装）。

3. **`vite-plugin-dts`**  
   - `rollupTypes: true`：尽量合并声明，消费者只需引用一个 `index.d.ts`  
   - `include`：限定扫描 `src` 下 ts/tsx  

4. **`build.sourcemap` / `emptyOutDir`**  
   - 生成 source map，发布前 `emptyOutDir` 避免脏文件残留  

### 3.3 `npm run dev` 为什么没有页面端口？

本仓库脚本：

- `dev` → `vite build --watch`  

含义是 **监听源码并持续产出 `dist/`**，不是启动静态站点。

若需要带端口的页面调试本库，可使用仓库内的 **`examples/demo`**：根目录执行 `pnpm demo:dev`，通过 Vite `alias` 指向 `../../src/index.ts`，与「库构建」分离。详见 `examples/demo/README.md`。

---

## 四、package.json：能顺利发到 npm 的关键字段

### 4.1 `files`

```json
"files": ["dist"]
```

**白名单机制**：只有 `dist`（以及 npm 默认会带的少量文件如根目录 `README`、`LICENSE`）会进入 tarball。  
因此本仓库的 **`docs/`、`src/` 不会被打进 npm 包**（与面试题「如何减小包体、避免泄露源码」对应）。

### 4.2 `prepublishOnly`

```json
"prepublishOnly": "npm run build"
```

保证执行 `npm publish` 前一定先执行 `vite build`，避免发布空 `dist` 或旧产物。

### 4.3 `peerDependencies` 与 `peerDependenciesMeta`

- `react`、`react-dom`：必须由宿主项目安装，版本范围用 `>=17.0.0` 等表达兼容策略。  
- `three`：若部分功能可选，可用 `peerDependenciesMeta.three.optional: true`，避免未使用该功能的用户被迫装 `three`。

### 4.4 `exports`（强烈建议）

统一解析规则，减少「有的环境能 `import`、有的只能 `require`」的差异，并指向正确的类型文件。

---

## 五、构建、自检、再发布

### 5.1 本地构建

```bash
npm run build
```

产物应在 `dist/` 下且与 `package.json` 的 `main`/`module`/`types` 一致。

### 5.2 发布前检查 tarball（推荐）

```bash
npm pack --dry-run
```

确认 **不包含** `docs/`、`src/`，且包含 `dist/` 下预期文件。

### 5.3 登录与权限

- `npm whoami` 确认当前登录用户与 **scope** 匹配。  
- 若遇 **403** 提示需要 2FA 或 Granular Access Token：按 npm 要求配置后再发布。  
- 若遇 **404** 且包名为 scope：多为 **scope 与当前账号不一致** 或 **未使用 `--access public`**。

### 5.4 正式发布（scope 公开包）

```bash
npm publish --access public
```

每次发布前 **递增 `version`**（semver），同一版本号不可重复上传。

---

## 六、用户安装后如何使用（对应「库的公共 API」）

```bash
npm install @xdy-npm/react-particle-backgrounds
```

从包入口按命名导出使用（与本仓库 `src/index.ts` 一致），例如：

```tsx
import { ParticlesBackground, ParticleProvider, ThemeSelector } from '@xdy-npm/react-particle-backgrounds';
```

面试可补充：

- **类型**：依赖 `dist/index.d.ts`，IDE 能自动提示。  
- **Tree-shaking**：ESM 产物配合宿主打包器的 sideEffects 字段（若未来在 package.json 声明 `"sideEffects": false` 需确保确实无副作用）。  
- **可选 peer**：`wave` 主题需要用户自行安装 `three`。

---

## 七、面试口述模板（约 90 秒）

「我做过一个 React 组件库，用 **Vite 的 library mode** 打包，输出 **ESM + CJS**，用 **vite-plugin-dts** 生成 **聚合后的类型声明**。  
**React** 放在 **peerDependencies**，并在 Rollup 里 **external** 掉，避免和用户项目里的 React 重复打包。  
`package.json` 里用 **`files: ['dist']`** 控制发布内容，配合 **`exports`** 统一入口。  
发布前 **`prepublishOnly` 跑 build**，并用 **`npm pack --dry-run`** 检查包内容。  
发布 scope 包时用 **`npm publish --access public`**，并处理 npm 账号的 **2FA 或 Granular Token**。」

---

## 八、与其他方案的对比（加分项）

| 方案 | 特点 |
|------|------|
| **Vite（library）** | 与前端工程栈统一，可扩展 demo；底层 Rollup，配置相对直观。 |
| **tsup** | 基于 esbuild，配置更少、构建极快，适合纯库无站点。 |
| **Rollup 手写** | 灵活度最高，配置成本略高。 |

选型话术：**团队已 Vite 化或需要 playground 时选 Vite；只追求极致构建速度可 tsup。**

---

## 九、本仓库速查

| 项目 | 位置 |
|------|------|
| Vite 配置 | `vite.config.ts` |
| 对外导出 | `src/index.ts` |
| 构建命令 | `package.json` → `scripts.build` |
| 发布白名单 | `package.json` → `files` |
| 使用说明（面向用户） | 根目录 `README.md` |

---

## 十、延伸阅读（自行准备 1～2 点即可）

- Semantic Versioning 与破坏性变更（major）如何沟通  
- Changesets / Release PR 等团队协作发布流程（中高级加分）  
- 在 CI 中 `npm publish` 使用 **Automation Token** 的安全边界  

文档结束。
