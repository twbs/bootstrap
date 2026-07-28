/**
 * --------------------------------------------------------------------------
 * Bootstrap util/config.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Types
 */
type ComponentConfig = Record<string, any>;
/**
 * Class definition
 */
declare class Config {
    ['constructor']: typeof Config;
    static get Default(): ComponentConfig;
    static get DefaultType(): ComponentConfig;
    static get NAME(): string;
    protected _getConfig(config?: ComponentConfig | null): ComponentConfig;
    protected _configAfterMerge(config: ComponentConfig): ComponentConfig;
    protected _mergeConfigObj(config?: ComponentConfig | null, element?: Element): ComponentConfig;
    protected _typeCheckConfig(config: ComponentConfig, configTypes?: ComponentConfig): void;
}
export default Config;
export type { ComponentConfig };
//# sourceMappingURL=config.d.ts.map