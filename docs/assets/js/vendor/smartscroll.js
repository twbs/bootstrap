/*!
* Debounced scroll event library for jQuery based on Paul Irish's smartresize
* http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/
* https://github.com/peschee/jquery-smartscroll
*/

(function($, sscr){
  'use strict';

  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced () {
      var obj = this,
         args = arguments

      function delayed () {
        if (!execAsap)
          func.apply(obj, args)

        timeout = null
      }

      if (timeout)
        clearTimeout(timeout)
      else if (execAsap)
        func.apply(obj, args)

      timeout = setTimeout(delayed, threshold || 100)
    }

  }

  jQuery.fn[sscr] = function (fn) {
    return fn ? this.bind('scroll', debounce(fn)) : this.trigger(sscr)
  }

})(jQuery, 'smartscroll');
