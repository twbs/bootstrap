/**
 * --------------------------------------------------------------------------
 * Bootstrap base-component.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import Config, { type ComponentConfig } from './util/config.js';
/**
 * Class definition
 */
declare class BaseComponent extends Config {
    ['constructor']: typeof BaseComponent;
    protected _element: HTMLElement;
    protected _config: ComponentConfig;
    constructor(element?: string | Element | null, config?: ComponentConfig | null);
    dispose(): void;
    protected _queueCallback(callback: () => void, element: Element, isAnimated?: boolean): void;
    protected _getConfig(config?: ComponentConfig | null): ComponentConfig;
    static getInstance<T extends typeof BaseComponent>(this: T, element?: string | Element | null): InstanceType<T> | null;
    static getOrCreateInstance<T extends typeof BaseComponent>(this: T, element?: string | Element | null, config?: NonNullable<ConstructorParameters<T>[1]> | null): InstanceType<T>;
    static get VERSION(): string;
    static get DATA_KEY(): string;
    static get EVENT_KEY(): string;
    static eventName(name: string): string;
}
export default BaseComponent;
//# sourceMappingURL=base-component.d.ts.map