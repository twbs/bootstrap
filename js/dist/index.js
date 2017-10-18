/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function () {
  if (typeof $ === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
  }

  var version = $.fn.jquery.split(' ')[0].split('.');
  var min = 3;
  var max = 4;

  if (version[0] < min || version[0] >= max) {
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v3.0.0 but less than v4.0.0');
  }
})($);
//# sourceMappingURL=index.js.map