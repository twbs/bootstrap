/* ========================================================
 * bootstrap-tab.js v2.0.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function( $ ){

  "use strict"

 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
    this.initialize()
  }

  Tab.prototype = {

    constructor: Tab

  , initialize: function () {
      var $ul
        , $target

      this.element.closest('ul:not(.dropdown-menu)').find('> li [data-target], > li [href]').each(function () {
        var $this = $(this)
          , selector = $this.attr('data-target')
          , $target

        if (!selector) {
          selector = $this.attr('href')
          selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        if ( $this.parent('li').hasClass('active') ) return

        $target = $(selector)

        if ( $this.parent('li').parent().find('> .active').size() == 0
              && $target.hasClass('active') )
          $this.parent('li').addClass('active')
        else
          $target.removeClass('active').addClass('inactive')
      });
    }

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      $this.trigger({
        type: 'show'
      , relatedTarget: previous
      })

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active').addClass('inactive')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active').removeClass('inactive')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })

    // Run auto-tab at the end of the DOMReady queue, so we can check if
    // the tab.data-api namespace has been turned off.
    $(function(){
      var events = $('body').data('events')
        , apienabled = events && $(events.click).filter(function(){ return this.namespace == 'data-api.tab' }).size()
      if (apienabled)
        $('[data-toggle="tab"], [data-toggle="pill"]').tab()
    })
  })

}( window.jQuery );