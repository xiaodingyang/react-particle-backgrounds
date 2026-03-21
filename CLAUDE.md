# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React particle background component library built with Vite, tsparticles, and Three.js. Provides 7 themed particle backgrounds (starline, snow, bubble, stars, firefly, geometry, wave) with dark/light mode support.

## Build & Development Commands

```bash
# Build the library (outputs to dist/)
pnpm build

# Build in watch mode
pnpm dev

# Type checking
pnpm lint

# Run demo app (installs deps and starts Vite dev server at localhost:5173)
pnpm demo:dev
```

The demo app (`examples/demo`) uses Vite alias to directly reference `src/index.ts`, enabling hot reload during development without rebuilding the library.

## Architecture

### Component Structure

- **ParticlesBackground**: Main component that renders particle effects. Can work standalone (via props) or with ParticleProvider (via context). Handles both tsparticles-based themes and Three.js-based themes (wave).
- **ParticleWave**: Three.js renderer for the 3D wave theme. Dynamically imports `three` to avoid bundling it when not needed.
- **ThemeSelector**: UI component for switching themes, must be used within ParticleProvider.
- **ParticleProvider**: Context provider for theme state management with localStorage persistence.

### Theme System

Each theme is defined in `src/themes/` with:
- `id`, `name`, `icon`, `description`: metadata
- `options(isDark)`: function returning tsparticles ISourceOptions
- `isThreeJS`: flag for Three.js-based themes (only wave)
- `backgroundColor` / `backgroundGradient`: optional background styling

Themes are registered in `src/themes/index.ts` via the `particleThemes` array. The `getThemeById()` function retrieves themes with fallback to starline.

### Context Pattern

The library supports two usage patterns:
1. **Props-based**: Pass `theme` and `isDark` directly to `<ParticlesBackground />`
2. **Context-based**: Wrap with `<ParticleProvider>` and use `useParticleTheme()` hook

`useParticleThemeOptional()` enables components to work in both modes by falling back to props when context is unavailable.

### Build Configuration

- **Library mode**: Vite builds to both ESM (`index.mjs`) and CJS (`index.js`) with TypeScript declarations
- **Externals**: `react`, `react-dom`, `react/jsx-runtime`, and `three` are marked as external
- **Peer dependencies**: `three` is optional (only needed for wave theme)
- **Type generation**: `vite-plugin-dts` with `rollupTypes: true` bundles all types into single declaration file

### Instance Management

ParticlesBackground uses an `instanceCounter` to generate unique IDs for each particle instance. When theme or isDark changes, it increments the counter and destroys the old container to force a clean re-render, preventing tsparticles state conflicts.

## Key Implementation Details

- Three.js is loaded dynamically in ParticleWave to avoid errors when not installed
- Theme persistence uses localStorage key `rpb-theme-id`
- The library exports both individual theme objects and a `particleThemes` array
- Custom themes can be created by implementing the `ParticleTheme` interface
