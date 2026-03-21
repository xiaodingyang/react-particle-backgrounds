import {
  ParticleProvider,
  ParticlesBackground,
  ThemeSelector,
} from '@xdy-npm/react-particle-backgrounds';

export default function App() {
  return (
    <ParticleProvider defaultTheme="starline" isDark persist={false}>
      <ParticlesBackground />
      <ThemeSelector position="bottom-right" accentColor="#3b82f6" />
      <main
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          color: '#e2e8f0',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
          react-particle-backgrounds 本地调试
        </h1>
        <p style={{ maxWidth: 480, marginTop: 16, lineHeight: 1.6, opacity: 0.9 }}>
          右下角打开主题面板切换效果；本页通过 Vite alias 直接引用仓库根目录{' '}
          <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>
            src/index.ts
          </code>
          ，修改库源码后保存即可热更新。
        </p>
      </main>
    </ParticleProvider>
  );
}
