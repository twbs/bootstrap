(function( $ ){

  /* CSS TRANSITION SUPPORT (https://gist.github.com/373874)
   * ======================================================= */

   var transitionEnd

   $(function () {

     $.support.transition = (function () {
       var thisBody = document.body || document.documentElement
         , thisStyle = thisBody.style
         , support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
       return support
     })()

     // set CSS transition event type
     if ( $.support.transition ) {
       transitionEnd = "TransitionEnd"
       if ( $.browser.webkit ) {
       	transitionEnd = "webkitTransitionEnd"
       } else if ( $.browser.mozilla ) {
       	transitionEnd = "transitionend"
       } else if ( $.browser.opera ) {
       	transitionEnd = "oTransitionEnd"
       }
     }

   })

 /* ALERT CLASS DEFINITION
  * ====================== */

  var Alert = function ( content ) {
    var that = this
    this.$element = $(content)
    this.$element.delegate('.close', 'click', function (e) {
      e.preventDefault()
      that.close()
    })
  }

  Alert.prototype = {

    close: function () {
      var that = this

      this.$element.removeClass('in')

      function removeElement () {
        that.$element.remove()
        that.$element = null
      }

      $.support.transition && this.$element.hasClass('fade') ?
        this.$element.bind(transitionEnd, removeElement) :
        removeElement()
    }

  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function ( options ) {
    return this.each(function () {
      new Alert(this)
    })
  }

})( jQuery || ender )