$(function () {

  module('tabs')

  test('should provide no conflict', function () {
    var tab = $.fn.tab.noConflict()
    ok(!$.fn.tab, 'tab was set back to undefined (org value)')
    $.fn.tab = tab
  })

  test('should be defined on jquery object', function () {
    ok($(document.body).tab, 'tabs method is defined')
  })

  test('should return element', function () {
    ok($(document.body).tab()[0] == document.body, 'document.body returned')
  })

  test('should activate element by tab id', function () {
    var tabsHTML = '<ul class="tabs">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo('#qunit-fixture')

    $(tabsHTML).find('li:last a').tab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('li:first a').tab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should activate element by tab id', function () {
    var pillsHTML = '<ul class="pills">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last a').tab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first a').tab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'home')
  })


  test('should not fire closed when close is prevented', function () {
    $.support.transition = false
    stop();
    $('<div class="tab"/>')
      .on('show.bs.tab', function (e) {
        e.preventDefault();
        ok(true);
        start();
      })
      .on('shown.bs.tab', function () {
        ok(false);
      })
      .tab('show')
  })

  test('show and shown events should reference correct relatedTarget', function () {
    var dropHTML = '<ul class="drop">' +
        '<li class="dropdown"><a data-toggle="dropdown" href="#">1</a>' +
        '<ul class="dropdown-menu">' +
        '<li><a href="#1-1" data-toggle="tab">1-1</a></li>' +
        '<li><a href="#1-2" data-toggle="tab">1-2</a></li>' +
        '</ul>' +
        '</li>' +
        '</ul>'

    $(dropHTML).find('ul>li:first a').tab('show').end()
      .find('ul>li:last a')
      .on('show.bs.tab', function (event) {
        equal(event.relatedTarget.hash, '#1-1')
      })
      .on('show.bs.tab', function (event) {
        equal(event.relatedTarget.hash, '#1-1')
      })
      .tab('show')
  })

})
