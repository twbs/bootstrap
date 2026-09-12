/**
 * --------------------------------------------------------------------------
 * Bootstrap util/color.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Types
 */

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'

// OKLCH is the canonical model: the Sass palette is authored in `oklch()` and the
// theme tokens mix `in oklch`, so keeping it as the working space avoids a lossy
// hop through sRGB on every edit.
type Oklch = {
  l: number // 0–1
  c: number // 0–0.4 in practice, unbounded in theory
  h: number // 0–360 degrees
  alpha: number // 0–1
}

// Channels are 0–1, not 0–255, so the transfer functions can use them directly
type Rgb = {
  r: number
  g: number
  b: number
  alpha: number
}

/**
 * Constants
 */

const FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch']

// The 16 base hues from `scss/_colors.scss`, in source order. Keep in sync with
// `$colors` and `site/data/colors.yml`.
const PALETTE = [
  'blue',
  'indigo',
  'violet',
  'purple',
  'pink',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'brown',
  'gray',
  'pewter'
]

// The semantic theme colors from `scss/_theme.scss`
const THEME_COLORS = [
  'primary', 'accent', 'success', 'danger', 'warning', 'info', 'inverse', 'secondary'
]

// Chroma that CSS treats as 100% for `oklch()` and `oklab()` percentage arguments
const CHROMA_REFERENCE = 0.4

// A hair of slack so a color that converts to 1.0000000002 still counts as displayable
const GAMUT_EPSILON = 0.000_01

// Mirrors `$min-contrast-ratio`, `$color-contrast-light` and `$color-contrast-dark`
// from `scss/_config.scss` so JS and Sass pick the same foreground
const MIN_CONTRAST_RATIO = 4.5
const CONTRAST_LIGHT = '#fff'
const CONTRAST_DARK = '#000'

const TRANSPARENT: Oklch = {
  l: 0, c: 0, h: 0, alpha: 0
}

/**
 * Private
 */

const clamp = (value: number, min = 0, max = 1): number => Math.min(Math.max(value, min), max)

const round = (value: number, precision: number): number => Number(value.toFixed(precision))

// sRGB transfer functions
const srgbToLinear = (value: number): number =>
  value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4

const linearToSrgb = (value: number): number =>
  value <= 0.003_130_8 ? value * 12.92 : (1.055 * (value ** (1 / 2.4))) - 0.055

// Björn Ottosson's OKLab matrices, applied straight against linear sRGB. Going
// through XYZ would give the same answer with more arithmetic.
const linearRgbToOklab = (r: number, g: number, b: number): [number, number, number] => {
  const l = (0.412_221_470_8 * r) + (0.536_332_536_3 * g) + (0.051_445_992_9 * b)
  const m = (0.211_903_498_2 * r) + (0.680_699_545_1 * g) + (0.107_396_956_6 * b)
  const s = (0.088_302_461_9 * r) + (0.281_718_837_6 * g) + (0.629_978_700_5 * b)

  const l2 = Math.cbrt(l)
  const m2 = Math.cbrt(m)
  const s2 = Math.cbrt(s)

  return [
    (0.210_454_255_3 * l2) + (0.793_617_785 * m2) - (0.004_072_046_8 * s2),
    (1.977_998_495_1 * l2) - (2.428_592_205 * m2) + (0.450_593_709_9 * s2),
    (0.025_904_037_1 * l2) + (0.782_771_766_2 * m2) - (0.808_675_766 * s2)
  ]
}

const oklabToLinearRgb = (lightness: number, a: number, b: number): [number, number, number] => {
  const l2 = lightness + (0.396_337_777_4 * a) + (0.215_803_757_3 * b)
  const m2 = lightness - (0.105_561_345_8 * a) - (0.063_854_172_8 * b)
  const s2 = lightness - (0.089_484_177_5 * a) - (1.291_485_548 * b)

  const l = l2 ** 3
  const m = m2 ** 3
  const s = s2 ** 3

  return [
    (4.076_741_662_1 * l) - (3.307_711_591_3 * m) + (0.230_969_929_2 * s),
    (-1.268_438_004_6 * l) + (2.609_757_401_1 * m) - (0.341_319_396_5 * s),
    (-0.004_196_086_3 * l) - (0.703_418_614_7 * m) + (1.707_614_701 * s)
  ]
}

