// resize fixed sidebar width

$(function() {
   var $affix = $(".sidenav"), 
       $parent = $affix.parent(), 
       resize = function() { $affix.width($parent.width()); };
   $(window).resize(resize); 
   resize();
});

// sidebar brand

  var $logo = $('.sidebar-brand');
  $(document).scroll(function() {
      $logo.css({display: $(this).scrollTop()>150 ? "block":"none"});
  });

// tooltip docs fix

    $('a').tooltip();
