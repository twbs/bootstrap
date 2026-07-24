/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
type SanitizerAllowList = Record<string, Array<string | RegExp>>;
export declare const DefaultAllowlist: SanitizerAllowList;
export declare function sanitizeHtml(unsafeHtml: string, allowList: SanitizerAllowList, sanitizeFunction?: ((unsafeHtml: string) => string) | null): string;
export type { SanitizerAllowList };
//# sourceMappingURL=sanitizer.d.ts.map