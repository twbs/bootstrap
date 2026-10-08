/*!
* Bootstrap dialog.js v6.0.0-alpha.1 (https://getbootstrap.com/)
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
var Dialog = class Dialog extends DialogBase {
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
	static {
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
			Dialog._handleDataApiClick(this, event);
		});
	}
	static _handleDataApiClick(trigger, event) {
		const target = SelectorEngine.getElementFromSelector(trigger);
		if (!target) return;
		if (["A", "AREA"].includes(trigger.tagName)) event.preventDefault();
		const config = Manipulator.getDataAttributes(trigger);
		const currentDialog = trigger.closest("dialog[open]");
		if (!(currentDialog && currentDialog !== target)) {
			EventHandler.one(target, EVENT_SHOW, (showEvent) => {
				if (!showEvent.defaultPrevented) Dialog._registerFocusRestoration(target, trigger);
			});
			Dialog.getOrCreateInstance(target, config).toggle(trigger);
			return;
		}
		if (currentDialog.classList.contains(CLASS_NAME_SWAP_IN)) return;
		const newDialog = Dialog.getOrCreateInstance(target, config);
		const currentInstance = Dialog.getOrCreateInstance(currentDialog);
		if (!newDialog._canShow(trigger) || !currentInstance._canHide()) return;
		Dialog._registerFocusRestoration(target, trigger);
		target.classList.add(CLASS_NAME_SWAP_IN);
		EventHandler.one(target, `shown${EVENT_KEY}`, () => {
			target.classList.remove(CLASS_NAME_SWAP_IN);
		});
		newDialog._show(trigger);
		currentDialog.classList.add(CLASS_NAME_INSTANT);
		EventHandler.one(currentDialog, EVENT_HIDDEN, () => {
			currentDialog.classList.remove(CLASS_NAME_INSTANT);
		});
		currentInstance._hide();
	}
	static _registerFocusRestoration(target, trigger) {
		EventHandler.one(target, EVENT_HIDDEN, () => {
			if (isVisible(trigger)) trigger.focus({ preventScroll: true });
		});
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
enableDismissTrigger(Dialog);
//#endregion
export { Dialog as default };

//# sourceMappingURL=dialog.js.map