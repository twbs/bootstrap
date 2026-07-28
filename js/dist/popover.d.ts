/**
 * --------------------------------------------------------------------------
 * Bootstrap popover.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import Tooltip, { type TooltipConfig } from './tooltip.js';
import type { TemplateContentEntry } from './util/template-factory.js';
type PopoverConfig = TooltipConfig & {
    content: string | Element | ((...args: any[]) => string | Element) | null;
};
/**
 * Class definition
 */
declare class Popover extends Tooltip {
    protected _config: PopoverConfig;
    constructor(element?: string | Element | null, config?: Partial<PopoverConfig> | null);
    static get Default(): PopoverConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    protected _isWithContent(): boolean;
    protected _getContentForTemplate(): Record<string, TemplateContentEntry>;
    protected _getContent(): string | Element | null;
}
export default Popover;
export type { PopoverConfig };
//# sourceMappingURL=popover.d.ts.map