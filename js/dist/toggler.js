/*!
* Bootstrap toggler.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import { eventActionOnPlugin } from "./util/component-functions.js";
//#region js/src/toggler.ts
/**
* --------------------------------------------------------------------------
* Bootstrap toggler.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME = "toggler";
const EVENT_KEY = `.bs.toggler`;
const EVENT_TOGGLE = `toggle${EVENT_KEY}`;
const EVENT_TOGGLED = `toggled${EVENT_KEY}`;
const EVENT_CLICK = "click";
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"toggler\"]";
const DefaultType = {
	attribute: "string",
	value: "(string|number|boolean)"
};
const Default = {
	attribute: "class",
	value: null
};
/**
* Class definition
*/
var Toggler = class extends BaseComponent {
	static get Default() {
		return Default;
	}
	static get DefaultType() {
		return DefaultType;
	}
	static get NAME() {
		return NAME;
	}
	toggle() {
		if (EventHandler.trigger(this._element, EVENT_TOGGLE).defaultPrevented) return;
		this._execute();
		EventHandler.trigger(this._element, EVENT_TOGGLED);
	}
	_execute() {
		const { attribute, value } = this._config;
		if (attribute === "id") return;
		if (attribute === "class") {
			this._element.classList.toggle(value);
			return;
		}
		if (this._element.getAttribute(attribute) === String(value)) {
			this._element.removeAttribute(attribute);
			return;
		}
		this._element.setAttribute(attribute, value);
	}
};
/**
* Data API implementation
*/
eventActionOnPlugin(Toggler, EVENT_CLICK, SELECTOR_DATA_TOGGLE, "toggle");
//#endregion
export { Toggler as default };

//# sourceMappingURL=toggler.js.map