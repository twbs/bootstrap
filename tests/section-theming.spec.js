/* eslint-env node */
// @ts-check
const { test, expect } = require('@playwright/test')

async function getComputedProp(page, sectionSelector, elementSelector, prop) {
  return page.evaluate(
    ([secSel, elSel, p]) => {
      const section = secSel ? document.querySelector(secSel) : document.body
      const el = section.querySelector(elSel)
      if (!el) {
        throw new Error(`Element ${elSel} not found in ${secSel || 'body'}`)
      }

      return getComputedStyle(el).getPropertyValue(p).trim()
    },
    [sectionSelector, elementSelector, prop]
  )
}

async function getComputedPseudoProp(page, sectionSelector, elementSelector, pseudo, prop) {
  return page.evaluate(
    ([secSel, elSel, ps, p]) => {
      const section = secSel ? document.querySelector(secSel) : document.body
      const el = section.querySelector(elSel)
      if (!el) {
        throw new Error(`Element ${elSel} not found in ${secSel || 'body'}`)
      }

      return getComputedStyle(el, ps).getPropertyValue(p).trim()
    },
    [sectionSelector, elementSelector, pseudo, prop]
  )
}

function parseRGB(str) {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
  }

  const s = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (s) {
    return { r: Math.round(Number(s[1]) * 255), g: Math.round(Number(s[2]) * 255), b: Math.round(Number(s[3]) * 255) }
  }

  throw new Error(`Cannot parse color: "${str}"`)
}

function expectColorClose(actual, expected, tolerance = 3) {
  const a = parseRGB(actual)
  expect(Math.abs(a.r - expected.r)).toBeLessThanOrEqual(tolerance)
  expect(Math.abs(a.g - expected.g)).toBeLessThanOrEqual(tolerance)
  expect(Math.abs(a.b - expected.b)).toBeLessThanOrEqual(tolerance)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/demo/index.html')
})

const OCEAN_PRIMARY = { r: 0, g: 119, b: 182 }
const SUNSET_PRIMARY = { r: 188, g: 71, b: 73 }
const NEON_PRIMARY = { r: 6, g: 214, b: 160 }
const DEFAULT_PRIMARY = { r: 13, g: 110, b: 253 }

test.describe('Buttons', () => {
  test('btn-primary background differs per section', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.btn-primary', 'background-color')
    const oceanBg = await getComputedProp(page, '#components-ocean', '.btn-primary', 'background-color')
    const sunsetBg = await getComputedProp(page, '#components-sunset', '.btn-primary', 'background-color')
    const neonBg = await getComputedProp(page, '#components-neon', '.btn-primary', 'background-color')

    expectColorClose(defaultBg, DEFAULT_PRIMARY)
    expectColorClose(oceanBg, OCEAN_PRIMARY)
    expectColorClose(sunsetBg, SUNSET_PRIMARY)
    expectColorClose(neonBg, NEON_PRIMARY)
  })

  test('btn-outline-primary border color matches section primary', async ({ page }) => {
    const oceanBorder = await getComputedProp(page, '#components-ocean', '.btn-outline-primary', 'border-color')
    expectColorClose(oceanBorder, OCEAN_PRIMARY)
  })
})

test.describe('Alerts', () => {
  test('alert-primary bg derives from section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.alert-primary', 'background-color')
    const oceanBg = await getComputedProp(page, '#components-ocean', '.alert-primary', 'background-color')

    expect(defaultBg).not.toEqual(oceanBg)
  })

  test('alert-primary text color derives from section primary', async ({ page }) => {
    const defaultColor = await getComputedProp(page, '#components-default', '.alert-primary', 'color')
    const sunsetColor = await getComputedProp(page, '#components-sunset', '.alert-primary', 'color')

    expect(defaultColor).not.toEqual(sunsetColor)
  })
})

test.describe('Tables', () => {
  test('table-primary bg derives from section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.table-primary td', 'background-color')
    const oceanBg = await getComputedProp(page, '#components-ocean', '.table-primary td', 'background-color')

    expect(defaultBg).not.toEqual(oceanBg)
  })
})

test.describe('List Group', () => {
  test('list-group-item-primary bg derives from section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.list-group-item-primary', 'background-color')
    const neonBg = await getComputedProp(page, '#components-neon', '.list-group-item-primary', 'background-color')

    expect(defaultBg).not.toEqual(neonBg)
  })

  test('active list-group-item uses section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.list-group-item.active', 'background-color')
    const oceanBg = await getComputedProp(page, '#components-ocean', '.list-group-item.active', 'background-color')

    expectColorClose(defaultBg, DEFAULT_PRIMARY)
    expectColorClose(oceanBg, OCEAN_PRIMARY)
  })
})