// Parses an `<angle>`: bare numbers are degrees, units are converted
const parseHue = (token: string): number => {
  const value = Number.parseFloat(token)

  if (Number.isNaN(value)) {
    return 0
  }

  let degrees = value

  if (token.endsWith('turn')) {
    degrees = value * 360
  } else if (token.endsWith('grad')) {
    degrees = value * 0.9
  } else if (token.endsWith('rad')) {
    degrees = (value * 180) / Math.PI
  }

  return ((degrees % 360) + 360) % 360
}

const parseAlpha = (token: string | null): number => {
  if (token === null || token === 'none') {
    return 1
  }

  const value = Number.parseFloat(token)

  if (Number.isNaN(value)) {
    return 1
  }

  return clamp(token.endsWith('%') ? value / 100 : value)
}

// `none` is a valid CSS Color 4 keyword that behaves as zero for our purposes
const parseComponent = (token: string | undefined, percentageScale: number, scale = 1): number => {
  if (!token || token === 'none') {
    return 0
  }

  const value = Number.parseFloat(token)

  if (Number.isNaN(value)) {
    return 0
  }

  return token.endsWith('%') ? (value / 100) * percentageScale : value * scale
}

// Normalizes both the legacy comma form and the modern space form, including the
// `/ alpha` suffix, into a component list plus an optional alpha token
const splitArguments = (body: string): { parts: string[], alpha: string | null } => {
  const tokens = body.trim().replaceAll('/', ' / ').split(/[\s,]+/).filter(Boolean)
  const slashIndex = tokens.indexOf('/')

  if (slashIndex !== -1) {
    return { parts: tokens.slice(0, slashIndex), alpha: tokens[slashIndex + 1] ?? null }
  }

  // Legacy `rgba(r, g, b, a)` / `hsla(h, s, l, a)`
  if (tokens.length === 4) {
    return { parts: tokens.slice(0, 3), alpha: tokens[3] }
  }

  return { parts: tokens, alpha: null }
}

// `#abc` shorthand doubles each digit: `a` means `aa`
const expandHexDigit = (char: string): number => Number.parseInt(char + char, 16) / 255

const parseHex = (value: string): Rgb | null => {
  const hex = value.slice(1)

  if (!/^[\da-f]+$/i.test(hex)) {
    return null
  }

  const pair = (index: number): number => Number.parseInt(hex.slice(index, index + 2), 16) / 255

  if (hex.length === 3 || hex.length === 4) {
    return {
      r: expandHexDigit(hex[0]),
      g: expandHexDigit(hex[1]),
      b: expandHexDigit(hex[2]),
      alpha: hex.length === 4 ? expandHexDigit(hex[3]) : 1
    }
  }

  if (hex.length === 6 || hex.length === 8) {
    return {
      r: pair(0),
      g: pair(2),
      b: pair(4),
      alpha: hex.length === 8 ? pair(6) : 1
    }
  }

  return null
}

const hslToRgb = (hue: number, saturation: number, lightness: number): [number, number, number] => {
  const h = ((hue % 360) + 360) % 360
  const s = clamp(saturation)
  const l = clamp(lightness)

  const chroma = (1 - Math.abs((2 * l) - 1)) * s
  const secondary = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const match = l - (chroma / 2)

  const sector = Math.floor(h / 60) % 6
  const table: [number, number, number][] = [
    [chroma, secondary, 0],
    [secondary, chroma, 0],
    [0, chroma, secondary],
    [0, secondary, chroma],
    [secondary, 0, chroma],
    [chroma, 0, secondary]
  ]

  const [r, g, b] = table[sector]
  return [r + match, g + match, b + match]
}

