$(function(){

  // Hide the Mobile Safari address bar once loaded
  // ==============================================

  window.addEventListener("load",function() {
    // Set a timeout...
    setTimeout(function(){
      // Hide the address bar!
      window.scrollTo(0, 1);
    }, 0);
  });


  // Docs topbar nav
  // ===============

  $('.nav .active').click(function(e) {
    e.preventDefault();
    $(this).siblings().toggle();
  });


  // Show grid dimensions on hover
  // =============================

  $('.show-grid > div').hover(function() {
    var width = $(this).width();
    $(this).attr('title', width);
    $(this).twipsy();
  });


  // table sort example
  // ==================

  $("#sortTableExample").tablesorter( { sortList: [[ 1, 0 ]] } )


  // add on logic
  // ============

  $('.add-on :checkbox').click(function () {
    if ($(this).attr('checked')) {
      $(this).parents('.add-on').addClass('active')
    } else {
      $(this).parents('.add-on').removeClass('active')
    }
  })


  // Disable certain links in docs
  // =============================
  // Please do not carry these styles over to your projects, it's merely here to prevent button clicks form taking you away from your spot on page

  $('ul.tabs a, ul.pills a, .pagination a, .well .btn, .actions .btn, .alert-message .btn, a.close').click(function (e) {
    e.preventDefault()
  })

  // Copy code blocks in docs
  $(".copy-code").focus(function () {
    var el = this;
    // push select to event loop for chrome :{o
    setTimeout(function () { $(el).select(); }, 1);
  });


  // POSITION STATIC TWIPSIES
  // ========================

  $(window).on('load resize', function () {
    $(".twipsies a").each(function () {
       $(this)
        .twipsy({
          live: false
        , placement: $(this).attr('title')
        , trigger: 'manual'
        , offset: 2
        })
        .twipsy('show')
      })
  })
});
