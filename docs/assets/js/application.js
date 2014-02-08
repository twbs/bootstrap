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

  $(function () {

    // IE10 viewport hack for Surface/desktop Windows 8 bug
    //
    // See Getting Started docs for more information
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      var msViewportStyle = document.createElement('style')
      msViewportStyle.appendChild(
        document.createTextNode(
          '@-ms-viewport{width:auto!important}'
        )
      )
      document.querySelector('head').appendChild(msViewportStyle)
    }

    // Config ZeroClipboard
    ZeroClipboard.config({
      moviePath: '/assets/flash/zero-clipboard.swf',
      hoverClass: 'btn-clipboard-hover'
    })

    // Insert copy to clipboard button before .highlight or .bs-example
    $('.highlight').each(function() {
      var highlight = $(this)
      var previous = highlight.prev()
      var btnHtml = '<div class="zero-clipboard"><span class="glyphicon glyphicon-list-alt btn-clipboard"></span></div>'

      if (previous.hasClass('bs-example')) {
        previous.before(btnHtml.replace(/btn-clipboard/, 'btn-clipboard with-example'))
      } else {
        highlight.before(btnHtml)
      }
    })

    var $window = $(window)
    var $body   = $(document.body)

    var navHeight = $('.navbar').outerHeight(true) + 10
    var zeroClipboard = new ZeroClipboard($('.btn-clipboard'))
    var htmlBridge = $('#global-zeroclipboard-html-bridge')

    $body.scrollspy({
      target: '.bs-sidebar',
      // offset: navHeight
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })

    $('.bs-docs-container [href=#]').click(function (e) {
      e.preventDefault()
    })

    // back to top
    setTimeout(function () {
      var $sideBar = $('.bs-sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.bs-docs-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          },
          bottom: function () {
            return (this.bottom = $('.bs-footer').outerHeight(true))
          }
        }
      })
    }, 100)

    setTimeout(function () {
      $('.bs-top').affix()
    }, 100)

    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: '[data-toggle=tooltip]',
      container: 'body'
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    $('.bs-docs-navbar').tooltip({
      selector: 'a[data-toggle=tooltip]',
      container: '.bs-docs-navbar .nav'
    })

    // popover demo
    $('[data-toggle=popover]').popover()

    // button state demo
    $('#loading-example-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })

    // Handlers for ZeroClipboard
    zeroClipboard.on('load', function(client) {
      htmlBridge
        .data('placement', 'left')
        .attr('title', 'copy to clipboard')
        .tooltip()
    })

    // Copy to clipboard
    zeroClipboard.on('dataRequested', function(client) {
      var highlight = $(this).parent().nextAll('.highlight').first()

      client.setText(highlight.text())
    })

    // Notify copy success and reset tooltip title
    zeroClipboard.on('complete', function(client) {
      htmlBridge
        .attr('title', 'copied!')
        .tooltip('fixTitle')
        .tooltip('show')
        .attr('title', 'copy to clipboard')
        .tooltip('fixTitle')
    })

    // Notify copy failure
    zeroClipboard.on('noflash wrongflash', function(client) {
      htmlBridge
        .attr('title', 'flash not supported!')
        .tooltip('fixTitle')
        .tooltip('show')
    })

  })

}(jQuery)
