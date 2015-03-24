/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.4'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.keydown = function (e) {
    var $li     = $(e.target).parent()
    var key     = e.which
    var $items  = $li.closest('ul[role="tablist"]').find('li')
    var len     = $items.length
    var index   = $li.index()
    var dir
    var $newTab

    switch (key) {
      case 37: // left
      case 38: // up
        dir = -1
        break
      case 39: // right
      case 40: // down
        dir = 1
        break
      default:
        return
    }

    e.preventDefault()
    e.stopPropagation()

    $newTab = $items.eq((index + len + dir) % len)

    if ($newTab) Plugin.call($newTab.find('a'), 'show')
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')

      if (element.attr('role') == 'tabpanel') { // Is this a panel or a tab
        $active.attr('aria-hidden', true)
        element.attr('aria-hidden', false)
      } else {
        $active
          .find('> [role="tab"]')
          .attr({
            'aria-selected': false,
            tabindex: -1
          })

        element
          .find('> [role="tab"]')
          .attr({
            'aria-selected': true,
            tabindex: 0
          })
          .trigger('focus')
      }

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }

  Tab.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $('[data-toggle="tab"], [data-toggle="pill"]').each(function () {
    var $this     = $(this)
    var $parent   = $this.parent()
    var active    = $parent.hasClass('active')
    var selector  = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    $parent.attr('role', 'presentation')

    $this.attr({
      'aria-selected': active,
      'aria-controls': selector.replace('#', ''),
      role: 'tab',
      tabindex: (active) ? 0 : -1
    })

    if (!$this.attr('id')) {
      $this.attr('id', Tab.prototype.getUID('tab'))
    }

    $(selector).attr({
      'aria-hidden': !active,
      'aria-labelledby': $this.attr('id'),
      role: 'tabpanel'
    })
  });

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  })
  .on('keydown.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', Tab.prototype.keydown)

}(jQuery);
