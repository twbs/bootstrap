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
    menuStrategy: string;
    moreText: string | false;
    moreIcon: string;
    threshold: number;
};
/**
 * Class definition
 */
declare class NavOverflow extends BaseComponent {
    protected _config: NavOverflowConfig;
    protected _nav: HTMLElement;
    protected _items: HTMLElement[];
    protected _overflowItems: HTMLElement[];
    protected _overflowMenu: HTMLElement | null;
    protected _overflowToggle: HTMLElement | null;
    protected _resizeObserver: ResizeObserver | null;
    protected _resizeHandler: (() => void) | null;
    protected _collapseBelow: number;
    protected _itemMenus: Map<HTMLElement, HTMLElement>;
    protected _relocatedMenus: Map<HTMLElement, {
        menu: HTMLElement;
        parent: ParentNode;
        nextSibling: ChildNode | null;
    }>;
    constructor(element?: string | Element | null, config?: Partial<NavOverflowConfig> | null);
    static get Default(): NavOverflowConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    update(): void;
    dispose(): void;
    protected _init(): void;
    protected _createOverflowMenu(): void;
    protected _resolveIcon(): string;
    protected _resolveCollapseBelow(): number;
    protected _setupResizeObserver(): void;
    protected _availableWidth(): number;
    protected _navGap(): number;
    protected _calculateOverflow(): void;
    protected _applyOverflow(items: HTMLElement[], overflowItem: HTMLElement | null): void;
    protected _moveToOverflow(items: HTMLElement[]): void;
    protected _relocateAsSubmenu(item: HTMLElement, link: HTMLElement, menu: HTMLElement): HTMLElement;
    protected _cloneAsMenuItem(link: HTMLElement, submenu?: boolean): HTMLElement;
    protected _findItemMenu(item: HTMLElement, link: HTMLElement): HTMLElement | null;
    protected _resetMenu(toggle: HTMLElement, menu: HTMLElement): void;
    protected _restoreRelocatedMenus(): void;
    protected _restoreItems(): void;
}
export default NavOverflow;
export type { NavOverflowConfig };
//# sourceMappingURL=nav-overflow.d.ts.map