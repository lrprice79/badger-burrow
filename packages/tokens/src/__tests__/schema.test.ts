import { defaultTokens } from '../defaults'
import type { BurrowTokens } from '../schema'

describe('BurrowTokens schema', () => {
  it('defaultTokens satisfies BurrowTokens interface', () => {
    const tokens: BurrowTokens = defaultTokens
    expect(tokens).toBeDefined()
  })

  it('has required top-level keys', () => {
    const tokens: BurrowTokens = defaultTokens
    expect(tokens).toHaveProperty('primitive')
    expect(tokens).toHaveProperty('semantic')
    expect(tokens).toHaveProperty('motion')
    expect(tokens).toHaveProperty('breakpoints')
  })
})
