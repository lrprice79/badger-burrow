import React from 'react'
import { render, screen } from '@testing-library/react'
import { Chamber } from '../Chamber'
import { BadgerBase } from '@badger-burrow/core'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── dimensions ───────────────────────────────────────────────────────────────

describe('dimensions', () => {
    it('w sets width from a space token', () => {
        render(<Chamber data-testid="b" w="space.16" />)
        expect(screen.getByTestId('b').style.width).toBe('64px')
    })

    it('w accepts a raw number', () => {
        render(<Chamber data-testid="b" w={200} />)
        expect(screen.getByTestId('b').style.width).toBe('200px')
    })

    it('w accepts a raw string', () => {
        render(<Chamber data-testid="b" w="100%" />)
        expect(screen.getByTestId('b').style.width).toBe('100%')
    })

    it('h sets height from a space token', () => {
        render(<Chamber data-testid="b" h="space.16" />)
        expect(screen.getByTestId('b').style.height).toBe('64px')
    })

    it('minW sets minWidth', () => {
        render(<Chamber data-testid="b" minW={100} />)
        expect(screen.getByTestId('b').style.minWidth).toBe('100px')
    })

    it('maxW sets maxWidth', () => {
        render(<Chamber data-testid="b" maxW="100%" />)
        expect(screen.getByTestId('b').style.maxWidth).toBe('100%')
    })

    it('minH sets minHeight', () => {
        render(<Chamber data-testid="b" minH={50} />)
        expect(screen.getByTestId('b').style.minHeight).toBe('50px')
    })

    it('maxH sets maxHeight', () => {
        render(<Chamber data-testid="b" maxH={300} />)
        expect(screen.getByTestId('b').style.maxHeight).toBe('300px')
    })
})

// ─── display ──────────────────────────────────────────────────────────────────

describe('display', () => {
    it('sets display: flex', () => {
        render(<Chamber data-testid="b" display="flex" />)
        expect(screen.getByTestId('b').style.display).toBe('flex')
    })

    it('sets display: grid', () => {
        render(<Chamber data-testid="b" display="grid" />)
        expect(screen.getByTestId('b').style.display).toBe('grid')
    })

    it('sets display: none', () => {
        render(<Chamber data-testid="b" display="none" />)
        expect(screen.getByTestId('b').style.display).toBe('none')
    })
})

// ─── flexbox ──────────────────────────────────────────────────────────────────

describe('flexbox', () => {
    it('flex sets the flex shorthand', () => {
        render(<Chamber data-testid="b" flex={1} />)
        expect(screen.getByTestId('b').style.flex).toBe('1')
    })

    it('flexDir sets flexDirection', () => {
        render(<Chamber data-testid="b" flexDir="column" />)
        expect(screen.getByTestId('b').style.flexDirection).toBe('column')
    })

    it('align sets alignItems', () => {
        render(<Chamber data-testid="b" align="center" />)
        expect(screen.getByTestId('b').style.alignItems).toBe('center')
    })

    it('justify sets justifyContent', () => {
        render(<Chamber data-testid="b" justify="space-between" />)
        expect(screen.getByTestId('b').style.justifyContent).toBe('space-between')
    })

    it('wrap sets flexWrap', () => {
        render(<Chamber data-testid="b" wrap="wrap" />)
        expect(screen.getByTestId('b').style.flexWrap).toBe('wrap')
    })
})

// ─── border ───────────────────────────────────────────────────────────────────

describe('border', () => {
    it('border sets border shorthand', () => {
        render(<Chamber data-testid="b" border="1px solid red" />)
        expect(screen.getByTestId('b').style.border).toBeTruthy()
    })

    it('borderColor resolves a semantic token', () => {
        render(<Chamber data-testid="b" borderColor="color.border.default" />)
        expect(screen.getByTestId('b').style.borderColor).toBeTruthy()
    })

    it('borderColor accepts a raw colour', () => {
        render(<Chamber data-testid="b" borderColor="#ff0000" />)
        expect(screen.getByTestId('b').style.borderColor).toBe('#ff0000')
    })

    it('borderWidth sets border width from a number', () => {
        render(<Chamber data-testid="b" borderWidth={2} />)
        expect(screen.getByTestId('b').style.borderWidth).toBe('2px')
    })
})

// ─── opacity ──────────────────────────────────────────────────────────────────

describe('opacity', () => {
    it('sets opacity', () => {
        render(<Chamber data-testid="b" opacity={0.5} />)
        expect(screen.getByTestId('b').style.opacity).toBe('0.5')
    })
})

// ─── shadow ───────────────────────────────────────────────────────────────────

describe('shadow', () => {
    it('shadow="sm" sets boxShadow from the web token', () => {
        render(<Chamber data-testid="b" shadow="sm" />)
        expect(screen.getByTestId('b').style.boxShadow).toBeTruthy()
    })

    it('shadow="md" sets a different boxShadow than sm', () => {
        render(<Chamber data-testid="b" shadow="md" />)
        const md = screen.getByTestId('b').style.boxShadow
        const { unmount } = render(<Chamber data-testid="b2" shadow="sm" />)
        expect(md).not.toBe(screen.getByTestId('b2').style.boxShadow)
        unmount()
    })

    it('shadow="none" sets boxShadow to none', () => {
        render(<Chamber data-testid="b" shadow="none" />)
        expect(screen.getByTestId('b').style.boxShadow).toBe('none')
    })
})

// ─── overflow ─────────────────────────────────────────────────────────────────

describe('overflow', () => {
    it('sets overflow: hidden', () => {
        render(<Chamber data-testid="b" overflow="hidden" />)
        expect(screen.getByTestId('b').style.overflow).toBe('hidden')
    })

    it('sets overflow: auto', () => {
        render(<Chamber data-testid="b" overflow="auto" />)
        expect(screen.getByTestId('b').style.overflow).toBe('auto')
    })
})

// ─── position ─────────────────────────────────────────────────────────────────

describe('position', () => {
    it('sets position: relative', () => {
        render(<Chamber data-testid="b" position="relative" />)
        expect(screen.getByTestId('b').style.position).toBe('relative')
    })

    it('sets position: absolute', () => {
        render(<Chamber data-testid="b" position="absolute" />)
        expect(screen.getByTestId('b').style.position).toBe('absolute')
    })

    it('top resolves a space token', () => {
        render(<Chamber data-testid="b" top="space.4" />)
        expect(screen.getByTestId('b').style.top).toBe('16px')
    })

    it('right resolves a space token', () => {
        render(<Chamber data-testid="b" right="space.2" />)
        expect(screen.getByTestId('b').style.right).toBe('8px')
    })

    it('bottom resolves a space token', () => {
        render(<Chamber data-testid="b" bottom="space.2" />)
        expect(screen.getByTestId('b').style.bottom).toBe('8px')
    })

    it('left resolves a space token', () => {
        render(<Chamber data-testid="b" left="space.4" />)
        expect(screen.getByTestId('b').style.left).toBe('16px')
    })

    it('top accepts a raw number', () => {
        render(<Chamber data-testid="b" top={0} />)
        expect(screen.getByTestId('b').style.top).toBe('0px')
    })
})

// ─── zIndex ───────────────────────────────────────────────────────────────────

describe('zIndex', () => {
    it('sets zIndex', () => {
        render(<Chamber data-testid="b" zIndex={10} />)
        expect(screen.getByTestId('b').style.zIndex).toBe('10')
    })
})
