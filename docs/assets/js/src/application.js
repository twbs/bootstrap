// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global Clipboard, anchors */

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

    // Indeterminate checkbox example
    $('.bd-example-indeterminate [type="checkbox"]').prop('indeterminate', true)

    // Disable empty links in docs examples
    $('.bd-example [href=#]').click(function (e) {
      e.preventDefault()
    })

    // Insert copy to clipboard button before .highlight
    $('.highlight').each(function () {
      var btnHtml = '<div class="bd-clipboard"><span class="btn-clipboard">Copy</span></div>'
      $(this).before(btnHtml)
    })

    var clipboard = new Clipboard('.bd-clipboard', {
      target: function (trigger) {
        return trigger.nextElementSibling;
      }
    });

    /*
    clipboard.on('success', function (e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);

      e.clearSelection();
    });

    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });*/

  })

}(jQuery)

;(function () {
  'use strict';

  anchors.options.placement = 'left';
  anchors.add('.bd-content > h1, .bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5')
})();
