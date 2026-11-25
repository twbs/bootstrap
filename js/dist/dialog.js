/*!
* Bootstrap dialog.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import DialogBase from "./dialog-base.js";
import EventHandler from "./dom/event-handler.js";
import Manipulator from "./dom/manipulator.js";
import SelectorEngine from "./dom/selector-engine.js";
import { enableDismissTrigger } from "./util/component-functions.js";
import { isDisabled } from "./util/index.js";
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
		if (!(target instanceof HTMLDialogElement) || isDisabled(trigger)) return;
		if (["A", "AREA"].includes(trigger.tagName)) event.preventDefault();
		const config = Manipulator.getDataAttributes(trigger);
		const currentDialog = trigger.closest("dialog.dialog[open]");
		if (currentDialog === target) return;
		if (!(currentDialog && currentDialog !== target)) {
			Dialog.getOrCreateInstance(target, config).toggle(trigger);
			return;
		}
		if (currentDialog.classList.contains(CLASS_NAME_SWAP_IN)) return;
		const newDialog = Dialog.getOrCreateInstance(target, config);
		const currentInstance = Dialog.getOrCreateInstance(currentDialog);
		if (!newDialog._canShow(trigger) || !currentInstance._canHide()) return;
		const returnFocus = currentInstance._returnFocus;
		const wasInstant = currentDialog.classList.contains(CLASS_NAME_INSTANT);
		target.classList.add(CLASS_NAME_SWAP_IN);
		newDialog._show(trigger, returnFocus).finally(() => {
			target.classList.remove(CLASS_NAME_SWAP_IN);
		});
		if (target.open) {
			currentDialog.classList.add(CLASS_NAME_INSTANT);
			currentInstance._hide(false).finally(() => {
				if (!wasInstant) currentDialog.classList.remove(CLASS_NAME_INSTANT);
			});
		}
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