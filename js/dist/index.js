(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./alert.js'), require('./button.js'), require('./carousel.js'), require('./collapse.js'), require('./dropdown.js'), require('./modal.js'), require('./popover.js'), require('./scrollspy.js'), require('./tab.js'), require('./tooltip.js'), require('./util.js')) :
	typeof define === 'function' && define.amd ? define(['./alert.js', './button.js', './carousel.js', './collapse.js', './dropdown.js', './modal.js', './popover.js', './scrollspy.js', './tab.js', './tooltip.js', './util.js'], factory) :
	(global.Index = factory(global.Alert,global.Button,global.Carousel,global.Collapse,global.Dropdown,global.Modal,global.Popover,global.Scrollspy,global.Tab,global.Tooltip,global.Util));
}(this, (function (Alert,Button,Carousel,Collapse,Dropdown,Modal,Popover,Scrollspy,Tab,Tooltip,Util) { 'use strict';

Alert = Alert && 'default' in Alert ? Alert['default'] : Alert;
Button = Button && 'default' in Button ? Button['default'] : Button;
Carousel = Carousel && 'default' in Carousel ? Carousel['default'] : Carousel;
Collapse = Collapse && 'default' in Collapse ? Collapse['default'] : Collapse;
Dropdown = Dropdown && 'default' in Dropdown ? Dropdown['default'] : Dropdown;
Modal = Modal && 'default' in Modal ? Modal['default'] : Modal;
Popover = Popover && 'default' in Popover ? Popover['default'] : Popover;
Scrollspy = Scrollspy && 'default' in Scrollspy ? Scrollspy['default'] : Scrollspy;
Tab = Tab && 'default' in Tab ? Tab['default'] : Tab;
Tooltip = Tooltip && 'default' in Tooltip ? Tooltip['default'] : Tooltip;
Util = Util && 'default' in Util ? Util['default'] : Util;

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var index = {
  Util: Util,
  Alert: Alert,
  Button: Button,
  Carousel: Carousel,
  Collapse: Collapse,
  Dropdown: Dropdown,
  Modal: Modal,
  Popover: Popover,
  Scrollspy: Scrollspy,
  Tab: Tab,
  Tooltip: Tooltip
};

return index;

})));
//# sourceMappingURL=index.js.map
