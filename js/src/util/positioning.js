/**
 * --------------------------------------------------------------------------
 * Bootstrap util/positioning.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { isRTL } from './index.js'

/**
 * Bootstrap breakpoints (must match $grid-breakpoints in _config.scss)
 * Order matters - from smallest to largest
 */
const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

const BREAKPOINT_ORDER = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

/**
 * Parse a responsive placement string into breakpoint-specific placements
 * Format: "placement bp:placement bp:placement"
 * Example: "bottom md:top lg:right-start"
 * @param {string} placementString - The placement string to parse
 * @returns {object} Object mapping breakpoints to placements
 */
const parseResponsivePlacement = placementString => {
  if (!placementString || typeof placementString !== 'string') {
    return { xs: 'bottom' }
  }

  const placements = {}
  const parts = placementString.trim().split(/\s+/)

  for (const part of parts) {
    if (part.includes(':')) {
      // Breakpoint-prefixed placement (e.g., "md:top")
      const [breakpoint, placement] = part.split(':')
      if (BREAKPOINTS[breakpoint] !== undefined && placement) {
        placements[breakpoint] = placement.toLowerCase()
      }
    } else {
      // Default placement (applies to xs/base)
      placements.xs = part.toLowerCase()
    }
  }

  // Ensure we have at least a default
  if (!placements.xs) {
    placements.xs = 'bottom'
  }

  return placements
}

/**
 * Get the effective placement for the current viewport width
 * @param {object} responsivePlacements - Object mapping breakpoints to placements
 * @param {number} [viewportWidth] - Current viewport width (defaults to window.innerWidth)
 * @returns {string} The placement to use
 */
const getPlacementForViewport = (responsivePlacements, viewportWidth = window.innerWidth) => {
  let effectivePlacement = responsivePlacements.xs || 'bottom'

  // Walk through breakpoints in order and find the largest matching one
  for (const breakpoint of BREAKPOINT_ORDER) {
    const minWidth = BREAKPOINTS[breakpoint]
    if (viewportWidth >= minWidth && responsivePlacements[breakpoint]) {
      effectivePlacement = responsivePlacements[breakpoint]
    }
  }

  return effectivePlacement
}

/**
 * Check if a placement string contains responsive values
 * @param {string} placementString - The placement string to check
 * @returns {boolean} True if the string contains breakpoint prefixes
 */
const isResponsivePlacement = placementString => {
  if (!placementString || typeof placementString !== 'string') {
    return false
  }

  return placementString.includes(':')
}

/**
 * Class to observe breakpoint changes and trigger callbacks
 */
class BreakpointObserver {
  constructor(callback) {
    this._callback = callback
    this._mediaQueries = []
    this._boundHandler = this._handleChange.bind(this)
    this._init()
  }

  _init() {
    // Create matchMedia listeners for each breakpoint
    for (const breakpoint of BREAKPOINT_ORDER) {
      const minWidth = BREAKPOINTS[breakpoint]
      if (minWidth > 0) {
        const mql = window.matchMedia(`(min-width: ${minWidth}px)`)
        mql.addEventListener('change', this._boundHandler)
        this._mediaQueries.push(mql)
      }
    }
  }

  _handleChange() {
    this._callback()
  }

  dispose() {
    for (const mql of this._mediaQueries) {
      mql.removeEventListener('change', this._boundHandler)
    }

    this._mediaQueries = []
    this._callback = null
  }
}

/**
 * Feature detection for native positioning APIs
 */
const supportsAnchorPositioning = () => {
  try {
    // Check for anchor-name support (core anchor positioning feature)
    return CSS.supports('anchor-name', '--test')
  } catch {
    return false
  }
}

/**
 * Check if browser uses position-area (new spec) vs inset-area (old spec)
 */
const usesPositionArea = () => {
  try {
    return CSS.supports('position-area', 'block-end')
  } catch {
    return false
  }
}

const supportsPopover = () => {
  return typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype
}

/**
 * Placement mapping from Bootstrap placements to CSS anchor positioning inset-area values
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/inset-area
 */
const PLACEMENT_MAP = {
  top: 'block-start',
  'top-start': isRTL() ? 'block-start span-inline-start' : 'block-start span-inline-end',
  'top-end': isRTL() ? 'block-start span-inline-end' : 'block-start span-inline-start',
  bottom: 'block-end',
  'bottom-start': isRTL() ? 'block-end span-inline-start' : 'block-end span-inline-end',
  'bottom-end': isRTL() ? 'block-end span-inline-end' : 'block-end span-inline-start',
  left: 'inline-start',
  'left-start': 'inline-start span-block-end',
  'left-end': 'inline-start span-block-start',
  right: 'inline-end',
  'right-start': 'inline-end span-block-end',
  'right-end': 'inline-end span-block-start',
  // Auto placement - let CSS handle fallbacks
  auto: 'block-end'
}

/**
 * Maps Bootstrap placement to CSS logical inset-area value
 * @param {string} placement - Bootstrap placement (top, bottom, left, right, auto)
 * @returns {string} CSS inset-area value
 */
const getInsetArea = placement => {
  const normalizedPlacement = placement.toLowerCase()
  return PLACEMENT_MAP[normalizedPlacement] || PLACEMENT_MAP.bottom
}

/**
 * Maps Bootstrap fallback placements to position-try-fallbacks values
 * @param {string[]} fallbacks - Array of Bootstrap placement strings
 * @returns {string} CSS position-try-fallbacks value
 */