const rgbToHsl = ({ r, g, b }: Rgb): [number, number, number] => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2
  const delta = max - min

  if (delta === 0) {
    return [0, 0, lightness]
  }

  const saturation = delta / (1 - Math.abs((2 * lightness) - 1))
  let hue = 0

  if (max === r) {
    hue = ((g - b) / delta) % 6
  } else if (max === g) {
    hue = ((b - r) / delta) + 2
  } else {
    hue = ((r - g) / delta) + 4
  }

  hue *= 60

  return [((hue % 360) + 360) % 360, saturation, lightness]
}

// Reusable probe for `resolveCssColor`. Kept out of the flow so it can't affect
// layout, but still in the document so `var()` and `light-dark()` resolve.
let probe: HTMLElement | null = null

// Only absolute colors are cached. Anything with a `var()` or `light-dark()` in it
// resolves differently per element and per color scheme, so caching it by string
// would hand one element's palette to another.
const resolveCache = new Map<string, string | null>()

const isContextDependent = (value: string): boolean => /var\(|light-dark\(|currentcolor/i.test(value)

const getProbe = (context?: Element | null): HTMLElement => {
  if (!probe || !probe.isConnected) {
    probe = document.createElement('span')
    probe.style.display = 'none'
    probe.setAttribute('aria-hidden', 'true')
  }

  const host = (context ?? document.body) as Element

  if (probe.parentNode !== host) {
    host.append(probe)
  }

  return probe
}

// Last resort for serializations we don't parse, such as the `lab()` that Chromium
// produces for the palette's `color-mix(in lab, ...)` stops. The canvas understands
// every color the browser does, at the cost of 8-bit precision.
const viaCanvas = (value: string): Rgb | null => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  // A transparent default lets us detect a rejected `fillStyle` assignment
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = '#000'
  context.fillStyle = value

  context.fillRect(0, 0, 1, 1)

  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data

  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    alpha: a / 255
  }
}

/**
 * Public
 */

const rgbToOklch = (rgb: Rgb): Oklch => {
  const [lightness, a, b] = linearRgbToOklab(
    srgbToLinear(rgb.r),
    srgbToLinear(rgb.g),
    srgbToLinear(rgb.b)
  )

  const chroma = Math.hypot(a, b)
  // Hue is meaningless at zero chroma, and a stray value there makes the hue
  // slider jump when the user drags chroma back up
  const hue = chroma < 0.000_001 ? 0 : ((((Math.atan2(b, a) * 180) / Math.PI) % 360) + 360) % 360

  return {
    l: lightness, c: chroma, h: hue, alpha: rgb.alpha
  }
}

const oklchToRgb = (color: Oklch): Rgb => {
  const radians = (color.h * Math.PI) / 180
  const [r, g, b] = oklabToLinearRgb(
    color.l,
    Math.cos(radians) * color.c,
    Math.sin(radians) * color.c
  )

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
    alpha: color.alpha
  }
}

const isInGamut = (color: Oklch): boolean => {
  const { r, g, b } = oklchToRgb(color)

  return [r, g, b].every(channel => channel >= -GAMUT_EPSILON && channel <= 1 + GAMUT_EPSILON)
}

// Reduces chroma until the color fits sRGB, holding lightness and hue. Bisection
// beats a naive clamp of the RGB channels, which shifts the hue.
const clampToGamut = (color: Oklch): Oklch => {
  if (isInGamut(color)) {
    return { ...color }
  }

  // Pure black and white are the only representable colors at the extremes
  if (color.l <= 0) {
    return {
      l: 0, c: 0, h: color.h, alpha: color.alpha
    }
  }

  if (color.l >= 1) {
    return {
      l: 1, c: 0, h: color.h, alpha: color.alpha
    }
  }

  let low = 0
  let high = color.c

  for (let index = 0; index < 24; index++) {
    const mid = (low + high) / 2

    if (isInGamut({ ...color, c: mid })) {
      low = mid
    } else {
      high = mid
    }
  }

  return { ...color, c: low }
}

