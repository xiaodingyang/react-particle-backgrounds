# react-particle-backgrounds

A React component library that provides **7 beautiful particle background themes** powered by [tsparticles](https://particles.js.org/) and [Three.js](https://threejs.org/).

## Themes

| Theme | ID | Description |
|-------|----|-------------|
| ✨ Star Links | `starline` | Classic particle linking effect |
| ❄️ Snowfall | `snow` | Romantic falling snowflakes |
| 🫧 Bubbles | `bubble` | Dreamy rising bubbles |
| ⭐ Twinkling Stars | `stars` | Sparkling starry sky |
| 🪲 Fireflies | `firefly` | Warm glowing firefly effect |
| 🔷 Geometry | `geometry` | Floating abstract geometric shapes |
| 🌊 Particle Ocean | `wave` | 3D particle wave (Three.js) |
| 🚫 None | `none` | Disable effects |

## Installation

```bash
npm install react-particle-backgrounds
# or
pnpm add react-particle-backgrounds
```

For the **Particle Ocean** (wave) theme, you also need Three.js:

```bash
npm install three
```

## Quick Start

### Simple Usage (Props)

```tsx
import { ParticlesBackground } from 'react-particle-backgrounds';

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

### With Theme Selector (Context)

```tsx
import {
  ParticleProvider,
  ParticlesBackground,
  ThemeSelector,
} from 'react-particle-backgrounds';

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

### Programmatic Theme Switching

```tsx
import {
  ParticleProvider,
  ParticlesBackground,
  useParticleTheme,
} from 'react-particle-backgrounds';

function ThemeButton() {
  const { themeId, setTheme } = useParticleTheme();

  return (
    <button onClick={() => setTheme('firefly')}>
      Current: {themeId} — Switch to Firefly
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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `ThemeId \| string` | `'starline'` | Theme ID (overrides provider) |
| `isDark` | `boolean` | `true` | Dark mode toggle |
| `onLoaded` | `(container?) => void` | — | Callback when particles load |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

### `<ParticleProvider />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `ThemeId \| string` | `'starline'` | Initial theme |
| `isDark` | `boolean` | `true` | Dark mode state |
| `persist` | `boolean` | `true` | Save to localStorage |
| `children` | `ReactNode` | — | Child components |

### `<ThemeSelector />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Button position |
| `accentColor` | `string` | `'#3b82f6'` | Active state color |

### `useParticleTheme()`

Hook to access theme state (must be within `<ParticleProvider>`).

```ts
const { themeId, isDark, setTheme, setDark } = useParticleTheme();
```

### Theme Objects

Access individual theme configs:

```ts
import { starlineTheme, particleThemes, getThemeById } from 'react-particle-backgrounds';

const theme = getThemeById('snow');
const options = theme.options(true); // get tsparticles config for dark mode
```

## Custom Themes

You can create your own theme and pass it directly:

```tsx
import type { ParticleTheme } from 'react-particle-backgrounds';
import { baseConfig } from 'react-particle-backgrounds';

const myTheme: ParticleTheme = {
  id: 'custom',
  name: 'My Theme',
  icon: '🎨',
  description: 'A custom particle theme',
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

## License

MIT
