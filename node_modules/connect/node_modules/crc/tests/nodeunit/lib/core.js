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
 * Module dependencies
 */

var async = require('../deps/async'), //@REMOVE_LINE_FOR_BROWSER
    types = require('./types');       //@REMOVE_LINE_FOR_BROWSER


/**
 * Added for browser compatibility
 */

var _keys = function(obj){
    if(Object.keys) return Object.keys(obj);
    var keys = [];
    for(var k in obj){
        if(obj.hasOwnProperty(k)) keys.push(k);
    }
    return keys;
};


/**
 * Runs a test function (fn) from a loaded module. After the test function
 * calls test.done(), the callback is executed with an assertionList as its
 * second argument.
 *
 * @param {String} name
 * @param {Function} fn
 * @param {Object} opt
 * @param {Function} callback
 * @api public
 */

exports.runTest = function (name, fn, opt, callback) {
    var options = types.options(opt);

    options.testStart(name);
    var start = new Date().getTime();
    var test = types.test(name, start, options, callback);

    try {
        fn(test);
    }
    catch (e) {
        test.done(e);
    }
};

/**
 * Takes an object containing test functions or other test suites as properties
 * and runs each in series. After all tests have completed, the callback is
 * called with a list of all assertions as the second argument.
 *
 * If a name is passed to this function it is prepended to all test and suite
 * names that run within it.
 *
 * @param {String} name
 * @param {Object} suite
 * @param {Object} opt
 * @param {Function} callback
 * @api public
 */

exports.runSuite = function (name, suite, opt, callback) {
    var keys = _keys(suite);

    async.concatSeries(keys, function (k, cb) {
        var prop = suite[k], _name;

        _name = name ? [].concat(name, k) : [k];

        _name.toString = function () {
            // fallback for old one
            return this.join(' - ');
        };

        if (typeof prop === 'function') {
            exports.runTest(_name, suite[k], opt, cb);
        }
        else {
            exports.runSuite(_name, suite[k], opt, cb);
        }
    }, callback);
};

/**
 * Run each exported test function or test suite from a loaded module.
 *
 * @param {String} name
 * @param {Object} mod
 * @param {Object} opt
 * @param {Function} callback
 * @api public
 */

exports.runModule = function (name, mod, opt, callback) {
    var options = types.options(opt);

    options.moduleStart(name);
    var start = new Date().getTime();

    exports.runSuite(null, mod, opt, function (err, a_list) {
        var end = new Date().getTime();
        var assertion_list = types.assertionList(a_list, end - start);
        options.moduleDone(name, assertion_list);
        callback(null, a_list);
    });
};

/**
 * Treats an object literal as a list of modules keyed by name. Runs each
 * module and finished with calling 'done'. You can think of this as a browser
 * safe alternative to runFiles in the nodeunit module.
 *
 * @param {Object} modules
 * @param {Object} opt
 * @api public
 */

// TODO: add proper unit tests for this function
exports.runModules = function (modules, opt) {
    var all_assertions = [];
    var options = types.options(opt);
    var start = new Date().getTime();

    async.concatSeries(_keys(modules), function (k, cb) {
        exports.runModule(k, modules[k], options, cb);
    },
    function (err, all_assertions) {
        var end = new Date().getTime();
        options.done(types.assertionList(all_assertions, end - start));
    });
};


/**
 * Wraps a test function with setUp and tearDown functions.
 * Used by testCase.
 *
 * @param {Function} setUp
 * @param {Function} tearDown
 * @param {Function} fn
 * @api private
 */

var wrapTest = function (setUp, tearDown, fn) {
    return function (test) {
        var context = {};
        if (tearDown) {
            var done = test.done;
            test.done = function (err) {
                try {
                    tearDown.call(context, function (err2) {
                        if (err && err2) {
                            test._assertion_list.push(
                                types.assertion({error: err})
                            );
                            return done(err2);
                        }
                        done(err || err2);
                    });
                }
                catch (e) {
                    done(e);
                }
            };
        }
        if (setUp) {
            setUp.call(context, function (err) {
                if (err) {
                    return test.done(err);
                }
                fn.call(context, test);
            });
        }
        else {
            fn.call(context, test);
        }
    }
};


/**
 * Wraps a group of tests with setUp and tearDown functions.
 * Used by testCase.
 *
 * @param {Function} setUp
 * @param {Function} tearDown
 * @param {Object} group
 * @api private
 */

var wrapGroup = function (setUp, tearDown, group) {
    var tests = {};
    var keys = _keys(group);
    for (var i=0; i<keys.length; i++) {
        var k = keys[i];
        if (typeof group[k] === 'function') {
            tests[k] = wrapTest(setUp, tearDown, group[k]);
        }
        else if (typeof group[k] === 'object') {
            tests[k] = wrapGroup(setUp, tearDown, group[k]);
        }
    }
    return tests;
}


/**
 * Utility for wrapping a suite of test functions with setUp and tearDown
 * functions.
 *
 * @param {Object} suite
 * @return {Object}
 * @api public
 */

exports.testCase = function (suite) {
    var setUp = suite.setUp;
    var tearDown = suite.tearDown;
    delete suite.setUp;
    delete suite.tearDown;
    return wrapGroup(setUp, tearDown, suite);
};
