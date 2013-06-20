/* ============================================================
 * bootstrap-offcanvas.js v3.0.0
 * http://twitter.github.com/bootstrap/javascript.html#offcanvas
 * ============================================================
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
 * ============================================================ */

/* ============================================================
 * This shouldn't be a plugin, because it's too simple.
 * BTW, having it as a plugin, makes for a simpler dev cycle.
 * ============================================================ */

!function ($) {

  "use strict"; // jshint ;_;


 /* OFFCANVAS CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=offcanvas]'
    , Offcanvas = function (element) {
        var $el = $(element).on('click.offcanvas.data-api', this.toggle)
      }

  Offcanvas.prototype = {

    constructor: Offcanvas

  , toggle: function (e) {
      var $this = $(this)
        , $parent

      $parent = $this.parents('.row-offcanvas')

      $parent.toggleClass('active')
      $this.toggleClass('active')

      return false
    }

  , keydown: function (e) {
      $(this).toggle
      // TODO
      // This should be enough to provide the basic functionality.
      // In the future I'd like to have the following behaviour:
      //
      // * on active via keyboard, give focus to the sidebar
      // * while in sidebar: ESC gives back focus to the toggler anchor/button
    }

  }


  /* OFFCANVAS PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.offcanvas

  $.fn.offcanvas = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('offcanvas')
      if (!data) $this.data('offcanvas', (data = new Offcanvas(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.offcanvas.Constructor = Offcanvas


 /* OFFCANVAS NO CONFLICT
  * ==================== */

  $.fn.offcanvas.noConflict = function () {
    $.fn.offcanvas = old
    return this
  }


  /* APPLY TO OFFCANVAS ELEMENTS
   * =================================== */

  $(document)
    .on('click.offcanvas.data-api touchstart.offcanvas.data-api'  , toggle, Offcanvas.prototype.toggle)
    .on('keydown.offcanvas.data-api touchstart.offcanvas.data-api', toggle, Offcanvas.prototype.keydown)

}(window.jQuery);