$(document).on('mq4hsChange', function (e) {
  'use strict';
  $(document.documentElement).toggleClass('bs-true-hover', e.trueHover);
});
