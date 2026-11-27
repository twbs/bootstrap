/*!
* Bootstrap scroll-lock.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import SelectorEngine from "../dom/selector-engine.js";
//#region js/src/util/scroll-lock.ts
/**
* --------------------------------------------------------------------------
* Bootstrap util/scroll-lock.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
const CLASS_NAME_OPEN = "dialog-open";
const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed";
const owners = /* @__PURE__ */ new Map();
let restore = null;
let observer = null;
const getStyleChange = (element, property, offset) => {
	const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0;
	return {
		element,
		property,
		value: element.style.getPropertyValue(property),
		priority: element.style.getPropertyPriority(property),
		adjustedValue: `${value + offset}px`
	};
};
const releaseUnusedLock = () => {
	for (const [owner, onDetach] of owners) if (!owner.isConnected) {
		owners.delete(owner);
		if (onDetach) queueMicrotask(onDetach);
	} else if (!owner.open) owners.delete(owner);
	if (owners.size === 0 && restore) {
		observer?.disconnect();
		observer = null;
		restore();
		restore = null;
	}
};
const lockScroll = (owner, onDetach) => {
	releaseUnusedLock();
	if (owners.has(owner)) return;
	owners.set(owner, onDetach);
	if (owners.size > 1) return;
	const root = document.documentElement;
	const alreadyLocked = root.classList.contains(CLASS_NAME_OPEN);
	const initialWidth = root.offsetWidth;
	const viewportWidth = root.clientWidth;
	const initialLeft = root.getBoundingClientRect().left + root.clientLeft + window.scrollX;
	const changes = [];
	const fixed = SelectorEngine.find(SELECTOR_FIXED_CONTENT).filter((element) => !element.closest("dialog") && getComputedStyle(element).position === "fixed" && element.clientWidth >= viewportWidth).map((element) => ({
		element,
		width: element.offsetWidth
	}));
	root.classList.add(CLASS_NAME_OPEN);
	const width = Math.max(0, root.offsetWidth - initialWidth);
	const side = initialLeft > root.getBoundingClientRect().left + root.clientLeft + window.scrollX ? "left" : "right";
	const fixedChanges = fixed.map((item) => ({
		element: item.element,
		width: Math.max(0, item.element.offsetWidth - item.width)
	}));
	if (width > 0) changes.push(getStyleChange(root, `padding-${side}`, width));
	for (const item of fixedChanges) if (item.width > 0) changes.push(getStyleChange(item.element, `margin-${side}`, item.width));
	for (const { element, property, adjustedValue } of changes) element.style.setProperty(property, adjustedValue, "important");
	restore = () => {
		for (const { element, property, value, priority } of changes) if (value) element.style.setProperty(property, value, priority);
		else element.style.removeProperty(property);
		if (!alreadyLocked) root.classList.remove(CLASS_NAME_OPEN);
	};
	observer = new MutationObserver(releaseUnusedLock);
	observer.observe(root, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["open"]
	});
};
const unlockScroll = (owner) => {
	owners.delete(owner);
	releaseUnusedLock();
};
//#endregion
export { lockScroll, unlockScroll };

//# sourceMappingURL=scroll-lock.js.map