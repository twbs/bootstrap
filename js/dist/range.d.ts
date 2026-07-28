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
    protected _config: RangeConfig;
    protected _input: HTMLInputElement | null;
    protected _bubble: HTMLElement | null;
    protected _bubbleText: HTMLElement | null;
    protected _ticks: HTMLElement | null;
    protected _updateHandler: () => void;
    constructor(element?: string | Element | null, config?: Partial<RangeConfig> | null);
    static get Default(): RangeConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    update(): void;
    dispose(): void;
    protected _configAfterMerge(config: ComponentConfig): ComponentConfig;
    protected _addEventListeners(): void;
    protected _min(): number;
    protected _max(): number;
    protected _value(): number;
    protected _ratio(): number;
    protected _update(): void;
    protected _format(value: number): string;
    protected _createBubble(): void;
    protected _createTicks(): void;
}
export default Range;
export type { RangeConfig };
//# sourceMappingURL=range.d.ts.map