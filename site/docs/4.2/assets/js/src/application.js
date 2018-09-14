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

  document.addEventListener('DOMContentLoaded', function () {
    // Tooltip and popover demos
    var tooltipDemoList = [].slice.call(document.querySelectorAll('.tooltip-demo'))
    tooltipDemoList.forEach(function (tooltip) {
      new bootstrap.Tooltip(tooltip, {
        selector: '[data-toggle="tooltip"]'
      })
    })

    var popoverList = [].slice.call(document.querySelectorAll('[data-toggle="popover"]'))
    popoverList.forEach(function (popover) {
      new bootstrap.Popover(popover)
    })

    $('.toast')
      .toast({
        autohide: false
      })
      .toast('show')

    // Demos within modals
    var tooltipTestList = [].slice.call(document.querySelectorAll('.tooltip-test'))
    tooltipTestList.forEach(function (tooltip) {
      new bootstrap.Tooltip(tooltip)
    })

    var popoverTestList = [].slice.call(document.querySelectorAll('.popover-test'))
    popoverTestList.forEach(function (popover) {
      new bootstrap.Popover(popover)
    })

    // Indeterminate checkbox example
    var indeterminateCheckboxList = [].slice.call(document.querySelectorAll('.bd-example-indeterminate [type="checkbox"]'))
    indeterminateCheckboxList.forEach(function (checkbox) {
      checkbox.indeterminate = true
    })

    // Disable empty links in docs examples
    var emptyLinkList = [].slice.call(document.querySelectorAll('.bd-content [href="#"]'))
    emptyLinkList.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault()
      })
    })

    // Modal relatedTarget demo
    var exampleModal = document.getElementById('exampleModal')
    if (exampleModal) {
      exampleModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget                     // Button that triggered the modal
        var recipient = button.getAttribute('data-whatever') // Extract info from data-* attributes

        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modalTitle = exampleModal.querySelector('.modal-title')
        var modalBodyInput = exampleModal.querySelector('.modal-body input')

        modalTitle.innerHTML = 'New message to ' + recipient
        modalBodyInput.value = recipient
      })
    }

    // Activate animated progress bar
    var animatedProgressBarList = [].slice.call(document.querySelectorAll('.bd-toggle-animated-progress > .progress-bar-striped'))
    animatedProgressBarList.forEach(function (progressBar) {
      progressBar.addEventListener('click', function () {
        if (progressBar.classList.contains('progress-bar-animated')) {
          progressBar.classList.remove('progress-bar-animated')
        } else {
          progressBar.classList.add('progress-bar-animated')
        }
      })
    })

    // Insert copy to clipboard button before .highlight
    var btnHtml = '<div class="bd-clipboard"><button type="button" class="btn-clipboard" title="Copy to clipboard">Copy</button></div>'
    var highList = [].slice.call(document.querySelectorAll('figure.highlight, div.highlight'))
    highList.forEach(function (element) {
      element.insertAdjacentHTML('beforebegin', btnHtml)
    })

    var copyBtnList = [].slice.call(document.querySelectorAll('.btn-clipboard'))
    copyBtnList.forEach(function (btn) {
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
      var tooltipBtn = bootstrap.Tooltip._getInstance(e.trigger)

      e.trigger.setAttribute('title', 'Copied!')
      tooltipBtn._fixTitle()
      tooltipBtn.show()

      e.trigger.setAttribute('title', 'Copy to clipboard')
      tooltipBtn._fixTitle()
      e.clearSelection()
    })

    clipboard.on('error', function (e) {
      var modifierKey = /Mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
      var fallbackMsg = 'Press ' + modifierKey + 'C to copy'
      var tooltipBtn = bootstrap.Tooltip._getInstance(e.trigger)

      e.trigger.setAttribute('title', fallbackMsg)
      tooltipBtn._fixTitle()
      tooltipBtn.show()

      e.trigger.setAttribute('title', 'Copy to clipboard')
      tooltipBtn._fixTitle()
    })

    anchors.options = {
      icon: '#'
    }
    anchors.add('.bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5')

    // Wrap inner
    var hList = [].slice.call(document.querySelectorAll('.bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5'))
    hList.forEach(function (hEl) {
      var span = document.createElement('span')
      span.classList.add('bd-content-title')
      hEl.parentElement.insertBefore(span, hEl)
      span.appendChild(hEl)
    })

    bsCustomFileInput.init()
  })
}())
