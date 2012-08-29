$(function () {

    module("bootstrap-tabs")

      test("should be defined on jquery object", function () {
        ok($(document.body).tab, 'tabs method is defined')
      })

      test("should return element", function () {
        ok($(document.body).tab()[0] == document.body, 'document.body returned')
      })

      test("should activate element by tab id", function () {
        var tabsHTML =
            '<ul class="tabs">'
          + '<li><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-fixture")

        $(tabsHTML).find('li:last a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "profile")

        $(tabsHTML).find('li:first a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "home")
      })

      test("should activate element by tab id", function () {
        var pillsHTML =
            '<ul class="pills">'
          + '<li><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-fixture")

        $(pillsHTML).find('li:last a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "profile")

        $(pillsHTML).find('li:first a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "home")
      })


      test("should not fire closed when close is prevented", function () {
        $.support.transition = false
        stop();
        $('<div class="tab"/>')
          .bind('show', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .bind('shown', function () {
            ok(false);
          })
          .tab('show')
      })

      test("should fire all four events", function () {
        stop()
        $('#qunit-fixture').append(''
          + "<ul class='nav nav-tabs'>"
          +   "<li class='active'><a data-target='#info' data-toggle='tab'>Info</a></li>"
          +   "<li><a data-target='#media' data-toggle='tab'>Media</a></li>"
          + "</ul>"
          + "<div class='tab-content'>"
          +   "<div class='tab-pane active' id='info'>Info</div>"
          +   "<div class='tab-pane' id='media'></div>"
          + "</div>")

        var events = '' // order matters so stop() and start() alone aren't sufficcient
        $('#qunit-fixture').find("a[data-target='#info']")
          .on('show', function(e) { ok(false) })
          .on('hide', function(e) { events += 'hide#info' })
          .on('shown', function(e) { ok(false) })
          .on('hidden', function(e) { events += ' hidden#info' })

        $('#qunit-fixture').find("a[data-target='#media']")
          .on('show', function(e) { events += ' show#media' })
          .on('hide', function(e) { ok(false) })
          .on('shown', function(e) { events += ' shown#media'; start() })
          .on('hidden', function(e) { ok(false) })

        $('#qunit-fixture').find('li:last a').tab('show')
        equal(events, 'hide#info show#media hidden#info shown#media')
      })
})
