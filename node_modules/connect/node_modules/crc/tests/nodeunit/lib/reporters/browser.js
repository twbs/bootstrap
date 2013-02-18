/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 * You can use @REMOVE_LINE_FOR_BROWSER to remove code from the browser build.
 * Only code on that line will be removed, its mostly to avoid requiring code
 * that is node specific
 */


/**
 * NOTE: this test runner is not listed in index.js because it cannot be
 * used with the command-line tool, only inside the browser.
 */


/**
 * Reporter info string
 */

exports.info = "Browser-based test reporter";


/**
 * Run all tests within each module, reporting the results
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (modules, options) {
    var start = new Date().getTime();

    function setText(el, txt) {
        if ('innerText' in el) {
            el.innerText = txt;
        }
        else if ('textContent' in el){
            el.textContent = txt;
        }
    }

    function getOrCreate(tag, id) {
        var el = document.getElementById(id);
        if (!el) {
            el = document.createElement(tag);
            el.id = id;
            document.body.appendChild(el);
        }
        return el;
    };

    var header = getOrCreate('h1', 'nodeunit-header');
    var banner = getOrCreate('h2', 'nodeunit-banner');
    var userAgent = getOrCreate('h2', 'nodeunit-userAgent');
    var tests = getOrCreate('ol', 'nodeunit-tests');
    var result = getOrCreate('p', 'nodeunit-testresult');

    setText(userAgent, navigator.userAgent);

    nodeunit.runModules(modules, {
        moduleStart: function (name) {
            /*var mheading = document.createElement('h2');
            mheading.innerText = name;
            results.appendChild(mheading);
            module = document.createElement('ol');
            results.appendChild(module);*/
        },
        testDone: function (name, assertions) {
            var test = document.createElement('li');
            var strong = document.createElement('strong');
            strong.innerHTML = name + ' <b style="color: black;">(' +
                '<b class="fail">' + assertions.failures() + '</b>, ' +
                '<b class="pass">' + assertions.passes() + '</b>, ' +
                assertions.length +
            ')</b>';
            test.className = assertions.failures() ? 'fail': 'pass';
            test.appendChild(strong);

            var aList = document.createElement('ol');
            aList.style.display = 'none';
            test.onclick = function () {
                var d = aList.style.display;
                aList.style.display = (d == 'none') ? 'block': 'none';
            };
            for (var i=0; i<assertions.length; i++) {
                var li = document.createElement('li');
                var a = assertions[i];
                if (a.failed()) {
                    li.innerHTML = (a.message || a.method || 'no message') +
                        '<pre>' + (a.error.stack || a.error) + '</pre>';
                    li.className = 'fail';
                }
                else {
                    li.innerHTML = a.message || a.method || 'no message';
                    li.className = 'pass';
                }
                aList.appendChild(li);
            }
            test.appendChild(aList);
            tests.appendChild(test);
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start;

            var failures = assertions.failures();
            banner.className = failures ? 'fail': 'pass';

            result.innerHTML = 'Tests completed in ' + duration +
                ' milliseconds.<br/><span class="passed">' +
                assertions.passes() + '</span> assertions of ' +
                '<span class="all">' + assertions.length + '<span> passed, ' +
                assertions.failures() + ' failed.';
        }
    });
};
