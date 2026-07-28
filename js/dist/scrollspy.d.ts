/**
 * --------------------------------------------------------------------------
 * Bootstrap scrollspy.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import type { ComponentConfig } from './util/config.js';
type ScrollSpyConfig = {
    rootMargin: string | null;
    smoothScroll: boolean;
    target: string | Element | null;
    threshold: number[] | string;
    topMargin: string;
};
/**
 * Class definition
 */
declare class ScrollSpy extends BaseComponent {
    protected _config: ScrollSpyConfig;
    protected _sections: HTMLElement[];
    protected _linkBySection: Map<HTMLElement, HTMLElement>;
    protected _sectionByLink: Map<HTMLElement, HTMLElement>;
    protected _intersecting: Set<Element>;
    protected _activeTarget: HTMLElement | null;
    protected _lastActive: HTMLElement | null;
    protected _atBottom: boolean;
    protected _rootElement: HTMLElement | null;
    protected _observer: IntersectionObserver | null;
    protected _sentinel: HTMLElement | null;
    protected _sentinelObserver: IntersectionObserver | null;
    protected _pendingNavigation: {
        hash: string;
        section: HTMLElement;
    } | null;
    protected _settleTimeout: number | null;
    protected _settleHandler: (() => void) | null;
    protected _scrollIdleHandler: (() => void) | null;
    protected _resizeHandler: (() => void) | null;
    protected _resizeTimeout: number | null;
    constructor(element?: string | Element | null, config?: Partial<ScrollSpyConfig> | null);
    static get Default(): ScrollSpyConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    refresh(): void;
    dispose(): void;
    protected _configAfterMerge(config: ComponentConfig): ComponentConfig;
    protected _getNewObserver(): IntersectionObserver;
    protected _onIntersect(entries: IntersectionObserverEntry[]): void;
    protected _computeActive(): void;
    protected _parseTopMargin(): {
        value: number;
        unit: string;
    };
    protected _getDerivedRootMargin(): string;
    protected _usesPixelMargin(): boolean;
    protected _setUpSentinel(): void;
    protected _onSentinel(entries: IntersectionObserverEntry[]): void;
    protected _isOverflowing(): boolean;
    protected _teardownSentinel(): void;
    protected _maybeAddResizeListener(): void;
    protected _removeResizeListener(): void;
    protected _rebuildObserver(): void;
    protected _maybeEnableSmoothScroll(): void;
    protected _armSettle(): void;
    protected _disarmSettle(): void;
    protected _getSettleTarget(): HTMLElement | Document;
    protected _onSettle(): void;
    protected _settleNavigation(hash: string, section: HTMLElement): void;
    protected _initializeTargetsAndObservables(): void;
    protected _process(target: HTMLElement): void;
    protected _activateParents(target: HTMLElement): void;
    protected _clearActiveClass(parent: HTMLElement): void;
}
export default ScrollSpy;
export type { ScrollSpyConfig };
//# sourceMappingURL=scrollspy.d.ts.map