/*!
  * Bootstrap floating-ui.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('./index.js')) :
  typeof define === 'function' && define.amd ? define(['exports', './index'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FloatingUi = {}, global.Index));
})(this, (function (exports, index_js) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/floating-ui.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Breakpoints for responsive placement (matches SCSS $grid-breakpoints)
   */
  const BREAKPOINTS = {
    sm: 576,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  /**
   * Default placement with RTL support
   */
  const getDefaultPlacement = (fallback = 'bottom') => {
    if (fallback.includes('-start') || fallback.includes('-end')) {
      const [side, alignment] = fallback.split('-');
      const flippedAlignment = alignment === 'start' ? 'end' : 'start';
      return index_js.isRTL() ? `${side}-${flippedAlignment}` : fallback;
    }
    return fallback;
  };

  /**
   * Parse a placement string that may contain responsive prefixes
   * Example: "bottom-start md:top-end lg:right" returns { xs: 'bottom-start', md: 'top-end', lg: 'right' }
   *
   * @param {string} placementString - The placement string to parse
   * @param {string} defaultPlacement - The default placement to use for xs/base
   * @returns {object|null} - Object with breakpoint keys and placement values, or null if not responsive
   */
  const parseResponsivePlacement = (placementString, defaultPlacement = 'bottom') => {
    // Check if placement contains responsive prefixes (e.g., "bottom-start md:top-end")
    if (!placementString || !placementString.includes(':')) {
      return null;
    }

    // Parse the placement string into breakpoint-keyed object
    const parts = placementString.split(/\s+/);
    const placements = {
      xs: defaultPlacement
    }; // Default fallback

    for (const part of parts) {
      if (part.includes(':')) {
        // Responsive placement like "md:top-end"
        const [breakpoint, placement] = part.split(':');
        if (BREAKPOINTS[breakpoint] !== undefined) {
          placements[breakpoint] = placement;
        }
      } else {
        // Base placement (no prefix = xs/default)
        placements.xs = part;
      }
    }
    return placements;
  };

  /**
   * Get the active placement for the current viewport width
   *
   * @param {object} responsivePlacements - Object with breakpoint keys and placement values
   * @param {string} defaultPlacement - Fallback placement
   * @returns {string} - The active placement for current viewport
   */
  const getResponsivePlacement = (responsivePlacements, defaultPlacement = 'bottom') => {
    if (!responsivePlacements) {
      return defaultPlacement;
    }

    // Get current viewport width
    const viewportWidth = window.innerWidth;

    // Find the largest breakpoint that matches
    let activePlacement = responsivePlacements.xs || defaultPlacement;

    // Check breakpoints in order (sm, md, lg, xl, 2xl)
    const breakpointOrder = ['sm', 'md', 'lg', 'xl', '2xl'];
    for (const breakpoint of breakpointOrder) {
      const minWidth = BREAKPOINTS[breakpoint];
      if (viewportWidth >= minWidth && responsivePlacements[breakpoint]) {
        activePlacement = responsivePlacements[breakpoint];
      }
    }
    return activePlacement;
  };

  /**
   * Create media query listeners for responsive placement changes
   *
   * @param {Function} callback - Callback to run when breakpoint changes
   * @returns {Array} - Array of { mql, handler } objects for cleanup
   */
  const createBreakpointListeners = callback => {
    const listeners = [];
    for (const breakpoint of Object.keys(BREAKPOINTS)) {
      const minWidth = BREAKPOINTS[breakpoint];
      const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
      mql.addEventListener('change', callback);
      listeners.push({
        mql,
        handler: callback
      });
    }
    return listeners;
  };

  /**
   * Clean up media query listeners
   *
   * @param {Array} listeners - Array of { mql, handler } objects
   */
  const disposeBreakpointListeners = listeners => {
    for (const {
      mql,
      handler
    } of listeners) {
      mql.removeEventListener('change', handler);
    }
  };

  exports.BREAKPOINTS = BREAKPOINTS;
  exports.createBreakpointListeners = createBreakpointListeners;
  exports.disposeBreakpointListeners = disposeBreakpointListeners;
  exports.getDefaultPlacement = getDefaultPlacement;
  exports.getResponsivePlacement = getResponsivePlacement;
  exports.parseResponsivePlacement = parseResponsivePlacement;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=floating-ui.js.map
