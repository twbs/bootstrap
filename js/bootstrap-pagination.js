/* ===========================================================
 * bootstrap-pagination.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#pagintation
 * ===========================================================
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
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* PAGINATION PUBLIC CLASS DEFINITION
  * =============================== */

  var Pagination = function (element, options) {
    this.$element = $(element)

    this.options = $.extend({}, $.fn.pagination.defaults, options)
    this.$paged  = $(this.options.paged).children()
    this.total = this.$paged.length
    this.pages = Math.ceil(this.total / this.options.pageSize)
    this.currentPage = 0

    if (this.pages > 1) {
      this.$ul = this.$element.find('ul')
      this.$ul = this.$ul.length ? this.$ul : $('<ul></ul>').appendTo(this.$element)

      var pageClick = function(i){
        return function(){
          this.page(i)

          return false
        }
      }

      for (var i = 1; i < (this.pages + 1); i++) {
        var li = $('<li><a href="#">' + i + '</a></li>').appendTo(this.$ul).click($.proxy(pageClick(i-1), this))
      }

      if (this.options.showArrows) {
        this.$prev = $('<li><a href="#">' + this.options.prevText + '</a></li>').prependTo(this.$ul).click($.proxy(this.prev, this))
        this.$next = $('<li><a href="#">' + this.options.nextText + '</a></li>').appendTo(this.$ul).click($.proxy(this.next, this))
      }

      this.page(this.currentPage)
    }
  }

  Pagination.prototype = {

    constructor: Pagination

  , page: function(page) {
      this.$paged.hide()

      this.$ul.find('li').removeClass('active')

      var index = page + (this.options.showArrows ? 1 : 0)

      this.$ul.find('li:eq(' + index + ')').addClass('active')

      var filtered = this.$paged.filter(':lt(' + ((page + 1) * this.options.pageSize) + ')')

      if (page > 0) filtered = filtered.filter(':gt(' + ((page * this.options.pageSize) -1 ) + ')')

      filtered.show()

      if (this.options.showArrows) {
        if ((page + 1) < this.pages) {
          this.$next.removeClass('active')
        } else {
          this.$next.addClass('active')
        }

        if (page > 0) {
          this.$prev.removeClass('active')
        } else {
          this.$prev.addClass('active')
        }
      }

      this.currentPage = page
    }

  , next: function() {
      if (this.currentPage < (this.pages - 1)) {
        this.page(++this.currentPage)
      }

      return false
    }

  , prev: function() {
      if (this.currentPage > 0) {
        this.page(--this.currentPage)
      }

      return false
    }
  }

 /* PAGINATION PLUGIN DEFINITION
  * ======================= */

  $.fn.pagination = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('pagination')
      if (!data) $this.data('pagination', (data = new Pagination(this, option)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.pagination.Constructor = Pagination

  $.fn.pagination.defaults = $.extend({} , $.fn.tooltip.defaults, {
    pageSize: 3
  , showArrows : true
  , prevText: '&laquo'
  , nextText: '&raquo'
  })

}(window.jQuery);