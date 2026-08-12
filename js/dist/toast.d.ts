/**
 * --------------------------------------------------------------------------
 * Bootstrap toast.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
type ToastConfig = {
    autohide: boolean;
    delay: number;
};
/**
 * Class definition
 */
declare class Toast extends BaseComponent {
    protected _config: ToastConfig;
    protected _timeout: number | null;
    protected _hasMouseInteraction: boolean;
    protected _hasKeyboardInteraction: boolean;
    constructor(element?: string | Element | null, config?: Partial<ToastConfig> | null);
    static get Default(): ToastConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    show(): Promise<void>;
    hide(): Promise<void>;
    dispose(): void;
    isShown(): boolean;
    protected _isAnimated(): boolean;
    protected _maybeScheduleHide(): void;
    protected _onInteraction(event: BootstrapEvent, isInteracting: boolean): void;
    protected _setListeners(): void;
    protected _clearTimeout(): void;
}
export default Toast;
export type { ToastConfig };
//# sourceMappingURL=toast.d.ts.map