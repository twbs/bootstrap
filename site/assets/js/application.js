// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2019 The Bootstrap Authors
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global ClipboardJS: false, anchors: false, bootstrap: false, bsCustomFileInput: false */

(function () {
  'use strict'

  function makeArray(list) {
    return [].slice.call(list)
  }

  (function () {
    var checkbox = document.getElementById('flexCheckIndeterminate')

    if (!checkbox) {
      return
    }

    checkbox.indeterminate = true
  })()

  makeArray(document.querySelectorAll('.js-sidenav-group'))
    .forEach(function (sidenavGroup) {
      var groupHasLinks = Boolean(sidenavGroup.querySelector('li'))
      var groupLink = sidenavGroup.querySelector('a')

      if (groupHasLinks) {
        groupLink.addEventListener('click', function (e) {
          e.preventDefault()
          e.target.parentNode.classList.toggle('active')
        }, true)
      }
    })

  // Tooltip and popover demos
  makeArray(document.querySelectorAll('.tooltip-demo'))
    .forEach(function (tooltip) {
      new bootstrap.Tooltip(tooltip, {
        selector: '[data-toggle="tooltip"]'
      })
    })

  makeArray(document.querySelectorAll('[data-toggle="popover"]'))
    .forEach(function (popover) {
      new bootstrap.Popover(popover)
    })

  makeArray(document.querySelectorAll('.toast'))
    .forEach(function (toastNode) {
      var toast = new bootstrap.Toast(toastNode, {
        autohide: false
      })

      toast.show()
    })

  // Demos within modals
  makeArray(document.querySelectorAll('.tooltip-test'))
    .forEach(function (tooltip) {
      new bootstrap.Tooltip(tooltip)
    })

  makeArray(document.querySelectorAll('.popover-test'))
    .forEach(function (popover) {
      new bootstrap.Popover(popover)
    })

  // Indeterminate checkbox example
  makeArray(document.querySelectorAll('.bd-example-indeterminate [type="checkbox"]'))
    .forEach(function (checkbox) {
      checkbox.indeterminate = true
    })

  // Disable empty links in docs examples
  makeArray(document.querySelectorAll('.bd-content [href="#"]'))
    .forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault()
      })
    })

  // Modal relatedTarget demo
  var exampleModal = document.getElementById('exampleModal')
  if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', function (event) {
      var button = event.relatedTarget // Button that triggered the modal
      var recipient = button.getAttribute('data-whatever') // Extract info from data-* attributes

      // Update the modal's content.
      var modalTitle = exampleModal.querySelector('.modal-title')
      var modalBodyInput = exampleModal.querySelector('.modal-body input')

      modalTitle.innerHTML = 'New message to ' + recipient
      modalBodyInput.value = recipient
    })
  }

  // Activate animated progress bar
  var btnToggleAnimatedProgress = document.getElementById('btnToggleAnimatedProgress')
  if (btnToggleAnimatedProgress) {
    btnToggleAnimatedProgress.addEventListener('click', function () {
      btnToggleAnimatedProgress.parentNode
        .querySelector('.progress-bar-striped')
        .classList
        .toggle('progress-bar-animated')
    })
  }

  // Insert copy to clipboard button before .highlight
  var btnHtml = '<div class="bd-clipboard"><button type="button" class="btn-clipboard" title="Copy to clipboard">Copy</button></div>'
  makeArray(document.querySelectorAll('figure.highlight, div.highlight'))
    .forEach(function (element) {
      element.insertAdjacentHTML('beforebegin', btnHtml)
    })

  makeArray(document.querySelectorAll('.btn-clipboard'))
    .forEach(function (btn) {
      var tooltipBtn = new bootstrap.Tooltip(btn)

      btn.addEventListener('mouseleave', function () {
        // Explicitly hide tooltip, since after clicking it remains
        // focused (as it's a button), so tooltip would otherwise
        // remain visible until focus is moved away
        tooltipBtn.hide()
      })
    })

  var clipboard = new ClipboardJS('.btn-clipboard', {
    target: function (trigger) {
      return trigger.parentNode.nextElementSibling
    }
  })

  clipboard.on('success', function (e) {
    var tooltipBtn = bootstrap.Tooltip.getInstance(e.trigger)

    e.trigger.setAttribute('data-original-title', 'Copied!')
    tooltipBtn.show()

    e.trigger.setAttribute('data-original-title', 'Copy to clipboard')
    e.clearSelection()
  })

  clipboard.on('error', function (e) {
    var modifierKey = /Mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
    var fallbackMsg = 'Press ' + modifierKey + 'C to copy'
    var tooltipBtn = bootstrap.Tooltip.getInstance(e.trigger)

    e.trigger.setAttribute('data-original-title', fallbackMsg)
    tooltipBtn.show()

    e.trigger.setAttribute('data-original-title', 'Copy to clipboard')
  })

  anchors.options = {
    icon: '#'
  }
  anchors.add('.bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5')

  // Wrap inner
  makeArray(document.querySelectorAll('.bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5'))
    .forEach(function (hEl) {
      hEl.innerHTML = '<span class="bd-content-title">' + hEl.innerHTML + '</span>'
    })

  bsCustomFileInput.init()
})()
