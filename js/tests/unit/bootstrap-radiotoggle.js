$(function () {

    module("bootstrap-radiotoggle")
    
    test("should be defined on jquery object", function () {
        ok($(document.body).radio, 'radio method is defined')
        ok($(document.body).toggleBtn, 'toggleBtn method is defined')
    })

    test("should return element", function () {
        ok($(document.body).radio()[0] == document.body, 'radio method returned document.body' )
        ok($(document.body).toggleBtn()[0] == document.body, 'toggleBtn method returned document.body')
    })

    test("should toggle element on click (toggleBtn)", function () {
        var toggleHTML = '<a class="btn toggle" href="#">Toggle</a>'
        , toggle = $(toggleHTML).toggleBtn()

        toggle.click()

        ok(toggle.hasClass('active'), 'add .active on click')
        
        toggle.click()
        
        ok(!toggle.hasClass('active'), 'remove .active on next click')
    })
    
    test("should activate focused radio on click (radio)", function () {
        var radioHTML = '<div class="btngroup radio">'
        + '<a class="btn">One</a><a class="btn active">Two</a>'
        + '</div>'
        , radio = $(radioHTML).find('a').radio()
        
        radio.eq(0).click()
        
        ok(radio.eq(0).hasClass('active'), 'add .active to focused button')
        ok(!radio.eq(1).hasClass('active'), 'remove .active from other buttons') 
    })
})