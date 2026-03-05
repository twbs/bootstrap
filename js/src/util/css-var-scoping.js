/**
 * --------------------------------------------------------------------------
 * Bootstrap css-var-scoping.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 *
 * 1. Tooltip/popover scoping — Bootstrap appends tips to <body>, outside any
 *    themed section. This copies the section's color-schema class to the tip
 *    so it inherits the correct theme.
 *
 * 2. oklch polyfill — When the browser doesn't support oklch relative color
 *    syntax, computes --bs-on-* and --bs-emphasis-color for section overrides.
 */

const SCHEMA_PREFIX = 'color-schema-'

// ── Helpers ────────────────────────────────────────────────────────────────

function getSchemaClass(element) {
  if (!element) {
    return null
  }

  const section = element.closest(`[class*="${SCHEMA_PREFIX}"]`)
  if (!section) {
    return null
  }

  return [...section.classList].find(c => c.startsWith(SCHEMA_PREFIX))
}

function applySchema(target, schemaClass) {
  if (!target || !schemaClass) {
    return
  }

  for (const c of target.classList) {
    if (c.startsWith(SCHEMA_PREFIX)) {
      target.classList.remove(c)
    }
  }

  target.classList.add(schemaClass)
}

// ── 1. Tooltip/popover scoping ─────────────────────────────────────────────
// The trigger gets aria-describedby pointing to the tip's id before the
// inserted event fires, so we can find the tip without importing Tooltip.

function scopeTip(event) {
  const trigger = event.target
  const schemaClass = getSchemaClass(trigger)
  if (!schemaClass) {
    return
  }

  const tipId = trigger.getAttribute('aria-describedby')
  const tip = tipId ? document.getElementById(tipId) : null
  if (tip) {
    applySchema(tip, schemaClass)
  }
}

document.addEventListener('inserted.bs.tooltip', scopeTip)
document.addEventListener('inserted.bs.popover', scopeTip)

// ── 2. oklch polyfill ─────────────────────────────────────────────────────

const THEME_COLORS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark'
]

/**
 * Parse a CSS color string to {r, g, b} (0–255).
 */
function parseColor(str) {
  const el = document.createElement('span')
  el.style.color = str
  document.body.append(el)
  const computed = getComputedStyle(el).color
  el.remove()

  const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
  }

  return null
}

/**
 * WCAG relative luminance.
 */
function luminance(r, g, b) {
  const a = [r, g, b].map(c => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return (0.2126 * a[0]) + (0.7152 * a[1]) + (0.0722 * a[2])
}

/**
 * Returns '#000' or '#fff' based on perceived lightness.
 * Threshold 0.179 matches Bootstrap's Sass color-contrast().
 */
function contrastColor(colorStr) {
  const rgb = parseColor(colorStr)
  if (!rgb) {
    return null
  }

  return luminance(rgb.r, rgb.g, rgb.b) > 0.179 ? '#000' : '#fff'
}

function applyContrastTokens(el) {
  const style = getComputedStyle(el)

  for (const color of THEME_COLORS) {
    const value = style.getPropertyValue(`--bs-${color}`).trim()
    if (value) {
      const contrast = contrastColor(value)
      if (contrast) {
        el.style.setProperty(`--bs-on-${color}`, contrast)
      }
    }
  }

  const bodyBg = style.getPropertyValue('--bs-body-bg').trim()
  if (bodyBg) {
    const emphasis = contrastColor(bodyBg)
    if (emphasis) {
      el.style.setProperty('--bs-emphasis-color', emphasis)
    }
  }
}

function updateAll() {
  for (const el of document.querySelectorAll(`[class*="${SCHEMA_PREFIX}"]`)) {
    applyContrastTokens(el)
  }
}

if (!CSS.supports('color', 'oklch(from red l c h)')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAll)
  } else {
    updateAll()
  }

  new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList' || (m.type === 'attributes' && m.attributeName === 'class')) {
        updateAll()
        return
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  })
}
