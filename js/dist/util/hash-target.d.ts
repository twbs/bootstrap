/**
 * --------------------------------------------------------------------------
 * Bootstrap util/hash-target.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */
declare const ATTR_HASH = "data-bs-hash";
type HashTargetHandler = {
    /** Return true when this component should open the hashed element. */
    matches: (element: HTMLElement) => boolean;
    /**
     * Optional visible anchor to scroll before opening (usually the trigger).
     * Closed collapses and inactive tab panes use `display: none`, so they cannot
     * be scrolled to until after they open.
     */
    getAnchor?: (element: HTMLElement) => HTMLElement | null;
    /**
     * Open the target. Call `done` after the open animation finishes,
     * or immediately when the target is already open.
     */
    open: (element: HTMLElement, done: () => void) => void;
};
/**
 * Decode a URL fragment id, tolerating malformed escapes (returns it as-is).
 */
declare const decodeFragment: (value: string) => string;
/**
 * Resolve the element named by `location.hash` when it opts in with `data-bs-hash`.
 */
declare const getHashTarget: () => HTMLElement | null;
/**
 * Open an opted-in hash target on `load` and `hashchange`.
 * Put `data-bs-hash` on the collapse or tab pane that the URL fragment names.
 *
 * Scrolls a visible anchor first when one exists, then opens the target, then
 * scrolls the target into view after it is shown.
 */
declare const enableHashTarget: (namespace: string, handler: HashTargetHandler) => void;
export { ATTR_HASH, decodeFragment, enableHashTarget, getHashTarget };
export type { HashTargetHandler };
//# sourceMappingURL=hash-target.d.ts.map