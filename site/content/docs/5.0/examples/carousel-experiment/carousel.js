(function () {
  'use strict'

  var carouselItems = [].slice.call(document.querySelectorAll('.carousel-show-three .carousel-item'))
  var hasRun = false

  /* https://gomakethings.com/how-to-get-all-of-an-elements-siblings-with-vanilla-js/ */
  function getSiblings(element) {
    // Setup siblings array and get the first sibling
    var siblings = []
    var sibling = element.parentNode.firstChild

    // Loop through each sibling and push to the array
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== element) {
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

    carouselItems.forEach(function (carouselItem) {
      // Get the first carousel item's child
      var siblings = getSiblings(carouselItem.firstChild)

      // Remove .carousel-item's first child next elements
      siblings.forEach(function (sibling) {
        sibling.parentNode.removeChild()
      })
    })

    hasRun = false
  }

  // For every slide in carousel, copy the next slide's item in the slide.
  // Do the same for the next, next item.
  function populateCarouselItems() {
    if (window.matchMedia('(max-width: 768px)').matches || hasRun) {
      return
    }

    carouselItems.forEach(function (carouselItem) {
      var next = carouselItem.nextElementSibling

      if (next) {
        carouselItem.appendChild(next.querySelector(':first-child').cloneNode(true))

        var nextSiblingsList = getSiblings(carouselItem.firstChild)

        if (nextSiblingsList.length > 0) {
          carouselItem.appendChild(next.nextElementSibling.querySelector(':first-child').cloneNode(true))
        } else {
          carouselItem.appendChild(carouselItem.nextElementSibling.firstChild.cloneNode(true))
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
