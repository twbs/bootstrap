$(function () {

      test("uneditable-input inside fluid-row should not overflow its parent", function () {
        var container = $('#fluidRowUneditableInputTest')

        container.children('div').each(function() {
            var parent = $(this).children().eq(0)
            var spanWidth = parent.outerWidth()

            parent.find('.uneditable-input').each(function() {
                var elementWidth = $(this).outerWidth()
                ok($(this).outerWidth() <= spanWidth, 'Child (' + elementWidth + 'px) should fit inside parent (' + spanWidth + 'px)')
            });
        })
    })

});
