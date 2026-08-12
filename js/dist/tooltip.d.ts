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
import { type BreakpointListener, type ResponsivePlacements, type FloatingOffsetOption, type FloatingConfigOption } from './util/floating-ui.js';
type TooltipConfig = {
    allowList: SanitizerAllowList;
    animation: boolean;
    boundary: string | Element;
    container: string | Element | boolean;
    customClass: string | ((...args: any[]) => string);
    delay: number | {
        show: number;
        hide: number;
    };
    fallbackPlacements: string[];
    html: boolean;
    offset: FloatingOffsetOption;
    placement: string | ((this: Tooltip, tip: HTMLElement, trigger: HTMLElement) => string);
    floatingConfig: FloatingConfigOption;
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
    ['constructor']: typeof Tooltip;
    protected _config: TooltipConfig;
    protected _isEnabled: boolean;
    protected _timeout: number;
    protected _resolveTimeout: (() => void) | null;
    protected _isHovered: boolean | null;
    protected _activeTrigger: Record<string, boolean>;
    protected _floatingCleanup: (() => void) | null;
    protected _keydownHandler: ((event: KeyboardEvent) => void) | null;
    protected _templateFactory: TemplateFactory | null;
    protected _newContent: Record<string, TemplateContentEntry> | null;
    protected _mediaQueryListeners: BreakpointListener[];
    protected _responsivePlacements: ResponsivePlacements | null;
    protected _hideModalHandler: () => void;
    tip: HTMLElement | null;
    constructor(element?: string | Element | null, config?: Partial<TooltipConfig> | null);
    static get Default(): TooltipConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    enable(): void;
    disable(): void;
    toggleEnabled(): void;
    toggle(): Promise<void>;
    dispose(): void;
    show(): Promise<void>;
    hide(): Promise<void>;
    update(): void;
    protected _isWithContent(): boolean;
    protected _hasNewContent(): boolean;
    protected _getTipElement(): HTMLElement;
    protected _createTipElement(content: Record<string, TemplateContentEntry>): HTMLElement;
    setContent(content: Record<string, TemplateContentEntry>): void;
    protected _getTemplateFactory(content: Record<string, TemplateContentEntry>): TemplateFactory;
    protected _getContentForTemplate(): Record<string, TemplateContentEntry>;
    protected _getTitle(): string | Element | null;
    protected _initializeOnDelegatedTarget(event: BootstrapEvent): Tooltip;
    protected _getInstantClassName(): string;
    protected _isAnimated(): boolean;
    protected _isShown(): boolean | null;
    protected _getPlacement(tip: HTMLElement): string;
    protected _parseResponsivePlacements(): void;
    protected _setupMediaQueryListeners(): void;
    protected _disposeMediaQueryListeners(): void;
    protected _createFloating(tip: HTMLElement): Promise<void>;
    protected _updateFloatingPosition(tip?: HTMLElement | null, placement?: string | null, arrowElement?: HTMLElement | null): Promise<void>;
    protected _getOffset(): number[] | ((state: any) => any);
    protected _resolvePossibleFunction<T>(arg: T | ((...args: any[]) => T)): T;
    protected _getFloatingMiddleware(arrowElement: HTMLElement | null): Middleware[];
    protected _getFloatingConfig(placement: string, middleware: Middleware[]): Record<string, any>;
    protected _setListeners(): void;
    protected _setEscapeListener(): void;
    protected _removeEscapeListener(): void;
    protected _fixTitle(): void;
    protected _enter(): Promise<void>;
    protected _leave(): Promise<void>;
    protected _setTimeout(handler: () => void | Promise<void>, timeout: number): Promise<void>;
    protected _clearTimeout(): void;
    protected _isWithActiveTrigger(): boolean;
    protected _getConfig(config?: ComponentConfig | null): ComponentConfig;
    protected _configAfterMerge(config: ComponentConfig): ComponentConfig;
    protected _getDelegateConfig(): ComponentConfig;
    protected _disposeFloating(): void;
}
export default Tooltip;
export type { TooltipConfig };
//# sourceMappingURL=tooltip.d.ts.map