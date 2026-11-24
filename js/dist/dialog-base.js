/*!
* Bootstrap dialog-base.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import Data from "./dom/data.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
import { lockScroll, unlockScroll } from "./util/scroll-lock.js";
import { executeAfterTransition, isVisible } from "./util/index.js";
//#region js/src/dialog-base.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dialog-base.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
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
		this._opening = false;
		this._active = Boolean(this._element?.open);
		this._openedAsModal = Boolean(this._element?.matches(":modal"));
		this._operation = 0;
		this._returnFocus = null;
		this._closedBy = void 0;
		this._cancelTransition = null;
		this._addDialogListeners();
	}
	static get NAME() {
		return "dialogbase";
	}
	toggle(relatedTarget) {
		return this._element?.open ? this.hide() : this.show(relatedTarget);
	}
	async show(relatedTarget) {
		if (!this._canShow(relatedTarget)) return;
		await this._show(relatedTarget);
	}
	async hide() {
		if (!this._canHide()) return;
		await this._hide();
	}
	_canShow(relatedTarget) {
		if (this._active && this._element?.isConnected && !this._element.open) {
			unlockScroll(this._element);
			this._finishHide();
		}
		if (!this._element?.isConnected || this._element.open || this._isTransitioning) return false;
		return !EventHandler.trigger(this._element, this.constructor.eventName("show"), { relatedTarget }).defaultPrevented;
	}
	async _show(relatedTarget, returnFocus = relatedTarget) {
		if (!this._element?.isConnected || this._element.open || this._isTransitioning) return;
		const operation = ++this._operation;
		this._isTransitioning = true;
		this._opening = true;
		this._active = true;
		const previousFocus = this._element.ownerDocument.activeElement;
		this._returnFocus = returnFocus === void 0 && previousFocus instanceof HTMLElement ? previousFocus : returnFocus ?? null;
		this._onBeforeShow();
		const { modal, preventBodyScroll } = this._getShowOptions();
		this._showElement({
			modal,
			preventBodyScroll
		});
		if (!this._element || this._operation !== operation) return;
		if (!this._element.open) {
			this._clearOpenState();
			this._active = false;
			this._returnFocus = null;
			this._isTransitioning = false;
			this._opening = false;
			return;
		}
		await this._queueLifecycle(() => {
			if (this._operation !== operation || !this._element.open || !this._element.isConnected) return;
			this._isTransitioning = false;
			this._opening = false;
			EventHandler.trigger(this._element, this.constructor.eventName("shown"), { relatedTarget });
		}, this._isAnimated());
	}
	_canHide() {
		if (!this._element?.open || this._isTransitioning && !this._opening) return false;
		return !EventHandler.trigger(this._element, this.constructor.eventName("hide")).defaultPrevented;
	}
	async _hide(restoreFocus = true) {
		if (!this._element?.open || this._isTransitioning && !this._opening) return;
		const operation = ++this._operation;
		this._cancelTransition?.();
		this._isTransitioning = true;
		this._opening = false;
		if (!restoreFocus) this._returnFocus = null;
		this._hideElement();
		await this._queueLifecycle(() => {
			if (this._operation === operation) {
				this._closeAndCleanup();
				if (this._element && !this._element.open && this._operation === operation) this._finishHide();
			}
		}, this._shouldDeferClose());
	}
	dispose() {
		if (!this._element) return;
		this._cancelTransition?.();
		if (this._element.open) {
			this._hideChildComponents();
			this._closeAndCleanup();
		}
		if (!this._element) return;
		unlockScroll(this._element);
		this._clearOpenState();
		EventHandler.off(this._element, "cancel", this._cancelHandler);
		EventHandler.off(this._element, "close", this._closeHandler);
		EventHandler.off(this._element, "toggle", this._toggleHandler);
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
		this._closedBy = this._element.getAttribute("closedby");
		this._element.setAttribute("closedby", modal && this._config.keyboard ? "closerequest" : "none");
		this._element.classList.toggle("dialog-no-backdrop", !this._config.backdrop);
		if (modal) this._element.showModal();
		else this._element.show();
		if (preventBodyScroll && this._element?.open) {
			const element = this._element;
			lockScroll(element, () => {
				if (this._element === element && this._active && !element.isConnected) {
					this._hideChildComponents();
					this._closeAndCleanup();
					this._finishHide();
				}
			});
		}
	}
	_hideElement() {
		this._hideChildComponents();
		this._element.classList.add("hiding");
	}
	_closeAndCleanup() {
		const element = this._element;
		element.close();
		unlockScroll(element);
	}
	_clearOpenState() {
		this._openedAsModal = false;
		this._element.classList.remove("hiding", "dialog-no-backdrop", this._getStaticClassName());
		if (this._closedBy === null) this._element.removeAttribute("closedby");
		else if (this._closedBy !== void 0) this._element.setAttribute("closedby", this._closedBy);
		this._closedBy = void 0;
		this._onAfterHide();
	}
	_finishHide() {
		const element = this._element;
		const trigger = this._returnFocus;
		const { activeElement, body } = element.ownerDocument;
		const restoreFocus = activeElement === body || element.contains(activeElement);
		this._cancelTransition?.();
		this._clearOpenState();
		this._active = false;
		this._returnFocus = null;
		this._isTransitioning = false;
		this._opening = false;
		this._operation++;
		if (trigger && restoreFocus && isVisible(trigger)) trigger.focus({ preventScroll: true });
		EventHandler.trigger(element, this.constructor.eventName("hidden"));
	}
	_queueLifecycle(callback, animated) {
		if (!animated) {
			callback();
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			const cancel = executeAfterTransition(() => {
				this._cancelTransition = null;
				callback();
				resolve();
			}, this._element);
			this._cancelTransition = () => {
				cancel?.();
				this._cancelTransition = null;
				resolve();
			};
		});
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
		for (const el of SelectorEngine.find("[data-bs-toggle=\"tooltip\"], [data-bs-toggle=\"popover\"], [data-bs-toggle=\"datepicker\"]", this._element)) {
			const instance = Data.get(el, `bs.${el.getAttribute("data-bs-toggle")}`);
			if (instance && typeof instance.hide === "function") instance.hide();
		}
		for (const el of SelectorEngine.find(".toast.show", this._element)) {
			const instance = Data.get(el, "bs.toast");
			if (instance && typeof instance.hide === "function") instance.hide();
		}
	}
	_addDialogListeners() {
		if (!this._element) return;
		const eventKey = this.constructor.EVENT_KEY;
		this._closeHandler = () => {
			if (!this._element.open) {
				unlockScroll(this._element);
				if (this._active) {
					this._hideChildComponents();
					this._finishHide();
				}
			}
		};
		EventHandler.on(this._element, "close", this._closeHandler);
		this._toggleHandler = () => {
			if (this._element.open && !this._active) {
				this._active = true;
				this._openedAsModal = this._element.matches(":modal");
			}
		};
		EventHandler.on(this._element, "toggle", this._toggleHandler);
		this._cancelHandler = (event) => {
			if (event.target !== this._element) return;
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
			if (event.key !== "Escape" || event.defaultPrevented || !this._element.open || event.target.closest("dialog") !== this._element) return;
			if (this._openedAsModal && this._config.keyboard) return;
			event.preventDefault();
			if (!this._config.keyboard) {
				if (this._openedAsModal) this._triggerBackdropTransition();
				return;
			}
			this._onCancel();
			this.hide();
		});
		const isOutside = (event) => {
			const { left, right, top, bottom } = this._element.getBoundingClientRect();
			return event.clientX < left || event.clientX >= right || event.clientY < top || event.clientY >= bottom;
		};
		let backdropPress = false;
		EventHandler.on(this._element, `pointerdown${eventKey}`, (event) => {
			backdropPress = event.button === 0 && event.target === this._element && isOutside(event);
		});
		EventHandler.on(this._element, `pointercancel${eventKey}`, () => {
			backdropPress = false;
		});
		EventHandler.on(this._element, `click${eventKey}`, (event) => {
			const startedOutside = backdropPress;
			backdropPress = false;
			if (!startedOutside || !event.detail || event.target !== this._element || !this._openedAsModal || !isOutside(event)) return;
			if (this._config.backdrop === false) return;
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