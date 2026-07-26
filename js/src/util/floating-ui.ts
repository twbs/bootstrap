/**
 * --------------------------------------------------------------------------
 * Bootstrap util/floating-ui.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { isRTL } from './index.js'

/**
 * Types
 */

type ResponsivePlacements = Record<string, string>

interface BreakpointListener {
  mql: MediaQueryList
  handler: (event: MediaQueryListEvent) => void
}

/**
 * Breakpoints for responsive placement (matches SCSS $breakpoints)
 */
export const BREAKPOINTS: Record<string, number> = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

/**
 * Default placement with RTL support
 */
export const getDefaultPlacement = (fallback = 'bottom'): string => {
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
 * @param placementString - The placement string to parse
 * @param defaultPlacement - The default placement to use for xs/base
 * @returns Object with breakpoint keys and placement values, or null if not responsive
 */
export const parseResponsivePlacement = (placementString: string | null | undefined, defaultPlacement = 'bottom'): ResponsivePlacements | null => {
  // Check if placement contains responsive prefixes (e.g., "bottom-start md:top-end")
  if (!placementString || !placementString.includes(':')) {
    return null
  }

  // Parse the placement string into breakpoint-keyed object
  const parts = placementString.split(/\s+/)
  const placements: ResponsivePlacements = { xs: defaultPlacement } // Default fallback

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
 * @param responsivePlacements - Object with breakpoint keys and placement values
 * @param defaultPlacement - Fallback placement
 * @returns The active placement for current viewport
 */
export const getResponsivePlacement = (responsivePlacements: ResponsivePlacements | null, defaultPlacement = 'bottom'): string => {
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
 * @param callback - Callback to run when breakpoint changes
 * @returns Array of { mql, handler } objects for cleanup
 */
export const createBreakpointListeners = (callback: (event: MediaQueryListEvent) => void): BreakpointListener[] => {
  const listeners: BreakpointListener[] = []

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
 * @param listeners - Array of { mql, handler } objects
 */
export const disposeBreakpointListeners = (listeners: BreakpointListener[]): void => {
  for (const { mql, handler } of listeners) {
    mql.removeEventListener('change', handler)
  }
}

/**
 * Public `offset` option shared by the positioned components (Tooltip, Menu, …):
 * an `[skidding, distance]` array, a comma-separated string, or a callback
 * returning that array.
 */
type FloatingOffsetOption = number[] | string | ((data: Record<string, any>, element: HTMLElement) => number[])

/**
 * Public `floatingConfig` option: a Floating UI config object, a function that
 * refines the default config, or null.
 */
type FloatingConfigOption = Record<string, any> | ((defaultConfig: Record<string, any>) => Record<string, any>) | null

/**
 * Floating UI offset value: a number, an axis object, or our `[skidding, distance]` array
 */
type FloatingOffsetInput = number | number[] | { mainAxis?: number, crossAxis?: number, alignmentAxis?: number | null }
type FloatingOffsetValue = Exclude<FloatingOffsetInput, number[]>

/**
 * Normalize an offset value into Floating UI's offset shape.
 * A `[skidding, distance]` array becomes `{ mainAxis: distance, crossAxis: skidding }`;
 * numbers and axis objects pass through unchanged.
 */
export const toFloatingOffset = (value: FloatingOffsetInput): FloatingOffsetValue => {
  return Array.isArray(value) ? { mainAxis: value[1] || 0, crossAxis: value[0] || 0 } : value
}

export type {
  BreakpointListener, ResponsivePlacements, FloatingOffsetValue, FloatingOffsetOption, FloatingConfigOption
}
