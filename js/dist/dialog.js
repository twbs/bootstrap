/*!
  * Bootstrap dialog.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./base-component.js'), require('./dom/event-handler.js'), require('./dom/manipulator.js'), require('./dom/selector-engine.js'), require('./util/component-functions.js'), require('./util/index.js')) :
  typeof define === 'function' && define.amd ? define(['./base-component', './dom/event-handler', './dom/manipulator', './dom/selector-engine', './util/component-functions', './util/index'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Dialog = factory(global.BaseComponent, global.EventHandler, global.Manipulator, global.SelectorEngine, global.ComponentFunctions, global.Index));
})(this, (function (BaseComponent, EventHandler, Manipulator, SelectorEngine, componentFunctions_js, index_js) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dialog.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'dialog';
  const DATA_KEY = 'bs.dialog';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
  const EVENT_CANCEL = `cancel${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_STATIC = 'dialog-static';
  const CLASS_NAME_OPEN = 'dialog-open';
  const CLASS_NAME_NONMODAL = 'dialog-nonmodal';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dialog"]';
  const SELECTOR_OPEN_MODAL_DIALOG = 'dialog.dialog[open]:not(.dialog-nonmodal)';
  const Default = {
    backdrop: true,
    // true (click dismisses) or 'static' (click does nothing) - only applies to modal dialogs
    keyboard: true,
    modal: true // true uses showModal(), false uses show() for non-modal dialogs
  };
  const DefaultType = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    modal: 'boolean'
  };

  /**
   * Class definition
   */

  class Dialog extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isTransitioning = false;
      this._addEventListeners();
    }

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
      if (this._config.modal) {
        // Modal dialog: use showModal() for focus trapping, backdrop, and top layer
        this._element.showModal();
        // Prevent body scroll for modal dialogs
        document.body.classList.add(CLASS_NAME_OPEN);
      } else {
        // Non-modal dialog: use show() - no backdrop, no focus trap, no top layer
        this._element.classList.add(CLASS_NAME_NONMODAL);
        this._element.show();
      }
      this._queueCallback(() => {
        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN, {
          relatedTarget
        });
      }, this._element, this._isAnimated());
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
      this._queueCallback(() => this._hideDialog(), this._element, this._isAnimated());
    }
    dispose() {
      EventHandler.off(this._element, EVENT_KEY);
      super.dispose();
    }
    handleUpdate() {
      // Provided for API consistency with Modal.
      // Native dialogs handle their own positioning.
    }

    // Private
    _hideDialog() {
      this._element.close();
      this._element.classList.remove(CLASS_NAME_NONMODAL);
      this._isTransitioning = false;

      // Only restore body scroll if no other modal dialogs are open
      if (!document.querySelector(SELECTOR_OPEN_MODAL_DIALOG)) {
        document.body.classList.remove(CLASS_NAME_OPEN);
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    }
    _isAnimated() {
      return this._element.classList.contains('fade');
    }
    _triggerBackdropTransition() {
      const hidePreventedEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
      if (hidePreventedEvent.defaultPrevented) {
        return;
      }
      this._element.classList.add(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.classList.remove(CLASS_NAME_STATIC);
      }, this._element);
    }
    _addEventListeners() {
      // Handle native cancel event (Escape key) - only fires for modal dialogs
      EventHandler.on(this._element, 'cancel', event => {
        // Prevent native close behavior - we'll handle it
        event.preventDefault();
        if (!this._config.keyboard) {
          this._triggerBackdropTransition();
          return;
        }
        EventHandler.trigger(this._element, EVENT_CANCEL);
        this.hide();
      });

      // Handle Escape key for non-modal dialogs (native cancel doesn't fire for show())
      EventHandler.on(this._element, 'keydown', event => {
        if (event.key !== 'Escape' || this._config.modal) {
          return;
        }
        event.preventDefault();
        if (!this._config.keyboard) {
          return;
        }
        EventHandler.trigger(this._element, EVENT_CANCEL);
        this.hide();
      });

      // Handle backdrop clicks (only applies to modal dialogs)
      // Native <dialog> fires click on the dialog element when backdrop is clicked
      EventHandler.on(this._element, 'click', event => {
        // Only handle clicks directly on the dialog (backdrop area)
        // Non-modal dialogs don't have a backdrop
        if (event.target !== this._element || !this._config.modal) {
          return;
        }
        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
          return;
        }

        // Default: click backdrop to dismiss
        this.hide();
      });
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
    EventHandler.one(target, EVENT_SHOW, showEvent => {
      if (showEvent.defaultPrevented) {
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN, () => {
        if (index_js.isVisible(this)) {
          this.focus();
        }
      });
    });

    // Get config from trigger's data attributes
    const config = Manipulator.getDataAttributes(this);

    // Check if trigger is inside an open dialog
    const currentDialog = this.closest('dialog[open]');
    const shouldSwap = currentDialog && currentDialog !== target;
    if (shouldSwap) {
      // Open new dialog first (its backdrop appears over current)
      const newDialog = Dialog.getOrCreateInstance(target, config);
      newDialog.show(this);

      // Close the current dialog (no backdrop flash since new one is already open)
      const currentInstance = Dialog.getInstance(currentDialog);
      if (currentInstance) {
        currentInstance.hide();
      }
      return;
    }
    const data = Dialog.getOrCreateInstance(target, config);
    data.toggle(this);
  });
  componentFunctions_js.enableDismissTrigger(Dialog);

  return Dialog;

}));
//# sourceMappingURL=dialog.js.map