const parseColor = (value: string | null | undefined): Oklch | null => {
  if (typeof value !== 'string') {
    return null
  }

  const input = value.trim().toLowerCase()

  if (input === '') {
    return null
  }

  if (input === 'transparent') {
    return { ...TRANSPARENT }
  }

  if (input.startsWith('#')) {
    const rgb = parseHex(input)
    return rgb ? rgbToOklch(rgb) : null
  }

  const functional = /^(rgba?|hsla?|oklch|oklab)\((.*)\)$/s.exec(input)

  if (!functional) {
    return null
  }

  const [, name, body] = functional
  const { parts, alpha } = splitArguments(body)

  if (parts.length < 3) {
    return null
  }

  const alphaValue = parseAlpha(alpha)

  if (name === 'rgb' || name === 'rgba') {
    return rgbToOklch({
      r: clamp(parseComponent(parts[0], 1, 1 / 255)),
      g: clamp(parseComponent(parts[1], 1, 1 / 255)),
      b: clamp(parseComponent(parts[2], 1, 1 / 255)),
      alpha: alphaValue
    })
  }

  if (name === 'hsl' || name === 'hsla') {
    const [r, g, b] = hslToRgb(
      parseHue(parts[0]),
      parseComponent(parts[1], 1),
      parseComponent(parts[2], 1)
    )

    return rgbToOklch({
      r, g, b, alpha: alphaValue
    })
  }

  if (name === 'oklch') {
    return {
      l: clamp(parseComponent(parts[0], 1)),
      c: Math.max(parseComponent(parts[1], CHROMA_REFERENCE), 0),
      h: parseHue(parts[2]),
      alpha: alphaValue
    }
  }

  // oklab
  const lightness = clamp(parseComponent(parts[0], 1))
  const a = parseComponent(parts[1], CHROMA_REFERENCE)
  const b = parseComponent(parts[2], CHROMA_REFERENCE)
  const chroma = Math.hypot(a, b)

  return {
    l: lightness,
    c: chroma,
    h: chroma < 0.000_001 ? 0 : ((((Math.atan2(b, a) * 180) / Math.PI) % 360) + 360) % 360,
    alpha: alphaValue
  }
}

// Turns anything CSS understands into a string our parser accepts, by letting the
// browser compute it. Handles `var(--bs-blue-500)`, `color-mix(...)`, named colors
// and `light-dark()`, none of which are parseable on their own.
const resolveCssColor = (value: string, context?: Element | null): string | null => {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }

  const cacheable = !isContextDependent(value)

  if (cacheable && resolveCache.has(value)) {
    return resolveCache.get(value)!
  }

  const element = getProbe(context)

  element.style.color = ''
  element.style.color = value

  // CSSOM rejects invalid declarations, which is how we tell a typo from a color
  const resolved = element.style.color === '' ? null : getComputedStyle(element).color || null

  if (cacheable) {
    resolveCache.set(value, resolved)
  }

  return resolved
}

// Escape hatch for consumers that change the custom properties a resolved color
// depended on. Absolute colors can't go stale, but a caller can't always tell.
const clearColorCache = (): void => {
  resolveCache.clear()
}

// The full resolution chain: parse what we can, ask the browser for the rest, and
// fall back to a canvas round trip for exotic serializations.
const resolveColor = (value: string, context?: Element | null): Oklch | null => {
  const direct = parseColor(value)

  if (direct) {
    return direct
  }

  const resolved = resolveCssColor(value, context)

  if (!resolved) {
    return null
  }

  const parsed = parseColor(resolved)

  if (parsed) {
    return parsed
  }

  const rgb = viaCanvas(resolved)

  return rgb ? rgbToOklch(rgb) : null
}

