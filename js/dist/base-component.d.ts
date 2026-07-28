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
    _element: HTMLElement;
    _config: ComponentConfig;
    constructor(element?: string | Element | null, config?: ComponentConfig | null);
    dispose(): void;
    _queueCallback(callback: () => void, element: Element, isAnimated?: boolean): void;
    _getConfig(config?: ComponentConfig | null): ComponentConfig;
    static getInstance<T extends typeof BaseComponent>(this: T, element?: string | Element | null): InstanceType<T> | null;
    static getOrCreateInstance<T extends typeof BaseComponent>(this: T, element?: string | Element | null, config?: ComponentConfig | null): InstanceType<T>;
    static get VERSION(): string;
    static get DATA_KEY(): string;
    static get EVENT_KEY(): string;
    static eventName(name: string): string;
}
export default BaseComponent;
//# sourceMappingURL=base-component.d.ts.map