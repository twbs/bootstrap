
!function( $ ){

  "use strict";

 /* LIST CLASS DEFINITION
  * ========================= */

  var List = function ( element ) {
          this.touchSupported = false;
          this.$el = null;
        this.init( element );
    };
      
      

  List.prototype = {

    constructor: List,
    
    init: function ( element ) {
    
        this.vendorPrefix = this.getVendorPrefix();
        var self = this;
        
        //params used in detecting "click" action - without collision of DOM events            
        this.MAX_CLICK_DURATION_MS = 350;
        this.MAX_MOUSE_POSITION_FLOAT_PX = 10;
        this.MAX_TOUCH_POSITION_FLOAT_PX = 25;
        
        this.SCROLLBAR_BORDER = 1;
        this.SCROLLBAR_MIN_SIZE = 10;
                
        this.RESIZE_TIMEOUT_DELAY = 100;
        
        this.processedItems = {};
        this.totalItems = [];
        this.itemHeight = -1;
            
        this.touchSupported = ("onorientationchange" in window);
        this.$el = $(element);
        this.$ul = this.$el.find( "ul" );
        this.$scrollbar = $("<div id='scrollbar'></div>");
        
        if ( this.$ul.length <= 0 ) {
            this.$ul = $("<ul />");
            this.$el.append( this.$ul );
        }
        this.$el.append( this.$scrollbar );
        
        this.dataProvider = this.$ul.find( "li" );
        this.listItems = (this.dataProvider.length > 0) ? this.dataProvider : $();
        
        this.listItems.each( function(i) {
            if ( i === 0 ) {
                self.itemHeight = $(this).outerHeight();
            }
            $(this).remove();
        });
        
        this.$ul.css( "visibility", "visible" );
        
        this.yPosition = 0;
        this.updateLayout();
        
        
        this.resizeHandler = function( event ) { return self.onResize(event); };
        this.touchStartHandler = function( event ) { return self.onTouchStart(event); };
        this.touchMoveHandler = function( event ) { return self.onTouchMove(event); };
        this.touchEndHandler = function( event ) { return self.onTouchEnd(event); };
        
        this.TOUCH_START = this.touchSupported ? "touchstart" : "mousedown";
        this.TOUCH_MOVE = this.touchSupported ? "touchmove" : "mousemove";
        this.TOUCH_END = this.touchSupported ? "touchend" : "mouseup";
        this.MOUSE_WHEEL = (navigator.userAgent.search("Fire") < 0) ? "mousewheel" : "DOMMouseScroll";
        
        $(window).resize( this.resizeHandler );
        this.$el.bind( this.TOUCH_START, this.touchStartHandler );
        this.$el.bind( this.MOUSE_WHEEL, function( event ) { event.preventDefault();  return self.onMouseWheel(event); } );
        
        if ( !this.touchSupported) {
        	var sbWidth = parseInt(this.$scrollbar.css( "width" ), 10);
            this.$scrollbar.css( "width", 1.25*sbWidth );
                
            this.scrollbarStartHandler = function( event ) { return self.scrollbarTouchStart(event); };
            this.scrollbarMoveHandler = function( event ) { return self.scrollbarTouchMove(event); };
            this.scrollbarEndHandler = function( event ) { return self.scrollbarTouchEnd(event); };
            this.$scrollbar.bind( this.TOUCH_START, this.scrollbarStartHandler );
        }
        else {
            this.$scrollbar.fadeTo( 0,0 );
        }
        
        this.inputCoordinates = null;
        this.velocity = {distance:0, lastTime:0, timeDelta:0};
    },
    
    getVendorPrefix: function() {
        //vendor prefix logic from http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
        var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
    
        var someScript = document.getElementsByTagName('script')[0];
    
        for(var prop in someScript.style)
        {
            if(regex.test(prop))
            {
                // test is faster than match, so it's better to perform
                // that on the lot and match only when necessary
                return prop.match(regex)[0];
            }
        }
    
        // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
        // However (prop in style) returns the correct value, so we'll have to test for
        // the precence of a specific property
        if('WebkitOpacity' in someScript.style) { return 'Webkit'; }
        if('KhtmlOpacity' in someScript.style) { return 'Khtml'; }
    
        return '';
    },
    
    onResize: function( event ) {
        clearTimeout( this.reizeTimeout );
        var maxPosition = (this.dataProvider.length*this.itemHeight)-(this.$el.height());
        this.yPosition = Math.min( this.yPosition, maxPosition );
        var self = this;
        this.reizeTimeout = setTimeout( function() { 
            self.updateLayout(); 
        }, this.RESIZE_TIMEOUT_DELAY );
    },
    
    onTouchStart: function ( event ) {
        this.stopAnimation();
        this.cleanupListItems(true);
        
        if ( this.touchSupported ) {
            this.$scrollbar.fadeTo( 300,1 );
        }
        
        this.cleanupEventHandlers();
        
        $(document).bind( this.TOUCH_MOVE, this.touchMoveHandler );
        $(document).bind( this.TOUCH_END, this.touchEndHandler );
        
        this.inputCoordinates = this.getInputCoordinates( event );
        this.inputStartCoordinates = this.inputCoordinates;
        this.inputStartTime = new Date().getTime();
        
        event.preventDefault();
        return false;
    },
    
    onTouchMove: function ( event ) {
        
        var newCoordinates = this.getInputCoordinates( event );
        var yDelta = this.inputCoordinates.y - newCoordinates.y;
        
        this.yPosition += yDelta;
        this.updateVelocity( yDelta );
        
        //limit scroll to within range of visible area
        var startPosition = Math.ceil(this.yPosition/this.itemHeight);
        if ( startPosition < 0 && startPosition*this.itemHeight <= -(this.$el.height()-this.itemHeight) ) {
            this.yPosition = -(this.$el.height()-this.itemHeight);
        }
        
        var maxPosition = (this.dataProvider.length*this.itemHeight)-this.itemHeight;
        if ( this.yPosition > maxPosition ) {
            this.yPosition = maxPosition;
        }

        //end scroll limiting
            
        this.updateLayout();
        this.inputCoordinates = newCoordinates;
        
        event.preventDefault();
        return false;
    },
    
    onTouchEnd: function ( event ) {
        var id = this.$el.attr("id");
        
        this.inputEndCoordinates = this.inputCoordinates;
        var clickEvent = this.detectClickEvent( event );
        this.inputCoordinates = null;
        
        this.cleanupEventHandlers();
        
        if ( !clickEvent ) {
            this.scrollWithInertia();
        }
        else {
            this.cleanupListItems();
        }
        event.preventDefault();
        return false;
    },
    
    onMouseWheel: function ( event ) {
        this.stopAnimation();
        clearTimeout( this.cleanupTimeout );
    
        //only concerned about vertical scroll
        //scroll wheel logic from: https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js
        var orgEvent = event.originalEvent;
        var delta = 0;
        
        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
        if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
        
        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { delta = orgEvent.wheelDeltaY/120; }
        
        this.yPosition -= (delta*this.itemHeight);
        
        
        //limit the mouse wheel scroll area
       	var maxPosition = ((this.dataProvider.length)*this.itemHeight) - this.$el.height();
        if ( this.yPosition > maxPosition ) {
            this.yPosition = maxPosition;
        }
           if ( this.yPosition < 0 ) {
            this.yPosition = 0;
        }
        
        var self = this;
        this.updateLayout();
        this.cleanupTimeout = setTimeout( function(){ self.cleanupListItems(); }, 100 );
        
        return false;
    },
    
    detectClickEvent: function(event) {
        if ( event.target.nodeName === "LI"  ) {
               
            var endTime = new Date().getTime();
            
            if (( endTime - this.inputStartTime ) < this.MAX_CLICK_DURATION_MS ) {
                var delta = {
                    x:    Math.abs( this.inputStartCoordinates.x - this.inputEndCoordinates.x ),
                    y:    Math.abs( this.inputStartCoordinates.y - this.inputEndCoordinates.y )
                };
                
                var triggerEvent = false;
                if ( this.touchSupported ) {
                    triggerEvent = delta.x <= this.MAX_TOUCH_POSITION_FLOAT_PX && delta.y <= this.MAX_TOUCH_POSITION_FLOAT_PX;
                }
                else {
                    triggerEvent = delta.x <= this.MAX_MOUSE_POSITION_FLOAT_PX && delta.y <= this.MAX_MOUSE_POSITION_FLOAT_PX;
                }
                
                if ( triggerEvent ) {
                    var index = $(event.target).attr( "list-index" );
                    if (index === this.selectedIndex) { return false; }
                    this.setSelectedIndex( index );
                
                    //make this asynch so that any "alert()" on a change event
                    //does not block the UI from updating the selected row
                    //this is particularly an issue on mobile devices
                    var self = this;
                    setTimeout( function() {
                            var data = { selectedIndex: index, 
                                         srcElement: $(event.srcElement), 
                                         item: self.dataProvider[index]  };
                            var e = jQuery.Event("change", data);
                            self.$el.trigger( e );
                        }, 150 );
                        
                    return true;
                }
            }
        }
        return false;
    },
    
    cleanupEventHandlers: function() {
        $(document).unbind( this.TOUCH_MOVE, this.touchMoveHandler );
        $(document).unbind( this.TOUCH_END, this.touchEndHandler );
        $(document).unbind( this.TOUCH_MOVE, this.scrollbarMoveHandler );
        $(document).unbind( this.TOUCH_END, this.scrollbarEndHandler );
    },
    
    cleanupListItems: function(keepScrollBar) {
        //remove any remaining LI elements hanging out on the dom
        var item, index;
        for ( var x=0; x<this.totalItems.length; x++ ) {
            item = this.totalItems[x];
            index = item.attr( "list-index" );
            if ( this.processedItems[ index ] === undefined ) {
                item.remove();
            }
        }
        //cleanup totalItems array
        var temp = [];
        if ( this.processedItems ) {
			for ( index in this.processedItems)
			{
				temp.push( this.processedItems[ index ] );
			}
        }
        this.totalItems = temp;
        
        if ( this.touchSupported && keepScrollBar !== true ) {
            this.$scrollbar.fadeTo( 300,0 );
        }
    },
    
    getInputCoordinates: function ( event ) {
        
        var targetEvent;
        if (this.touchSupported) {
            targetEvent = event.originalEvent.touches[0];
        }
        else {
            targetEvent = event;
        }
        
        var result = {x: Math.round(targetEvent.pageX), y: Math.round(targetEvent.pageY)};
        return result;
    },
    
    updateLayout: function(ignoreScrollbar) {
        
        if ( this.dataProvider.length > 0 ) {
            
            var height = this.$el.height();
            
            var i = -1;
            var startPosition = Math.ceil(this.yPosition/this.itemHeight);
            var offset = -(this.yPosition % this.itemHeight);
            
            this.setItemPosition( this.$ul, 0, -this.yPosition );
            this.processedItems = {};
            
            while (((i)*this.itemHeight) < (height+(2*this.itemHeight))) {
            
                var index = Math.max(  startPosition+i, 0 );
                index = Math.min( index, this.dataProvider.length );
                
                var item = this.getItemAtIndex( index );
                this.totalItems.push( item );
                
                this.processedItems[ index.toString() ] = item;
                this.setItemPosition( item, 0, ((startPosition+i)*this.itemHeight) );
                if ( item.parent().length <= 0 ) {
                    this.$ul.append( item );
                    
                    if ( this.itemHeight <= 0 ) {
                        this.itemHeight = item.outerHeight();
                        this.updateLayout();
                        return;
                    }
                }
                i++;
            }
            
            if ( ignoreScrollbar !== true ) {
                this.updateScrollBar();
            }
        }
    },
    
    updateScrollBar: function() {
        var height = this.$el.height();
        var maxScrollbarHeight = this.$el.height() - (2*this.SCROLLBAR_BORDER);
        var maxItemsHeight = (this.dataProvider.length) * this.itemHeight;
        var targetHeight = Math.min(maxScrollbarHeight / maxItemsHeight, 1) * maxScrollbarHeight;
        var actualHeight = Math.max(targetHeight, this.SCROLLBAR_MIN_SIZE);
        
        var scrollPosition = this.SCROLLBAR_BORDER+((this.yPosition/(maxItemsHeight-height)) * (maxScrollbarHeight-actualHeight));
        if ( scrollPosition < this.SCROLLBAR_BORDER ) {
            
            actualHeight = Math.max( actualHeight+scrollPosition, 0 );
            scrollPosition = this.SCROLLBAR_BORDER;
        }    
        else if ( scrollPosition > (height-actualHeight) ) {
            actualHeight = Math.min( actualHeight, (height-(scrollPosition+this.SCROLLBAR_BORDER)) );
        }
        
        this.$scrollbar.height( actualHeight );
        var parent = this.$scrollbar.parent();
        
        if ((this.dataProvider.length * this.itemHeight) <= this.$el.height() ) {
            if ( parent.length > 0 ) {
                this.$scrollbar.remove();
            }
        }
        else {
            if ( parent.length <= 0 ) {
                this.$el.append( this.$scrollbar );
            }
            this.$scrollbar.css( "top", scrollPosition );
        }
        
    },
    
    updateVelocity: function( yDelta ) {
        this.velocity.distance = yDelta;
        var time = new Date().getTime();
        this.velocity.timeDelta = time - this.velocity.lastTime;
        this.velocity.lastTime = time;
        
        if ( this.velocity.timeDelta > 1000 ) {
            this.velocity.distance = 0;
        }
    },
    
    scrollWithInertia: function() {
        var friction = 0.96;
        var animationInterval = 25;
        
        //detect bounds and "snap back" if needed
        var startPosition = Math.ceil(this.yPosition/this.itemHeight);
    
        if ( startPosition <= 0 && this.yPosition <= 0 || (this.dataProvider.length * this.itemHeight) < this.$el.height() ) {
             this.snapToTop();
             return;
        }
        
        var maxPosition = (this.dataProvider.length*this.itemHeight)-(this.$el.height());
        if ( this.yPosition > maxPosition ) {
             this.snapToBottom();
             return;
        }
        
        //end "snap back"
        
        
        var yDelta = this.velocity.distance * (friction*(Math.max(1000 - this.velocity.timeDelta, 0)/1000));
        this.yPosition += yDelta;
        this.updateVelocity( yDelta );
        this.updateLayout();
        
        var self= this;
        this.stopAnimation();
        if ( Math.abs(yDelta) >= 1 ) {
            this.animationTimeout = setTimeout( function() { self.scrollWithInertia(); }, animationInterval );    
        }
        else {
            this.cleanupListItems();
        }
    },
    
    snapToTop: function() {
        var animationInterval = 25;
        var self = this;
        var snapRatio = 1.5;
        this.stopAnimation();
        var targetPosition = 0;
        
        if ( this.yPosition !== 0 ) {
            this.yPosition += (targetPosition-this.yPosition)/snapRatio;
            this.yPosition = Math.round(this.yPosition);
            this.updateLayout();
            this.animationTimeout = setTimeout( function() { self.snapToTop(); }, animationInterval );    
        }
        else {
            this.updateLayout();
            this.cleanupListItems();
        }
    },
    
    snapToBottom: function() {
        var animationInterval = 25;
        var self = this;
        var snapRatio = 1.5;
        this.stopAnimation();
        
        var maxPosition = (this.dataProvider.length*this.itemHeight) - (this.$el.height());
        if ( this.yPosition > maxPosition ) {
            
            this.yPosition += (maxPosition - this.yPosition)/snapRatio;
            
            this.updateLayout();
            this.animationTimeout = setTimeout( function() { self.snapToBottom(); }, animationInterval );    
        }
        else {
            this.cleanupListItems();
        }
    },
    
    stopAnimation: function() {
        clearTimeout( this.animationTimeout );
    },
    
    setItemPosition: function( item, x, y ) {
        
        if ( this.useTransform === null || this.useTransform === undefined ) {
            var body = document.body || document.documentElement;
            var style = body.style;
            this.useTransform = style.WebkitTransition !== undefined || style.MozTransition !== undefined || style.OTransition !== undefined || style.transition !== undefined;
        }
        
        if ( this.useTransform ) {
            var cssString = "translate3d("+x+"px, "+y+"px, 0px)";
            item.css( "-"+this.vendorPrefix+"-transform", cssString );
        } 
        else {
            item.css( "left", x );
            item.css( "top", y );
        }
    },
    
    getItemAtIndex: function( i ) {
        var item;
        if (this.dataProvider === this.listItems) {
            item = $(this.listItems[i]);
        }
        else if ( i !== undefined ){
            var iString = i.toString();
            if ( this.listItems[ iString ] === null || this.listItems[ iString ] === undefined ) {
                item = $("<li/>");
                this.listItems[ iString ] = item;
            }
            else {
                item = this.listItems[ i ];
            }
            if ( i >= 0 && i < this.dataProvider.length ){
                var data = this.dataProvider[i];
                var label =  this.labelFunction ? this.labelFunction( data ) : data.toString();
                item.text( label );
            }
        }
        if ( item !== null && item !== undefined ) {
            item.attr( "list-index", i );
        }
        return item;
    },
    
    setDataProvider: function( dataProvider ) {
        this.clearSelectedIndex();
        this.dataProvider = dataProvider;
        
        this.$ul.find("li").each( function(i) {
            $(this).remove();
        });
        
        this.yPosition = 0;
        this.updateLayout();
    },
    
    setLabelFunction: function( labelFunction ) {
        this.labelFunction = labelFunction;
        this.updateLayout();
    },
    
    getSelectedIndex: function() {
        return parseInt(this.selectedIndex, 10);
    },
    
    setSelectedIndex: function( index ) {
        var item = this.getItemAtIndex( this.selectedIndex );
        
        if ( item !== undefined ) {
            item.removeClass( "listSelected" );
        }
        
        this.selectedIndex = index;
        this.getItemAtIndex( index ).addClass( "listSelected" );
    },
    
    clearSelectedIndex: function() {
        var item = this.getItemAtIndex( this.selectedIndex );
        
        if ( item !== undefined ) {
            item.removeClass( "listSelected" );
        }
        this.selectedIndex = -1;
    },
    
    scrollbarTouchStart: function( event ) {
        this.cleanupEventHandlers();
        this.scrollbarInputCoordinates = this.getInputCoordinates( event );
        
        $(document).bind( this.TOUCH_MOVE, this.scrollbarMoveHandler );
        $(document).bind( this.TOUCH_END, this.scrollbarEndHandler );
        
        event.preventDefault();
        return false;
    },
    
    scrollbarTouchMove: function( event ) {
        var newCoordinates = this.getInputCoordinates( event );
        var yDelta = this.scrollbarInputCoordinates.y - newCoordinates.y;
        
        var yPosition = parseInt( this.$scrollbar.css( "top" ), 10 );
        yPosition -= yDelta;
        
        yPosition = Math.max( yPosition, this.SCROLLBAR_BORDER );
        yPosition = Math.min( yPosition, this.$el.height()-this.SCROLLBAR_BORDER-this.$scrollbar.height() );
        
        this.$scrollbar.css( "top", yPosition );
        this.scrollbarInputCoordinates = newCoordinates;
        
        var newYPosition = ((yPosition-this.SCROLLBAR_BORDER)/
                            (this.$el.height()-(2*this.SCROLLBAR_BORDER)-this.$scrollbar.height())
                           )*(this.itemHeight*this.dataProvider.length-1);
        newYPosition = Math.max( 0, newYPosition );
        newYPosition = Math.min( newYPosition, (this.itemHeight*(this.dataProvider.length))-(this.$el.height()-(2*this.SCROLLBAR_BORDER)-this.$scrollbar.height()) );
        
        this.yPosition = newYPosition;
        this.updateLayout(true);
        
        event.preventDefault();
        return false;
    },
    
    scrollbarTouchEnd: function( event ) {
        this.cleanupEventHandlers();
        this.cleanupListItems();
        event.preventDefault();
        return false;
    }
  
  };

  /* LIST PLUGIN DEFINITION
   * ========================== */

  $.fn.list = function ( option, params ) {
    return this.each(function () {
      var $this = $(this), data = $this.data('list');
      if (!data) { $this.data('list', (data = new List(this))); }
      if (typeof option === 'string') { data[option](params); }
    });
  };

  $.fn.list.Constructor = List;

}( window.jQuery );