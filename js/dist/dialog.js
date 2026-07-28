/*!
* Bootstrap dialog.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import DialogBase from "./dialog-base.js";
import EventHandler from "./dom/event-handler.js";
import Manipulator from "./dom/manipulator.js";
import SelectorEngine from "./dom/selector-engine.js";
import { enableDismissTrigger } from "./util/component-functions.js";
import { isVisible } from "./util/index.js";
//#region js/src/dialog.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dialog.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME = "dialog";
const EVENT_KEY = `.bs.dialog`;
const DATA_API_KEY = ".data-api";
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_CANCEL = `cancel${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_NONMODAL = "dialog-nonmodal";
const CLASS_NAME_INSTANT = "dialog-instant";
const CLASS_NAME_SWAP_IN = "dialog-swap-in";
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"dialog\"]";
const Default = {
	backdrop: true,
	keyboard: true,
	modal: true
};
const DefaultType = {
	backdrop: "(boolean|string)",
	keyboard: "boolean",
	modal: "boolean"
};
/**
* Class definition
*/
var Dialog = class extends DialogBase {
	constructor(element, config) {
		super(element, config);
	}
	static get Default() {
		return Default;
	}
	static get DefaultType() {
		return DefaultType;
	}
	static get NAME() {
		return NAME;
	}
	handleUpdate() {}
	_getShowOptions() {
		return {
			modal: this._config.modal,
			preventBodyScroll: this._config.modal
		};
	}
	_onBeforeShow() {
		if (!this._config.modal) this._element.classList.add(CLASS_NAME_NONMODAL);
	}
	_onAfterHide() {
		this._element.classList.remove(CLASS_NAME_NONMODAL);
	}
	_shouldDeferClose() {
		return this._isAnimated();
	}
	_onCancel() {
		EventHandler.trigger(this._element, EVENT_CANCEL);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
	EventHandler.one(target, EVENT_SHOW, (showEvent) => {
		if (showEvent.defaultPrevented) return;
		EventHandler.one(target, EVENT_HIDDEN, () => {
			if (isVisible(this)) this.focus({ preventScroll: true });
		});
	});
	const config = Manipulator.getDataAttributes(this);
	const currentDialog = this.closest("dialog[open]");
	if (currentDialog && currentDialog !== target) {
		const newDialog = Dialog.getOrCreateInstance(target, config);
		target.classList.add(CLASS_NAME_SWAP_IN);
		newDialog.show(this);
		EventHandler.one(target, `shown${EVENT_KEY}`, () => {
			target.classList.remove(CLASS_NAME_SWAP_IN);
		});
		const currentInstance = Dialog.getInstance(currentDialog);
		if (currentInstance) {
			currentDialog.classList.add(CLASS_NAME_INSTANT);
			EventHandler.one(currentDialog, EVENT_HIDDEN, () => {
				currentDialog.classList.remove(CLASS_NAME_INSTANT);
			});
			currentInstance.hide();
		}
		return;
	}
	Dialog.getOrCreateInstance(target, config).toggle(this);
});
enableDismissTrigger(Dialog);
//#endregion
export { Dialog as default };

//# sourceMappingURL=dialog.js.map