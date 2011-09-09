(function( $ ){

  function activate ( element, container ) {
    container.find('.active').removeClass('active')
		element.addClass('active')
  }

  function tab( e ) {
    debugger
		var $this = $(this)
		  , href = $this.attr('href')

		if (/^#/.test(href)) {
			e.preventDefault()

      if ($this.hasClass('active')) {
        return
      }

      activate($this, $ul)
      activate($(href), $content)
		}
  }


 /* TABS PLUGIN DEFINITION
  * ====================== */

  $.fn.tabs = function ( content ) {
    return this.each(function () {
      $(this).delegate('> li > a', 'click', tab)
    })
  }

})( jQuery || ender )