/**
 * --------------------------------------------------------------------------
 * Bootstrap util/floating-ui.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Types
 */
type ResponsivePlacements = Record<string, string>;
interface BreakpointListener {
    mql: MediaQueryList;
    handler: (event: MediaQueryListEvent) => void;
}
/**
 * Breakpoints for responsive placement (matches SCSS $breakpoints)
 */
export declare const BREAKPOINTS: Record<string, number>;
/**
 * Default placement with RTL support
 */
export declare const getDefaultPlacement: (fallback?: string) => string;
/**
 * Parse a placement string that may contain responsive prefixes
 * Example: "bottom-start md:top-end lg:right" returns { xs: 'bottom-start', md: 'top-end', lg: 'right' }
 *
 * @param placementString - The placement string to parse
 * @param defaultPlacement - The default placement to use for xs/base
 * @returns Object with breakpoint keys and placement values, or null if not responsive
 */
export declare const parseResponsivePlacement: (placementString: string | null | undefined, defaultPlacement?: string) => ResponsivePlacements | null;
/**
 * Get the active placement for the current viewport width
 *
 * @param responsivePlacements - Object with breakpoint keys and placement values
 * @param defaultPlacement - Fallback placement
 * @returns The active placement for current viewport
 */
export declare const getResponsivePlacement: (responsivePlacements: ResponsivePlacements | null, defaultPlacement?: string) => string;
/**
 * Create media query listeners for responsive placement changes
 *
 * @param callback - Callback to run when breakpoint changes
 * @returns Array of { mql, handler } objects for cleanup
 */
export declare const createBreakpointListeners: (callback: (event: MediaQueryListEvent) => void) => BreakpointListener[];
/**
 * Clean up media query listeners
 *
 * @param listeners - Array of { mql, handler } objects
 */
export declare const disposeBreakpointListeners: (listeners: BreakpointListener[]) => void;
/**
 * Public `offset` option shared by the positioned components (Tooltip, Menu, …):
 * an `[skidding, distance]` array, a comma-separated string, or a callback
 * returning that array.
 */
type FloatingOffsetOption = number[] | string | ((data: Record<string, any>, element: HTMLElement) => number[]);
/**
 * Public `floatingConfig` option: a Floating UI config object, a function that
 * refines the default config, or null.
 */
type FloatingConfigOption = Record<string, any> | ((defaultConfig: Record<string, any>) => Record<string, any>) | null;
/**
 * Floating UI offset value: a number, an axis object, or our `[skidding, distance]` array
 */
type FloatingOffsetInput = number | number[] | {
    mainAxis?: number;
    crossAxis?: number;
    alignmentAxis?: number | null;
};
type FloatingOffsetValue = Exclude<FloatingOffsetInput, number[]>;
/**
 * Normalize an offset value into Floating UI's offset shape.
 * A `[skidding, distance]` array becomes `{ mainAxis: distance, crossAxis: skidding }`;
 * numbers and axis objects pass through unchanged.
 */
export declare const toFloatingOffset: (value: FloatingOffsetInput) => FloatingOffsetValue;
export type { BreakpointListener, ResponsivePlacements, FloatingOffsetValue, FloatingOffsetOption, FloatingConfigOption };
//# sourceMappingURL=floating-ui.d.ts.map