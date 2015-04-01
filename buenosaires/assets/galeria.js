/* modal carousel */

$('.row-gallery > a').each(function(i) {
  var $itemTemplate = $('<div class="item"> <img src="{img}" alt="{alt}"><div class="item-info"><p>{caption}</p></div> </div>');
  $itemTemplate.find('img').attr('src', $(this).attr('href')).attr('alt', $(this).attr('title'));
  $itemTemplate.find('.item-info').html($(this).find('.info').html());
  if(i==0){
    $itemTemplate.addClass('active');
  }
  $('#gallery .carousel-inner').append($itemTemplate);
});

$('#gallery').carousel({ interval:false });

$('.row-gallery > a').click(function(event){
    var index = parseInt($(this).index());
    $('#galleryModal').modal('show');
    $('#gallery').carousel(index);
    event.preventDefault();
});
