$(function () {

    module("bootstrap-carousel")

      test("should be defined on jquery object", function () {
        ok($(document.body).carousel, 'carousel method is defined')
      })

      test("should return element", function () {
        ok($(document.body).carousel()[0] == document.body, 'document.body returned')
      })

      test("should not fire sliden when slide is prevented", function () {
        $.support.transition = false
        stop();
        $('<div class="carousel"/>')
          .bind('slide', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .bind('slid', function () {
            ok(false);
          })
          .carousel('next')
      })

      test("it should have indicator pills by default", function () {
        ok($('<div class="carousel"/>').carousel().find("span.carousel-pills").length > 0);
      })

      test("it should not add indicator pills when its deactivated", function () {
        ok($('<div class="carousel"/>').carousel({
          pills: false
        }).find("span.carousel-pills").length === 0);
      })

      test("it should add as many pills as there are items", function () {

        var inner = $('<div class="carousel-inner" />')
                      .append('<div class="item" />')
                      .append('<div class="item" />')
                      .append('<div class="item" />')
          , carousel = $('<div class="carousel"/>').append(inner).carousel();

        ok(carousel.find(".carousel-pills span").length === carousel.find(".item").length);
      })


      test("it should have navigateable indicator pills", function () {

        var inner = $('<div class="carousel-inner" />')
                      .append('<div class="item active" />')
                      .append('<div class="item" />')
                      .append('<div class="item" />')
          , carousel = $('<div class="carousel"/>').append(inner).carousel({
              interval: false
            });

        stop();
        carousel.bind('slid', function () {
          ok(carousel.find(".item.active").index() === 1);
          start();
        });

        // Click second pill
        carousel.find(".carousel-pills span:nth-child(2)").trigger("click");
      })

})