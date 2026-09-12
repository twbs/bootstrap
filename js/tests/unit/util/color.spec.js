import {
  CHROMA_REFERENCE, FORMATS, PALETTE, THEME_COLORS,
  clampToGamut, contrastColor, detectFormat, formatColor, isColorFormat, isInGamut,
  oklchToRgb, parseColor, resolveColor, resolveCssColor, rgbToOklch
} from '../../../src/util/color.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('Color', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  // OKLCH conversion is lossy in the last few decimals, so compare with tolerance
  const expectClose = (actual, expected, tolerance = 0.001) => {
    expect(Math.abs(actual - expected)).toBeLessThan(tolerance)
  }

  describe('constants', () => {
    it('should expose the 16 base palette hues', () => {
      expect(PALETTE.length).toEqual(16)
      expect(PALETTE).toContain('blue')
      expect(PALETTE).toContain('pewter')
    })

    it('should expose the 8 semantic theme colors', () => {
      expect(THEME_COLORS.length).toEqual(8)
      expect(THEME_COLORS).toContain('primary')
      expect(THEME_COLORS).toContain('secondary')
    })

    it('should expose the supported formats', () => {
      expect(FORMATS).toEqual(['hex', 'rgb', 'hsl', 'oklch'])
    })
  })

  describe('parseColor', () => {
    it('should return null for non-strings and empty values', () => {
      expect(parseColor(null)).toBeNull()
      expect(parseColor(undefined)).toBeNull()
      expect(parseColor(42)).toBeNull()
      expect(parseColor('')).toBeNull()
      expect(parseColor('   ')).toBeNull()
    })

    it('should return null for malformed input', () => {
      expect(parseColor('notacolor')).toBeNull()
      expect(parseColor('#xyz')).toBeNull()
      expect(parseColor('#12345')).toBeNull()
      expect(parseColor('rgb(1 2)')).toBeNull()
      expect(parseColor('rebeccapurple')).toBeNull()
    })

    it('should parse transparent', () => {
      const color = parseColor('transparent')

      expect(color.alpha).toEqual(0)
      expect(color.l).toEqual(0)
    })

    it('should parse 3 and 6 digit hex identically', () => {
      const short = parseColor('#f00')
      const long = parseColor('#ff0000')

      expectClose(short.l, long.l)
      expectClose(short.c, long.c)
      expectClose(short.h, long.h)
    })

    it('should parse hex alpha', () => {
      expect(parseColor('#ff000080').alpha).toBeCloseTo(0.502, 2)
      expect(parseColor('#f008').alpha).toBeCloseTo(0.533, 2)
      expect(parseColor('#ff0000').alpha).toEqual(1)
    })

    it('should parse legacy and modern rgb the same way', () => {
      const legacy = parseColor('rgba(255, 0, 0, 0.5)')
      const modern = parseColor('rgb(255 0 0 / 0.5)')

      expectClose(legacy.l, modern.l)
      expectClose(legacy.alpha, modern.alpha)
      expect(legacy.alpha).toEqual(0.5)
    })

    it('should parse rgb percentages', () => {
      const percent = parseColor('rgb(100% 0% 0%)')
      const bytes = parseColor('rgb(255 0 0)')

      expectClose(percent.l, bytes.l)
      expectClose(percent.c, bytes.c)
    })

    it('should parse hsl', () => {
      const red = parseColor('hsl(0 100% 50%)')
      const hex = parseColor('#ff0000')

      expectClose(red.l, hex.l, 0.01)
      expectClose(red.c, hex.c, 0.01)
    })

    it('should parse hsl with alpha in both syntaxes', () => {
      expect(parseColor('hsla(0, 100%, 50%, 0.25)').alpha).toEqual(0.25)
      expect(parseColor('hsl(0 100% 50% / 25%)').alpha).toEqual(0.25)
    })

    it('should parse oklch with percentage and unit lightness', () => {
      const percent = parseColor('oklch(60% 0.24 240)')
      const unit = parseColor('oklch(0.6 0.24 240)')

      expectClose(percent.l, 0.6)
      expectClose(unit.l, 0.6)
      expectClose(percent.c, 0.24)
      expectClose(percent.h, 240)
    })

    it('should parse oklch chroma percentages against the 0.4 reference', () => {
      expectClose(parseColor('oklch(60% 50% 240)').c, CHROMA_REFERENCE * 0.5)
    })

    it('should parse hue angle units', () => {
      expectClose(parseColor('oklch(60% 0.1 0.5turn)').h, 180)
      expectClose(parseColor('oklch(60% 0.1 200grad)').h, 180)
      expectClose(parseColor('oklch(60% 0.1 180deg)').h, 180)
      expectClose(parseColor('oklch(60% 0.1 3.14159rad)').h, 180, 0.01)
    })

    it('should treat none as zero', () => {
      const color = parseColor('oklch(60% none none)')

      expect(color.c).toEqual(0)
      expect(color.h).toEqual(0)
    })

    it('should parse oklab into equivalent oklch', () => {
      const lab = parseColor('oklab(60% 0.1 0)')

      expectClose(lab.l, 0.6)
      expectClose(lab.c, 0.1)
      expectClose(lab.h, 0)
    })

    it('should zero the hue when chroma is zero', () => {
      expect(parseColor('#808080').h).toEqual(0)
      expect(parseColor('oklab(50% 0 0)').h).toEqual(0)
    })

    it('should be case insensitive', () => {
      expect(parseColor('#FF0000')).not.toBeNull()
      expect(parseColor('RGB(255 0 0)')).not.toBeNull()
      expect(parseColor('OKLCH(60% 0.2 240)')).not.toBeNull()
    })
  })

  describe('round trips', () => {
    it('should round trip sRGB hex values exactly', () => {
      const values = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#0d6efd', '#631aff', '#808080', '#123456']

      for (const value of values) {
        expect(formatColor(parseColor(value), 'hex')).toEqual(value)
      }
    })

    it('should round trip through rgb', () => {
      expect(formatColor(parseColor('rgb(13 110 253)'), 'rgb')).toEqual('rgb(13 110 253)')
    })

    it('should round trip rgb to oklch and back', () => {
      const original = {
        r: 13 / 255, g: 110 / 255, b: 253 / 255, alpha: 1
      }
      const roundTripped = oklchToRgb(rgbToOklch(original))

      expectClose(roundTripped.r, original.r, 0.0001)
      expectClose(roundTripped.g, original.g, 0.0001)
      expectClose(roundTripped.b, original.b, 0.0001)
    })

    it('should preserve alpha across formats', () => {
      const color = parseColor('#ff000080')

      expect(formatColor(color, 'hex')).toEqual('#ff000080')
      expect(formatColor(color, 'rgb')).toContain('/')
      expect(formatColor(color, 'hsl')).toContain('/')
      expect(formatColor(color, 'oklch')).toContain('/')
    })
  })

  describe('formatColor', () => {
    const red = {
      l: 0.627_955, c: 0.257_683, h: 29.234, alpha: 1
    }

    it('should default to hex', () => {
      expect(formatColor(red)).toMatch(/^#[\da-f]{6}$/)
    })

    it('should omit alpha when fully opaque', () => {
      expect(formatColor(red, 'rgb')).toEqual('rgb(255 0 0)')
      expect(formatColor(red, 'hex')).not.toContain('/')
      expect(formatColor({ ...red, alpha: 1 }, 'oklch')).not.toContain('/')
    })

    it('should use modern space separated syntax', () => {
      expect(formatColor(red, 'rgb')).not.toContain(',')
      expect(formatColor(red, 'hsl')).not.toContain(',')
    })

    it('should serialize oklch lightness as a percentage', () => {
      const color = {
        l: 0.6, c: 0.24, h: 240, alpha: 1
      }

      expect(formatColor(color, 'oklch')).toEqual('oklch(60% 0.24 240)')
    })

    it('should serialize hsl with percentage saturation and lightness', () => {
      expect(formatColor(parseColor('#ff0000'), 'hsl')).toEqual('hsl(0 100% 50%)')
    })

    it('should honor the precision option', () => {
      const color = {
        l: 0.612_345, c: 0.123_456, h: 240.987, alpha: 1
      }

      expect(formatColor(color, 'oklch', { precision: 0 })).toEqual('oklch(61% 0.12 241)')
    })

    it('should clamp out of gamut colors before serializing to hex', () => {
      // Maximum chroma green is far outside sRGB
      const result = formatColor({
        l: 0.8, c: 0.4, h: 140, alpha: 1
      }, 'hex')

      expect(result).toMatch(/^#[\da-f]{6}$/)
    })
  })

  describe('isInGamut', () => {
    it('should accept plain sRGB colors', () => {
      expect(isInGamut(parseColor('#ff0000'))).toBeTrue()
      expect(isInGamut(parseColor('#000000'))).toBeTrue()
      expect(isInGamut(parseColor('#ffffff'))).toBeTrue()
    })

    it('should reject colors beyond sRGB', () => {
      expect(isInGamut({
        l: 0.8, c: 0.4, h: 140, alpha: 1
      })).toBeFalse()
    })
  })

  describe('clampToGamut', () => {
    it('should leave in gamut colors untouched', () => {
      const color = parseColor('#0d6efd')
      const clamped = clampToGamut(color)

      expectClose(clamped.c, color.c)
      expectClose(clamped.l, color.l)
    })

    it('should reduce chroma while holding lightness and hue', () => {
      const color = {
        l: 0.8, c: 0.4, h: 140, alpha: 1
      }
      const clamped = clampToGamut(color)

      expect(clamped.c).toBeLessThan(color.c)
      expect(clamped.l).toEqual(color.l)
      expect(clamped.h).toEqual(color.h)
      expect(isInGamut(clamped)).toBeTrue()
    })

    it('should collapse chroma at the lightness extremes', () => {
      expect(clampToGamut({
        l: 0, c: 0.3, h: 100, alpha: 1
      }).c).toEqual(0)
      expect(clampToGamut({
        l: 1, c: 0.3, h: 100, alpha: 1
      }).c).toEqual(0)
    })

    it('should preserve alpha', () => {
      expect(clampToGamut({
        l: 0.8, c: 0.4, h: 140, alpha: 0.5
      }).alpha).toEqual(0.5)
    })
  })

  describe('contrastColor', () => {
    it('should pick white on dark colors', () => {
      expect(contrastColor(parseColor('#000000'))).toEqual('#fff')
      expect(contrastColor(parseColor('#663399'))).toEqual('#fff')
    })

    it('should pick black on light colors', () => {
      expect(contrastColor(parseColor('#ffffff'))).toEqual('#000')
      expect(contrastColor(parseColor('#ffff00'))).toEqual('#000')
    })

    // Sass `color-contrast()` returns the first foreground clearing
    // `$min-contrast-ratio`, checking light first, which is why `--primary-bg`
    // ships `contrast: var(--white)` even though black wins on raw ratio
    it('should prefer light text whenever it clears the minimum ratio', () => {
      expect(contrastColor(parseColor('#0d6efd'))).toEqual('#fff')
    })
  })

  describe('detectFormat', () => {
    it('should detect each supported format', () => {
      expect(detectFormat('#0d6efd')).toEqual('hex')
      expect(detectFormat('rgb(1 2 3)')).toEqual('rgb')
      expect(detectFormat('rgba(1, 2, 3, 1)')).toEqual('rgb')
      expect(detectFormat('hsl(1 2% 3%)')).toEqual('hsl')
      expect(detectFormat('oklch(60% 0.2 240)')).toEqual('oklch')
      expect(detectFormat('oklab(60% 0.1 0)')).toEqual('oklch')
    })

    it('should return null for unrecognized values', () => {
      expect(detectFormat('rebeccapurple')).toBeNull()
      expect(detectFormat(null)).toBeNull()
      expect(detectFormat(42)).toBeNull()
    })
  })

  describe('isColorFormat', () => {
    it('should validate format names', () => {
      expect(isColorFormat('hex')).toBeTrue()
      expect(isColorFormat('oklch')).toBeTrue()
      expect(isColorFormat('lab')).toBeFalse()
      expect(isColorFormat(null)).toBeFalse()
    })
  })

  describe('resolveCssColor', () => {
    it('should return null for empty values', () => {
      expect(resolveCssColor('')).toBeNull()
      expect(resolveCssColor('   ')).toBeNull()
    })

    it('should return null for values CSSOM rejects', () => {
      expect(resolveCssColor('notacolor')).toBeNull()
    })

    it('should resolve named colors', () => {
      expect(resolveCssColor('rebeccapurple')).toContain('102')
    })

    it('should resolve custom properties against a context element', () => {
      fixtureEl.innerHTML = '<div id="host" style="--test-color: #ff0000"></div>'

      const host = fixtureEl.querySelector('#host')

      expect(resolveCssColor('var(--test-color)', host)).toEqual('rgb(255, 0, 0)')
    })

    // A cache keyed only by the value string would hand the first element's
    // palette to the second
    it('should not cache custom properties across context elements', () => {
      fixtureEl.innerHTML = [
        '<div id="red" style="--test-color: #ff0000"></div>',
        '<div id="green" style="--test-color: #00ff00"></div>'
      ].join('')

      const red = fixtureEl.querySelector('#red')
      const green = fixtureEl.querySelector('#green')

      expect(resolveCssColor('var(--test-color)', red)).toEqual('rgb(255, 0, 0)')
      expect(resolveCssColor('var(--test-color)', green)).toEqual('rgb(0, 255, 0)')
    })
  })

  describe('resolveColor', () => {
    it('should parse directly parseable values without touching the DOM', () => {
      const color = resolveColor('#0d6efd')

      expectClose(color.l, parseColor('#0d6efd').l)
    })

    it('should resolve named colors', () => {
      const color = resolveColor('rebeccapurple')

      expect(color).not.toBeNull()
      expectClose(color.l, parseColor('#663399').l, 0.01)
    })

    it('should resolve custom properties', () => {
      fixtureEl.innerHTML = '<div id="host" style="--test-color: #00ff00"></div>'

      const host = fixtureEl.querySelector('#host')
      const color = resolveColor('var(--test-color)', host)

      expect(color).not.toBeNull()
      expectClose(color.l, parseColor('#00ff00').l, 0.01)
    })

    it('should resolve color-mix through the canvas fallback when needed', () => {
      const color = resolveColor('color-mix(in lab, #ffffff 100%, #000000)')

      expect(color).not.toBeNull()
      expectClose(color.l, 1, 0.02)
    })

    it('should return null for values nothing can resolve', () => {
      expect(resolveColor('definitelynotacolor')).toBeNull()
    })
  })
})
