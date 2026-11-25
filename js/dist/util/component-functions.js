/*!
* Bootstrap component-functions.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import EventHandler from "../dom/event-handler.js";
import SelectorEngine from "../dom/selector-engine.js";
import { isDisabled } from "./index.js";
//#region js/src/util/component-functions.ts
const enableDismissTrigger = (component, method = "hide") => {
	const clickEvent = `click.dismiss${component.EVENT_KEY}`;
	const name = component.NAME;
	const usesNativeDialog = name === "dialog" || name === "drawer";
	EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
		if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
		if (isDisabled(this)) return;
		const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}, [class*=":${name}"]`);
		if (!target || usesNativeDialog && !(target instanceof HTMLDialogElement)) return;
		component.getOrCreateInstance(target)[method]();
	});
};
const eventActionOnPlugin = (Plugin, onEvent, stringSelector, method, callback = null) => {
	eventAction(`${onEvent}.${Plugin.NAME}`, stringSelector, (data) => {
		const instances = data.targets.filter(Boolean).map((element) => Plugin.getOrCreateInstance(element));
		if (typeof callback === "function") callback({
			...data,
			instances
		});
		for (const instance of instances) instance[method]();
	});
};
const eventAction = (onEvent, stringSelector, callback) => {
	const selector = `${stringSelector}:not(.disabled):not(:disabled)`;
	EventHandler.on(document, onEvent, selector, function(event) {
		if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
		const selector = SelectorEngine.getSelectorFromElement(this);
		callback({
			targets: selector ? SelectorEngine.find(selector) : [this],
			event
		});
	});
};
const onDocumentReady = (eventName, callback) => {
	EventHandler.on(document, eventName, callback);
	if (document.readyState !== "loading") callback();
};
//#endregion
export { enableDismissTrigger, eventActionOnPlugin, onDocumentReady };

//# sourceMappingURL=component-functions.js.map