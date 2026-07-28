/**
 * --------------------------------------------------------------------------
 * Bootstrap toggler.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
type TogglerConfig = {
    attribute: string;
    value: string | number | boolean;
};
/**
 * Class definition
 */
declare class Toggler extends BaseComponent {
    protected _config: TogglerConfig;
    static get Default(): TogglerConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): void;
    protected _execute(): void;
}
export default Toggler;
export type { TogglerConfig };
//# sourceMappingURL=toggler.d.ts.map