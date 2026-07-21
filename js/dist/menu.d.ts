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
import { type BreakpointListener, type ResponsivePlacements } from './util/floating-ui.js';
type Point = {
    x: number;
    y: number;
};
type MenuConfig = {
    autoClose: boolean | 'inside' | 'outside';
    boundary: string | Element;
    container: string | Element | boolean;
    display: string;
    offset: number[] | string | ((data: Record<string, any>, element: HTMLElement) => any);
    floatingConfig: Record<string, any> | ((defaultConfig: Record<string, any>) => Record<string, any>) | null;
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
    _config: MenuConfig;
    _floatingCleanup: (() => void) | null;
    _mediaQueryListeners: BreakpointListener[];
    _responsivePlacements: ResponsivePlacements | null;
    _parent: HTMLElement;
    _openSubmenus: Map<HTMLElement, () => void>;
    _submenuCloseTimeouts: Map<HTMLElement, number>;
    _hoverIntentData: {
        x: number;
        y: number;
        timestamp: number;
    } | null;
    _menu: HTMLElement;
    _isSubmenu: boolean;
    _menuOriginalParent: ParentNode | null;
    constructor(element?: string | Element | null, config?: Partial<MenuConfig> | null);
    static get Default(): MenuConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
    update(): void;
    _findMenu(): Element | null;
    _findWrapper(menu: HTMLElement): HTMLElement;
    _completeHide(relatedTarget: Record<string, unknown>): void;
    _getConfig(config?: ComponentConfig | null): ComponentConfig;
    _createFloating(): void;
    _updateFloatingPosition(referenceElement?: ReferenceElement | null): Promise<void>;
    _isShown(): boolean;
    _getPlacement(): string;
    _parseResponsivePlacements(): void;
    _setupMediaQueryListeners(): void;
    _disposeMediaQueryListeners(): void;
    _getOffset(): number[] | ((state: MiddlewareState) => any);
    _getFloatingMiddleware(): Middleware[];
    _getFallbackPlacements(): Placement[];
    _getFloatingConfig(placement: string, middleware: Middleware[]): Record<string, any>;
    _disposeFloating(): void;
    _getContainer(): HTMLElement | null;
    _moveMenuToContainer(): void;
    _restoreMenuToOriginalParent(): void;
    _applyFloatingPosition(reference: ReferenceElement, floating: HTMLElement, placement: Placement, middleware: Middleware[], strategy?: Strategy): Promise<string | null>;
    _setupSubmenuListeners(): void;
    _onSubmenuTriggerEnter(event: BootstrapEvent): void;
    _onSubmenuLeave(event: BootstrapEvent): void;
    _onSubmenuTriggerClick(event: BootstrapEvent): void;
    _openSubmenu(trigger: HTMLElement, submenu: HTMLElement, submenuWrapper: Element): void;
    _closeSubmenu(submenu: HTMLElement, submenuWrapper: Element): void;
    _closeAllSubmenus(): void;
    _closeSiblingSubmenus(currentSubmenuWrapper: Element): void;
    _createSubmenuFloating(trigger: HTMLElement, submenu: HTMLElement, submenuWrapper: Element): () => void;
    _scheduleSubmenuClose(submenu: HTMLElement, submenuWrapper: Element): void;
    _cancelSubmenuCloseTimeout(submenu: HTMLElement): void;
    _clearAllSubmenuTimeouts(): void;
    _trackMousePosition(event: BootstrapEvent): void;
    _isMovingTowardSubmenu(event: BootstrapEvent, submenu: HTMLElement): boolean;
    _pointInTriangle(point: Point, v1: Point, v2: Point, v3: Point): boolean;
    _selectMenuItem({ key, target }: BootstrapEvent): void;
    _handleSubmenuKeydown(event: BootstrapEvent): boolean;
    static clearMenus(event: BootstrapEvent): void;
    static dataApiKeydownHandler(this: HTMLElement, event: BootstrapEvent): void;
}
export default Menu;
export type { MenuConfig };
//# sourceMappingURL=menu.d.ts.map