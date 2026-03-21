/*!
  * Bootstrap nav-overflow.js v6.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import BaseComponent from './base-component.js';
import EventHandler from './dom/event-handler.js';
import SelectorEngine from './dom/selector-engine.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap nav-overflow.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'navoverflow';
const DATA_KEY = 'bs.navoverflow';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_UPDATE = `update${EVENT_KEY}`;
const EVENT_OVERFLOW = `overflow${EVENT_KEY}`;
const CLASS_NAME_OVERFLOW = 'nav-overflow';
const CLASS_NAME_OVERFLOW_MENU = 'nav-overflow-menu';
const CLASS_NAME_HIDDEN = 'd-none';
const SELECTOR_NAV_ITEM = '.nav-item';
const SELECTOR_NAV_LINK = '.nav-link';
const SELECTOR_OVERFLOW_TOGGLE = '.nav-overflow-toggle';
const SELECTOR_OVERFLOW_MENU = '.nav-overflow-menu';
const CLASS_NAME_KEEP = 'nav-overflow-keep';
const Default = {
  moreText: 'More',
  moreIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/></svg>',
  threshold: 0 // Minimum items to keep visible before showing overflow
};
const DefaultType = {
  moreText: 'string',
  moreIcon: 'string',
  threshold: 'number'
};

/**
 * Class definition
 */

class NavOverflow extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._items = [];
    this._overflowItems = [];
    this._overflowMenu = null;
    this._overflowToggle = null;
    this._resizeObserver = null;
    this._isInitialized = false;
    this._init();
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
    this._calculateOverflow();
    EventHandler.trigger(this._element, EVENT_UPDATE);
  }
  dispose() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    // Move items back to original positions
    this._restoreItems();

    // Remove overflow menu
    if (this._overflowToggle && this._overflowToggle.parentElement) {
      this._overflowToggle.parentElement.remove();
    }
    super.dispose();
  }

  // Private
  _init() {
    // Add overflow class to nav
    this._element.classList.add(CLASS_NAME_OVERFLOW);

    // Get all nav items
    this._items = [...SelectorEngine.find(SELECTOR_NAV_ITEM, this._element)];

    // Store original order data
    for (const [index, item] of this._items.entries()) {
      item.dataset.bsNavOrder = index;
    }

    // Create overflow menu if it doesn't exist
    this._createOverflowMenu();

    // Setup resize observer
    this._setupResizeObserver();

    // Initial calculation
    this._calculateOverflow();
    this._isInitialized = true;
  }
  _createOverflowMenu() {
    // Check if overflow menu already exists
    this._overflowToggle = SelectorEngine.findOne(SELECTOR_OVERFLOW_TOGGLE, this._element);
    if (this._overflowToggle) {
      this._overflowMenu = SelectorEngine.findOne(SELECTOR_OVERFLOW_MENU, this._element);
      return;
    }
    const overflowItem = document.createElement('li');
    overflowItem.className = 'nav-item nav-overflow-item';
    overflowItem.innerHTML = `
      <button class="nav-link nav-overflow-toggle" type="button" data-bs-toggle="menu" data-bs-placement="bottom-end" aria-expanded="false">
        <span class="nav-overflow-icon">${this._config.moreIcon}</span>
        <span class="nav-overflow-text">${this._config.moreText}</span>
      </button>
      <div class="${CLASS_NAME_OVERFLOW_MENU} menu"></div>
    `;
    this._element.append(overflowItem);
    this._overflowToggle = overflowItem.querySelector(SELECTOR_OVERFLOW_TOGGLE);
    this._overflowMenu = overflowItem.querySelector(SELECTOR_OVERFLOW_MENU);
  }
  _setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') {
      // Fallback for older browsers
      EventHandler.on(window, 'resize', () => this._calculateOverflow());
      return;
    }
    this._resizeObserver = new ResizeObserver(() => {
      this._calculateOverflow();
    });
    this._resizeObserver.observe(this._element);
  }
  _calculateOverflow() {
    // First, restore all items to measure properly
    this._restoreItems();
    const navWidth = this._element.offsetWidth;
    const overflowItem = this._overflowToggle?.closest('.nav-item');
    const overflowWidth = overflowItem?.offsetWidth || 0;
    let usedWidth = 0;
    const itemsToOverflow = [];
    const overflowThreshold = navWidth - overflowWidth - 10; // 10px buffer

    // Calculate which items need to overflow (skip items with keep class)
    for (const item of this._items) {
      const itemWidth = item.offsetWidth;
      usedWidth += itemWidth;

      // Never overflow items with the keep class
      if (item.classList.contains(CLASS_NAME_KEEP)) {
        continue;
      }
      if (usedWidth > overflowThreshold) {
        itemsToOverflow.push(item);
      }
    }

    // Check if we need threshold minimum visible
    const visibleCount = this._items.length - itemsToOverflow.length;
    if (visibleCount < this._config.threshold && this._items.length > this._config.threshold) {
      // Add more items to overflow until we reach threshold (but not keep items)
      const toMove = this._items.slice(this._config.threshold).filter(item => !item.classList.contains(CLASS_NAME_KEEP));
      itemsToOverflow.length = 0;
      itemsToOverflow.push(...toMove);
    }

    // Move items to overflow menu
    this._moveToOverflow(itemsToOverflow);

    // Show/hide overflow toggle
    if (overflowItem) {
      if (itemsToOverflow.length > 0) {
        overflowItem.classList.remove(CLASS_NAME_HIDDEN);
      } else {
        overflowItem.classList.add(CLASS_NAME_HIDDEN);
      }
    }

    // Trigger overflow event if items changed
    if (itemsToOverflow.length > 0) {
      EventHandler.trigger(this._element, EVENT_OVERFLOW, {
        overflowCount: itemsToOverflow.length,
        visibleCount: this._items.length - itemsToOverflow.length
      });
    }
  }
  _moveToOverflow(items) {
    if (!this._overflowMenu) {
      return;
    }

    // Clear existing overflow items
    this._overflowMenu.innerHTML = '';
    this._overflowItems = [];
    for (const item of items) {
      const link = SelectorEngine.findOne(SELECTOR_NAV_LINK, item);
      if (!link) {
        continue;
      }
      const clonedLink = link.cloneNode(true);
      clonedLink.className = 'menu-item';
      if (link.classList.contains('active')) {
        clonedLink.classList.add('active');
      }
      if (link.classList.contains('disabled') || link.hasAttribute('disabled')) {
        clonedLink.classList.add('disabled');
      }
      this._overflowMenu.append(clonedLink);

      // Hide original item
      item.classList.add(CLASS_NAME_HIDDEN);
      item.dataset.bsNavOverflow = 'true';
      this._overflowItems.push(item);
    }
  }
  _restoreItems() {
    for (const item of this._items) {
      item.classList.remove(CLASS_NAME_HIDDEN);
      delete item.dataset.bsNavOverflow;
    }
    if (this._overflowMenu) {
      this._overflowMenu.innerHTML = '';
    }
    this._overflowItems = [];
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, 'DOMContentLoaded', () => {
  for (const element of SelectorEngine.find('[data-bs-toggle="nav-overflow"]')) {
    NavOverflow.getOrCreateInstance(element);
  }
});

export { NavOverflow as default };
//# sourceMappingURL=nav-overflow.js.map
