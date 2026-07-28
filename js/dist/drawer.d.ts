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
    constructor(element?: string | Element | null, config?: Partial<DrawerConfig> | null);
    static get Default(): DrawerConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    dispose(): void;
    protected _getShowOptions(): {
        modal: boolean;
        preventBodyScroll: boolean;
    };
    protected _onBeforeShow(): void;
    protected _getInstantClassName(): string;
    protected _getStaticClassName(): string;
    protected _initSwipe(): void;
}
export default Drawer;
export type { DrawerConfig };
//# sourceMappingURL=drawer.d.ts.map