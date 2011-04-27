$(document).ready(function(){
  // Get Heights
  windowHeight = $(window).height();
  documentHeight = $(document).height();
  sidebarHeight = windowHeight - 40;
  containerHeight = windowHeight - 40;
  
  // Get Widths
  windowWidth = $(window).width();
  containerWidth = windowWidth - 200;
  
  if (windowHeight < containerHeight) {
  
    // Set Dimensions for default state (before resize)
    $('div#sidebar').css({
      height: sidebarHeight
    });
    $('div#container').css({
      width: containerWidth,
      height: containerHeight
    });
    
  } else {
  
    // During resize, set widths
    $(window).resize(function() {
      console.log('Window Height: ' + $(window).height() + ', Sidebar Height:' + ($(window).height() - 40));
  
  	  // Get Heights
  	  windowHeight = $(window).height();
  	  sidebarHeight = windowHeight - 40;
  	  containerHeight = windowHeight - 40;
  	  
      // Get Widths
  	  windowWidth = $(window).width();
  	  containerWidth = windowWidth - 200;
  
  	  // Set Dimensions for default state (before resize)
  	  $('div#sidebar').css({
  	    height: sidebarHeight
  	  });
  	  $('div#container').css({
  	    width: containerWidth,
  	    height: containerHeight
  	  });
    });
    // console.log('omgz window is less than container so... fuck.');
    $('div#sidebar').css({
      height: documentHeight - 40
    });
    
  }
  
  
  
/*
  // Toggle Calendars
  $('div#sidebar ul li a').click(function() {
    if ($(this).is('#toggleMonthView')) {
      console.log('toggle month');
      $(this).addClass('active');
      $('#toggleListView').removeClass('active');
      $('table#monthView').show();
      $('table#listView').hide();
    } else {
      console.log('toggle list');
      $(this).addClass('active');
      $('#toggleMonthView').removeClass('active');
      $('table#listView').show();
      $('table#monthView').hide();
    }
    return false;
  });    
*/
});
