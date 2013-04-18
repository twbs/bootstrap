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

exports.info = "Skip passed tests output";

/**
 * Run all tests within each module, reporting the results to the command-line.
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (files, options) {

    if (!options) {
        // load default options
        var content = fs.readFileSync(
            __dirname + '/../../bin/nodeunit.json', 'utf8'
        );
        options = JSON.parse(content);
    }

    var error = function (str) {
        return options.error_prefix + str + options.error_suffix;
    };
    var ok    = function (str) {
        return options.ok_prefix + str + options.ok_suffix;
    };
    var bold  = function (str) {
        return options.bold_prefix + str + options.bold_suffix;
    };
    var assertion_message = function (str) {
        return options.assertion_prefix + str + options.assertion_suffix;
    };

    var start = new Date().getTime();
    var paths = files.map(function (p) {
        return path.join(process.cwd(), p);
    });

    nodeunit.runFiles(paths, {
        moduleStart: function (name) {
            sys.puts('\n' + bold(name));
        },
        testDone: function (name, assertions) {
            if (assertions.failures()) {
                sys.puts(error('✖ ' + name) + '\n');
                assertions.forEach(function (a) {
                    if (a.failed()) {
                        a = utils.betterErrors(a);
                        if (a.error instanceof AssertionError && a.message) {
                            sys.puts(
                                'Assertion Message: ' + assertion_message(a.message)
                            );
                        }
                        sys.puts(a.error.stack + '\n');
                    }
                });
            }
        },
        moduleDone: function (name, assertions) {
            if (!assertions.failures()) {
                sys.puts('✔ all tests passed');
            }
            else {
                sys.puts(error('✖ some tests failed'));
            }
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start;
            if (assertions.failures()) {
                sys.puts(
                    '\n' + bold(error('FAILURES: ')) + assertions.failures() +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)'
                );
            }
            else {
                sys.puts(
                    '\n' + bold(ok('OK: ')) + assertions.length +
                    ' assertions (' + assertions.duration + 'ms)'
                );
            }
            // should be able to flush stdout here, but doesn't seem to work,
            // instead delay the exit to give enough to time flush.
            setTimeout(function () {
                process.reallyExit(assertions.failures());
            }, 10);
        }
    });
};
