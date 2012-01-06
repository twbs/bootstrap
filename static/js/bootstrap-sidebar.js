// Automatically resize all sidebar elements

var resize_sidebar = function() {
  var targets = $('.sidebar .expanding');
  targets.each(function(index, element) {
    var height = $(window).height() - $(element).offset().top - $('.sidebar .sticky-footer').height();
    $(element).height(height);
  });
};

$(document).ready(function () {
  $(window).resize(function() { resize_sidebar(); });
  resize_sidebar();
});
