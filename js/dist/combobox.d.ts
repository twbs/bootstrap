/**
 * --------------------------------------------------------------------------
 * Bootstrap combobox.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
import Menu from './menu.js';
type ComboboxConfig = {
    boundary: string | Element;
    multiple: boolean;
    name: string | null;
    offset: number[] | string | ((data: Record<string, any>, element: HTMLElement) => any);
    placeholder: string;
    placement: string;
    search: boolean;
    searchNormalize: boolean;
};
/**
 * Class definition
 */
declare class Combobox extends BaseComponent {
    _config: ComboboxConfig;
    _toggle: HTMLElement;
    _menu: HTMLElement;
    _valueDisplay: HTMLElement;
    _searchInput: HTMLInputElement | null;
    _noResults: HTMLElement | null;
    _hiddenInput: HTMLInputElement | null;
    _menuInstance: Menu | null;
    constructor(element?: string | Element | null, config?: Partial<ComboboxConfig> | null);
    static get Default(): ComboboxConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
    _isShown(): boolean;
    _createHiddenInput(): void;
    _createMenuInstance(): void;
    _syncInitialSelection(): void;
    _addEventListeners(): void;
    _selectItem(item: HTMLElement): void;
    _updateToggleText(): void;
    _showPlaceholder(): void;
    _updateHiddenInput(): void;
    _getSelectedItems(): HTMLElement[];
    _getVisibleItems(): HTMLElement[];
    _filterItems(query: string): void;
    _normalizeText(text: string): string;
    _handleToggleKeydown(event: BootstrapEvent): void;
    _handleMenuKeydown(event: BootstrapEvent): void;
    static jQueryInterface(this: any, config: any): any;
}
export default Combobox;
export type { ComboboxConfig };
//# sourceMappingURL=combobox.d.ts.map