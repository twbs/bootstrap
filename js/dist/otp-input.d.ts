/**
 * --------------------------------------------------------------------------
 * Bootstrap otp-input.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
type OtpInputConfig = {
    groups: number[] | null;
    length: number | null;
    mask: boolean;
    separator: string;
    type: string;
};
/**
 * Class definition
 */
declare class OtpInput extends BaseComponent {
    protected _config: OtpInputConfig;
    protected _input: HTMLInputElement;
    protected _type: {
        inputmode: string;
        pattern: string;
        filter: RegExp;
    };
    protected _length: number;
    protected _slots: HTMLElement[];
    protected _pointerActive: boolean;
    protected _pointerIndex: number;
    protected _slotsContainer: HTMLElement;
    protected _onInput: () => void;
    protected _onBeforeInput: (event: BootstrapEvent) => void;
    protected _onFocus: () => void;
    protected _onPointerDown: (event: BootstrapEvent) => void;
    protected _onSync: () => void;
    protected _onSelectionChange: () => void;
    constructor(element?: string | Element | null, config?: Partial<OtpInputConfig> | null);
    static get Default(): OtpInputConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    getValue(): string;
    setValue(value: string | number): void;
    clear(): void;
    focus(): void;
    dispose(): void;
    protected _resolveLength(): number;
    protected _setupInput(): void;
    protected _renderSlots(): void;
    protected _addEventListeners(): void;
    protected _handleInput(): void;
    protected _handleBeforeInput(event: BootstrapEvent): void;
    protected _handlePointerDown(event: BootstrapEvent): void;
    protected _slotIndexFromPoint(x: number): number | null;
    protected _afterValueChange(): void;
    protected _firstEmptyIndex(): number;
    protected _selectSlot(index: number): void;
    protected _sanitize(value: string): string;
    protected _render(): void;
    protected _checkComplete(): void;
}
export default OtpInput;
export type { OtpInputConfig };
//# sourceMappingURL=otp-input.d.ts.map