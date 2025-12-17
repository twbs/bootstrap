/**
 * --------------------------------------------------------------------------
 * Bootstrap util/floating-ui.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { isRTL } from './index.js'

/**
 * Breakpoints for responsive placement (matches SCSS $grid-breakpoints)
 */
export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

/**
 * Default placement with RTL support
 */
export const getDefaultPlacement = (fallback = 'bottom') => {
  if (fallback.includes('-start') || fallback.includes('-end')) {
    const [side, alignment] = fallback.split('-')
    const flippedAlignment = alignment === 'start' ? 'end' : 'start'
    return isRTL() ? `${side}-${flippedAlignment}` : fallback
  }

  return fallback
}

/**
 * Parse a placement string that may contain responsive prefixes
 * Example: "bottom-start md:top-end lg:right" returns { xs: 'bottom-start', md: 'top-end', lg: 'right' }
 *
 * @param {string} placementString - The placement string to parse
 * @param {string} defaultPlacement - The default placement to use for xs/base
 * @returns {object|null} - Object with breakpoint keys and placement values, or null if not responsive
 */
export const parseResponsivePlacement = (placementString, defaultPlacement = 'bottom') => {
  // Check if placement contains responsive prefixes (e.g., "bottom-start md:top-end")
  if (!placementString || !placementString.includes(':')) {
    return null
  }

  // Parse the placement string into breakpoint-keyed object
  const parts = placementString.split(/\s+/)
  const placements = { xs: defaultPlacement } // Default fallback

  for (const part of parts) {
    if (part.includes(':')) {
      // Responsive placement like "md:top-end"
      const [breakpoint, placement] = part.split(':')
      if (BREAKPOINTS[breakpoint] !== undefined) {
        placements[breakpoint] = placement
      }
    } else {
      // Base placement (no prefix = xs/default)
      placements.xs = part
    }
  }

  return placements
}

/**
 * Get the active placement for the current viewport width
 *
 * @param {object} responsivePlacements - Object with breakpoint keys and placement values
 * @param {string} defaultPlacement - Fallback placement
 * @returns {string} - The active placement for current viewport
 */
export const getResponsivePlacement = (responsivePlacements, defaultPlacement = 'bottom') => {
  if (!responsivePlacements) {
    return defaultPlacement
  }

  // Get current viewport width
  const viewportWidth = window.innerWidth

  // Find the largest breakpoint that matches
  let activePlacement = responsivePlacements.xs || defaultPlacement

  // Check breakpoints in order (sm, md, lg, xl, 2xl)
  const breakpointOrder = ['sm', 'md', 'lg', 'xl', '2xl']

  for (const breakpoint of breakpointOrder) {
    const minWidth = BREAKPOINTS[breakpoint]
    if (viewportWidth >= minWidth && responsivePlacements[breakpoint]) {
      activePlacement = responsivePlacements[breakpoint]
    }
  }

  return activePlacement
}

/**
 * Create media query listeners for responsive placement changes
 *
 * @param {Function} callback - Callback to run when breakpoint changes
 * @returns {Array} - Array of { mql, handler } objects for cleanup
 */
export const createBreakpointListeners = callback => {
  const listeners = []

  for (const breakpoint of Object.keys(BREAKPOINTS)) {
    const minWidth = BREAKPOINTS[breakpoint]
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`)

    mql.addEventListener('change', callback)
    listeners.push({ mql, handler: callback })
  }

  return listeners
}

/**
 * Clean up media query listeners
 *
 * @param {Array} listeners - Array of { mql, handler } objects
 */
export const disposeBreakpointListeners = listeners => {
  for (const { mql, handler } of listeners) {
    mql.removeEventListener('change', handler)
  }
}
