/**
 * --------------------------------------------------------------------------
 * Bootstrap nav-overflow.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
type NavOverflowConfig = {
    collapseBelow: number | string;
    iconPlacement: string;
    menuPlacement: string;
    moreText: string;
    moreIcon: string;
    threshold: number;
};
/**
 * Class definition
 */
declare class NavOverflow extends BaseComponent {
    _config: NavOverflowConfig;
    _items: HTMLElement[];
    _overflowItems: HTMLElement[];
    _overflowMenu: HTMLElement | null;
    _overflowToggle: HTMLElement | null;
    _resizeObserver: ResizeObserver | null;
    _collapseBelow: number;
    _isInitialized: boolean;
    constructor(element?: string | Element | null, config?: Partial<NavOverflowConfig> | null);
    static get Default(): NavOverflowConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    update(): void;
    dispose(): void;
    _init(): void;
    _createOverflowMenu(): void;
    _resolveIcon(): string;
    _resolveCollapseBelow(): number;
    _setupResizeObserver(): void;
    _calculateOverflow(): void;
    _moveToOverflow(items: HTMLElement[]): void;
    _restoreItems(): void;
}
export default NavOverflow;
export type { NavOverflowConfig };
//# sourceMappingURL=nav-overflow.d.ts.map