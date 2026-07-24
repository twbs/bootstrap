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
    _config: ChipsConfig;
    _input: HTMLInputElement;
    _chips: string[];
    _selectedChips: Set<HTMLElement>;
    _anchorChip: HTMLElement | null;
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
    _getChipElements(): HTMLElement[];
    _createInput(): void;
    _initializeExistingChips(): void;
    _setupChip(chip: HTMLElement): void;
    _createChip(value: string): HTMLElement;
    _createDismissButton(): HTMLButtonElement;
    _findChipByValue(value: string): HTMLElement | undefined;
    _getChipValue(chip: HTMLElement): string;
    _addEventListeners(): void;
    _handleInputKeydown(event: BootstrapEvent): void;
    _handleChipKeydown(event: BootstrapEvent): void;
    _handleChipDelete(currentIndex: number, chips: HTMLElement[]): void;
    _navigateChip(chips: HTMLElement[], currentIndex: number, direction: number, shiftKey: boolean): void;
    _navigateToEdge(chips: HTMLElement[], targetIndex: number, shiftKey: boolean): void;
    _handleSelectAll(event: BootstrapEvent, chips: HTMLElement[]): void;
    _handleInput(event: BootstrapEvent): void;
    _handlePaste(event: BootstrapEvent): void;
    _createChipFromInput(): void;
}
export default Chips;
export type { ChipsConfig };
//# sourceMappingURL=chips.d.ts.map