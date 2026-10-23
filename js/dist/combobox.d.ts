/**
 * --------------------------------------------------------------------------
 * Bootstrap combobox.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
import Menu from './menu.js';
import type { FloatingOffsetOption } from './util/floating-ui.js';
type ComboboxConfig = {
    boundary: string | Element;
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
    protected _menuInstance: Menu | null;
    constructor(element?: string | Element | null, config?: Partial<ComboboxConfig> | null);
    static get Default(): ComboboxConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    dispose(): void;
    protected _isShown(): boolean;
    protected _createHiddenInput(): void;
    protected _createMenuInstance(): void;
    protected _syncInitialSelection(): void;
    protected _addEventListeners(): void;
    protected _selectItem(item: HTMLElement): void;
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