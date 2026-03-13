import type { ISourceOptions } from '@tsparticles/engine';

export interface ParticleTheme {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** Whether this theme uses Three.js instead of tsparticles */
  isThreeJS?: boolean;
  /** Returns tsparticles config for the given dark mode state */
  options: (isDark: boolean) => ISourceOptions;
  /** Solid background color */
  backgroundColor?: string;
  /** CSS gradient background */
  backgroundGradient?: string;
}

export type ThemeId = 'starline' | 'snow' | 'bubble' | 'stars' | 'firefly' | 'geometry' | 'wave' | 'none';
