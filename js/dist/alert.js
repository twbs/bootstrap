/*!
* Bootstrap alert.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import { enableDismissTrigger } from "./util/component-functions.js";
import { getTransitionDurationFromElement } from "./util/index.js";
//#region js/src/alert.ts
/**
* --------------------------------------------------------------------------
* Bootstrap alert.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME = "alert";
const EVENT_KEY = `.bs.alert`;
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_CLOSED = `closed${EVENT_KEY}`;
const CLASS_NAME_HIDING = "hiding";
const CLASS_NAME_SHOW = "show";
/**
* Class definition
*/
var Alert = class extends BaseComponent {
	static get NAME() {
		return NAME;
	}
	async close() {
		if (EventHandler.trigger(this._element, EVENT_CLOSE).defaultPrevented) return;
		this._element.classList.remove(CLASS_NAME_SHOW);
		this._element.classList.add(CLASS_NAME_HIDING);
		const isAnimated = getTransitionDurationFromElement(this._element) > 0;
		await this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
	}
	_destroyElement() {
		this._element.remove();
		EventHandler.trigger(this._element, EVENT_CLOSED);
		this.dispose();
	}
};
/**
* Data API implementation
*/
enableDismissTrigger(Alert, "close");
//#endregion
export { Alert as default };

//# sourceMappingURL=alert.js.map