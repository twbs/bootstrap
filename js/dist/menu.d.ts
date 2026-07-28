/**
 * --------------------------------------------------------------------------
 * Bootstrap menu.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import { type Middleware, type MiddlewareState, type Placement, type ReferenceElement, type Strategy } from '@floating-ui/dom';
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
import type { ComponentConfig } from './util/config.js';
import { type BreakpointListener, type ResponsivePlacements, type FloatingOffsetOption, type FloatingConfigOption } from './util/floating-ui.js';
type Point = {
    x: number;
    y: number;
};
type MenuConfig = {
    autoClose: boolean | 'inside' | 'outside';
    boundary: string | Element;
    container: string | Element | boolean;
    display: string;
    offset: FloatingOffsetOption;
    floatingConfig: FloatingConfigOption;
    menu: HTMLElement | null;
    placement: string;
    reference: string | Element | Record<string, any>;
    strategy: string;
    submenuTrigger: string;
    submenuDelay: number;
};
/**
 * Class definition
 */
declare class Menu extends BaseComponent {
    static _openInstances: Set<Menu>;
    protected _config: MenuConfig;
    protected _floatingCleanup: (() => void) | null;
    protected _mediaQueryListeners: BreakpointListener[];
    protected _responsivePlacements: ResponsivePlacements | null;
    protected _parent: HTMLElement;
    protected _openSubmenus: Map<HTMLElement, () => void>;
    protected _submenuCloseTimeouts: Map<HTMLElement, number>;
    protected _hoverIntentData: {
        x: number;
        y: number;
        timestamp: number;
    } | null;
    protected _menu: HTMLElement;
    protected _isSubmenu: boolean;
    protected _menuOriginalParent: ParentNode | null;
    constructor(element?: string | Element | null, config?: Partial<MenuConfig> | null);
    static get Default(): MenuConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
    update(): void;
    protected _findMenu(): Element | null;
    protected _findWrapper(menu: HTMLElement): HTMLElement;
    protected _completeHide(relatedTarget: Record<string, unknown>): void;
    protected _getConfig(config?: ComponentConfig | null): ComponentConfig;
    protected _createFloating(): void;
    protected _updateFloatingPosition(referenceElement?: ReferenceElement | null): Promise<void>;
    protected _isShown(): boolean;
    protected _getPlacement(): string;
    protected _parseResponsivePlacements(): void;
    protected _setupMediaQueryListeners(): void;
    protected _disposeMediaQueryListeners(): void;
    protected _getOffset(): number[] | ((state: MiddlewareState) => any);
    protected _getFloatingMiddleware(): Middleware[];
    protected _getFallbackPlacements(): Placement[];
    protected _getFloatingConfig(placement: string, middleware: Middleware[]): Record<string, any>;
    protected _disposeFloating(): void;
    protected _getContainer(): HTMLElement | null;
    protected _moveMenuToContainer(): void;
    protected _restoreMenuToOriginalParent(): void;
    protected _applyFloatingPosition(reference: ReferenceElement, floating: HTMLElement, placement: Placement, middleware: Middleware[], strategy?: Strategy): Promise<string | null>;
    protected _setupSubmenuListeners(): void;
    protected _onSubmenuTriggerEnter(event: BootstrapEvent): void;
    protected _onSubmenuLeave(event: BootstrapEvent): void;
    protected _onSubmenuTriggerClick(event: BootstrapEvent): void;
    protected _openSubmenu(trigger: HTMLElement, submenu: HTMLElement, submenuWrapper: Element): void;
    protected _closeSubmenu(submenu: HTMLElement, submenuWrapper: Element): void;
    protected _closeAllSubmenus(): void;
    protected _closeSiblingSubmenus(currentSubmenuWrapper: Element): void;
    protected _createSubmenuFloating(trigger: HTMLElement, submenu: HTMLElement, submenuWrapper: Element): () => void;
    protected _scheduleSubmenuClose(submenu: HTMLElement, submenuWrapper: Element): void;
    protected _cancelSubmenuCloseTimeout(submenu: HTMLElement): void;
    protected _clearAllSubmenuTimeouts(): void;
    protected _trackMousePosition(event: BootstrapEvent): void;
    protected _isMovingTowardSubmenu(event: BootstrapEvent, submenu: HTMLElement): boolean;
    protected _pointInTriangle(point: Point, v1: Point, v2: Point, v3: Point): boolean;
    protected _selectMenuItem({ key, target }: BootstrapEvent): void;
    protected _handleSubmenuKeydown(event: BootstrapEvent): boolean;
    static clearMenus(event: BootstrapEvent): void;
    static dataApiKeydownHandler(this: HTMLElement, event: BootstrapEvent): void;
}
export default Menu;
export type { MenuConfig };
//# sourceMappingURL=menu.d.ts.map