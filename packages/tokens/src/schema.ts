export interface PrimitiveColorScale {
  [shade: string]: string
}

export interface ShadowToken {
  web: string
  native: NativeShadow
}

export interface NativeShadow {
  elevation: number
  shadowColor: string
  shadowOpacity: number
  shadowRadius: number
  shadowOffset: { width: number; height: number }
}

export interface PrimitiveTokens {
  color: Record<string, PrimitiveColorScale>
  space: Record<string | number, number>
  radius: Record<string, number>
  fontSize: Record<string, number>
  fontWeight: Record<string, number>
  lineHeight: Record<string, number>
  letterSpacing: Record<string, number>
  fontFamily: Record<string, string>
  shadow: Record<string, ShadowToken>
}

export interface SemanticTokens {
  light: Record<string, string>
  dark: Record<string, string>
}

export interface MotionDuration {
  [key: string]: number
}

export interface MotionEasing {
  [key: string]: string
}

export interface SpringConfig {
  damping: number
  stiffness: number
}

export interface MotionTokens {
  duration: MotionDuration
  easing: MotionEasing
  spring: Record<string, SpringConfig>
}

export interface BurrowTokens {
  primitive: PrimitiveTokens
  semantic: SemanticTokens
  motion: MotionTokens
  breakpoints: Record<string, string>
}
