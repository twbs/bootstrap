/**
 * --------------------------------------------------------------------------
 * Bootstrap tab.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
/**
 * Class definition
 */
declare class Tab extends BaseComponent {
    _parent: Element | null;
    constructor(element?: string | Element | null);
    static get NAME(): string;
    show(): void;
    _activate(element: HTMLElement | null, relatedElem?: HTMLElement | null): void;
    _deactivate(element: HTMLElement | null, relatedElem?: HTMLElement | null): void;
    _keydown(event: BootstrapEvent): void;
    _getChildren(): HTMLElement[];
    _getActiveElem(): HTMLElement | null;
    _setInitialAttributes(parent: Element, children: HTMLElement[]): void;
    _setInitialAttributesOnChild(child: HTMLElement): void;
    _setInitialAttributesOnTargetPanel(child: HTMLElement): void;
    _toggleMenu(element: HTMLElement, open: boolean): void;
    _setAttributeIfNotExists(element: Element, attribute: string, value: string): void;
    _elemIsActive(elem: HTMLElement): boolean;
    _getInnerElement(elem: HTMLElement): HTMLElement | null;
    _getOuterElement(elem: HTMLElement): Element;
}
export default Tab;
//# sourceMappingURL=tab.d.ts.map