/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/manipulator.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
declare const Manipulator: {
    setDataAttribute(element: Element, key: string, value: unknown): void;
    removeDataAttribute(element: Element, key: string): void;
    getDataAttributes(element: HTMLElement | null): Record<string, unknown>;
    getDataAttribute(element: Element, key: string): unknown;
};
export default Manipulator;
//# sourceMappingURL=manipulator.d.ts.map