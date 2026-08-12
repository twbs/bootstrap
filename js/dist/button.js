/*!
* Bootstrap button.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
import { setAriaAttribute } from "./util/index.js";
//#region js/src/button.ts
/**
* --------------------------------------------------------------------------
* Bootstrap button.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME = "button";
const EVENT_KEY = `.bs.button`;
const DATA_API_KEY = ".data-api";
const CLASS_NAME_ACTIVE = "active";
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"button\"]";
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_DOM_CONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`;
/**
* Class definition
*/
var Button = class extends BaseComponent {
	static get NAME() {
		return NAME;
	}
	toggle() {
		setAriaAttribute(this._element, "aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE));
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, (event) => {
	event.preventDefault();
	const button = event.target.closest(SELECTOR_DATA_TOGGLE);
	Button.getOrCreateInstance(button).toggle();
});
EventHandler.on(document, EVENT_DOM_CONTENT_LOADED, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) if (!element.hasAttribute("aria-pressed")) setAriaAttribute(element, "aria-pressed", element.classList.contains(CLASS_NAME_ACTIVE));
});
//#endregion
export { Button as default };

//# sourceMappingURL=button.js.map