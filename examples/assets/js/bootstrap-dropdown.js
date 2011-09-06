(function( $ ){

 /* DROPDOWN PLUGIN DEFINITION
  * ========================== */

  function clearMenus() {
    $('a.menu').parent('li').removeClass('open')
  }

  $(function () {
    $('body').bind("click", clearMenus)
  })

  $.fn.dropdown = function ( options ) {
    return this.each(function () {
      $(this).delegate('a.menu', 'click', function (e) {
        clearMenus()
        $(this).parent('li').toggleClass('open')
        return false
      })
    })
  }

})( jQuery || ender )