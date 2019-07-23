(function () {
  'use strict'

  var carouselItems = document.querySelectorAll('.carousel-show-three .carousel-item')
  var hasRun = false

  /* https://gomakethings.com/how-to-get-all-of-an-elements-siblings-with-vanilla-js/ */
  function getSiblings(elem) {
    // Setup siblings array and get the first sibling
    var siblings = []
    var sibling = elem.parentNode.firstChild

    // Loop through each sibling and push to the array
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== elem) {
        siblings.push(sibling)
      }

      sibling = sibling.nextSibling
    }

    return siblings
  }

  function removeCarouselItems() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      return
    }

    [].slice.call(carouselItems).forEach(function (el) {
      // Get the first carousel item's child
      var siblings = getSiblings(el.firstChild);

      // Remove .carousel-item's first child next elements
      [].slice.call(siblings).forEach(function (ele) {
        ele.parentNode.removeChild()
      })
    })

    hasRun = false
  }

  // For every slide in carousel, copy the next slide's item in the slide.
  // Do the same for the next, next item.
  function populateCarouselItems() {
    if (window.matchMedia('(max-width: 768px)').matches || hasRun === true) {
      return
    }

    [].slice.call(carouselItems).forEach(function (el) {
      var next = el.nextElementSibling

      if (next) {
        next = getSiblings(el.firstChild)

        el.appendChild(next[0].cloneNode(true))

        if (next.nextElementSibling) {
          el.appendChild(next.nextElementSibling.querySelector(':first-child').cloneNode(true))
        } else {
          el.appendChild(getSiblings(el.firstChild)[0].cloneNode(true))
        }
      }
    })

    hasRun = true
  }

  populateCarouselItems()

  window.addEventListener('resize', function () {
    removeCarouselItems()
    populateCarouselItems()
  })
})()
