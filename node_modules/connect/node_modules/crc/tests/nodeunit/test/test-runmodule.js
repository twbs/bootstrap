/*  THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 *  You can use @REMOVE_LINE_FOR_BROWSER to remove code from the browser build.
 *  Only code on that line will be removed, its mostly to avoid requiring code
 *  that is node specific
 */

var nodeunit = require('../lib/nodeunit'); // @REMOVE_LINE_FOR_BROWSER


exports.testRunModule = function (test) {
    test.expect(11);
    var call_order = [];
    var testmodule = {
        test1: function (test) {
            call_order.push('test1');
            test.ok(true, 'ok true');
            test.done();
        },
        test2: function (test) {
            call_order.push('test2');
            test.ok(false, 'ok false');
            test.ok(false, 'ok false');
            test.done();
        },
        test3: function (test) {
            call_order.push('test3');
            test.done();
        }
    };
    nodeunit.runModule('testmodule', testmodule, {
        log: function (assertion) {
            call_order.push('log');
        },
        testStart: function (name) {
            call_order.push('testStart');
            test.ok(
                name.toString() === 'test1' ||
                name.toString() === 'test2' ||
                name.toString() === 'test3',
                'testStart called with test name '
            );
        },
        testDone: function (name, assertions) {
            call_order.push('testDone');
            test.ok(
                name.toString() === 'test1' ||
                name.toString() === 'test2' ||
                name.toString() === 'test3',
                'testDone called with test name'
            );
        },
        moduleDone: function (name, assertions) {
            call_order.push('moduleDone');
            test.equals(assertions.length, 3);
            test.equals(assertions.failures(), 2);
            test.equals(name, 'testmodule');
            test.ok(typeof assertions.duration === "number");
            test.same(call_order, [
                'testStart', 'test1', 'log', 'testDone',
                'testStart', 'test2', 'log', 'log', 'testDone',
                'testStart', 'test3', 'testDone',
                'moduleDone'
            ]);
        }
    }, test.done);
};

exports.testRunModuleEmpty = function (test) {
    nodeunit.runModule('module with no exports', {}, {
        log: function (assertion) {
            test.ok(false, 'log should not be called');
        },
        testStart: function (name) {
            test.ok(false, 'testStart should not be called');
        },
        testDone: function (name, assertions) {
            test.ok(false, 'testDone should not be called');
        },
        moduleDone: function (name, assertions) {
            test.equals(assertions.length, 0);
            test.equals(assertions.failures(), 0);
            test.equals(name, 'module with no exports');
            test.ok(typeof assertions.duration === "number");
        }
    }, test.done);
};

exports.testNestedTests = function (test) {
    var call_order = [];
    var m = {
        test1: function (test) {
            test.done();
        },
        suite: {
            t1: function (test) {
                test.done();
            },
            t2: function (test) {
                test.done();
            },
            another_suite: {
                t3: function (test) {
                    test.done();
                }
            }
        }
    };
    nodeunit.runModule('modulename', m, {
        testStart: function (name) {
            call_order.push(['testStart'].concat(name));
        },
        testDone: function (name, assertions) {
            call_order.push(['testDone'].concat(name));
        }
    }, function () {
        test.same(call_order, [
            ['testStart', 'test1'], ['testDone', 'test1'],
            ['testStart', 'suite', 't1'], ['testDone', 'suite', 't1'],
            ['testStart', 'suite', 't2'], ['testDone', 'suite', 't2'],
            ['testStart', 'suite', 'another_suite', 't3'],
            ['testDone', 'suite', 'another_suite', 't3']
        ]);
        test.done();
    });
};
