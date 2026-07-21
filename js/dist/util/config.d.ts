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
    static get Default(): ComponentConfig;
    static get DefaultType(): ComponentConfig;
    static get NAME(): string;
    _getConfig(config?: ComponentConfig | null): ComponentConfig;
    _configAfterMerge(config: ComponentConfig): ComponentConfig;
    _mergeConfigObj(config?: ComponentConfig | null, element?: Element): ComponentConfig;
    _typeCheckConfig(config: ComponentConfig, configTypes?: ComponentConfig): void;
}
export default Config;
export type { ComponentConfig };
//# sourceMappingURL=config.d.ts.map