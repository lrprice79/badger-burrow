import { generateScale } from './colorScale'

export const palette = {
  primary:   generateScale('#8B5CF6'),
  secondary: generateScale('#14B8A6'),
  // Surfaces / borders — a clean pure grey with a near-white 50 (#f7f7f7).
  neutral:   generateScale('#808080'),
  // Text — its own scale so surfaces can be light without weakening text
  // contrast, and so text can carry a distinct (here, faintly cool) cast.
  // Override in one line: extendBurrow({ primitive: { color: { ink: generateScale('#...') } } })
  ink:       generateScale('#71717A'),
  success:   generateScale('#22C55E'),
  error:     generateScale('#EF4444'),
  warning:   generateScale('#F59E0B'),
  info:      generateScale('#3B82F6'),
}