const getPositionTryFallbacks = fallbacks => {
  if (!fallbacks || fallbacks.length === 0) {
    return 'flip-block, flip-inline, flip-block flip-inline'
  }

  // Map each fallback to a position-try-fallbacks value
  const mapped = fallbacks.map(placement => {
    const normalized = placement.toLowerCase()
    if (normalized.includes('top') || normalized.includes('bottom')) {
      return 'flip-block'
    }

    if (normalized.includes('left') || normalized.includes('right')) {
      return 'flip-inline'
    }

    return 'flip-block flip-inline'
  })

  // Remove duplicates and join
  return [...new Set(mapped)].join(', ')
}

/**
 * Generate a unique anchor name for positioning
 * @param {string} prefix - Prefix for the anchor name
 * @param {string|number} uid - Unique identifier
 * @returns {string} CSS anchor name (e.g., "--bs-tooltip-123")
 */
const generateAnchorName = (prefix, uid) => {
  return `--bs-${prefix}-anchor-${uid}`
}

/**
 * Apply anchor positioning styles to an anchor element
 * @param {HTMLElement} anchorElement - The element to anchor to
 * @param {string} anchorName - The anchor name to use
 */
const applyAnchorStyles = (anchorElement, anchorName) => {
  anchorElement.style.anchorName = anchorName
}

/**
 * Apply positioned element styles using CSS anchor positioning
 * @param {HTMLElement} positionedElement - The element to position
 * @param {object} options - Positioning options
 * @param {string} options.anchorName - The anchor name to position relative to
 * @param {string} options.placement - Bootstrap placement string
 * @param {number[]} options.offset - [x, y] offset values
 * @param {string[]} options.fallbackPlacements - Fallback placements for auto-flip
 */
const applyPositionedStyles = (positionedElement, options) => {
  const { anchorName, placement, offset = [0, 0], fallbackPlacements } = options

  // Set position anchor
  positionedElement.style.positionAnchor = anchorName

  // Set position area based on placement
  // Note: The spec renamed inset-area to position-area (Chrome 131+)
  const areaValue = getInsetArea(placement)
  if (usesPositionArea()) {
    positionedElement.style.positionArea = areaValue
  } else {
    positionedElement.style.insetArea = areaValue
  }

  // Set position-try-fallbacks for auto-flipping
  positionedElement.style.positionTryFallbacks = getPositionTryFallbacks(fallbackPlacements)

  // Apply offsets using CSS custom properties
  // Offset format: [skidding, distance] (same as Popper.js)
  const [skidding, distance] = offset
  if (skidding !== 0 || distance !== 0) {
    positionedElement.style.setProperty('--bs-position-skidding', `${skidding}px`)
    positionedElement.style.setProperty('--bs-position-distance', `${distance}px`)
  }

  // Store placement as data attribute for CSS styling hooks
  positionedElement.dataset.bsPlacement = placement
}

/**
 * Remove anchor positioning styles from elements
 * @param {HTMLElement} anchorElement - The anchor element
 * @param {HTMLElement} positionedElement - The positioned element
 */
const removePositioningStyles = (anchorElement, positionedElement) => {
  if (anchorElement) {
    anchorElement.style.anchorName = ''
  }

  if (positionedElement) {
    positionedElement.style.positionAnchor = ''
    positionedElement.style.positionArea = ''
    positionedElement.style.insetArea = ''
    positionedElement.style.positionTryFallbacks = ''
    positionedElement.style.removeProperty('--bs-position-skidding')
    positionedElement.style.removeProperty('--bs-position-distance')
    delete positionedElement.dataset.bsPlacement
  }
}

/**
 * Get the current computed placement of a positioned element
 * This is useful after CSS has applied fallback positioning
 * @param {HTMLElement} positionedElement - The positioned element
 * @returns {string} The current placement
 */
const getCurrentPlacement = positionedElement => {
  // Try to get from data attribute first (what we set)
  const setPlacement = positionedElement.dataset.bsPlacement

  // In the future, we could potentially detect actual position via getComputedStyle
  // For now, return what was set
  return setPlacement || 'bottom'
}

/**
 * Initialize the anchor positioning polyfill if needed
 * @returns {Promise<boolean>} Whether polyfill was loaded
 */
const initPolyfill = async () => {
  if (supportsAnchorPositioning()) {
    return false
  }

  // Try to load the polyfill dynamically
  try {
    // Check if polyfill is already loaded
    if (window.__CSS_ANCHOR_POLYFILL_LOADED__) {
      return true
    }

    // The polyfill should be loaded via script tag or bundled
    // This is a fallback for dynamic loading
    const polyfill = await import('@oddbird/css-anchor-positioning')
    if (polyfill && typeof polyfill.default === 'function') {
      polyfill.default()
      window.__CSS_ANCHOR_POLYFILL_LOADED__ = true
      return true
    }
  } catch {
    // Polyfill not available - positioning features may be limited in unsupported browsers
  }

  return false
}

export {
  applyAnchorStyles,
  applyPositionedStyles,
  BreakpointObserver,
  generateAnchorName,
  getCurrentPlacement,
  getInsetArea,
  getPlacementForViewport,
  getPositionTryFallbacks,
  initPolyfill,
  isResponsivePlacement,
  parseResponsivePlacement,
  removePositioningStyles,
  supportsAnchorPositioning,
  supportsPopover
}
