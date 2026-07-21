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
    _config: DrawerConfig;
    _swipeHelper: Swipe | null;
    constructor(element?: string | Element | null, config?: Partial<DrawerConfig> | null);
    static get Default(): DrawerConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    dispose(): void;
    _getShowOptions(): {
        modal: boolean;
        preventBodyScroll: boolean;
    };
    _onBeforeShow(): void;
    _getInstantClassName(): string;
    _getStaticClassName(): string;
    _initSwipe(): void;
}
export default Drawer;
export type { DrawerConfig };
//# sourceMappingURL=drawer.d.ts.map