// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com)
 * Copyright 2011-2017 The Bootstrap Authors
 * Copyright 2011-2017 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global Clipboard, anchors */

(function ($) {
  'use strict'

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
    $('.bd-content [href="#"]').click(function (e) {
      e.preventDefault()
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
    $('.bd-toggle-animated-progress').on('click', function () {
      $(this).siblings('.progress').find('.progress-bar-striped').toggleClass('progress-bar-animated')
    })

    // Insert copy to clipboard button before .highlight
    $('.highlight').each(function () {
      var btnHtml = '<div class="bd-clipboard"><span class="btn-clipboard" title="Copy to clipboard">Copy</span></div>'
      $(this).before(btnHtml)
      $('.btn-clipboard').tooltip()
    })

    var clipboard = new Clipboard('.btn-clipboard', {
      target: function (trigger) {
        return trigger.parentNode.nextElementSibling
      }
    })

    clipboard.on('success', function (e) {
      $(e.trigger)
        .attr('title', 'Copied!')
        .tooltip('_fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('_fixTitle')

      e.clearSelection()
    })

    clipboard.on('error', function (e) {
      var modifierKey = /Mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
      var fallbackMsg = 'Press ' + modifierKey + 'C to copy'

      $(e.trigger)
        .attr('title', fallbackMsg)
        .tooltip('_fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('_fixTitle')
    })

  })

}(jQuery))

;(function () {
  'use strict'

  anchors.options.placement = 'left'
  anchors.add('.bd-content > h1, .bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5')
}())

// Slick Init
;(function () {
  'use strict'

  $(".slider .slider-inner").slick({

    // general
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 20,
    swipeToSlide: true,
    slide: '.slider-item',

    // controls
    dots: true,
    appendDots: $('.slider-control-indicators'),
    arrows: true,
    prevArrow: $('.slider-control-prev'),
    nextArrow: $('.slider-control-next'),

    // responsive
    mobileFirst: true,
    responsive: [{
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      }
    }, {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      }
    },{
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      }
    },{
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
      }
    },],
  });
}())

// Floating-Label Demo Code
$('.js-float-input').each(function() {
  var $input = $(this).find('input'),
      val = $input.val();

  if (val) {
    $(this).addClass('is-filled');
  }
});

$('.js-float-input input').on('focus', function() {
  $(this).closest('.js-float-input').addClass('is-focused');
});

$('.js-float-input input').on('blur', function() {
  $(this).closest('.js-float-input').removeClass('is-focused');
});

$('.js-float-input input').on('input', function() {
  var $input = $(this),
      val = $input.val();

  if (val) {
    $(this).closest('.js-float-input').addClass('is-filled');
  } else {
    $(this).closest('.js-float-input').removeClass('is-filled');
  }
});