/*!
  * Bootstrap strength.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./base-component.js'), require('./dom/event-handler.js'), require('./dom/selector-engine.js')) :
  typeof define === 'function' && define.amd ? define(['./base-component', './dom/event-handler', './dom/selector-engine'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Strength = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine));
})(this, (function (BaseComponent, EventHandler, SelectorEngine) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap strength.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'strength';
  const DATA_KEY = 'bs.strength';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_STRENGTH_CHANGE = `strengthChange${EVENT_KEY}`;
  const SELECTOR_DATA_STRENGTH = '[data-bs-strength]';
  const STRENGTH_LEVELS = ['weak', 'fair', 'good', 'strong'];
  const Default = {
    input: null,
    // Selector or element for password input
    minLength: 8,
    messages: {
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong'
    },
    weights: {
      minLength: 1,
      extraLength: 1,
      lowercase: 1,
      uppercase: 1,
      numbers: 1,
      special: 1,
      multipleSpecial: 1,
      longPassword: 1
    },
    thresholds: [2, 4, 6],
    // weak ≤2, fair ≤4, good ≤6, strong >6
    scorer: null // Custom scoring function (password) => number
  };
  const DefaultType = {
    input: '(string|element|null)',
    minLength: 'number',
    messages: 'object',
    weights: 'object',
    thresholds: 'array',
    scorer: '(function|null)'
  };

  /**
   * Class definition
   */

  class Strength extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._input = this._getInput();
      this._segments = SelectorEngine.find('.strength-segment', this._element);
      this._textElement = SelectorEngine.findOne('.strength-text', this._element.parentElement);
      this._currentStrength = null;
      if (this._input) {
        this._addEventListeners();
        // Check initial value
        this._evaluate();
      }
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
    getStrength() {
      return this._currentStrength;
    }
    evaluate() {
      this._evaluate();
    }

    // Private
    _getInput() {
      if (this._config.input) {
        return typeof this._config.input === 'string' ? SelectorEngine.findOne(this._config.input) : this._config.input;
      }

      // Look for preceding password input
      const parent = this._element.parentElement;
      return SelectorEngine.findOne('input[type="password"]', parent);
    }
    _addEventListeners() {
      EventHandler.on(this._input, 'input', () => this._evaluate());
      EventHandler.on(this._input, 'change', () => this._evaluate());
    }
    _evaluate() {
      const password = this._input.value;
      const score = this._calculateScore(password);
      const strength = this._scoreToStrength(score);
      if (strength !== this._currentStrength) {
        this._currentStrength = strength;
        this._updateUI(strength, score);
        EventHandler.trigger(this._element, EVENT_STRENGTH_CHANGE, {
          strength,
          score,
          password: password.length > 0 ? '***' : '' // Don't expose actual password
        });
      }
    }
    _calculateScore(password) {
      if (!password) {
        return 0;
      }

      // Use custom scorer if provided
      if (typeof this._config.scorer === 'function') {
        return this._config.scorer(password);
      }
      const {
        weights
      } = this._config;
      let score = 0;

      // Length scoring
      if (password.length >= this._config.minLength) {
        score += weights.minLength;
      }
      if (password.length >= this._config.minLength + 4) {
        score += weights.extraLength;
      }

      // Character variety
      if (/[a-z]/.test(password)) {
        score += weights.lowercase;
      }
      if (/[A-Z]/.test(password)) {
        score += weights.uppercase;
      }
      if (/\d/.test(password)) {
        score += weights.numbers;
      }

      // Special characters
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += weights.special;
      }

      // Extra points for more special chars or length
      if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += weights.multipleSpecial;
      }
      if (password.length >= 16) {
        score += weights.longPassword;
      }
      return score;
    }
    _scoreToStrength(score) {
      if (score === 0) {
        return null;
      }
      const [weak, fair, good] = this._config.thresholds;
      if (score <= weak) {
        return 'weak';
      }
      if (score <= fair) {
        return 'fair';
      }
      if (score <= good) {
        return 'good';
      }
      return 'strong';
    }
    _updateUI(strength) {
      // Update data attribute on element
      if (strength) {
        this._element.dataset.bsStrength = strength;
      } else {
        delete this._element.dataset.bsStrength;
      }

      // Update segmented meter
      const strengthIndex = strength ? STRENGTH_LEVELS.indexOf(strength) : -1;
      for (const [index, segment] of this._segments.entries()) {
        if (index <= strengthIndex) {
          segment.classList.add('active');
        } else {
          segment.classList.remove('active');
        }
      }

      // Update text feedback
      if (this._textElement) {
        if (strength && this._config.messages[strength]) {
          this._textElement.textContent = this._config.messages[strength];
          this._textElement.dataset.bsStrength = strength;

          // Also set the color via inheriting from parent or using CSS variable
          const colorMap = {
            weak: 'danger',
            fair: 'warning',
            good: 'info',
            strong: 'success'
          };
          this._textElement.style.setProperty('--strength-color', `var(--${colorMap[strength]}-text)`);
        } else {
          this._textElement.textContent = '';
          delete this._textElement.dataset.bsStrength;
        }
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_STRENGTH)) {
      Strength.getOrCreateInstance(element);
    }
  });

  return Strength;

}));
//# sourceMappingURL=strength.js.map
