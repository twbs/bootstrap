// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */


!function ($) {
  'use strict';

  $(function () {

    var $window = $(window)
    var $body   = $(document.body)

    $body.scrollspy({
      target: '.bs-docs-sidebar'
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })

    $('.bs-docs-container [href=#]').click(function (e) {
      e.preventDefault()
    })

    // back to top
    setTimeout(function () {
      var $sideBar = $('.bs-docs-sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.bs-docs-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          },
          bottom: function () {
            return (this.bottom = $('.bs-docs-footer').outerHeight(true))
          }
        }
      })
    }, 100)

    setTimeout(function () {
      $('.bs-top').affix()
    }, 100)

    // theme toggler
    ;(function () {
      var stylesheetLink = $('#bs-theme-stylesheet')
      var themeBtn = $('.bs-docs-theme-toggle')
      themeBtn.click(function () {
        var href = stylesheetLink.attr('href');
        if (!href || href.indexOf('data') === 0) {
          stylesheetLink.attr('href', stylesheetLink.attr('data-href'))
          themeBtn.text('Disable theme preview')
        }
        else {
          stylesheetLink.attr('href', '')
          themeBtn.text('Preview theme')
        }
      })
    })();

    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: '[data-toggle="tooltip"]',
      container: 'body'
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    $('.bs-docs-navbar').tooltip({
      selector: 'a[data-toggle="tooltip"]',
      container: '.bs-docs-navbar .nav'
    })

    // popover demo
    $('.bs-docs-popover').popover()

    // Popover dismiss on next click
    $('.bs-docs-popover-dismiss').popover({
      trigger: 'focus'
    })

    // button state demo
    $('#loading-example-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })
  })

}(jQuery)
