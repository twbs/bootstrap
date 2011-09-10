(function( $ ){

 /* DROPDOWN PLUGIN DEFINITION
  * ========================== */

  var selector = 'a.menu, .dropdown-toggle'

  function clearMenus() {
    $(selector).parent('li').removeClass('open')
  }

  $(function () {
    $('body').bind("click", clearMenus)
  })

  $.fn.dropdown = function ( options ) {
    return this.each(function () {
      $(this).delegate(selector, 'click', function (e) {
        clearMenus()
        $(this).parent('li').toggleClass('open')
        return false
      })
    })
  }

})( jQuery || ender )