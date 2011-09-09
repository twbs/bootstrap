(function( $ ){

  function activate ( element, container ) {
    container.find('.active').removeClass('active')
    element.addClass('active')
  }

  function tab( e ) {
    var $this = $(this)
      , href = $this.attr('href')
      , $ul = $(e.liveFired)
      , $controlled

    if (/^#\w+/.test(href)) {
      e.preventDefault()

      if ($this.hasClass('active')) {
        return
      }

      $href = $(href)

      activate($this.parent('li'), $ul)
      activate($href, $href.parent())
    }
  }


 /* TABS/PILLS PLUGIN DEFINITION
  * ============================ */

  $.fn.tabs = $.fn.pills = function () {
    return this.each(function () {
      $(this).delegate('.tabs > li > a, .pills > li > a, .dropdown-menu > li > a', 'click', tab)
    })
  }

})( jQuery || ender )