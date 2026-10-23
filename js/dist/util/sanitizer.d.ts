/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
type SanitizerAllowList = Record<string, Array<string | RegExp>>;
export declare const DefaultAllowlist: SanitizerAllowList;
/**
 * Allowlist for icon HTML options (Chips `dismissIcon`, NavOverflow `moreIcon`,
 * and markup supplied via `[data-bs-overflow-icon]`). Covers the default SVG
 * icons plus common inline-icon markup. Event-handler attributes and tags not
 * listed here are stripped by `sanitizeHtml`.
 */
export declare const DefaultIconAllowlist: SanitizerAllowList;
export declare function sanitizeHtml(unsafeHtml: string, allowList: SanitizerAllowList, sanitizeFunction?: ((unsafeHtml: string) => string) | null): string;
export type { SanitizerAllowList };
//# sourceMappingURL=sanitizer.d.ts.map