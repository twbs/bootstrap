/*!
 * Bootstrap-select v1.7.3 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function () {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: 'Nic nie zaznaczono',
    noneResultsText: 'Brak wyników wyszukiwania {0}',
    countSelectedText: 'Zaznaczono {0} z {1}',
    maxOptionsText: ['Osiągnięto limit ({n} {var} max)', 'Limit grupy osiągnięty ({n} {var} max)', ['elementy', 'element']],
    selectAll: 'Zaznacz wszystkie',
    deselectAll: 'Odznacz wszystkie',
    multipleSeparator: ', '
  };
})(jQuery);


}));
