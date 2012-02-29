$(function () {

    module("bootstrap-navlists");

      test("should be defined on jquery object", function () {
        ok($(document.body).navList, 'navList method is defined')
      });

      test("should return element", function () {
        ok($(document.body).navList()[0] == document.body, 'document.body returned')
      });

      test("should activate element by navList id", function () {
        var navListHTML =
            '<ul class=" nav-list">'
          + '<li><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-fixture");

        $(navListHTML).find('li:last a').navList('show');
        equals($("#qunit-fixture").find('.active').attr('id'), "profile");

        $(navListHTML).find('li:first a').navList('show');
        equals($("#qunit-fixture").find('.active').attr('id'), "home");
      });

});