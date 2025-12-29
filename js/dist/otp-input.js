/*!
  * Bootstrap otp-input.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./base-component.js'), require('./dom/event-handler.js'), require('./dom/selector-engine.js')) :
  typeof define === 'function' && define.amd ? define(['./base-component', './dom/event-handler', './dom/selector-engine'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.OtpInput = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine));
})(this, (function (BaseComponent, EventHandler, SelectorEngine) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap otp-input.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'otpInput';
  const DATA_KEY = 'bs.otp-input';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_COMPLETE = `complete${EVENT_KEY}`;
  const EVENT_INPUT = `input${EVENT_KEY}`;
  const SELECTOR_DATA_OTP = '[data-bs-otp]';
  const SELECTOR_INPUT = 'input';
  const Default = {
    length: 6,
    mask: false
  };
  const DefaultType = {
    length: 'number',
    mask: 'boolean'
  };

  /**
   * Class definition
   */

  class OtpInput extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._inputs = SelectorEngine.find(SELECTOR_INPUT, this._element);
      this._setupInputs();
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
    getValue() {
      return this._inputs.map(input => input.value).join('');
    }
    setValue(value) {
      const chars = String(value).split('');
      for (const [index, input] of this._inputs.entries()) {
        input.value = chars[index] || '';
      }
      this._checkComplete();
    }
    clear() {
      for (const input of this._inputs) {
        input.value = '';
      }
      this._inputs[0]?.focus();
    }
    focus() {
      // Focus first empty input, or last input if all filled
      const emptyInput = this._inputs.find(input => !input.value);
      if (emptyInput) {
        emptyInput.focus();
      } else {
        this._inputs.at(-1)?.focus();
      }
    }

    // Private
    _setupInputs() {
      for (const input of this._inputs) {
        // Set attributes for proper OTP handling
        input.setAttribute('maxlength', '1');
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '\\d*');

        // First input gets autocomplete for browser OTP autofill
        if (input === this._inputs[0]) {
          input.setAttribute('autocomplete', 'one-time-code');
        } else {
          input.setAttribute('autocomplete', 'off');
        }

        // Mask input if configured
        if (this._config.mask) {
          input.setAttribute('type', 'password');
        }
      }
    }
    _addEventListeners() {
      for (const [index, input] of this._inputs.entries()) {
        EventHandler.on(input, 'input', event => this._handleInput(event, index));
        EventHandler.on(input, 'keydown', event => this._handleKeydown(event, index));
        EventHandler.on(input, 'paste', event => this._handlePaste(event));
        EventHandler.on(input, 'focus', event => this._handleFocus(event));
      }
    }
    _handleInput(event, index) {
      const input = event.target;

      // Only allow digits
      if (!/^\d*$/.test(input.value)) {
        input.value = input.value.replace(/\D/g, '');
      }
      const {
        value
      } = input;

      // Handle multi-character input (some browsers/autofill)
      if (value.length > 1) {
        // Distribute characters across inputs
        const chars = value.split('');
        input.value = chars[0] || '';
        for (let i = 1; i < chars.length && index + i < this._inputs.length; i++) {
          this._inputs[index + i].value = chars[i];
        }

        // Focus appropriate input
        const nextIndex = Math.min(index + chars.length, this._inputs.length - 1);
        this._inputs[nextIndex].focus();
      } else if (value && index < this._inputs.length - 1) {
        // Auto-advance to next input
        this._inputs[index + 1].focus();
      }
      EventHandler.trigger(this._element, EVENT_INPUT, {
        value: this.getValue(),
        index
      });
      this._checkComplete();
    }
    _handleKeydown(event, index) {
      const {
        key
      } = event;
      switch (key) {
        case 'Backspace':
          {
            if (!this._inputs[index].value && index > 0) {
              // Move to previous input and clear it
              event.preventDefault();
              this._inputs[index - 1].value = '';
              this._inputs[index - 1].focus();
            }
            break;
          }
        case 'Delete':
          {
            // Clear current and shift remaining values left
            event.preventDefault();
            for (let i = index; i < this._inputs.length - 1; i++) {
              this._inputs[i].value = this._inputs[i + 1].value;
            }
            this._inputs.at(-1).value = '';
            break;
          }
        case 'ArrowLeft':
          {
            if (index > 0) {
              event.preventDefault();
              this._inputs[index - 1].focus();
            }
            break;
          }
        case 'ArrowRight':
          {
            if (index < this._inputs.length - 1) {
              event.preventDefault();
              this._inputs[index + 1].focus();
            }
            break;
          }

        // No default
      }
    }
    _handlePaste(event) {
      event.preventDefault();
      const pastedData = (event.clipboardData || window.clipboardData).getData('text');
      const digits = pastedData.replace(/\D/g, '').slice(0, this._inputs.length);
      if (digits) {
        this.setValue(digits);

        // Focus last filled input or last input
        const lastIndex = Math.min(digits.length, this._inputs.length) - 1;
        this._inputs[lastIndex].focus();
      }
    }
    _handleFocus(event) {
      // Select the content on focus for easy replacement
      event.target.select();
    }
    _checkComplete() {
      const value = this.getValue();
      const isComplete = value.length === this._inputs.length && this._inputs.every(input => input.value !== '');
      if (isComplete) {
        EventHandler.trigger(this._element, EVENT_COMPLETE, {
          value
        });
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) {
      OtpInput.getOrCreateInstance(element);
    }
  });

  return OtpInput;

}));
//# sourceMappingURL=otp-input.js.map
