/**
 * --------------------------------------------------------------------------
 * Bootstrap drawer.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import DialogBase, { type DialogBaseConfig } from './dialog-base.js';
import Swipe from './util/swipe.js';
type DrawerConfig = DialogBaseConfig & {
    scroll: boolean;
};
/**
 * Class definition
 */
declare class Drawer extends DialogBase {
    protected _config: DrawerConfig;
    protected _swipeHelper: Swipe | null;
    protected _resizeObserver: ResizeObserver | null;
    protected _resizeFrame: number | null;
    constructor(element?: string | Element | null, config?: Partial<DrawerConfig> | null);
    static get Default(): DrawerConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    protected static _toggleDrawer(target: HTMLDialogElement, trigger: HTMLElement): void;
    dispose(): void;
    protected _getShowOptions(): {
        modal: boolean;
        preventBodyScroll: boolean;
    };
    protected _onBeforeShow(): void;
    protected _canShow(relatedTarget?: HTMLElement): boolean;
    protected _show(relatedTarget?: HTMLElement, returnFocus?: HTMLElement | null | undefined): Promise<void>;
    protected _onAfterHide(): void;
    protected _isInline(): boolean;
    protected _getInstantClassName(): string;
    protected _getStaticClassName(): string;
    protected _shouldDeferClose(): boolean;
    protected _initResizeObserver(): void;
    protected _initSwipe(): void;
}
export default Drawer;
export type { DrawerConfig };
//# sourceMappingURL=drawer.d.ts.map