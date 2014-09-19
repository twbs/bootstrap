/* modal carousel */

      $('#modalCarousel').carousel({
        interval: false
      })

      /* copy loaded thumbnails into carousel */
      $('.row .thumbnail').on('load', function() {
      }).each(function(i) {
        if(this.complete) {
          var item = $('<div class="item"></div>');
          var itemDiv = $(this).parents('div');
          var title = $(this).parent('a').attr("title");
          
          item.attr("title",title);
          $(itemDiv.html()).appendTo(item);
          item.appendTo('.carousel-inner'); 
          if (i==0){ // set first item active
           item.addClass('active');
          }
        }
      });
      /* activate the carousel */
      $('#modalCarousel').carousel({interval:false});
      /* change modal title when slide changes */
      $('#modalCarousel').on('slid.bs.carousel', function () {
        $('.modal-title').html($(this).find('.active').attr("title"));
      })
      /* when clicking a thumbnail */
      $('.row .thumbnail').click(function(){
          var idx = $(this).parents('div').index();
          var id = parseInt(idx);
          $('#myModal').modal('show'); // show the modal
          $('#modalCarousel').carousel(id); // slide carousel to selected          
      });