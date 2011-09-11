/* =============================================================
 * bootstrap-scrollspy.js
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
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
 * ==============================================================
 */

!function ( $ ) {

  var $window = $(window)

  function ScrollSpy( topbar ) {
    var processScroll = $.proxy(this.processScroll, this)
    this.$topbar = $(topbar)
    this.setup()
    this.$topbar
      .delegate('li > a', 'click', processScroll)
      .bind('topbar:refresh', $.proxy(this.setup, this))
    $window.scroll(processScroll)
    this.processScroll()
  }

  ScrollSpy.prototype = {

      setup: function () {
        this.targets = this.$topbar.find('li > a').map(function () {
          var href = $(this).attr('href')
          return /^#\w/.test(href) && $(href).length ? href : null
        })

        this.offsets = $.map(this.targets, function (id) {
          return $(id).offset().top
        })
      }

    , processScroll: function () {
        var scrollTop = $window.scrollTop() + 10
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activateButton( targets[i] )
        }
      }

    , activateButton: function (target) {
        this.activeTarget = target

        this.$topbar
          .find('.active')
          .removeClass('active')

        this.$topbar
          .find('a[href=' + target + ']')
          .parent('li')
          .addClass('active')
      }

  }

  /* SCROLLSPY PLUGIN DEFINITION
   * =========================== */

  $.fn.scrollSpy = function() {
    return this.each(function () {
      new ScrollSpy(this)
    })
  }

}( jQuery || ender )