function when(size, testFunc) {
  $(document).foundation();
  if (matchMedia(Foundation.media_queries[size]).matches) {
    return testFunc;
  } else {
    return function() {};
  }
}

function when_not(size, testFunc) {
  $(document).foundation();
  if (!matchMedia(Foundation.media_queries[size]).matches) {
    return testFunc;
  } else {
    return function() {};
  }
}

beforeEach(function() {
  jasmine.Clock.useMock();

  if($('head').has('#foundation-style').length === 0) {
    $('head').append('<style id="foundation-style"></style>')
  }

  $.ajax({ url: '/base/dist/assets/css/normalize.css', cache: false, async: false, success: function(data) {
    $('#foundation-style').html(data);
  }});

  $.ajax({ url: '/base/dist/assets/css/foundation.css', cache: false, async: false, success: function(data) {
    $('#foundation-style').append(data);
  }});
});

afterEach(function() {
  $('body').empty().removeClass();
});
