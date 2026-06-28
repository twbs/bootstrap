/*!
  * Bootstrap offcanvas.js v6.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import DialogBase from './dialog-base.js';
import EventHandler from './dom/event-handler.js';
import SelectorEngine from './dom/selector-engine.js';
import { enableDismissTrigger } from './util/component-functions.js';
import { isDisabled, isVisible } from './util/index.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'offcanvas';
const DATA_KEY = 'bs.offcanvas';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]';
const Default = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
};

/**
 * Class definition
 */

class Offcanvas extends DialogBase {
  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }

  // Public
  toggle(relatedTarget) {
    return this._element.open ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._element.open || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isTransitioning = true;

    // Determine modal mode:
    // - Use showModal() (modal) when backdrop is enabled or scroll is disabled
    // - Use show() (non-modal) when backdrop is false AND scroll is true
    //   (matches behavior where focus trap is skipped for this combo)
    const useModal = Boolean(this._config.backdrop) || !this._config.scroll;
    this._showElement({
      modal: useModal,
      preventBodyScroll: !this._config.scroll
    });

    // CSS @starting-style handles the entry animation automatically.
    // Wait for the transform transition to complete, then fire shown.
    this._queueCallback(() => {
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget
      });
    }, this._element, true);
  }
  hide() {
    if (!this._element.open || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isTransitioning = true;

    // Call close() immediately — CSS handles the exit animation via
    // transition-behavior: allow-discrete on display and overlay,
    // keeping the element visible and in the top layer until complete.
    this._hideElement();
    this._queueCallback(() => {
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    }, this._element, true);
  }

  // Private
  _getStaticClassName() {
    return 'offcanvas-static';
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  EventHandler.one(target, EVENT_HIDDEN, () => {
    // Focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  });

  // Avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne('dialog.offcanvas[open]');
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const selector of SelectorEngine.find('dialog.offcanvas[open]')) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('dialog[open][class*="\\:offcanvas"]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide();
    }
  }
});
enableDismissTrigger(Offcanvas);

export { Offcanvas as default };
//# sourceMappingURL=offcanvas.js.map
