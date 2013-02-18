/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var async = require('../deps/async'),
    types = require('./types'),
    utils = require('./utils'),
    core = require('./core'),
    reporters = require('./reporters'),
    path = require('path');


/**
 * Export sub-modules.
 */

exports.types = types;
exports.utils = utils;
exports.reporters = reporters;

// backwards compatibility
exports.testrunner = {
    run: function () {
        console.log(
            'WARNING: nodeunit.testrunner is going to be deprecated, please ' +
            'use nodeunit.reporters.default instead!'
        );
        return reporters['default'].run.apply(this, arguments);
    }
};


/**
 * Export all core functions
 */

for (var k in core) {
    exports[k] = core[k];
};


/**
 * Load modules from paths array and run all exported tests in series. If a path
 * is a directory, load all supported file types inside it as modules. This only
 * reads 1 level deep in the directory and does not recurse through
 * sub-directories.
 *
 * @param {Array} paths
 * @param {Object} opt
 * @api public
 */

exports.runFiles = function (paths, opt) {
    var all_assertions = [];
    var options = types.options(opt);
    var start = new Date().getTime();

    if (!paths.length) {
        return options.done(types.assertionList(all_assertions));
    }

    utils.modulePaths(paths, function (err, files) {
        if (err) throw err;
        async.concatSeries(files, function (file, cb) {
            var name = path.basename(file);
            exports.runModule(name, require(file), options, cb);
        },
        function (err, all_assertions) {
            var end = new Date().getTime();
            options.done(types.assertionList(all_assertions, end - start));
        });
    });

};
