(function ($) {
  'use strict'

  var $win = $(window)
  var $carouselItems = $('.carousel-show-three .carousel-item')
  var $hasRun = false

  function removeCarouselItems() {
    if ($win.width() >= 768) {
      return
    }

    $carouselItems.each(function (i, el) {
      // Remove .carousel-item's first child next elements
      $(el).children(':first-child').nextAll().remove()
    })

    $hasRun = false
  }

  // For every slide in carousel, copy the next slide's item in the slide.
  // Do the same for the next, next item.
  function populateCarouselItems() {
    if ($win.width() < 768 || $hasRun === true) {
      return
    }

    $carouselItems.each(function (i, el) {
      var $next = $(el).next()

      if ($next.length === 0) {
        $next = $(el).siblings(':first')
      }

      $next.children(':first-child').clone().appendTo($(el))

      if ($next.next().length > 0) {
        $next.next().children(':first-child').clone().appendTo($(el))
      } else {
        $(el).siblings(':first').children(':first-child').clone().appendTo($(el))
      }
    })

    $hasRun = true
  }

  populateCarouselItems()

  $win.on('resize', function () {
    removeCarouselItems()
    populateCarouselItems()
  })
}(jQuery))
