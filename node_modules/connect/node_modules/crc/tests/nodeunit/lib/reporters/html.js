/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var nodeunit = require('../nodeunit'),
    utils = require('../utils'),
    fs = require('fs'),
    sys = require('sys'),
    path = require('path'),
    AssertionError = require('assert').AssertionError;

/**
 * Reporter info string
 */

exports.info = "Report tests result as HTML";

/**
 * Run all tests within each module, reporting the results to the command-line.
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (files, options) {

    var start = new Date().getTime();
    var paths = files.map(function (p) {
        return path.join(process.cwd(), p);
    });

    sys.puts('<html>');
    sys.puts('<head>');
    sys.puts('<title></title>');
    sys.puts('<style type="text/css">');
    sys.puts('body { font: 12px Helvetica Neue }');
    sys.puts('h2 { margin:0 ; padding:0 }');
    sys.puts('pre { font: 11px Andale Mono; margin-left: 1em; padding-left: 1em; margin-top:0; font-size:smaller;}');
    sys.puts('.assertion_message { margin-left: 1em; }');
    sys.puts('  ol {' +
    '	list-style: none;' +
    '	margin-left: 1em;' +
    '	padding-left: 1em;' +
    '	text-indent: -1em;' +
    '}');
    sys.puts('  ol li.pass:before { content: "\\2714 \\0020"; }');
    sys.puts('  ol li.fail:before { content: "\\2716 \\0020"; }');
    sys.puts('</style>');
    sys.puts('</head>');
    sys.puts('<body>');
    nodeunit.runFiles(paths, {
        moduleStart: function (name) {
            sys.puts('<h2>' + name + '</h2>');
            sys.puts('<ol>');
        },
        testDone: function (name, assertions) {
            if (!assertions.failures()) {
                sys.puts('<li class="pass">' + name + '</li>');
            }
            else {
                sys.puts('<li class="fail">' + name);
                assertions.forEach(function (a) {
                    if (a.failed()) {
                        a = utils.betterErrors(a);
                        if (a.error instanceof AssertionError && a.message) {
                            sys.puts('<div class="assertion_message">' +
                                'Assertion Message: ' + a.message +
                            '</div>');
                        }
                        sys.puts('<pre>');
                        sys.puts(a.error.stack);
                        sys.puts('</pre>');
                    }
                });
                sys.puts('</li>');
            }
        },
        moduleDone: function () {
            sys.puts('</ol>');
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start;
            if (assertions.failures()) {
                sys.puts(
                    '<h3>FAILURES: '  + assertions.failures() +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)</h3>'
                );
            }
            else {
                sys.puts(
                    '<h3>OK: ' + assertions.length +
                    ' assertions (' + assertions.duration + 'ms)</h3>'
                );
            }
            sys.puts('</body>');
            // should be able to flush stdout here, but doesn't seem to work,
            // instead delay the exit to give enough to time flush.
            setTimeout(function () {
                process.reallyExit(assertions.failures());
            }, 10);
        }
    });

};