const formatColor = (color: Oklch, format: ColorFormat = 'hex', { precision = 2 }: { precision?: number } = {}): string => {
  const alpha = clamp(color.alpha)
  const hasAlpha = alpha < 1

  if (format === 'oklch') {
    const lightness = round(color.l * 100, precision)
    const chroma = round(color.c, precision + 2)
    const hue = round(color.h, precision)

    return hasAlpha ?
      `oklch(${lightness}% ${chroma} ${hue} / ${round(alpha, precision)})` :
      `oklch(${lightness}% ${chroma} ${hue})`
  }

  // Everything below is sRGB-bound, so out-of-gamut colors have to be brought in
  // before they're serialized or the channels would silently clip and shift hue
  const rgb = oklchToRgb(clampToGamut(color))
  const channels = {
    r: clamp(rgb.r),
    g: clamp(rgb.g),
    b: clamp(rgb.b),
    alpha
  }

  if (format === 'hsl') {
    const [hue, saturation, lightness] = rgbToHsl(channels)

    return hasAlpha ?
      `hsl(${round(hue, precision)} ${round(saturation * 100, precision)}% ${round(lightness * 100, precision)}% / ${round(alpha, precision)})` :
      `hsl(${round(hue, precision)} ${round(saturation * 100, precision)}% ${round(lightness * 100, precision)}%)`
  }

  const bytes = [channels.r, channels.g, channels.b].map(channel => Math.round(channel * 255))

  if (format === 'rgb') {
    return hasAlpha ?
      `rgb(${bytes.join(' ')} / ${round(alpha, precision)})` :
      `rgb(${bytes.join(' ')})`
  }

  const hex = bytes.map(byte => byte.toString(16).padStart(2, '0')).join('')

  return hasAlpha ?
    `#${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` :
    `#${hex}`
}

// Picks a foreground for text sitting on `color`, following the same rule as Sass
// `color-contrast()`: take light if it clears the minimum ratio, otherwise dark,
// otherwise whichever is closest. Preferring light is why white text wins on
// `--primary-bg`, where a pure max-ratio comparison would pick black by a hair.
const contrastColor = (color: Oklch): string => {
  const rgb = oklchToRgb(clampToGamut(color))
  const luminance =
    (0.2126 * srgbToLinear(clamp(rgb.r))) +
    (0.7152 * srgbToLinear(clamp(rgb.g))) +
    (0.0722 * srgbToLinear(clamp(rgb.b)))

  const againstLight = 1.05 / (luminance + 0.05)
  const againstDark = (luminance + 0.05) / 0.05

  if (againstLight >= MIN_CONTRAST_RATIO) {
    return CONTRAST_LIGHT
  }

  if (againstDark >= MIN_CONTRAST_RATIO) {
    return CONTRAST_DARK
  }

  return againstLight > againstDark ? CONTRAST_LIGHT : CONTRAST_DARK
}

// Detects which format a value was authored in, so an input that starts as
// `oklch(...)` keeps emitting `oklch(...)` instead of being rewritten as hex
const detectFormat = (value: string | null | undefined): ColorFormat | null => {
  if (typeof value !== 'string') {
    return null
  }

  const input = value.trim().toLowerCase()

  if (input.startsWith('#')) {
    return 'hex'
  }

  if (input.startsWith('oklch') || input.startsWith('oklab')) {
    return 'oklch'
  }

  if (input.startsWith('hsl')) {
    return 'hsl'
  }

  if (input.startsWith('rgb')) {
    return 'rgb'
  }

  return null
}

const isColorFormat = (value: unknown): value is ColorFormat =>
  typeof value === 'string' && FORMATS.includes(value as ColorFormat)

export {
  clampToGamut,
  clearColorCache,
  contrastColor,
  detectFormat,
  formatColor,
  isColorFormat,
  isInGamut,
  oklchToRgb,
  parseColor,
  resolveColor,
  resolveCssColor,
  rgbToOklch,
  CHROMA_REFERENCE,
  FORMATS,
  PALETTE,
  THEME_COLORS
}

export type { ColorFormat, Oklch, Rgb }
