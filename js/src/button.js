/**
 * --------------------------------------------------------------------------
 * Bootstrap button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import { defineJQueryPlugin } from "./util/index.js";

/**
 * Constants
 */

let NAME = "button";
let DATA_KEY = "bs.button";
let EVENT_KEY = `.${DATA_KEY}`;
let DATA_API_KEY = ".data-api";

let CLASS_NAME_ACTIVE = "active";
let SELECTOR_DATA_TOGGLE = '[data-bs-toggle="button"]';
let EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME;
  }

  // Public
  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute(
      "aria-pressed",
      this._element.classList.toggle(CLASS_NAME_ACTIVE)
    );
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      let data = Button.getOrCreateInstance(this);

      if (this.config == toggle) {
        data[this.config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(
  document,
  EVENT_CLICK_DATA_API,
  SELECTOR_DATA_TOGGLE,
  (event) => {
    event.preventDefault();

    const button = event.target.closest(SELECTOR_DATA_TOGGLE);
    const data = Button.getOrCreateInstance(button);

    data.toggle();
  }
);

/**
 * jQuery
 */

defineJQueryPlugin(Button);

export default Button;
