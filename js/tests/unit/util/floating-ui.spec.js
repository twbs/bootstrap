import {
  BREAKPOINTS,
  getDefaultPlacement,
  parseResponsivePlacement,
  getResponsivePlacement,
  createBreakpointListeners,
  disposeBreakpointListeners
} from '../../../src/util/floating-ui.js'

describe('FloatingUI Util', () => {
  describe('BREAKPOINTS', () => {
    it('should export breakpoint values', () => {
      expect(BREAKPOINTS).toEqual(jasmine.any(Object))
      expect(BREAKPOINTS.sm).toBe(576)
      expect(BREAKPOINTS.md).toBe(768)
      expect(BREAKPOINTS.lg).toBe(1024)
      expect(BREAKPOINTS.xl).toBe(1280)
      expect(BREAKPOINTS['2xl']).toBe(1536)
    })
  })

  describe('getDefaultPlacement', () => {
    it('should return fallback placement when no alignment', () => {
      expect(getDefaultPlacement('bottom')).toBe('bottom')
      expect(getDefaultPlacement('top')).toBe('top')
      expect(getDefaultPlacement('left')).toBe('left')
      expect(getDefaultPlacement('right')).toBe('right')
    })

    it('should return default "bottom" when no argument provided', () => {
      expect(getDefaultPlacement()).toBe('bottom')
    })

    it('should return placement with alignment in LTR mode', () => {
      // In LTR mode (default), alignment should be preserved
      const htmlEl = document.documentElement
      const originalDir = htmlEl.getAttribute('dir')
      htmlEl.removeAttribute('dir')

      expect(getDefaultPlacement('bottom-start')).toBe('bottom-start')
      expect(getDefaultPlacement('bottom-end')).toBe('bottom-end')
      expect(getDefaultPlacement('top-start')).toBe('top-start')
      expect(getDefaultPlacement('top-end')).toBe('top-end')

      if (originalDir) {
        htmlEl.setAttribute('dir', originalDir)
      }
    })

    it('should flip alignment in RTL mode', () => {
      const htmlEl = document.documentElement
      const originalDir = htmlEl.getAttribute('dir')
      htmlEl.setAttribute('dir', 'rtl')

      expect(getDefaultPlacement('bottom-start')).toBe('bottom-end')
      expect(getDefaultPlacement('bottom-end')).toBe('bottom-start')
      expect(getDefaultPlacement('top-start')).toBe('top-end')
      expect(getDefaultPlacement('top-end')).toBe('top-start')

      if (originalDir) {
        htmlEl.setAttribute('dir', originalDir)
      } else {
        htmlEl.removeAttribute('dir')
      }
    })
  })

  describe('parseResponsivePlacement', () => {
    it('should return null for non-responsive placement strings', () => {
      expect(parseResponsivePlacement('bottom')).toBeNull()
      expect(parseResponsivePlacement('top-start')).toBeNull()
      expect(parseResponsivePlacement('left-end')).toBeNull()
      expect(parseResponsivePlacement('')).toBeNull()
      expect(parseResponsivePlacement(null)).toBeNull()
      expect(parseResponsivePlacement(undefined)).toBeNull()
    })

    it('should parse simple responsive placement', () => {
      const result = parseResponsivePlacement('bottom md:top')
      expect(result).toEqual({
        xs: 'bottom',
        md: 'top'
      })
    })

    it('should parse responsive placement with alignments', () => {
      const result = parseResponsivePlacement('bottom-start md:top-end lg:right')
      expect(result).toEqual({
        xs: 'bottom-start',
        md: 'top-end',
        lg: 'right'
      })
    })

    it('should parse all breakpoints', () => {
      const result = parseResponsivePlacement('bottom sm:top md:left lg:right xl:bottom-start 2xl:top-end')
      expect(result).toEqual({
        xs: 'bottom',
        sm: 'top',
        md: 'left',
        lg: 'right',
        xl: 'bottom-start',
        '2xl': 'top-end'
      })
    })

    it('should use default placement for xs when base is not specified', () => {
      const result = parseResponsivePlacement('md:top lg:bottom', 'right')
      expect(result).toEqual({
        xs: 'right',
        md: 'top',
        lg: 'bottom'
      })
    })

    it('should ignore invalid breakpoints', () => {
      const result = parseResponsivePlacement('bottom invalid:top md:left')
      expect(result).toEqual({
        xs: 'bottom',
        md: 'left'
      })
      expect(result.invalid).toBeUndefined()
    })

    it('should handle placement string with only responsive prefixes', () => {
      const result = parseResponsivePlacement('md:top')
      expect(result).toEqual({
        xs: 'bottom', // default
        md: 'top'
      })
    })
  })

  describe('getResponsivePlacement', () => {
    it('should return default placement when responsivePlacements is null', () => {
      expect(getResponsivePlacement(null)).toBe('bottom')
      expect(getResponsivePlacement(null, 'top')).toBe('top')
    })

    it('should return default placement when responsivePlacements is undefined', () => {
      expect(getResponsivePlacement(undefined)).toBe('bottom')
      expect(getResponsivePlacement(undefined, 'left')).toBe('left')
    })

    it('should return xs placement for small viewports', () => {
      // Mock a small viewport (less than sm breakpoint)
      spyOnProperty(window, 'innerWidth').and.returnValue(400)

      const placements = { xs: 'bottom', md: 'top' }
      expect(getResponsivePlacement(placements)).toBe('bottom')
    })

    it('should return appropriate placement for sm viewport', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(600)

      const placements = { xs: 'bottom', sm: 'top', md: 'left' }
      expect(getResponsivePlacement(placements)).toBe('top')
    })

    it('should return appropriate placement for md viewport', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(800)

      const placements = {
        xs: 'bottom',
        sm: 'top',
        md: 'left',
        lg: 'right'
      }
      expect(getResponsivePlacement(placements)).toBe('left')
    })

    it('should return appropriate placement for lg viewport', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1100)

      const placements = { xs: 'bottom', md: 'top', lg: 'right' }
      expect(getResponsivePlacement(placements)).toBe('right')
    })

    it('should return appropriate placement for xl viewport', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1300)

      const placements = { xs: 'bottom', lg: 'top', xl: 'left' }
      expect(getResponsivePlacement(placements)).toBe('left')
    })

    it('should return appropriate placement for 2xl viewport', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1600)

      const placements = { xs: 'bottom', xl: 'top', '2xl': 'right-start' }
      expect(getResponsivePlacement(placements)).toBe('right-start')
    })

    it('should cascade to smaller breakpoints when larger ones are not defined', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1600)

      // Only xs and md defined, viewport is 2xl
      const placements = { xs: 'bottom', md: 'top' }
      expect(getResponsivePlacement(placements)).toBe('top')
    })

    it('should use default when xs is not defined', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(400)

      const placements = { md: 'top' } // No xs
      expect(getResponsivePlacement(placements, 'left')).toBe('left')
    })
  })

  describe('createBreakpointListeners', () => {
    it('should create listeners for all breakpoints', () => {
      const callback = jasmine.createSpy('callback')
      const listeners = createBreakpointListeners(callback)

      expect(listeners).toEqual(jasmine.any(Array))
      expect(listeners.length).toBe(Object.keys(BREAKPOINTS).length)

      // Each listener should have mql and handler
      for (const listener of listeners) {
        expect(listener.mql).toBeDefined()
        expect(listener.handler).toBe(callback)
      }

      // Clean up
      disposeBreakpointListeners(listeners)
    })

    it('should create MediaQueryList objects with correct queries', () => {
      const callback = jasmine.createSpy('callback')
      const listeners = createBreakpointListeners(callback)

      // Verify media query objects are created
      expect(listeners[0].mql.media).toContain('min-width')

      // Clean up
      disposeBreakpointListeners(listeners)
    })
  })

  describe('disposeBreakpointListeners', () => {
    it('should remove all event listeners', () => {
      const callback = jasmine.createSpy('callback')
      const listeners = createBreakpointListeners(callback)

      // Spy on removeEventListener for each mql
      const spies = listeners.map(listener =>
        spyOn(listener.mql, 'removeEventListener').and.callThrough()
      )

      disposeBreakpointListeners(listeners)

      // Verify removeEventListener was called on each
      for (const spy of spies) {
        expect(spy).toHaveBeenCalledWith('change', callback)
      }
    })

    it('should handle empty array', () => {
      expect(() => disposeBreakpointListeners([])).not.toThrow()
    })
  })
})
