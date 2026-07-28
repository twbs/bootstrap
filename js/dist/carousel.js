/*!
* Bootstrap carousel.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import Manipulator from "./dom/manipulator.js";
import SelectorEngine from "./dom/selector-engine.js";
import { isRTL, isVisible } from "./util/index.js";
//#region js/src/carousel.ts
/**
* --------------------------------------------------------------------------
* Bootstrap carousel.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME = "carousel";
const EVENT_KEY = `.bs.carousel`;
const DATA_API_KEY = ".data-api";
const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";
const EVENT_SLIDE = `slide${EVENT_KEY}`;
const EVENT_SLID = `slid${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_CAROUSEL = "carousel";
const CLASS_NAME_ACTIVE = "active";
const CLASS_NAME_FADE = "carousel-fade";
const CLASS_NAME_CENTER = "carousel-center";
const CLASS_NAME_AUTO = "carousel-auto";
const CLASS_NAME_CLONE = "carousel-item-clone";
const CLASS_NAME_PAUSED = "paused";
const CLASS_NAME_PLAYING = "carousel-playing";
const PROPERTY_INTERVAL = "--bs-carousel-interval";
const SCROLL_DURATION = 300;
const ACTIVE_RATIO_TOLERANCE = .05;
const SELECTOR_ACTIVE = ".active";
const SELECTOR_ITEM = `.carousel-item:not(.${CLASS_NAME_CLONE})`;
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_INNER = ".carousel-inner";
const SELECTOR_INDICATORS = ".carousel-indicators";
const SELECTOR_PLAY_PAUSE = ".carousel-control-play-pause";
const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
const SELECTOR_DATA_SLIDE_PREV = "[data-bs-slide=\"prev\"]";
const SELECTOR_DATA_SLIDE_NEXT = "[data-bs-slide=\"next\"]";
const SELECTOR_DATA_AUTOPLAY = "[data-bs-autoplay=\"true\"]";
const KEY_TO_DIRECTION = {
	[ARROW_LEFT_KEY]: DIRECTION_RIGHT,
	[ARROW_RIGHT_KEY]: DIRECTION_LEFT
};
const ENDS_STOP = "stop";
const ENDS_WRAP = "wrap";
const ENDS_LOOP = "loop";
const Default = {
	autoplay: false,
	ends: ENDS_LOOP,
	interval: 5e3,
	keyboard: true,
	pause: "hover"
};
const DefaultType = {
	autoplay: "boolean",
	ends: "string",
	interval: "number",
	keyboard: "boolean",
	pause: "(string|boolean)"
};
const easeInOutCubic = (progress) => progress < .5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;
/**
* Class definition
*/
var Carousel = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._viewport = SelectorEngine.findOne(SELECTOR_INNER, this._element) || this._element;
		this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
		this._playPauseElement = SelectorEngine.findOne(SELECTOR_PLAY_PAUSE, this._element);
		this._prevControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_PREV, this._element);
		this._nextControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_NEXT, this._element);
		this._interval = null;
		this._observer = null;
		this._scrollFrame = null;
		this._looping = false;
		this._visibility = /* @__PURE__ */ new Map();
		this._playing = this._config.autoplay;
		this._activeIndex = this._initialActiveIndex();
		this._addEventListeners();
		this._observeItems();
		this._refreshActiveState();
		if (this._playing) this.cycle();
		this._updatePlayPauseControl();
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
	next() {
		this.to(this._navIndex() + 1);
	}
	nextWhenVisible() {
		if (document.visibilityState === "visible" && isVisible(this._element)) this.next();
	}
	prev() {
		this.to(this._navIndex() - 1);
	}
	pause() {
		this._clearInterval();
		this._element.classList.remove(CLASS_NAME_PLAYING);
	}
	cycle() {
		this._clearInterval();
		this._scheduleAutoplay();
		this._element.classList.add(CLASS_NAME_PLAYING);
	}
	to(index) {
		if (this._looping) return;
		const items = this._getItems();
		const rawIndex = Number.parseInt(index, 10);
		if (this._config.ends === ENDS_LOOP && !this._prefersReducedMotion() && this._canLoop()) {
			if (rawIndex > items.length - 1) {
				this._loopTransition(true);
				return;
			}
			if (rawIndex < 0) {
				this._loopTransition(false);
				return;
			}
		}
		const targetIndex = this._normalizeIndex(rawIndex, items.length);
		const currentIndex = this._navIndex();
		if (targetIndex === null || targetIndex === currentIndex) return;
		if (EventHandler.trigger(this._element, EVENT_SLIDE, {
			relatedTarget: items[targetIndex],
			direction: this._direction(currentIndex, targetIndex),
			from: currentIndex,
			to: targetIndex
		}).defaultPrevented) return;
		if (this._isFade()) {
			this._fadeTo(targetIndex);
			return;
		}
		this._scrollToIndex(targetIndex);
	}
	dispose() {
		this._clearInterval();
		if (this._observer) this._observer.disconnect();
		if (this._scrollFrame !== null) cancelAnimationFrame(this._scrollFrame);
		for (const clone of SelectorEngine.find(`.${CLASS_NAME_CLONE}`, this._viewport)) clone.remove();
		this._viewport.style.scrollSnapType = "";
		EventHandler.off(this._viewport, EVENT_KEY);
		super.dispose();
	}
	_configAfterMerge(config) {
		if (![
			ENDS_STOP,
			ENDS_WRAP,
			ENDS_LOOP
		].includes(config.ends)) config.ends = Default.ends;
		return config;
	}
	_initialActiveIndex() {
		const active = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
		const index = active ? this._getItems().indexOf(active) : 0;
		return Math.max(index, 0);
	}
	_addEventListeners() {
		if (this._config.keyboard) EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
		if (this._config.pause === "hover") {
			EventHandler.on(this._element, EVENT_MOUSEENTER, () => this.pause());
			EventHandler.on(this._element, EVENT_MOUSELEAVE, () => this._maybeEnableCycle());
		}
		EventHandler.on(this._viewport, EVENT_POINTERDOWN, () => this._pauseFromInteraction());
	}
	_keydown(event) {
		if (/input|textarea/i.test(event.target.tagName)) return;
		const direction = KEY_TO_DIRECTION[event.key];
		if (direction) {
			event.preventDefault();
			this._pauseFromInteraction();
			if (direction === DIRECTION_RIGHT) this.prev();
			else this.next();
		}
	}
	_observeItems() {
		if (this._isFade() || typeof IntersectionObserver === "undefined") return;
		this._observer = new IntersectionObserver((entries) => this._handleIntersection(entries), {
			root: this._viewport,
			threshold: [
				0,
				.25,
				.5,
				.75,
				1
			]
		});
		for (const item of this._getItems()) this._observer.observe(item);
	}
	_handleIntersection(entries) {
		if (this._looping) return;
		for (const entry of entries) this._visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
		const ratios = this._getItems().map((item) => this._visibility.get(item) ?? 0);
		const maxRatio = Math.max(...ratios);
		let bestIndex = this._activeIndex;
		if (maxRatio > 0) bestIndex = ratios.findIndex((ratio) => ratio >= maxRatio - ACTIVE_RATIO_TOLERANCE);
		this._setActive(bestIndex);
		this._updateEndControls();
	}
	_navIndex() {
		if (this._isFade() || this._viewport.scrollWidth - this._viewport.clientWidth <= 0) return this._activeIndex;
		let index = this._activeIndex;
		let smallestDelta = Number.POSITIVE_INFINITY;
		for (const [itemIndex, item] of this._getItems().entries()) {
			const delta = Math.abs(this._scrollDelta(item));
			if (delta < smallestDelta) {
				smallestDelta = delta;
				index = itemIndex;
			}
		}
		return index;
	}
	_scrollToIndex(index) {
		const item = this._getItems()[index];
		if (!item) return;
		const left = this._scrollDelta(item);
		if (Math.abs(left) < 1) return;
		const targetLeft = this._viewport.scrollLeft + left;
		this._viewport.style.scrollSnapType = "none";
		this._animateScroll(targetLeft, () => {
			this._viewport.style.scrollSnapType = "";
			if (!this._observer) this._setActive(index);
			this._updateEndControls();
		});
	}
	_animateScroll(targetLeft, onComplete) {
		if (this._scrollFrame !== null) {
			cancelAnimationFrame(this._scrollFrame);
			this._scrollFrame = null;
		}
		const startLeft = this._viewport.scrollLeft;
		const distance = targetLeft - startLeft;
		if (this._prefersReducedMotion() || typeof requestAnimationFrame === "undefined") {
			this._viewport.scrollTo({
				left: targetLeft,
				behavior: "instant"
			});
			onComplete();
			return;
		}
		let startTime = null;
		const step = (now) => {
			if (startTime === null) startTime = now;
			const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
			this._viewport.scrollTo({
				left: startLeft + distance * easeInOutCubic(progress),
				behavior: "instant"
			});
			if (progress < 1) {
				this._scrollFrame = requestAnimationFrame(step);
				return;
			}
			this._viewport.scrollTo({
				left: targetLeft,
				behavior: "instant"
			});
			this._scrollFrame = null;
			onComplete();
		};
		this._scrollFrame = requestAnimationFrame(step);
	}
	_scrollDelta(element) {
		const viewportRect = this._viewport.getBoundingClientRect();
		const rect = element.getBoundingClientRect();
		if (this._element.classList.contains(CLASS_NAME_CENTER)) return rect.left + rect.width / 2 - (viewportRect.left + viewportRect.width / 2);
		const padStart = Number.parseFloat(getComputedStyle(this._viewport).scrollPaddingInlineStart) || 0;
		return isRTL() ? rect.right - (viewportRect.right - padStart) : rect.left - (viewportRect.left + padStart);
	}
	_loopTransition(isNext) {
		const items = this._getItems();
		const last = items.length - 1;
		const fromIndex = this._activeIndex;
		const toIndex = isNext ? 0 : last;
		const direction = this._loopDirection(isNext);
		if (EventHandler.trigger(this._element, EVENT_SLIDE, {
			relatedTarget: items[toIndex],
			direction,
			from: fromIndex,
			to: toIndex
		}).defaultPrevented) return;
		this._looping = true;
		const clone = (isNext ? items[0] : items[last]).cloneNode(true);
		clone.classList.add(CLASS_NAME_CLONE);
		clone.classList.remove(CLASS_NAME_ACTIVE);
		clone.removeAttribute("id");
		for (const node of SelectorEngine.find("[id]", clone)) node.removeAttribute("id");
		clone.setAttribute("aria-hidden", "true");
		clone.inert = true;
		this._viewport.style.scrollSnapType = "none";
		if (isNext) this._viewport.append(clone);
		else {
			this._viewport.prepend(clone);
			this._jumpScroll(this._scrollDelta(items[fromIndex]));
		}
		this._animateScroll(this._viewport.scrollLeft + this._scrollDelta(clone), () => {
			clone.remove();
			this._jumpScroll(this._scrollDelta(items[toIndex]));
			this._activeIndex = toIndex;
			this._refreshActiveState();
			EventHandler.trigger(this._element, EVENT_SLID, {
				relatedTarget: items[toIndex],
				direction,
				from: fromIndex,
				to: toIndex
			});
			this._viewport.style.scrollSnapType = "";
			this._looping = false;
		});
	}
	_loopDirection(isNext) {
		if (isRTL()) return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
		return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
	}
	_jumpScroll(delta) {
		this._viewport.style.scrollSnapType = "none";
		this._viewport.scrollBy({
			left: delta,
			top: 0,
			behavior: "instant"
		});
	}
	_fadeTo(index) {
		this._setActive(index);
	}
	_setActive(index) {
		const items = this._getItems();
		if (index === this._activeIndex || !items[index]) return;
		const from = this._activeIndex;
		this._activeIndex = index;
		this._refreshActiveState();
		EventHandler.trigger(this._element, EVENT_SLID, {
			relatedTarget: items[index],
			direction: this._direction(from, index),
			from,
			to: index
		});
	}
	_refreshActiveState() {
		const items = this._getItems();
		for (const [index, item] of items.entries()) item.classList.toggle(CLASS_NAME_ACTIVE, index === this._activeIndex);
		this._setActiveIndicatorElement(this._activeIndex);
		this._updateEndControls();
	}
	_updateEndControls() {
		if (this._config.ends !== ENDS_STOP) return;
		const viewport = this._viewport;
		const maxScroll = viewport.scrollWidth - viewport.clientWidth;
		let atStart;
		let atEnd;
		if (maxScroll > 0) {
			const progress = Math.abs(viewport.scrollLeft);
			atStart = progress <= 1;
			atEnd = progress >= maxScroll - 1;
		} else {
			const last = this._getItems().length - 1;
			atStart = this._activeIndex <= 0;
			atEnd = this._activeIndex >= last;
		}
		this._setControlsDisabled(this._prevControls, atStart);
		this._setControlsDisabled(this._nextControls, atEnd);
	}
	_setControlsDisabled(controls, disabled) {
		for (const control of controls) {
			if (disabled && control === document.activeElement) ((controls === this._prevControls ? this._nextControls : this._prevControls)[0] ?? this._viewport).focus({ preventScroll: true });
			control.disabled = disabled;
		}
	}
	_setActiveIndicatorElement(index) {
		if (!this._indicatorsElement) return;
		const active = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
		if (active) {
			active.classList.remove(CLASS_NAME_ACTIVE);
			active.removeAttribute("aria-current");
		}
		const newActive = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
		if (newActive) {
			newActive.classList.add(CLASS_NAME_ACTIVE);
			newActive.setAttribute("aria-current", "true");
		}
	}
	_normalizeIndex(index, length) {
		if (Number.isNaN(index) || length === 0) return null;
		if (index < 0) return this._wrapsAround() ? length - 1 : null;
		if (index > length - 1) return this._wrapsAround() ? 0 : null;
		return index;
	}
	_wrapsAround() {
		return this._config.ends === ENDS_WRAP || this._config.ends === ENDS_LOOP;
	}
	_canLoop() {
		if (this._isFade() || this._getItems().length < 2) return false;
		const styles = getComputedStyle(this._element);
		const num = (name) => Number.parseFloat(styles.getPropertyValue(name)) || 0;
		return (num("--bs-carousel-items") || 1) === 1 && num("--bs-carousel-items-peek") === 0 && !this._element.classList.contains(CLASS_NAME_CENTER) && !this._element.classList.contains(CLASS_NAME_AUTO);
	}
	_direction(from, to) {
		const isNext = to > from;
		if (isRTL()) return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
		return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
	}
	_scheduleAutoplay(index = this._activeIndex) {
		const interval = this._itemInterval(index);
		this._element.style.setProperty(PROPERTY_INTERVAL, `${interval}ms`);
		this._interval = setTimeout(() => {
			const upcoming = this._upcomingIndex();
			this.nextWhenVisible();
			if (upcoming === null) {
				this.pause();
				return;
			}
			this._scheduleAutoplay(upcoming);
		}, interval);
	}
	_upcomingIndex() {
		return this._normalizeIndex(this._navIndex() + 1, this._getItems().length);
	}
	_itemInterval(index = this._activeIndex) {
		const item = this._getItems()[index];
		const interval = item ? Number.parseInt(item.getAttribute("data-bs-interval"), 10) : NaN;
		return Number.isNaN(interval) ? this._config.interval : interval;
	}
	_maybeEnableCycle() {
		if (!this._playing) return;
		this.cycle();
	}
	_pauseFromInteraction() {
		this._playing = false;
		this.pause();
		this._updatePlayPauseControl();
	}
	_togglePlayPause() {
		if (this._playing) {
			this._pauseFromInteraction();
			return;
		}
		this._playing = true;
		this.cycle();
		this._updatePlayPauseControl();
	}
	_updatePlayPauseControl() {
		if (!this._playPauseElement) return;
		this._playPauseElement.classList.toggle(CLASS_NAME_PAUSED, !this._playing);
		const label = this._playPauseElement.getAttribute(this._playing ? "data-bs-pause-label" : "data-bs-play-label");
		if (label) this._playPauseElement.setAttribute("aria-label", label);
	}
	_isFade() {
		return this._element.classList.contains(CLASS_NAME_FADE);
	}
	_prefersReducedMotion() {
		return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
	_getItems() {
		return SelectorEngine.find(SELECTOR_ITEM, this._element);
	}
	_clearInterval() {
		if (this._interval) {
			clearTimeout(this._interval);
			this._interval = null;
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
	event.preventDefault();
	const carousel = Carousel.getOrCreateInstance(target);
	carousel._pauseFromInteraction();
	const slideIndex = this.getAttribute("data-bs-slide-to");
	if (slideIndex) {
		carousel.to(slideIndex);
		return;
	}
	if (Manipulator.getDataAttribute(this, "slide") === "next") {
		carousel.next();
		return;
	}
	carousel.prev();
});
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_PLAY_PAUSE, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
	event.preventDefault();
	Carousel.getOrCreateInstance(target)._togglePlayPause();
});
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	const carousels = SelectorEngine.find(SELECTOR_DATA_AUTOPLAY);
	for (const carousel of carousels) Carousel.getOrCreateInstance(carousel);
});
//#endregion
export { Carousel as default };

//# sourceMappingURL=carousel.js.map