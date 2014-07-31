/* ========================================================================
 * Bootstrap: tab.js v3.3.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.0'

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
    var key     = e.which || e.keyCode
    var $items  = $li.closest('ul[role="tablist"]').find('li')
    var index   = $li.index()
    var uBound  = $items.length -1
    var newTab

    e.preventDefault()
    e.stopPropagation()

    switch (key) {
      case 37: // left
      case 38: // up
        newTab = (index === 0) ? $items[uBound] : $items[index-1]
        break
      case 39: // right
      case 40: // down
        newTab = (index === uBound) ? $items[0] : $items[index + 1]
        break
    }

    if (newTab) $(newTab).tab('show')

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

      if (element.attr('role') === 'tabpanel') { // Is this a panel or a tab
        $active.attr('aria-hidden', true)
        element.attr('aria-hidden', false)
      } else {
        $active
          .find('> [role="tab"]')
          .attr({
            'aria-selected': false,
            'tabindex': -1
          })

        element
          .find('> [role="tab"]')
          .attr({
            'aria-selected': true,
            'tabindex': 0
          })
          .focus()
      }

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
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
    var $this   = $(this)
    var $parent = $this.parent()
    var active  = $parent.hasClass('active')

    $parent.attr('role', 'presentation')

    $this.attr({
      'aria-selected':  active,
      'aria-controls':  $this.attr('href').replace('#', ''),
      'role':           'tab',
      'tabindex':       (active) ? 0 : -1
    })

    $($this.attr('href')).attr({
      'aria-hidden':      !active,
      'aria-labelledby':  $this.attr('id'),
      'role':             'tabpanel'
    })
  });

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

  $(document).on('keydown.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', $.fn.tab.Constructor.prototype.keydown)

}(jQuery);
