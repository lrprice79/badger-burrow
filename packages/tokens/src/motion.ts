import type { MotionTokens } from './schema'

export const defaultMotion: MotionTokens = {
  duration: { instant: 0, fast: 150, normal: 300, slow: 600, glacial: 1000 },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  spring: {
    bouncy: { damping: 10, stiffness: 100 },
    gentle: { damping: 20, stiffness: 80 },
    stiff: { damping: 30, stiffness: 200 },
  },
}
