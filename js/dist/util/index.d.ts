/**
 * --------------------------------------------------------------------------
 * Bootstrap util/index.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Properly escapes ID selectors to handle special characters in IDs
 * (e.g. forward slashes, periods) so that they work with `document.querySelector`.
 *
 * @param selector - The selector to escape
 * @returns The escaped selector
 */
declare const parseSelector: (selector: string) => string;
declare const toType: (object: unknown) => string;
/**
 * Public Util API
 */
declare const getUID: (prefix: string) => string;
declare const getTransitionDurationFromElement: (element: Element | null) => number;
declare const triggerTransitionEnd: (element: Element) => void;
declare const isElement: (object: unknown) => object is Element;
declare const getElement: (object: unknown) => HTMLElement | null;
declare const isVisible: (element: unknown) => boolean;
declare const isDisabled: (element: Element | null | undefined) => boolean;
declare const setAriaAttribute: (element: Element, name: string, value: boolean) => void;
declare const findShadowRoot: (element: Node) => ShadowRoot | null;
declare const noop: () => void;
/**
 * Trick to restart an element's animation by forcing a reflow.
 *
 * @param element - The element whose animation should be restarted
 *
 * @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
declare const reflow: (element: HTMLElement) => void;
declare const onDOMContentLoaded: (callback: () => void) => void;
declare const isRTL: () => boolean;
declare const execute: <T = any>(possibleCallback: T | ((...functionArgs: any[]) => T), args?: any[], defaultValue?: T | ((...functionArgs: any[]) => T)) => T;
declare const executeAfterTransition: (callback: () => void, transitionElement: Element, waitForTransition?: boolean) => void;
/**
 * Return the previous/next element of a list.
 *
 * @param list - The list of elements to traverse
 * @param activeElement - The currently active element
 * @param shouldGetNext - Whether to return the next element (`true`) or the previous one (`false`)
 * @param isCycleAllowed - Whether to cycle back to the opposite end of the list when reaching the boundary
 * @returns The appropriate previous/next element from the list
 */
declare const getNextActiveElement: <T>(list: T[], activeElement: T, shouldGetNext: boolean, isCycleAllowed: boolean) => T;
export { execute, executeAfterTransition, findShadowRoot, getElement, getNextActiveElement, getTransitionDurationFromElement, getUID, isDisabled, isElement, isRTL, isVisible, noop, onDOMContentLoaded, parseSelector, reflow, setAriaAttribute, triggerTransitionEnd, toType };
//# sourceMappingURL=index.d.ts.map