(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('./alert.js'), require('./button.js'), require('./carousel.js'), require('./collapse.js'), require('./dropdown.js'), require('./modal.js'), require('./popover.js'), require('./scrollspy.js'), require('./tab.js'), require('./tooltip.js'), require('./util.js')) :
	typeof define === 'function' && define.amd ? define(['exports', './alert.js', './button.js', './carousel.js', './collapse.js', './dropdown.js', './modal.js', './popover.js', './scrollspy.js', './tab.js', './tooltip.js', './util.js'], factory) :
	(factory((global.bootstrap = global.bootstrap || {}),global.__alert_js,global.__button_js,global.__carousel_js,global.__collapse_js,global.__dropdown_js,global.__modal_js,global.__popover_js,global.__scrollspy_js,global.__tab_js,global.__tooltip_js,global.__util_js));
}(this, (function (exports,__alert_js,__button_js,__carousel_js,__collapse_js,__dropdown_js,__modal_js,__popover_js,__scrollspy_js,__tab_js,__tooltip_js,__util_js) { 'use strict';

__alert_js = __alert_js && 'default' in __alert_js ? __alert_js['default'] : __alert_js;
__button_js = __button_js && 'default' in __button_js ? __button_js['default'] : __button_js;
__carousel_js = __carousel_js && 'default' in __carousel_js ? __carousel_js['default'] : __carousel_js;
__collapse_js = __collapse_js && 'default' in __collapse_js ? __collapse_js['default'] : __collapse_js;
__dropdown_js = __dropdown_js && 'default' in __dropdown_js ? __dropdown_js['default'] : __dropdown_js;
__modal_js = __modal_js && 'default' in __modal_js ? __modal_js['default'] : __modal_js;
__popover_js = __popover_js && 'default' in __popover_js ? __popover_js['default'] : __popover_js;
__scrollspy_js = __scrollspy_js && 'default' in __scrollspy_js ? __scrollspy_js['default'] : __scrollspy_js;
__tab_js = __tab_js && 'default' in __tab_js ? __tab_js['default'] : __tab_js;
__tooltip_js = __tooltip_js && 'default' in __tooltip_js ? __tooltip_js['default'] : __tooltip_js;
__util_js = __util_js && 'default' in __util_js ? __util_js['default'] : __util_js;



exports.Util = __util_js;
exports.Alert = __alert_js;
exports.Button = __button_js;
exports.Carousel = __carousel_js;
exports.Collapse = __collapse_js;
exports.Dropdown = __dropdown_js;
exports.Modal = __modal_js;
exports.Popover = __popover_js;
exports.Scrollspy = __scrollspy_js;
exports.Tab = __tab_js;
exports.Tooltip = __tooltip_js;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
