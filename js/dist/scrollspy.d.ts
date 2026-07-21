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
    _config: ScrollSpyConfig;
    _sections: HTMLElement[];
    _linkBySection: Map<HTMLElement, HTMLElement>;
    _sectionByLink: Map<HTMLElement, HTMLElement>;
    _intersecting: Set<Element>;
    _activeTarget: HTMLElement | null;
    _lastActive: HTMLElement | null;
    _atBottom: boolean;
    _rootElement: HTMLElement | null;
    _observer: IntersectionObserver | null;
    _sentinel: HTMLElement | null;
    _sentinelObserver: IntersectionObserver | null;
    _pendingNavigation: {
        hash: string;
        section: HTMLElement;
    } | null;
    _settleTimeout: number | null;
    _settleHandler: (() => void) | null;
    _scrollIdleHandler: (() => void) | null;
    _resizeHandler: (() => void) | null;
    _resizeTimeout: number | null;
    constructor(element?: string | Element | null, config?: Partial<ScrollSpyConfig> | null);
    static get Default(): ScrollSpyConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    refresh(): void;
    dispose(): void;
    _configAfterMerge(config: ComponentConfig): ComponentConfig;
    _getNewObserver(): IntersectionObserver;
    _onIntersect(entries: IntersectionObserverEntry[]): void;
    _computeActive(): void;
    _parseTopMargin(): {
        value: number;
        unit: string;
    };
    _getDerivedRootMargin(): string;
    _usesPixelMargin(): boolean;
    _setUpSentinel(): void;
    _onSentinel(entries: IntersectionObserverEntry[]): void;
    _isOverflowing(): boolean;
    _teardownSentinel(): void;
    _maybeAddResizeListener(): void;
    _removeResizeListener(): void;
    _rebuildObserver(): void;
    _maybeEnableSmoothScroll(): void;
    _armSettle(): void;
    _disarmSettle(): void;
    _getSettleTarget(): HTMLElement | Document;
    _onSettle(): void;
    _settleNavigation(hash: string, section: HTMLElement): void;
    _initializeTargetsAndObservables(): void;
    _process(target: HTMLElement): void;
    _activateParents(target: HTMLElement): void;
    _clearActiveClass(parent: HTMLElement): void;
}
export default ScrollSpy;
export type { ScrollSpyConfig };
//# sourceMappingURL=scrollspy.d.ts.map