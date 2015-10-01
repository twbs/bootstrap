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
    noneSelectedText: 'Aucune s&eacute;lection',
    noneResultsText: 'Aucun r&eacute;sultat pour {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected > 1) ? "{0} &eacute;l&eacute;ments s&eacute;lectionn&eacute;s" : "{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll > 1) ? 'Limite atteinte ({n} &eacute;l&eacute;ments max)' : 'Limite atteinte ({n} &eacute;l&eacute;ment max)',
        (numGroup > 1) ? 'Limite du groupe atteinte ({n} &eacute;l&eacute;ments max)' : 'Limite du groupe atteinte ({n} &eacute;l&eacute;ment max)'
      ];
    },
    multipleSeparator: ', '
  };
})(jQuery);


}));
