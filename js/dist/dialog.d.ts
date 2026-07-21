/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import DialogBase, { type DialogBaseConfig } from './dialog-base.js';
type DialogConfig = DialogBaseConfig & {
    modal: boolean;
};
/**
 * Class definition
 */
declare class Dialog extends DialogBase {
    _config: DialogConfig;
    constructor(element?: string | Element | null, config?: Partial<DialogConfig> | null);
    static get Default(): DialogConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    handleUpdate(): void;
    _getShowOptions(): {
        modal: boolean;
        preventBodyScroll: boolean;
    };
    _onBeforeShow(): void;
    _onAfterHide(): void;
    _shouldDeferClose(): boolean;
    _onCancel(): void;
}
export default Dialog;
export type { DialogConfig };
//# sourceMappingURL=dialog.d.ts.map