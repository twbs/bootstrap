// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global ZeroClipboard, anchors */

!function ($) {
  'use strict';

  $(function () {

    // Tooltip and popover demos
    $('.tooltip-demo').tooltip({
      selector: '[data-toggle="tooltip"]',
      container: 'body'
    })

    $('[data-toggle="popover"]').popover()

    // Demos within modals
    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // Disable empty links in docs examples
    $('.bd-example [href=#]').click(function (e) {
      e.preventDefault()
    })

    // Config ZeroClipboard
    ZeroClipboard.config({
      moviePath: '/assets/flash/ZeroClipboard.swf',
      hoverClass: 'btn-clipboard-hover'
    })

    // Insert copy to clipboard button before .highlight
    $('.highlight').each(function () {
      var btnHtml = '<div class="zero-clipboard"><span class="btn-clipboard">Copy</span></div>'
      $(this).before(btnHtml)
    })
    var zeroClipboard = new ZeroClipboard($('.btn-clipboard'))
    var $htmlBridge = $('#global-zeroclipboard-html-bridge')

    // Handlers for ZeroClipboard
    zeroClipboard.on('load', function () {
      $htmlBridge
        .data('placement', 'top')
        .attr('title', 'Copy to clipboard')
        .tooltip()

      // Copy to clipboard
      zeroClipboard.on('dataRequested', function (client) {
        var highlight = $(this).parent().nextAll('.highlight').first()
        client.setText(highlight.text())
      })

      // Notify copy success and reset tooltip title
      zeroClipboard.on('complete', function () {
        $htmlBridge
          .attr('title', 'Copied!')
          .tooltip('fixTitle')
          .tooltip('show')
          .attr('title', 'Copy to clipboard')
          .tooltip('fixTitle')
      })
    })

    // Hide copy button when no Flash is found
    // or wrong Flash version is present
    zeroClipboard.on('noflash wrongflash', function () {
      $('.zero-clipboard').remove()
      ZeroClipboard.destroy()
    })

  })

}(jQuery)

;(function () {
  'use strict';

  anchors.options.placement = 'left';
  anchors.add('.bd-content > h1, .bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5')
})();
