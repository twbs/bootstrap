/**
 * --------------------------------------------------------------------------
 * Bootstrap collapse.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import type { ComponentConfig } from './util/config.js';
type CollapseConfig = {
    parent: string | Element | null;
    toggle: boolean;
};
/**
 * Class definition
 */
declare class Collapse extends BaseComponent {
    protected _config: CollapseConfig;
    protected _isTransitioning: boolean;
    protected _triggerArray: HTMLElement[];
    constructor(element?: string | Element | null, config?: Partial<CollapseConfig> | null);
    static get Default(): CollapseConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): void;
    show(): void;
    hide(): void;
    protected _isShown(element?: HTMLElement): boolean;
    protected _configAfterMerge(config: ComponentConfig): ComponentConfig;
    protected _getDimension(): 'width' | 'height';
    protected _initializeChildren(): void;
    protected _getFirstLevelChildren(selector: string): HTMLElement[];
    protected _addAriaAndCollapsedClass(triggerArray: HTMLElement[], isOpen: boolean): void;
}
export default Collapse;
export type { CollapseConfig };
//# sourceMappingURL=collapse.d.ts.map