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

      test("should fire slide event with relatedTarget", function () {
        var template = '<div id="myCarousel" class="carousel slide"><div class="carousel-inner"><div class="item active"><img alt=""><div class="carousel-caption"><h4>{{_i}}First Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Second Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Third Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div></div><a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a><a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a></div>'
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

      test("should set interval from data attribute", 3,function () {
        var template = $('<div id="myCarousel" class="carousel slide"> <div class="carousel-inner"> <div class="item active"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}First Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Second Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Third Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> </div> <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a> <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a> </div>');
        template.attr("data-interval", 1814);

        template.appendTo("body");
        $('[data-slide]').first().click();
        ok($('#myCarousel').data('carousel').options.interval == 1814);
        $('#myCarousel').remove();

        template.appendTo("body").attr("data-modal", "foobar");
        $('[data-slide]').first().click();
        ok($('#myCarousel').data('carousel').options.interval == 1814, "even if there is an data-modal attribute set");
        $('#myCarousel').remove();

        template.appendTo("body");
        $('[data-slide]').first().click();
        $('#myCarousel').attr('data-interval', 1860);
        $('[data-slide]').first().click();
        ok($('#myCarousel').data('carousel').options.interval == 1814, "attributes should be read only on intitialization");
        $('#myCarousel').remove();
      })
})