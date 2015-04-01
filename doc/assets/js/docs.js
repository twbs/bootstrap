var components = [];
var unique_search_terms = {};

function pushSearchTerm(searchTerm, data) {
  if (!unique_search_terms[searchTerm]) {
    components.push({
      value: searchTerm,
      data: data
    });

    unique_search_terms[searchTerm] = true
  }
};

$("[data-search]")
  .each(function() {
    var self = $(this),
        searchTerm = self.text().trim(),
        otherSearchTerms = self.data("search").trim(),
        url = self.attr("href");

    pushSearchTerm(searchTerm, self.attr("href"))

    if (otherSearchTerms !== "") {
      $.each(otherSearchTerms.split(","), function(idx, el) {
        pushSearchTerm(el, self.attr("href"))
      });
    }
  });

$('#autocomplete').autocomplete({
  lookup: components,
  autoSelectFirst: true,
  onSelect: function (suggestion) {
    window.location = suggestion.data;
  }
});

$('input, textarea').placeholder();

$('#interchangeMarkup').on('replace', function () {
  $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyASm3CwaK9qtcZEWYa-iQwHaGi3gcosAJc&sensor=false&callback=initializeMaps");
});

function initializeMaps() {
  // Basic options for a simple Google Map
  // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  var mapOptions = {
    // How zoomed in you want the map to start at (always required)
    zoom: 11,

    // The latitude and longitude to center the map (always required)
    center: new google.maps.LatLng(40.6700, -73.9400), // New York

    // How you would like to style the map.
    // This is where you would paste any style found on Snazzy Maps.
    styles: [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]},{'featureType':'landscape','stylers':[{'color':'#f2e5d4'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}]
  };

  // Get the HTML DOM element that will contain your map
  // We are using a div with id="map" seen below in the <body>
  var mapElement = document.getElementById('map');

  // Create the Google Map using out element and options defined above
  var map = new google.maps.Map(mapElement, mapOptions);
}

var currentUrl = window.location.href;
    partial = currentUrl.split('docs')[1].split('/'),
    page = partial[partial.length-1],
    sidenav_links = $('.side-nav a');

sidenav_links.each(function () {
  var link = $(this);
  if (page == link.attr('href')) {
    link.closest('li').addClass('active');
  }
});

// Fetch forum posts
if ($('[data-forum-posts]').length > 0) {
  var cb = function(data) {
    var html = '';
    $.each(data, function(idx, el) {
      html += JST['doc/templates/forum_post.html'](el);
    });
    $('[data-forum-posts]').each(function() {
      $(this).html(html);
    });
  };
  $.ajax({
    url:'http://foundation.zurb.com/forum/api/v1/posts.json',
    dataType:'jsonp',
    success: cb
  });
}
