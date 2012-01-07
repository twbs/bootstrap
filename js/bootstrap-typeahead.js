/* =============================================================
 * bootstrap-typeahead.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#collapsible
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
 * ============================================================ */

!function( $ ){

  "use strict"

  var Typeahead = function ( element, options ) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.$menu = $(this.options.menu).appendTo('body')
    this.data = this.options.data
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , matcher: function(item, query) {
      return ~item.indexOf(query)
    }

  , select: function(event) {
      this.$element.val($(event.target).attr('data-value'))
      this.hide()
    }

  , show: function () {
      this.shown = true
      this.$menu.show()
      return this
    }

  , hide: function () {
      this.shown = false
      this.$menu.hide()
      return this
    }

  , lookup: function (event) {
      var query = this.$element.val()
        , that = this

      var items = this.data.filter(function (item) {
        if (that.matcher(item, query)) {
          return item
        }
      })

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items).show()
    }

  , render: function(items) {
      var that = this

      items = $(items).map(function (i, item) {
        return $(that.options.item)
          .text(item)
          .attr('data-value', item)[0]
      })

      items.first().addClass('active')

      this.$menu.append(items)

      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next() || $(this.$menu.find('li')[0])

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.prev() || this.$menu.find('li').last()

      next.addClass('active')
    }

  , keyup: function () {
      event
        .stopPropagation()
        .preventDefault()

      switch(event.keyCode) {
        case 9: // tab
        case 13: // enter
          this.select()
          break

        case 27: // escape
          this.hide()
          break

        default:
          this.lookup()
      }
  }

  , keypress: function (event) {
      event.stopPropagation()
      switch(event.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          event.preventDefault()
          break

        case 38: // up arrow
          this.prev()
          event.preventDefault()
          break

        case 40: // down arrow
          this.next()
          event.preventDefault()
          break
      }
  }

  , listen: function () {
      this.$element
        .on('focus', this.show)
        .on('blur', $.proxy(this.hide, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup', this.keyup)
        .on('change', $.proxy(this.lookup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', this.keypress)
      }

      this.$menu
        .on('click', '* > *', $.proxy(this.select, this))
        .on('mouseenter', function () {
          /* remove selected class, add to mouseover */
        })
    }
  }

  /* TYPEAHEAD PLUGIN DEFINITION
  * ============================== */

  $.fn.typeahead = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    data: null
  , items: 8
  , empty: false
  , noresults: false
  , menu: '<ul class="dropdown-menu"></ul>'
  , item: '<li></li>'
  }

  $.fn.typeahead.Constructor = Typeahead

}( window.jQuery )