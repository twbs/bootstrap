/*!
* Bootstrap floating-ui.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import { isRTL } from "./index.js";
//#region js/src/util/floating-ui.ts
/**
* --------------------------------------------------------------------------
* Bootstrap util/floating-ui.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Breakpoints for responsive placement (matches SCSS $breakpoints)
*/
const BREAKPOINTS = {
	sm: 576,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536
};
/**
* Default placement with RTL support
*/
const getDefaultPlacement = (fallback = "bottom") => {
	if (fallback.includes("-start") || fallback.includes("-end")) {
		const [side, alignment] = fallback.split("-");
		const flippedAlignment = alignment === "start" ? "end" : "start";
		return isRTL() ? `${side}-${flippedAlignment}` : fallback;
	}
	return fallback;
};
/**
* Parse a placement string that may contain responsive prefixes
* Example: "bottom-start md:top-end lg:right" returns { xs: 'bottom-start', md: 'top-end', lg: 'right' }
*
* @param placementString - The placement string to parse
* @param defaultPlacement - The default placement to use for xs/base
* @returns Object with breakpoint keys and placement values, or null if not responsive
*/
const parseResponsivePlacement = (placementString, defaultPlacement = "bottom") => {
	if (!placementString || !placementString.includes(":")) return null;
	const parts = placementString.split(/\s+/);
	const placements = { xs: defaultPlacement };
	for (const part of parts) if (part.includes(":")) {
		const [breakpoint, placement] = part.split(":");
		if (BREAKPOINTS[breakpoint] !== void 0) placements[breakpoint] = placement;
	} else placements.xs = part;
	return placements;
};
/**
* Get the active placement for the current viewport width
*
* @param responsivePlacements - Object with breakpoint keys and placement values
* @param defaultPlacement - Fallback placement
* @returns The active placement for current viewport
*/
const getResponsivePlacement = (responsivePlacements, defaultPlacement = "bottom") => {
	if (!responsivePlacements) return defaultPlacement;
	const viewportWidth = window.innerWidth;
	let activePlacement = responsivePlacements.xs || defaultPlacement;
	for (const breakpoint of [
		"sm",
		"md",
		"lg",
		"xl",
		"2xl"
	]) if (viewportWidth >= BREAKPOINTS[breakpoint] && responsivePlacements[breakpoint]) activePlacement = responsivePlacements[breakpoint];
	return activePlacement;
};
/**
* Create media query listeners for responsive placement changes
*
* @param callback - Callback to run when breakpoint changes
* @returns Array of { mql, handler } objects for cleanup
*/
const createBreakpointListeners = (callback) => {
	const listeners = [];
	for (const breakpoint of Object.keys(BREAKPOINTS)) {
		const minWidth = BREAKPOINTS[breakpoint];
		const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
		mql.addEventListener("change", callback);
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
* @param listeners - Array of { mql, handler } objects
*/
const disposeBreakpointListeners = (listeners) => {
	for (const { mql, handler } of listeners) mql.removeEventListener("change", handler);
};
/**
* Normalize an offset value into Floating UI's offset shape.
* A `[skidding, distance]` array becomes `{ mainAxis: distance, crossAxis: skidding }`;
* numbers and axis objects pass through unchanged.
*/
const toFloatingOffset = (value) => {
	return Array.isArray(value) ? {
		mainAxis: value[1] || 0,
		crossAxis: value[0] || 0
	} : value;
};
//#endregion
export { BREAKPOINTS, createBreakpointListeners, disposeBreakpointListeners, getDefaultPlacement, getResponsivePlacement, parseResponsivePlacement, toFloatingOffset };

//# sourceMappingURL=floating-ui.js.map