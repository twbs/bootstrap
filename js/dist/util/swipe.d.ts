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
    _element: HTMLElement;
    _config: SwipeConfig;
    _deltaX: number;
    _deltaY: number;
    _supportPointerEvents: boolean;
    constructor(element: HTMLElement | null, config?: Partial<SwipeConfig> | null);
    static get Default(): SwipeConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    dispose(): void;
    _start(event: BootstrapEvent): void;
    _end(event: BootstrapEvent): void;
    _move(event: BootstrapEvent): void;
    _handleSwipe(): void;
    _initEvents(): void;
    _eventIsPointerPenTouch(event: BootstrapEvent): boolean;
    static isSupported(): boolean;
}
export default Swipe;
export type { SwipeConfig };
//# sourceMappingURL=swipe.d.ts.map