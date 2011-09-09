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

    if (/^#/.test(href)) {
      e.preventDefault()

      if ($this.hasClass('active')) {
        return
      }

      $controlled = $('#' + $ul.attr('aria-controls'))

      activate($this.parent('li'), $ul)
      activate($(href, $controlled), $controlled)
    }
  }


 /* TABS/PILLS PLUGIN DEFINITION
  * ============================ */

  $.fn.tabs = $.fn.pills = function () {
    return this.each(function () {
      $(this).delegate('.tabs > li > a, .pills > li > a', 'click', tab)
    })
  }

})( jQuery || ender )