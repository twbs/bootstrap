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
        stop()
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

      test("should fire slide event with relatedTarget", function () {
        var template = '<div id="myCarousel" class="carousel slide"><div class="carousel-inner"><div class="item active"><img src="assets/img/bootstrap-mdo-sfmoma-01.jpg" alt=""><div class="carousel-caption"><h4>{{_i}}First Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img src="assets/img/bootstrap-mdo-sfmoma-02.jpg" alt=""><div class="carousel-caption"><h4>{{_i}}Second Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img src="assets/img/bootstrap-mdo-sfmoma-03.jpg" alt=""><div class="carousel-caption"><h4>{{_i}}Third Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div></div><a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a><a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a></div>'
        $.support.transition = false
        stop()
        $(template)
          .on('slide', function (e) {
            e.preventDefault();
            ok(e.relatedTarget);
            ok($(e.relatedTarget).hasClass('item'));
            start();
          })
          .carousel('next')
      })

})