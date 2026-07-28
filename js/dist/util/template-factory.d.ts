/**
 * --------------------------------------------------------------------------
 * Bootstrap util/template-factory.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import Config, { type ComponentConfig } from './config.js';
import { type SanitizerAllowList } from './sanitizer.js';
type TemplateContentEntry = string | Element | ((...args: any[]) => string | Element | null) | null;
type TemplateFactoryConfig = {
    allowList: SanitizerAllowList;
    content: Record<string, TemplateContentEntry>;
    extraClass: string | ((...args: any[]) => string);
    html: boolean;
    sanitize: boolean;
    sanitizeFn: ((unsafeHtml: string) => string) | null;
    template: string;
};
/**
 * Class definition
 */
declare class TemplateFactory extends Config {
    protected _config: TemplateFactoryConfig;
    constructor(config?: Partial<TemplateFactoryConfig> | null);
    static get Default(): TemplateFactoryConfig;
    static get DefaultType(): ComponentConfig;
    static get NAME(): string;
    getContent(): Array<string | Element>;
    hasContent(): boolean;
    changeContent(content: Record<string, TemplateContentEntry>): this;
    toHtml(): HTMLElement;
    protected _typeCheckConfig(config: ComponentConfig): void;
    protected _checkContent(arg: Record<string, TemplateContentEntry>): void;
    protected _setContent(template: Element, content: TemplateContentEntry, selector: string): void;
    protected _maybeSanitize(arg: string): string;
    protected _resolvePossibleFunction<T>(arg: T | ((...args: any[]) => T)): T;
    protected _putElementInTemplate(element: Element, templateElement: Element): void;
}
export default TemplateFactory;
export type { TemplateFactoryConfig, TemplateContentEntry };
//# sourceMappingURL=template-factory.d.ts.map