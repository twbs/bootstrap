/* ========================================================
 * bootstrap-tabs.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2011 Twitter, Inc.
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
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , href = $this.attr('data-target') || $this.attr('href')
        , previous
        , $href

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      $this.trigger({
        type: 'show'
      , relatedTarget: previous
      })

      $href = $(href)

      this.activate($this.parent('li'), $ul)
      this.activate($href, $href.parent())

      $this.trigger({
        type: 'shown'
      , relatedTarget: previous
      })
    }

  , activate: function ( element, container ) {
      container
        .find('> .active')
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if ( element.parent('.dropdown-menu') ) {
        element.closest('li.dropdown').addClass('active')
      }
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Tab = Tab


 /* TAB DATA-API
  * ============ */

  $(document).ready(function () {
    $('body').delegate('[data-toggle="tab"], [data-toggle="pill"]', 'click.tab.data-api', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}( window.jQuery || window.ender )