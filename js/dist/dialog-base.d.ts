/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog-base.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
type DialogBaseConfig = {
    backdrop: boolean | string;
    keyboard: boolean;
};
/**
 * Class definition
 *
 * Shared base class for Dialog and Drawer components that use
 * the native <dialog> element. Provides common behavior for:
 * - Show/hide/toggle lifecycle with events
 * - Opening/closing via showModal()/show()/close()
 * - Escape key handling (modal and non-modal)
 * - Backdrop click handling
 * - Static backdrop transition ("bounce")
 * - Body scroll prevention
 * - Transition coordination
 * - Child component cleanup (tooltips, popovers, toasts)
 */
declare class DialogBase extends BaseComponent {
    protected _element: HTMLDialogElement;
    protected _config: DialogBaseConfig;
    protected _isTransitioning: boolean;
    protected _openedAsModal: boolean;
    protected _cancelHandler: (event: BootstrapEvent) => void;
    constructor(element?: string | Element | null, config?: Partial<DialogBaseConfig> | null);
    static get NAME(): string;
    toggle(relatedTarget?: HTMLElement): void;
    show(relatedTarget?: HTMLElement): void;
    hide(): void;
    dispose(): void;
    protected _getShowOptions(): {
        modal: boolean;
        preventBodyScroll: boolean;
    };
    protected _onBeforeShow(): void;
    protected _onAfterHide(): void;
    protected _isAnimated(): boolean;
    protected _getInstantClassName(): string;
    protected _getStaticClassName(): string;
    protected _onCancel(): void;
    protected _showElement({ modal, preventBodyScroll }?: {
        modal?: boolean;
        preventBodyScroll?: boolean;
    }): void;
    protected _hideElement(): void;
    protected _closeAndCleanup(): void;
    protected _shouldDeferClose(): boolean;
    protected _triggerBackdropTransition(): void;
    protected _hideChildComponents(): void;
    protected _addDialogListeners(): void;
}
export default DialogBase;
export type { DialogBaseConfig };
//# sourceMappingURL=dialog-base.d.ts.map