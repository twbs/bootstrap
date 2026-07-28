/**
 * --------------------------------------------------------------------------
 * Bootstrap toast.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
type ToastConfig = {
    animation: boolean;
    autohide: boolean;
    delay: number;
};
/**
 * Class definition
 */
declare class Toast extends BaseComponent {
    _config: ToastConfig;
    _timeout: number | null;
    _hasMouseInteraction: boolean;
    _hasKeyboardInteraction: boolean;
    constructor(element?: string | Element | null, config?: Partial<ToastConfig> | null);
    static get Default(): ToastConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    show(): void;
    hide(): void;
    dispose(): void;
    isShown(): boolean;
    _maybeScheduleHide(): void;
    _onInteraction(event: BootstrapEvent, isInteracting: boolean): void;
    _setListeners(): void;
    _clearTimeout(): void;
}
export default Toast;
export type { ToastConfig };
//# sourceMappingURL=toast.d.ts.map