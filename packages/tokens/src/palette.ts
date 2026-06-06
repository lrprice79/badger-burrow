import { generateScale } from './colorScale'

export const palette = {
  primary:   generateScale('#8B5CF6'),
  secondary: generateScale('#14B8A6'),
  neutral:   generateScale('#71717A'),
  success:   generateScale('#22C55E'),
  error:     generateScale('#EF4444'),
  warning:   generateScale('#F59E0B'),
  info:      generateScale('#3B82F6'),
}
