/* main nav img height fix */

$('.nav .dropdown').on('show.bs.dropdown', function(){ 
  var height = $(this).find('.dropdown-menu').height();
  $(this).find('.col-menu-img').height( height );
})

/* modal carousel */

$('#carousel-ba').carousel({
  interval: false
})

/* modal carousel */

$('.row-modalcarousel > a').each(function(i) {
  var $itemTemplate = $('<div class="item"> <img src="{img}" alt="{alt}"><div class="carousel-caption"><p>{caption}</p></div> </div>');
  $itemTemplate.find('img').attr('src', $(this).attr('href')).attr('alt', $(this).attr('title'));
  $itemTemplate.find('.carousel-caption p').text($(this).attr('title'));
  if(i==0){
    $itemTemplate.addClass('active');
  }
  $('.modal-carousel .carousel-inner').append($itemTemplate);
});
$('#modalCarousel').carousel({ interval:false });
$('.row-modalcarousel > a').click(function(event){
    var index = parseInt($(this).index());
    $('#carouselModal').modal('show');
    $('#modalCarousel').carousel(index);
    event.preventDefault();
});

/* tramites toggle scroll */

// $(function () {
//   $(document).on('ready', function(){
//     $('#tramite').on('show.bs.collapse', function (e) {
//       // Timeout because it's not visible yet
//       setTimeout(function(){
//         var offset = $('#tramite').offset();
//         if(offset){
//           $('html,body').animate({ scrollTop: offset.top}, 400);
//         }
//       }, 10);
//     });
//   });
// });

/* widget-map scroll fix */

$('.widget-embed').click(function () {
  $('.widget-map').css("pointer-events", "auto");
});


/* Tooltips */

$('[data-toggle="tooltip"]').tooltip();

