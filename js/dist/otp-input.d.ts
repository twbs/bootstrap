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
    _config: OtpInputConfig;
    _input: HTMLInputElement;
    _type: {
        inputmode: string;
        pattern: string;
        filter: RegExp;
    };
    _length: number;
    _slots: HTMLElement[];
    _pointerActive: boolean;
    _pointerIndex: number;
    _slotsContainer: HTMLElement;
    _onInput: () => void;
    _onBeforeInput: (event: BootstrapEvent) => void;
    _onFocus: () => void;
    _onPointerDown: (event: BootstrapEvent) => void;
    _onSync: () => void;
    _onSelectionChange: () => void;
    constructor(element?: string | Element | null, config?: Partial<OtpInputConfig> | null);
    static get Default(): OtpInputConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    getValue(): string;
    setValue(value: string | number): void;
    clear(): void;
    focus(): void;
    dispose(): void;
    _resolveLength(): number;
    _setupInput(): void;
    _renderSlots(): void;
    _addEventListeners(): void;
    _handleInput(): void;
    _handleBeforeInput(event: BootstrapEvent): void;
    _handlePointerDown(event: BootstrapEvent): void;
    _slotIndexFromPoint(x: number): number | null;
    _afterValueChange(): void;
    _firstEmptyIndex(): number;
    _selectSlot(index: number): void;
    _sanitize(value: string): string;
    _render(): void;
    _checkComplete(): void;
}
export default OtpInput;
export type { OtpInputConfig };
//# sourceMappingURL=otp-input.d.ts.map