/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/selector-engine.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
declare const SelectorEngine: {
    find<T extends Element = HTMLElement>(selector: string, element?: ParentNode): T[];
    findOne<T extends Element = HTMLElement>(selector: string, element?: ParentNode): T | null;
    children<T extends Element = HTMLElement>(element: Element, selector: string): T[];
    parents(element: Element, selector: string): Element[];
    closest<T extends Element = HTMLElement>(element: Element, selector: string): T | null;
    prev(element: Element, selector: string): Element[];
    next(element: Element, selector: string): Element[];
    focusableChildren(element: Element): HTMLElement[];
    getSelectorFromElement(element: Element): string | null;
    getElementFromSelector(element: Element): HTMLElement | null;
    getMultipleElementsFromSelector(element: Element): HTMLElement[];
};
export default SelectorEngine;
//# sourceMappingURL=selector-engine.d.ts.map