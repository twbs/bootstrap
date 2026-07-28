/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog-base.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
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
    _element: HTMLDialogElement;
    _config: DialogBaseConfig;
    _isTransitioning: boolean;
    _openedAsModal: boolean;
    constructor(element?: string | Element | null, config?: Partial<DialogBaseConfig> | null);
    static get NAME(): string;
    toggle(relatedTarget?: HTMLElement): void;
    show(relatedTarget?: HTMLElement): void;
    hide(): void;
    dispose(): void;
    _getShowOptions(): {
        modal: boolean;
        preventBodyScroll: boolean;
    };
    _onBeforeShow(): void;
    _onAfterHide(): void;
    _isAnimated(): boolean;
    _getInstantClassName(): string;
    _getStaticClassName(): string;
    _onCancel(): void;
    _showElement({ modal, preventBodyScroll }?: {
        modal?: boolean;
        preventBodyScroll?: boolean;
    }): void;
    _hideElement(): void;
    _closeAndCleanup(): void;
    _shouldDeferClose(): boolean;
    _triggerBackdropTransition(): void;
    _hideChildComponents(): void;
    _addDialogListeners(): void;
}
export default DialogBase;
export type { DialogBaseConfig };
//# sourceMappingURL=dialog-base.d.ts.map