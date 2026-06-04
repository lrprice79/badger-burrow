import { defaultTokens } from '../defaults'

describe('Semantic token reference format', () => {
  it('light semantic tokens use {category.scale.shade} reference format', () => {
    const ref = defaultTokens.semantic.light['color.interactive.primary']
    expect(ref).toMatch(/^\{.+\}$/)
  })

  it('dark mode overrides same keys as light', () => {
    const lightKeys = Object.keys(defaultTokens.semantic.light)
    const darkKeys = Object.keys(defaultTokens.semantic.dark)
    darkKeys.forEach(key => {
      expect(lightKeys).toContain(key)
    })
  })

  it('space scale contains both numeric and named keys', () => {
    const space = defaultTokens.primitive.space
    expect(space[4]).toBe(16)
    expect(space['md']).toBe(16)
  })

  it('shadow tokens have both web and native shapes', () => {
    const shadow = defaultTokens.primitive.shadow.md
    expect(shadow.web).toMatch(/rgba/)
    expect(shadow.native).toHaveProperty('elevation')
    expect(shadow.native).toHaveProperty('shadowColor')
  })
})
