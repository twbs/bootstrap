/*!
* Bootstrap dialog-base.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import Data from "./dom/data.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
//#region js/src/dialog-base.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dialog-base.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const CLASS_NAME_OPEN = "dialog-open";
/**
* Class definition
*
* Shared base class for Dialog and Drawer components that use
* the native <dialog> element. Provides common behavior for:
* - Show/hide/toggle lifecycle with events
* - Opening/closing via showModal()/show()/close()
* - Escape key handling (modal and non-modal)
* - Backdrop click handling
* - Static backdrop transition ("bounce")
* - Body scroll prevention
* - Transition coordination
* - Child component cleanup (tooltips, popovers, toasts)
*/
var DialogBase = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._isTransitioning = false;
		this._openedAsModal = false;
		this._addDialogListeners();
	}
	static get NAME() {
		return "dialogbase";
	}
	toggle(relatedTarget) {
		return this._element.open ? this.hide() : this.show(relatedTarget);
	}
	async show(relatedTarget) {
		if (this._element.open || this._isTransitioning) return;
		if (EventHandler.trigger(this._element, this.constructor.eventName("show"), { relatedTarget }).defaultPrevented) return;
		this._isTransitioning = true;
		this._onBeforeShow();
		const { modal, preventBodyScroll } = this._getShowOptions();
		this._showElement({
			modal,
			preventBodyScroll
		});
		await this._queueCallback(() => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, this.constructor.eventName("shown"), { relatedTarget });
		}, this._element, this._isAnimated());
	}
	async hide() {
		if (!this._element.open || this._isTransitioning) return;
		if (EventHandler.trigger(this._element, this.constructor.eventName("hide")).defaultPrevented) return;
		this._isTransitioning = true;
		this._hideElement();
		await this._queueCallback(() => {
			if (this._element.open) this._closeAndCleanup();
			this._element.classList.remove("hiding");
			this._onAfterHide();
			this._isTransitioning = false;
			EventHandler.trigger(this._element, this.constructor.eventName("hidden"));
		}, this._element, this._isAnimated());
	}
	dispose() {
		if (this._element.open) this._closeAndCleanup();
		EventHandler.off(this._element, "cancel", this._cancelHandler);
		super.dispose();
	}
	_getShowOptions() {
		return {
			modal: true,
			preventBodyScroll: true
		};
	}
	_onBeforeShow() {}
	_onAfterHide() {}
	_isAnimated() {
		return !this._element.classList.contains(this._getInstantClassName());
	}
	_getInstantClassName() {
		return "dialog-instant";
	}
	_getStaticClassName() {
		return "dialog-static";
	}
	_onCancel() {}
	_showElement({ modal = true, preventBodyScroll = true } = {}) {
		this._openedAsModal = modal;
		if (modal) this._element.showModal();
		else this._element.show();
		if (preventBodyScroll) document.documentElement.classList.add(CLASS_NAME_OPEN);
	}
	_hideElement() {
		this._hideChildComponents();
		this._element.classList.add("hiding");
		if (!this._shouldDeferClose()) this._closeAndCleanup();
	}
	_closeAndCleanup() {
		this._element.close();
		this._openedAsModal = false;
		if (!document.querySelector("dialog[open]:modal")) document.documentElement.classList.remove(CLASS_NAME_OPEN);
	}
	_shouldDeferClose() {
		return false;
	}
	_triggerBackdropTransition() {
		if (EventHandler.trigger(this._element, this.constructor.eventName("hidePrevented")).defaultPrevented) return;
		const staticClass = this._getStaticClassName();
		this._element.classList.add(staticClass);
		this._queueCallback(() => {
			this._element.classList.remove(staticClass);
		}, this._element);
	}
	_hideChildComponents() {
		for (const el of SelectorEngine.find("[data-bs-toggle=\"tooltip\"], [data-bs-toggle=\"popover\"]", this._element)) {
			const instance = Data.getAny(el);
			if (instance && typeof instance.hide === "function") instance.hide();
		}
		for (const el of SelectorEngine.find(".toast.show", this._element)) {
			const instance = Data.getAny(el);
			if (instance && typeof instance.hide === "function") instance.hide();
		}
	}
	_addDialogListeners() {
		const eventKey = this.constructor.EVENT_KEY;
		this._cancelHandler = (event) => {
			event.preventDefault();
			if (!this._config.keyboard) {
				this._triggerBackdropTransition();
				return;
			}
			this._onCancel();
			this.hide();
		};
		EventHandler.on(this._element, "cancel", this._cancelHandler);
		EventHandler.on(this._element, `keydown${eventKey}`, (event) => {
			if (event.key !== "Escape" || this._openedAsModal) return;
			event.preventDefault();
			if (!this._config.keyboard) return;
			this._onCancel();
			this.hide();
		});
		EventHandler.on(this._element, `click${eventKey}`, (event) => {
			if (event.target !== this._element || !this._openedAsModal) return;
			if (this._config.backdrop === "static") {
				this._triggerBackdropTransition();
				return;
			}
			this.hide();
		});
	}
};
//#endregion
export { DialogBase as default };

//# sourceMappingURL=dialog-base.js.map