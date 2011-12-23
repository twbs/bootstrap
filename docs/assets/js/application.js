$(function(){

  // NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
  // IT'S ALL JUST JUNK FOR OUR DOCS!
  // ++++++++++++++++++++++++++++++++++++++++++

  // Hide the Mobile Safari address bar once loaded
  // ==============================================

  // Set a timeout...
  setTimeout(function(){
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);

  // table sort example
  // ==================

  // make code pretty
  window.prettyPrint && prettyPrint()

  // table sort example
  if ($.fn.tableSorter) {
    $("#sortTableExample").tablesorter( { sortList: [[ 1, 0 ]] } )
  }

  // add on logic
  $('.add-on :checkbox').on('click', function () {
    var $this = $(this)
      , method = $this.attr('checked') ? 'addClass' : 'removeClass'
    $(this).parents('.add-on')[method]('active')
  })

  // Disable certain links in docs
  // Please do not carry these styles over to your projects
  // it's merely here to prevent button clicks form taking you
  // away from your spot on page!!

  $('[href^=#]').click(function (e) {
    e.preventDefault()
  })

  // Copy code blocks in docs
  $(".copy-code").on('focus', function () {
    var el = this
    setTimeout(function () { $(el).select() }, 0)
  })

  if ($.fn.twipsy) {

    // position static twipsies for components page
    if ($(".twipsies a").length) {
      $(window).on('load resize', function () {
        $(".twipsies a").each(function () {
          $(this)
            .twipsy({
              placement: $(this).attr('title')
            , trigger: 'manual'
            })
            .twipsy('show')
          })
      })
    }

    // add tipsies to grid for scaffolding
    if ($('#grid-system').length) {

      $('#grid-system').twipsy({
          selector: '.show-grid > div'
        , title: function () { return $(this).width() + 'px' }
      })

    }
  }

})
