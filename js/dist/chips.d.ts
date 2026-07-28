/**
 * --------------------------------------------------------------------------
 * Bootstrap chips.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
type ChipsConfig = {
    separator: string | null;
    allowDuplicates: boolean;
    maxChips: number | null;
    placeholder: string;
    dismissible: boolean;
    dismissIcon: string;
    createOnBlur: boolean;
};
/**
 * Class definition
 */
declare class Chips extends BaseComponent {
    protected _config: ChipsConfig;
    protected _input: HTMLInputElement;
    protected _chips: string[];
    protected _selectedChips: Set<HTMLElement>;
    protected _anchorChip: HTMLElement | null;
    constructor(element?: string | Element | null, config?: Partial<ChipsConfig> | null);
    static get Default(): ChipsConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    add(value: string): HTMLElement | null;
    remove(chipOrValue: string | HTMLElement): boolean;
    removeSelected(): void;
    getValues(): string[];
    getSelectedValues(): string[];
    clear(): void;
    clearSelection(): void;
    selectChip(chip: HTMLElement, options?: {
        addToSelection?: boolean;
        rangeSelect?: boolean;
    }): void;
    focus(): void;
    protected _getChipElements(): HTMLElement[];
    protected _createInput(): void;
    protected _initializeExistingChips(): void;
    protected _setupChip(chip: HTMLElement): void;
    protected _createChip(value: string): HTMLElement;
    protected _createDismissButton(): HTMLButtonElement;
    protected _findChipByValue(value: string): HTMLElement | undefined;
    protected _getChipValue(chip: HTMLElement): string;
    protected _addEventListeners(): void;
    protected _handleInputKeydown(event: BootstrapEvent): void;
    protected _handleChipKeydown(event: BootstrapEvent): void;
    protected _handleChipDelete(currentIndex: number, chips: HTMLElement[]): void;
    protected _navigateChip(chips: HTMLElement[], currentIndex: number, direction: number, shiftKey: boolean): void;
    protected _navigateToEdge(chips: HTMLElement[], targetIndex: number, shiftKey: boolean): void;
    protected _handleSelectAll(event: BootstrapEvent, chips: HTMLElement[]): void;
    protected _handleInput(event: BootstrapEvent): void;
    protected _handlePaste(event: BootstrapEvent): void;
    protected _createChipFromInput(): void;
}
export default Chips;
export type { ChipsConfig };
//# sourceMappingURL=chips.d.ts.map