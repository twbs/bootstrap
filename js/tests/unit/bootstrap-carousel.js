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

      test("should set interval from data attribute once", function () {
        var template = $('<div id="myCarousel" data-interval=1000 data-modal="foo" class="carousel slide"> <div class="carousel-inner"> <div class="item active"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}First Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Second Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Third Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> </div> <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a> <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a> </div>');
        stop()
        $.support.transition = false
        template.appendTo("body");

        $(document).find('[data-slide]').first().on('click', function(e){

         }).click();

        start();


        ok($('#myCarousel').data('carousel').options.interval == 1000)
      })

})