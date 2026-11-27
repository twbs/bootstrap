/**
 * --------------------------------------------------------------------------
 * Bootstrap combobox.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
import Menu from './menu.js';
import type { ComponentConfig } from './util/config.js';
import type { FloatingOffsetOption } from './util/floating-ui.js';
declare class ComboboxMenu extends Menu {
    show(focus?: () => void): Promise<void>;
}
type ComboboxConfig = {
    allowCustom: boolean;
    createOnBlur: boolean;
    maxItems: number | null;
    separator: string | null;
    boundary: string | Element;
    input: string | HTMLInputElement | null;
    multiple: boolean;
    name: string | null;
    offset: FloatingOffsetOption;
    placeholder: string;
    placement: string;
    search: boolean;
    searchNormalize: boolean;
};
/**
 * Class definition
 */
declare class Combobox extends BaseComponent {
    protected _config: ComboboxConfig;
    protected _toggle: HTMLElement;
    protected _menu: HTMLElement;
    protected _valueDisplay: HTMLElement;
    protected _searchInput: HTMLInputElement | null;
    protected _noResults: HTMLElement | null;
    protected _hiddenInput: HTMLInputElement | null;
    protected _menuInstance: ComboboxMenu | null;
    protected _ownsInput: boolean;
    protected _inputDisabled: boolean;
    protected _extraInputs: HTMLInputElement[];
    protected _initialSelection: HTMLElement[];
    protected _form: HTMLFormElement | null;
    protected _formObserver: MutationObserver;
    protected _submitHandler: () => void;
    protected _resetTimeouts: Set<number>;
    protected _resetHandler: (event: BootstrapEvent) => void;
    protected _menuEventHandlers: Map<string, (event: BootstrapEvent) => void>;
    protected _changeId: number;
    protected _editor: HTMLInputElement | null;
    protected _activeItem: HTMLElement | null;
    protected _chips: Map<HTMLElement, HTMLElement>;
    protected _selectedChips: Set<HTMLElement>;
    protected _anchorChip: HTMLElement | null;
    protected _focusingChip: boolean;
    protected _composing: boolean;
    protected _query: string | null;
    protected _ownsMenu: boolean;
    protected _status: HTMLElement | null;
    protected _menuMinWidth: string;
    protected _attributes: Map<Element, Map<string, string | null>>;
    constructor(element?: string | Element | null, config?: Partial<ComboboxConfig> | null);
    static get Default(): ComboboxConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    update(): void;
    dispose(): void;
    getValues(): string[];
    add(value: string): HTMLElement | null;
    remove(value: string | HTMLElement): boolean;
    clear(): void;
    protected _clearSelection(query: string | null): void;
    focus(): void;
    getSelectedValues(): string[];
    selectChip(chip: HTMLElement, options?: {
        addToSelection?: boolean;
        rangeSelect?: boolean;
    }): void;
    clearSelection(): void;
    removeSelected(): boolean;
    protected _getChipElements(): HTMLElement[];
    protected _syncChipSelection(): void;
    protected _notifyChipSelection(): void;
    protected _focusChip(chip: HTMLElement, options?: {
        addToSelection?: boolean;
        rangeSelect?: boolean;
    }): void;
    protected _focusSelectedChip(chip: HTMLElement): void;
    protected _selectAllChips(): void;
    protected _removeItems(items: HTMLElement[], query?: string | null): boolean;
    protected _isDisabled(): boolean;
    protected _setAttribute(element: Element, name: string, value: string): void;
    protected _syncOptionRoles(): void;
    protected _setupEditor(): void;
    protected _getItemLabel(item: HTMLElement): string;
    protected _renderEditor(): void;
    protected _updateChipState(item: HTMLElement, chip: HTMLElement, label: string): void;
    protected _setActiveItem(item: HTMLElement | null): void;
    protected _addEditorListeners(): void;
    protected _handleEditorInput(openMenu?: boolean): void;
    protected _handleEditorKeydown(event: BootstrapEvent): void;
    protected _handleEditorChipFocus(event: BootstrapEvent): void;
    protected _handleChipKeydown(event: BootstrapEvent): void;
    protected _deleteChipSelection(chip: HTMLElement): void;
    protected _isShown(): boolean;
    protected _configAfterMerge(config: ComponentConfig): ComponentConfig;
    protected _createHiddenInput(): void;
    protected _removeExtraInputs(): void;
    protected _readInputDisabled(records: MutationRecord[]): void;
    protected _observeFormState(): void;
    protected _showMenu(focus?: () => void): Promise<void>;
    protected _createMenuInstance(): void;
    protected _addEventListeners(): void;
    protected _selectItem(item: HTMLElement): void;
    protected _selectionChanged(item: HTMLElement | null, query?: string | null): void;
    protected _updateToggleText(): void;
    protected _showPlaceholder(): void;
    protected _updateHiddenInput(): void;
    protected _getSelectedItems(): HTMLElement[];
    protected _getVisibleItems(): HTMLElement[];
    protected _filterItems(query: string): void;
    protected _normalizeText(text: string): string;
    protected _handleToggleKeydown(event: BootstrapEvent): void;
    protected _handleMenuKeydown(event: BootstrapEvent): void;
}
export default Combobox;
export type { ComboboxConfig };
//# sourceMappingURL=combobox.d.ts.map