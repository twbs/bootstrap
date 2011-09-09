// scroll spy logic
// ================
$(function () {

  var activeTarget,
     position = {},
     $window = $(window),
     nav = $('body > .topbar li a'),
     targets = nav.map(function () {
       return $(this).attr('href');
     }),
     offsets = $.map(targets, function (id) {
       return $(id).offset().top;
     });

  function setButton(id) {
   nav.parent("li").removeClass('active');
   $(nav[$.inArray(id, targets)]).parent("li").addClass('active');
  }

  function processScroll(e) {
   var scrollTop = $window.scrollTop() + 10, i;
   for (i = offsets.length; i--;) {
     if (activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
       activeTarget = targets[i];
       setButton(activeTarget);
     }
   }
  }

  nav.click(function () {
   processScroll();
  });

  processScroll();

  $window.scroll(processScroll);

})