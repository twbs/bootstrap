/* ============================================================
 * bootstrap-select.js v2.1.2
 * http://twitter.github.com/bootstrap/javascript.html#select
 * ============================================================
 * Copyright 2012 CERN, Jiri Kuncar <jiri.kuncar@cern.ch>
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


 /* BUTTON SELECT PUBLIC CLASS DEFINITION
  * ===================================== */

  var ButtonSelect = function (element, options) {
    var that = this
    this.$element = $(element)
    this.options = $.extend({}, $.fn.buttonSelect.defaults, options)
    this.$wrap = this.$element.wrap(this.options.wrap)
                .parent();
    this.$prev = $(this.options.button).clone()
                .html(this.options.prev)
                .appendTo(this.$wrap)
    this.$span = $(this.options.span).clone()
                .text(this.$element.children(':selected').text())
                .appendTo(this.$wrap)
    this.$next = $(this.options.button).clone()
                .html(this.options.next)
                .appendTo(this.$wrap)
    this.$element.appendTo(this.$wrap.parent()).hide()
    this.$element.change(function() {
      that.$span.text(that.$element.children(':selected').text())
    })
    this.$next.on('click', function(e) {
      ButtonSelect.prototype.next.call(that)
    })
    this.$prev.on('click', function(e) {
      ButtonSelect.prototype.prev.call(that)
    })
  }

  ButtonSelect.prototype.next = function () {
    var i = this.$element.prop('selectedIndex'),
        l = this.$element.children('option').length
    if (i+1<l) {
      this.$element.prop('selectedIndex', i+1)
      this.$element.change()
    }
  }

  ButtonSelect.prototype.prev = function () {
    var i = this.$element.prop('selectedIndex')
    if (i>0) {
      this.$element.prop('selectedIndex', i-1)
      this.$element.change()
    }
  }

 /* BUTTON SELECT PLUGIN DEFINITION
  * =============================== */

  $.fn.buttonSelect = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('buttonSelect')
        , options = typeof option == 'object' && option
      if (!data) $this.data('buttonSelect', (data = new ButtonSelect(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.buttonSelect.defaults = {
    wrap: '<div class="btn-group" />'
  , button: '<a class="btn" />'
  , span: '<span class="btn" />'
  , next: '&gt;'
  , prev: '&lt;'
  }

  $.fn.buttonSelect.Constructor = ButtonSelect


 /* BUTTON SELECT DATA-API
  * ====================== */

  $(function () {
    $('select[data-change=select]').buttonSelect({})
  })

}(window.jQuery);
