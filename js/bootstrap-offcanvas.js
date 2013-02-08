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
      var $this
        , $parent

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      $parent = $this.parents('.row-offcanvas')

      $parent.hasClass('active')

      if (e.keyCode == 27) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

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