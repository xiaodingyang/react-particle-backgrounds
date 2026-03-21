import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 指向库源码，改 ../../src 后无需先执行根目录 build
      '@xdy-npm/react-particle-backgrounds': path.join(repoRoot, 'src/index.ts'),
    },
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: [repoRoot],
    },
  },
});