test.describe('Accordion', () => {
  test('accordion active bg derives from section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.accordion-button:not(.collapsed)', 'background-color')
    const sunsetBg = await getComputedProp(page, '#components-sunset', '.accordion-button:not(.collapsed)', 'background-color')

    expect(defaultBg).not.toEqual(sunsetBg)
  })

  test('accordion active color derives from section primary', async ({ page }) => {
    const defaultColor = await getComputedProp(page, '#components-default', '.accordion-button:not(.collapsed)', 'color')
    const oceanColor = await getComputedProp(page, '#components-ocean', '.accordion-button:not(.collapsed)', 'color')

    expect(defaultColor).not.toEqual(oceanColor)
  })
})

test.describe('Badges (text-bg-*)', () => {
  test('text-bg-primary background matches section primary', async ({ page }) => {
    const oceanBg = await getComputedProp(page, '#components-ocean', '.text-bg-primary', 'background-color')
    expectColorClose(oceanBg, OCEAN_PRIMARY)
  })
})

test.describe('Nav pills', () => {
  test('active nav pill background matches section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.nav-pills .nav-link.active', 'background-color')
    const neonBg = await getComputedProp(page, '#components-neon', '.nav-pills .nav-link.active', 'background-color')

    expectColorClose(defaultBg, DEFAULT_PRIMARY)
    expectColorClose(neonBg, NEON_PRIMARY)
  })
})

test.describe('Pagination', () => {
  test('active page-link background matches section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.page-item.active .page-link', 'background-color')
    const oceanBg = await getComputedProp(page, '#components-ocean', '.page-item.active .page-link', 'background-color')

    expectColorClose(defaultBg, DEFAULT_PRIMARY)
    expectColorClose(oceanBg, OCEAN_PRIMARY)
  })
})

test.describe('Progress', () => {
  test('progress bar background matches section primary', async ({ page }) => {
    const defaultBg = await getComputedProp(page, '#components-default', '.progress-bar:not(.bg-success)', 'background-color')
    const sunsetBg = await getComputedProp(page, '#components-sunset', '.progress-bar:not(.bg-success)', 'background-color')

    expectColorClose(defaultBg, DEFAULT_PRIMARY)
    expectColorClose(sunsetBg, SUNSET_PRIMARY)
  })
})

test.describe('Colored links', () => {
  test('link-primary color matches section primary', async ({ page }) => {
    const oceanColor = await getComputedProp(page, '#components-ocean', '.link-primary', 'color')
    expectColorClose(oceanColor, OCEAN_PRIMARY)
  })
})

test.describe('Text utilities', () => {
  test('text-primary matches section primary', async ({ page }) => {
    const defaultColor = await getComputedProp(page, '#components-default', '.text-primary', 'color')
    const neonColor = await getComputedProp(page, '#components-neon', '.text-primary', 'color')

    expectColorClose(defaultColor, DEFAULT_PRIMARY)
    expectColorClose(neonColor, NEON_PRIMARY)
  })
})

test.describe('Form focus', () => {
  test('form-check-input checked uses section primary', async ({ page }) => {
    const oceanBg = await getComputedProp(page, '#components-ocean', '.form-check-input:checked', 'background-color')
    expectColorClose(oceanBg, OCEAN_PRIMARY)
  })
})

test.describe('Border utilities', () => {
  test('border-primary matches section primary', async ({ page }) => {
    const oceanBorder = await getComputedProp(page, '#components-ocean', '.border-primary', 'border-color')
    expectColorClose(oceanBorder, OCEAN_PRIMARY)
  })
})

test.describe('Accordion icon (mask)', () => {
  test('active accordion icon color derives from section primary', async ({ page }) => {
    const defaultBg = await getComputedPseudoProp(
      page, '#components-default', '.accordion-button:not(.collapsed)', '::after', 'background-color'
    )
    const oceanBg = await getComputedPseudoProp(
      page, '#components-ocean', '.accordion-button:not(.collapsed)', '::after', 'background-color'
    )

    expect(defaultBg).not.toEqual(oceanBg)
  })

  test('accordion icon uses mask-image (not background-image)', async ({ page }) => {
    const maskImage = await getComputedPseudoProp(
      page, '#components-default', '.accordion-button', '::after', 'mask-image'
    )
    expect(maskImage).not.toEqual('none')
  })
})

test.describe('Navbar toggler (mask)', () => {
  test('toggler icon uses mask (not background-image)', async ({ page }) => {
    const maskImage = await getComputedProp(
      page, '#components-default', '.navbar:not([data-bs-theme]) .navbar-toggler-icon', 'mask-image'
    )
    expect(maskImage).not.toEqual('none')
  })

  test('toggler icon background follows navbar color', async ({ page }) => {
    const bg = await getComputedProp(
      page, '#components-default', '.navbar:not([data-bs-theme]) .navbar-toggler-icon', 'background-color'
    )
    expect(bg).not.toEqual('rgba(0, 0, 0, 0)')
    expect(bg).not.toEqual('transparent')
  })
})
