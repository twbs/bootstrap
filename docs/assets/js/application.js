$(document).ready(function(){

  // Dropdown example for topbar nav
  // ===============================

  $('body').dropdown() // catch any dropdowns on the page


  // Scrollspy
  // =========

  $('body > .topbar').scrollSpy()


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

  $(".twipsies a").each(function () {
     $(this)
      .twipsy({
        live: false
      , placement: $(this).attr('title')
      , trigger: 'manual'
      , offset: 2
      })
      .trigger('twipsy:show')
    })

});
