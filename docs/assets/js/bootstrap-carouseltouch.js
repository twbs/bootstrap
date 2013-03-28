/* ==========================================================
 * bootstrap-carouseltouch.js v3.0.0
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL TOUCH CLASS DEFINITION
  * ========================= */

  var CarouselTouch = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  CarouselTouch.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  , touch: function () {
      var startX, startY, offset, delta, scrolling = false;
      var that = this;
      var isCycling = this.interval;
      var $active;
      
      var onTouchStart = function (event) {
        var e = event.originalEvent;
        if (e.touches.length === 1) {
          isCycling && that.pause()
          
          startX = e.touches[0].pageX;
          startY = e.touches[0].pageY;
          delta = 0;
          
          that.$element.on('touchmove', { carouselTouch: that }, onTouchMove);
          that.$element.on('touchend', { carouselTouch: that }, onTouchEnd);
          
          var prevItems = that.$element.find('.item.prev');
          prevItems.removeClass('prev')
          
          var nextItems = that.$element.find('.item.next');
          nextItems.removeClass('next')
          
          //event.preventDefault();
        }
        
      };
      this.$element.on('touchstart', onTouchStart);
      
      var onTouchMove = function(event) {
        var e = event.originalEvent, $neighbor, slide, margin;
        $active = that.$element.find('.item.active');
        delta = startX - e.touches[0].pageX;
        scrolling = (Math.abs(delta) < Math.abs(e.touches[0].pageY - startY));
        if (!scrolling) {
          if (isCycling) return;
          if ($active.hasClass('prev') || $active.hasClass('next')) return;
          
          $active.addClass('touch')
          margin = slide = (100/that.$element.width()) * delta;
          if (that.options.sticky) margin = (slide/5) * Math.log(Math.max(1,Math.abs(slide)))/2;
          
          if (slide > 0) {
            $neighbor = $active.next();
            $neighbor = $neighbor.length ? $neighbor : that.$element.find('.item').first();
            $neighbor.addClass('next').addClass('neighbor').css('left', ( 100 - margin ) + '%');
          } else {
            $neighbor = $active.prev();
            $neighbor = $neighbor.length ? $neighbor : that.$element.find('.item').last();
            $neighbor.addClass('prev').addClass('neighbor').css('left', ( -100 - margin ) + '%');
          }
          $active.css('left', (-margin) + '%')
          e.preventDefault()
        }
      };
      
      var onTouchEnd = function (event) {
        var e = event.originalEvent;
        $active = that.$element.find('.item.active');
        that.$element.off('touchmove', onTouchMove);
        if (!scrolling) {
          var $neighbors = that.$element.find('.item.neighbor');
          
          $active.removeClass('touch').css('left', '')
          $neighbors.removeClass('neighbor').css('left', '')
          var activeZone = Math.min(250, that.$element.width()/2);
          if (delta > activeZone) {
            that.next();
          } else if  (delta < -activeZone) {
            that.prev();
          }
          // 15 is finger size ;-) 
          if (Math.abs(delta) > 15) {
            e.preventDefault()
          }
          isCycling && that.cycle()
          
        }
        
        that.$element.off('touchend', onTouchEnd);
        
      };
    }

  }


 /* CAROUSEL TOUCH PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carouseltouch

  $.fn.carouseltouch = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carouseltouch')
        , options = $.extend({}, $.fn.carouseltouch.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carouseltouch', (data = new CarouselTouch(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carouseltouch.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carouseltouch.Constructor = CarouselTouch


 /* CAROUSEL TOUCH NO CONFLICT
  * ==================== */

  $.fn.carouseltouch.noConflict = function () {
    $.fn.carouseltouch = old
    return this
  }

 /* CAROUSEL TOUCH DATA-API
  * ================= */

  $(document).on('click.carouseltouch.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carouseltouch(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carouseltouch').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);