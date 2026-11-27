/*!
* Bootstrap hash-target.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import EventHandler from "../dom/event-handler.js";
//#region js/src/util/hash-target.ts
/**
* --------------------------------------------------------------------------
* Bootstrap util/hash-target.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const ATTR_HASH = "data-bs-hash";
/**
* Decode a URL fragment id, tolerating malformed escapes (returns it as-is).
*/
const decodeFragment = (value) => {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
};
/**
* Resolve the element named by `location.hash` when it opts in with `data-bs-hash`.
*/
const getHashTarget = () => {
	const { hash } = window.location;
	if (!hash || hash === "#") return null;
	const id = decodeFragment(hash.slice(1));
	if (!id) return null;
	const element = document.getElementById(id);
	if (!element?.hasAttribute("data-bs-hash")) return null;
	return element;
};
/**
* Open an opted-in hash target on `load` and `hashchange`.
* Put `data-bs-hash` on the collapse or tab pane that the URL fragment names.
*
* Scrolls a visible anchor first when one exists, then opens the target, then
* scrolls the target into view after it is shown.
*/
const enableHashTarget = (namespace, handler) => {
	let generation = 0;
	const onHash = () => {
		const current = ++generation;
		const element = getHashTarget();
		if (!element || !handler.matches(element)) return;
		const anchor = handler.getAnchor?.(element);
		if (anchor) anchor.scrollIntoView();
		handler.open(element, () => {
			if (current === generation && element.isConnected && getHashTarget() === element) element.scrollIntoView();
		});
	};
	EventHandler.on(window, `load${namespace}`, onHash);
	EventHandler.on(window, `hashchange${namespace}`, onHash);
	if (document.readyState === "complete") onHash();
};
//#endregion
export { ATTR_HASH, decodeFragment, enableHashTarget, getHashTarget };

//# sourceMappingURL=hash-target.js.map