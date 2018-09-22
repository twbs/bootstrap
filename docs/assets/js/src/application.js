// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2018 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global ClipboardJS: false, anchors: false */

!function ($) {
  'use strict';

  $(function () {

    // Scrollspy
    var $window = $(window)
    var $body   = $(document.body)

    $body.scrollspy({
      target: '.bs-docs-sidebar'
    })
    $window.on('load', function () {
      $body.scrollspy('refresh')
    })

    // Kill links
    $('.bs-docs-container [href="#"]').click(function (e) {
      e.preventDefault()
    })

    // Sidenav affixing
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

    // Theme toggler
    ;(function () {
      var $stylesheetLink = $('#bs-theme-stylesheet')
      var $themeBtn = $('.bs-docs-theme-toggle')

      var activateTheme = function () {
        $stylesheetLink.attr('href', $stylesheetLink.attr('data-href'))
        $themeBtn.text('Disable theme preview')
        localStorage.setItem('previewTheme', true)
      }

      if (localStorage.getItem('previewTheme')) {
        activateTheme()
      }

      $themeBtn.click(function () {
        var href = $stylesheetLink.attr('href')
        if (!href || href.indexOf('data') === 0) {
          activateTheme()
        } else {
          $stylesheetLink.attr('href', '')
          $themeBtn.text('Preview theme')
          localStorage.removeItem('previewTheme')
        }
      })
    })();

    // Tooltip and popover demos
    $('.tooltip-demo').tooltip({
      selector: '[data-toggle="tooltip"]',
      container: 'body'
    })
    $('.popover-demo').popover({
      selector: '[data-toggle="popover"]',
      container: 'body'
    })

    // Demos within modals
    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // Popover demos
    $('.bs-docs-popover').popover()

    // Button state demo
    $('#loading-example-btn').on('click', function () {
      var $btn = $(this)
      $btn.button('loading')
      setTimeout(function () {
        $btn.button('reset')
      }, 3000)
    })

    // Modal relatedTarget demo
    $('#exampleModal').on('show.bs.modal', function (event) {
      var $button = $(event.relatedTarget)      // Button that triggered the modal
      var recipient = $button.data('whatever')  // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var $modal = $(this)
      $modal.find('.modal-title').text('New message to ' + recipient)
      $modal.find('.modal-body input').val(recipient)
    })

    // Activate animated progress bar
    $('.bs-docs-activate-animated-progressbar').on('click', function () {
      $(this).siblings('.progress').find('.progress-bar-striped').toggleClass('active')
    })

    // Insert copy to clipboard button before .highlight
    $('figure.highlight, div.highlight').each(function () {
      var btnHtml = '<div class="bs-clipboard"><button type="button" class="btn-clipboard" title="Copy to clipboard">Copy</button></div>'
      $(this).before(btnHtml)
      $('.btn-clipboard')
        .tooltip()
        .on('mouseleave', function () {
          // Explicitly hide tooltip, since after clicking it remains
          // focused (as it's a button), so tooltip would otherwise
          // remain visible until focus is moved away
          $(this).tooltip('hide')
        })
    })

    var clipboard = new ClipboardJS('.btn-clipboard', {
      target: function (trigger) {
        return trigger.parentNode.nextElementSibling
      }
    })

    clipboard.on('success', function (e) {
      $(e.trigger)
        .attr('title', 'Copied!')
        .tooltip('fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('fixTitle')

      e.clearSelection()
    })

    clipboard.on('error', function (e) {
      var modifierKey = /Mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
      var fallbackMsg = 'Press ' + modifierKey + 'C to copy'

      $(e.trigger)
        .attr('title', fallbackMsg)
        .tooltip('fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('fixTitle')
    })

  })

}(jQuery)

;(function () {
  'use strict';

  anchors.options.placement = 'left';
  anchors.add('.bs-docs-section > h1, .bs-docs-section > h2, .bs-docs-section > h3, .bs-docs-section > h4, .bs-docs-section > h5')
})();
