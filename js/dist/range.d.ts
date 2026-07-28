/**
 * --------------------------------------------------------------------------
 * Bootstrap range.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import type { ComponentConfig } from './util/config.js';
type RangeConfig = {
    bubble: boolean | null;
    formatter: ((value: number) => string) | null;
};
/**
 * Class definition
 */
declare class Range extends BaseComponent {
    _config: RangeConfig;
    _input: HTMLInputElement | null;
    _bubble: HTMLElement | null;
    _bubbleText: HTMLElement | null;
    _ticks: HTMLElement | null;
    _updateHandler: () => void;
    constructor(element?: string | Element | null, config?: Partial<RangeConfig> | null);
    static get Default(): RangeConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    update(): void;
    dispose(): void;
    _configAfterMerge(config: ComponentConfig): ComponentConfig;
    _addEventListeners(): void;
    _min(): number;
    _max(): number;
    _value(): number;
    _ratio(): number;
    _update(): void;
    _format(value: number): string;
    _createBubble(): void;
    _createTicks(): void;
}
export default Range;
export type { RangeConfig };
//# sourceMappingURL=range.d.ts.map