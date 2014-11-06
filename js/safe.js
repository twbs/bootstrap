(function (jQuery, window, factory) {
  'use strict';
  if (window.Platform && window.wrap) {
    // when using combined with Polymer
    return factory(jQuery, window.wrap(window), window.wrap(window.document));
  }else {
    return factory(jQuery, window, window.document);
  }
})(jQuery, window, function (jQuery, window, document) {
  'use strict';
  // Bootstrap code
});
