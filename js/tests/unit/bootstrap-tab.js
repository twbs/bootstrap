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

      test("should add active class to target when collapse shown", function () {
        $.support.transition = false
        stop()

        var target = $('<a data-toggle="collapse" href="#test1"></a>')
          .appendTo($('#qunit-fixture'))

        var collapsible = $('<div id="test1"></div>')
          .appendTo($('#qunit-fixture'))
          .on('show', function () {
            ok(!target.hasClass('collapsed'))
            start()
          })

        target.click()
      })

      test("should set relatedTarget for any target element", function () {

        stop();

        var pillsHTML =
            '<ul class="pills">'
          + '<li class="active"><span href="#home">Home</span></li>'
          + '<li><span href="#profile">Profile</span></li>'
          + '</ul>'

        var pills = $(pillsHTML).appendTo($('#qunit-fixture'))
        var tabContent = $('<ul><li class="in active" id="home"></li><li id="profile"></li></ul>').appendTo($('#qunit-fixture'))

        pills.find('li:last span')
          .on('show', function (e) {
            equals(e.target, pills.find('li:last span')[0])
            equals(e.relatedTarget, pills.find('li:first span')[0])
            start()
          })
          .tab('show')

      })
})