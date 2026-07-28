/*!
  * Bootstrap range.js v6.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import BaseComponent from './base-component.js';
import EventHandler from './dom/event-handler.js';
import SelectorEngine from './dom/selector-engine.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap range.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const NAME = 'range';
const DATA_KEY = 'bs.range';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const EVENT_CHANGED = `changed${EVENT_KEY}`;
const EVENT_DOM_CONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`;

// `input` is not in EventHandler's native-event list, so it can't be namespaced; bind it raw
const EVENT_INPUT = 'input';
const EVENT_CHANGE = 'change';
const SELECTOR_RANGE = '.form-range';
const SELECTOR_INPUT = '.form-range-input';
const CLASS_NAME_BUBBLE = 'form-range-bubble';
const CLASS_NAME_TICKS = 'form-range-ticks';
const CLASS_NAME_TICK = 'form-range-tick';
const CLASS_NAME_TICK_LABEL = 'form-range-tick-label';

// Shipped (`--bs-`-prefixed) custom properties; the build prefixes the SCSS tokens, so the
// plugin must write the prefixed names to interoperate with the rendered CSS.
const PROPERTY_FILL = '--bs-range-fill';
const Default = {
  bubble: false,
  // Show a value bubble above the thumb
  formatter: null // (value) => string, for the bubble and tick labels
};
const DefaultType = {
  bubble: '(boolean|null)',
  formatter: '(function|null)'
};

/**
 * Class definition
 */

class Range extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    // BaseComponent bails (no `_element`) when the element can't be resolved
    if (!this._element) {
      return;
    }
    this._input = SelectorEngine.findOne(SELECTOR_INPUT, this._element);
    if (!this._input) {
      return;
    }
    this._bubble = null;
    this._bubbleText = null;
    this._ticks = null;
    this._updateHandler = () => this._update();
    if (this._config.bubble) {
      this._createBubble();
    }
    this._createTicks();
    this._addEventListeners();
    this._update();
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
  update() {
    this._update();
  }
  dispose() {
    EventHandler.off(this._input, EVENT_INPUT, this._updateHandler);
    EventHandler.off(this._input, EVENT_CHANGE, this._updateHandler);
    this._bubble?.remove();
    this._ticks?.remove();
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    // A bare `data-bs-bubble` attribute normalizes to `null`; treat it as enabled
    if (config.bubble === null) {
      config.bubble = true;
    }
    return config;
  }
  _addEventListeners() {
    EventHandler.on(this._input, EVENT_INPUT, this._updateHandler);
    EventHandler.on(this._input, EVENT_CHANGE, this._updateHandler);
  }
  _min() {
    return this._input.min === '' ? 0 : Number.parseFloat(this._input.min);
  }
  _max() {
    return this._input.max === '' ? 100 : Number.parseFloat(this._input.max);
  }
  _value() {
    return Number.parseFloat(this._input.value);
  }
  _ratio() {
    const span = this._max() - this._min();
    return span > 0 ? (this._value() - this._min()) / span : 0;
  }
  _update() {
    // The fill ratio drives the track gradient and the bubble/tick positions, all in CSS
    this._element.style.setProperty(PROPERTY_FILL, `${this._ratio()}`);
    if (this._bubbleText) {
      this._bubbleText.textContent = this._format(this._value());
    }
    EventHandler.trigger(this._input, EVENT_CHANGED, {
      value: this._value()
    });
  }
  _format(value) {
    return typeof this._config.formatter === 'function' ? this._config.formatter(value) : String(value);
  }
  _createBubble() {
    // Reuse the tooltip markup so we don't duplicate the pill and arrow styles
    this._bubble = document.createElement('output');
    this._bubble.className = `${CLASS_NAME_BUBBLE} tooltip bs-tooltip-top show`;
    this._bubble.setAttribute('aria-hidden', 'true');

    // Match the Tooltip template's block-level markup: `.tooltip-inner` has no `display` rule,
    // so an inline `<span>` would let its padding bleed outside the bubble and clip the arrow.
    const arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';
    this._bubbleText = document.createElement('div');
    this._bubbleText.className = 'tooltip-inner';
    this._bubble.append(arrow, this._bubbleText);
    this._input.insertAdjacentElement('afterend', this._bubble);
  }
  _createTicks() {
    const listId = this._input.getAttribute('list');
    const datalist = listId ? document.getElementById(listId) : null;
    if (!datalist) {
      return;
    }
    const min = this._min();
    const span = this._max() - min || 1;
    const points = [];
    for (const option of SelectorEngine.find('option', datalist)) {
      const value = Number.parseFloat(option.value);
      if (!Number.isNaN(value)) {
        // Clamp to [0, 1] so out-of-range options can't produce negative `fr` tracks
        const ratio = Math.min(Math.max((value - min) / span, 0), 1);
        points.push({
          ratio,
          label: option.label
        });
      }
    }
    if (points.length === 0) {
      return;
    }
    points.sort((a, b) => a.ratio - b.ratio);
    this._ticks = document.createElement('div');
    this._ticks.className = CLASS_NAME_TICKS;
    this._ticks.setAttribute('aria-hidden', 'true');

    // Columns are the gaps between 0, each tick, and 1, so every tick lands on a grid line
    const stops = [0, ...points.map(point => point.ratio), 1];
    this._ticks.style.gridTemplateColumns = stops.slice(1).map((stop, index) => `${stop - stops[index]}fr`).join(' ');
    for (const [index, point] of points.entries()) {
      const tick = document.createElement('span');
      tick.className = CLASS_NAME_TICK;
      tick.style.gridColumnStart = `${index + 2}`;
      if (point.label) {
        const label = document.createElement('span');
        label.className = CLASS_NAME_TICK_LABEL;
        label.textContent = point.label;
        tick.append(label);
      }
      this._ticks.append(tick);
    }
    this._element.append(this._ticks);
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_DOM_CONTENT_LOADED, () => {
  for (const element of SelectorEngine.find(SELECTOR_RANGE)) {
    Range.getOrCreateInstance(element);
  }
});

export { Range as default };
//# sourceMappingURL=range.js.map
