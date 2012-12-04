/* ============================================================
 * bootstrap-dropdown.js v2.2.2
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
        var $el = $(element).on('click.dropdown.data-api touchstart.dropdown.data-api', this.toggle)
        $(document).on('click.dropdown.data-api touchstart.dropdown.data-api', function () {
          clearMenus(getParent($el))
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      $parent.data('parent', $this) // For when we close the dropdown

      $this.focus()

      if (!isActive) {
        $parent.toggleClass('open')
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
        , keyMap
        , pullLeft
        , dropup

      if (!~$.inArray(e.which, [27, 37, 38, 39, 40])) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || e.which === 27) {
        return (($parent.is('.dropdown-submenu') ? getParent($parent.parents('.dropdown-menu').last()) : $parent).data('parent') || $this).click()
      }

      $items = $parent.find(' > .dropdown-menu > li:visible:not(.divider) > a')

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      keyMap       = {}
      keyMap.up    = 38
      keyMap.left  = 37
      keyMap.down  = 40
      keyMap.right = 39

      pullLeft = (~index ? $items.eq(index) : $this).closest('.dropdown-submenu').is('.pull-left')
      dropup   = (~index ? $items.eq(index) : $this).closest('.dropdown, .dropup').is('.dropup:not(.dropdown)')

      if (!~index) {
        if (e.which === keyMap.up) index = -1
        if (e.which === keyMap.down) index = 0
      } else {
        if (e.which === keyMap.up && index > 0) index--
        if (e.which === keyMap.down && index < $items.length - 1) index++
      }

      // Reverse left and right buttons if the submenu is pulled to the left
      if (pullLeft) {
        keyMap.left  = 39
        keyMap.right = 37
      }

      // Left or right arrows
      if (e.which === keyMap.left || e.which === keyMap.right) {
        // Cache the result
        var $submenu
        // Right arrow and a submenu
        if (e.which === keyMap.right && (($submenu = $items.eq(index).parent()) && $submenu.hasClass('dropdown-submenu'))) {
          $submenu
            .find(' > .dropdown-menu > li:visible:not(.divider) > a')
              .eq(dropup ? -1 : 0)
              .focus()
        } else if (e.which === keyMap.left && $parent.is('.dropdown-submenu')) {
          $this.children('.dropdown-submenu').removeClass('open')
          $parent.removeClass('open').children('a').first().focus()
        }
      // Up or down arrows
      } else {
        $items
          .eq(index)
          .focus()
      }

    }

  , focusin: function (e) {
      var $this = $(this)
        , active

      active = $this.parent().filter('.dropdown-submenu').index()

      $this.parent().parent().children()
        .each(function (index) {
          $(this)
            .toggleClass('open', (active === index))
            .filter('.dropdown-submenu')
              .find('.dropdown-submenu')
                .removeClass('open')
        })
    }

  , touchstart: function (e) {
      var $this = $(this)
        , active

      active = $this.parent().filter('.dropdown-submenu').index()

      if (~active) {

        $this.parent().parent().children()
          .each(function (index) {
            $(this)
              .toggleClass('open', (active === index))
              .filter('.dropdown-submenu')
                .find('.dropdown-submenu')
                  .removeClass('open')
          })

      } else {
        $this.click()
      }

      return false
    }

  }

  function clearMenus($this) {
    ($this || $(toggle)).each(function () {
      getParent($(this)).removeClass('open').find('.dropdown-submenu').removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
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

  $(document)
    .on('click.dropdown.data-api touchstart.dropdown.data-api', function () { clearMenus() })
    .on('click.dropdown.data-api touchstart.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api touchstart.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('focusin.dropdown.data-api', toggle + ', .dropdown-menu li > a', Dropdown.prototype.focusin)
    .on('keydown.dropdown.data-api', toggle + ', .dropdown-menu', Dropdown.prototype.keydown)
    .on('touchstart.dropdown.data-api', '.dropdown-menu li > a', Dropdown.prototype.touchstart)

}(window.jQuery);