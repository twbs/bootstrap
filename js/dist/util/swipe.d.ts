/**
 * --------------------------------------------------------------------------
 * Bootstrap util/swipe.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import { type BootstrapEvent } from '../dom/event-handler.js';
import Config from './config.js';
type SwipeConfig = {
    endCallback: (() => void) | null;
    leftCallback: (() => void) | null;
    rightCallback: (() => void) | null;
    upCallback: (() => void) | null;
    downCallback: (() => void) | null;
};
/**
 * Class definition
 */
declare class Swipe extends Config {
    protected _element: HTMLElement;
    protected _config: SwipeConfig;
    protected _deltaX: number;
    protected _deltaY: number;
    protected _supportPointerEvents: boolean;
    constructor(element: HTMLElement | null, config?: Partial<SwipeConfig> | null);
    static get Default(): SwipeConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    dispose(): void;
    protected _start(event: BootstrapEvent): void;
    protected _end(event: BootstrapEvent): void;
    protected _move(event: BootstrapEvent): void;
    protected _handleSwipe(): void;
    protected _initEvents(): void;
    protected _eventIsPointerPenTouch(event: BootstrapEvent): boolean;
    static isSupported(): boolean;
}
export default Swipe;
export type { SwipeConfig };
//# sourceMappingURL=swipe.d.ts.map