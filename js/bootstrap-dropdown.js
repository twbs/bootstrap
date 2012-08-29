/* ============================================================
 * bootstrap-dropdown.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
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


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      if (!$parent.hasClass('open')) {
        clearMenus()
        $parent.addClass('open')
        $this.focus()
      }

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!~$.inArray(e.which, [37, 38, 39, 40, 27])) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      if (e.which == 27 && $parent.hasClass('open')) {
        clearMenus()
        return ($parent.hasClass('dropdown-submenu') ? $parent.parents('.dropdown-menu').last().parent() : $parent)
          .children('a').focus()
      }

      $items = $parent.find(' > .dropdown-menu > li:not(.divider) > a')

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.which === 38 && index > 0) index--
      if (e.which === 40 && index < $items.length - 1) index++
      if (!~index) index = 0

      // Left arrow
      if (e.which === 37) {
        $this.children('.dropdown-submenu').removeClass('open')
        $parent.removeClass('open').children('a').focus()
      // Right arrow
      } else if (e.which === 39) {
        $items
          .eq(index)
          .parent()
            .filter('.dropdown-submenu')
            .find(' > .dropdown-menu > li:not(.divider) > a')
              .eq(0)
              .focus()
      // Up or down arrows
      } else {
        $items
          .eq(index)
          .focus()
      }

    }

  , focus: function (e) {
    var $this = $(this)
      , current

    // Trigger focus immediately after touchstart to avoid click delay
    if (e.type == 'touchstart') {
      e.preventDefault()
      return $this.focus()
    }

    current = $this.parent().filter('.dropdown-submenu').index()

    $this
      .closest('.dropdown-menu')
        .children()
        .each(function (index, element) {
          $(element)
            .toggleClass('open', (current === index))
            .filter('.dropdown-submenu')
              .find('.dropdown-submenu')
                .removeClass('open')
        })
    }

  }

  function clearMenus() {
    getParent($(toggle))
      .removeClass('open')
      .find('.dropdown-submenu')
        .removeClass('open')
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)
    $parent.length || ($parent = $this.parent())

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html')
      .on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown touchstart.dropdown', '.dropdown form, .dropdown-submenu > a', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api touchstart.dropdown.data-api', toggle, Dropdown.prototype.toggle)
      .on('focusin.dropdown.data-api touchstart.dropdown.data-api', toggle + ', .dropdown-menu a', Dropdown.prototype.focus)
      .on('keydown.dropdown.data-api', toggle + ', .dropdown-menu' , Dropdown.prototype.keydown)
  })

}(window.jQuery);