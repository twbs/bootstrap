$(function () {

    module("bootstrap-tabs")

      test("should be defined on jquery object", function () {
        ok($(document.body).tabs, 'tabs method is defined')
      })

      test("should return element", function () {
        ok($(document.body).tabs()[0] == document.body, 'document.body returned')
      })

      test("should activate element by tab id", function () {
        var tabsHTML = '<ul class="tabs">'
          + '<li class="active"><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'


        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-runoff")

        $(tabsHTML).tabs().find('a').last().click()
        equals($("#qunit-runoff").find('.active').attr('id'), "profile")

        $(tabsHTML).tabs().find('a').first().click()
        equals($("#qunit-runoff").find('.active').attr('id'), "home")

        $("#qunit-runoff").empty()
      })

      test("should activate element by pill id", function () {
        var pillsHTML = '<ul class="pills">'
          + '<li class="active"><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'


        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-runoff")

        $(pillsHTML).pills().find('a').last().click()
        equals($("#qunit-runoff").find('.active').attr('id'), "profile")

        $(pillsHTML).pills().find('a').first().click()
        equals($("#qunit-runoff").find('.active').attr('id'), "home")

        $("#qunit-runoff").empty()
      })

})