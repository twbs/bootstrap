/* Radio and toggle buttons */
              
!function( $ ) {

    function activate( element, container ) {
        container.find( '.active' ).removeClass( 'active' )
        element.addClass('active')
    }

    jQuery.fn.radio = function() {
        
        return this.each( function() {
            var $this = $(this)
            $this.click( function() {
                activate( $this, $this.parent() )
            })
        })
    }
    
    jQuery.fn.toggleBtn = function() {
        return this.each( function() {
            var $this = $(this)
            $this.click( function() {
                $this.toggleClass('active')
            })
        })
    }
    
}( window.jQuery || window.ender );