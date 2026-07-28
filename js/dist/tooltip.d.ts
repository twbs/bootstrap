/**
 * --------------------------------------------------------------------------
 * Bootstrap tooltip.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import { type Middleware } from '@floating-ui/dom';
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
import type { ComponentConfig } from './util/config.js';
import { type SanitizerAllowList } from './util/sanitizer.js';
import TemplateFactory, { type TemplateContentEntry } from './util/template-factory.js';
import { type BreakpointListener, type ResponsivePlacements } from './util/floating-ui.js';
type TooltipConfig = {
    allowList: SanitizerAllowList;
    animation: boolean;
    boundary: string | Element;
    container: string | Element | boolean | null;
    customClass: string | ((...args: any[]) => string);
    delay: number | {
        show: number;
        hide: number;
    };
    fallbackPlacements: string[];
    html: boolean;
    offset: number[] | string | ((deps: Record<string, any>, element: HTMLElement) => number[]);
    placement: string | ((this: Tooltip, tip: HTMLElement, trigger: HTMLElement) => string);
    floatingConfig: Record<string, any> | ((defaultConfig: Record<string, any>) => Record<string, any>) | null;
    sanitize: boolean;
    sanitizeFn: ((unsafeHtml: string) => string) | null;
    selector: string | boolean;
    template: string;
    title: string | Element | ((...args: any[]) => string | Element);
    trigger: string;
};
/**
 * Class definition
 */
declare class Tooltip extends BaseComponent {
    _config: TooltipConfig;
    _isEnabled: boolean;
    _timeout: number;
    _isHovered: boolean | null;
    _activeTrigger: Record<string, boolean>;
    _floatingCleanup: (() => void) | null;
    _keydownHandler: ((event: KeyboardEvent) => void) | null;
    _templateFactory: TemplateFactory | null;
    _newContent: Record<string, TemplateContentEntry> | null;
    _mediaQueryListeners: BreakpointListener[];
    _responsivePlacements: ResponsivePlacements | null;
    _hideModalHandler: () => void;
    tip: HTMLElement | null;
    constructor(element?: string | Element | null, config?: Partial<TooltipConfig> | null);
    static get Default(): TooltipConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    enable(): void;
    disable(): void;
    toggleEnabled(): void;
    toggle(): void;
    dispose(): void;
    show(): Promise<void>;
    hide(): void;
    update(): void;
    _isWithContent(): boolean;
    _hasNewContent(): boolean;
    _getTipElement(): HTMLElement;
    _createTipElement(content: Record<string, TemplateContentEntry>): HTMLElement;
    setContent(content: Record<string, TemplateContentEntry>): void;
    _getTemplateFactory(content: Record<string, TemplateContentEntry>): TemplateFactory;
    _getContentForTemplate(): Record<string, TemplateContentEntry>;
    _getTitle(): string | Element | null;
    _initializeOnDelegatedTarget(event: BootstrapEvent): Tooltip;
    _isAnimated(): boolean | null;
    _isShown(): boolean | null;
    _getPlacement(tip: HTMLElement): string;
    _parseResponsivePlacements(): void;
    _setupMediaQueryListeners(): void;
    _disposeMediaQueryListeners(): void;
    _createFloating(tip: HTMLElement): Promise<void>;
    _updateFloatingPosition(tip?: HTMLElement | null, placement?: string | null, arrowElement?: HTMLElement | null): Promise<void>;
    _getOffset(): number[] | ((state: any) => any);
    _resolvePossibleFunction<T>(arg: T | ((...args: any[]) => T)): T;
    _getFloatingMiddleware(arrowElement: HTMLElement | null): Middleware[];
    _getFloatingConfig(placement: string, middleware: Middleware[]): Record<string, any>;
    _setListeners(): void;
    _setEscapeListener(): void;
    _removeEscapeListener(): void;
    _fixTitle(): void;
    _enter(): void;
    _leave(): void;
    _setTimeout(handler: () => void, timeout: number): void;
    _isWithActiveTrigger(): boolean;
    _getConfig(config?: ComponentConfig | null): ComponentConfig;
    _configAfterMerge(config: ComponentConfig): ComponentConfig;
    _getDelegateConfig(): ComponentConfig;
    _disposeFloating(): void;
}
export default Tooltip;
export type { TooltipConfig };
//# sourceMappingURL=tooltip.d.ts.map