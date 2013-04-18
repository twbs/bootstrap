/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var async = require('../deps/async'),
    fs = require('fs'),
    sys = require('sys'),
    Script = process.binding('evals').Script,
    http = require('http');


/**
 * Detect if coffee-script is available and search for .coffee as an
 * extension in modulePaths if it is.
 */

var extensionPattern;
try {
    require('coffee-script');
    extensionPattern = /\.(?:js|coffee)$/;
}
catch (e) {
    extensionPattern = /\.js$/;
}


/**
 * Finds all modules at each path in an array, If a path is a directory, it
 * returns all supported file types inside it. This only reads 1 level deep in
 * the directory and does not recurse through sub-directories.
 *
 * The extension (.js, .coffee etc) is stripped from the filenames so they can
 * simply be require()'ed.
 *
 * @param {Array} paths
 * @param {Function} callback
 * @api public
 */

exports.modulePaths = function (paths, callback) {
    async.concat(paths, function (p, cb) {
        fs.stat(p, function (err, stats) {
            if (err) {
                return cb(err);
            }
            if (stats.isFile()) {
                return cb(null, [p]);
            }
            if (stats.isDirectory()) {
                fs.readdir(p, function (err, files) {
                    if (err) {
                        return cb(err);
                    }

                    // filter out any filenames with unsupported extensions
                    var modules = files.filter(function (filename) {
                        return extensionPattern.exec(filename);
                    });

                    // remove extension from module name and prepend the
                    // directory path
                    var fullpaths = modules.map(function (filename) {
                        var mod_name = filename.replace(extensionPattern, '');
                        return [p, mod_name].join('/');
                    });

                    // sort filenames here, because Array.map changes order
                    fullpaths.sort();

                    cb(null, fullpaths);
                });
            }
        });
    }, callback);
};

/**
 * Evaluates JavaScript files in a sandbox, returning the context. The first
 * argument can either be a single filename or an array of filenames. If
 * multiple filenames are given their contents are concatenated before
 * evalution. The second argument is an optional context to use for the sandbox.
 *
 * @param files
 * @param {Object} sandbox
 * @return {Object}
 * @api public
 */

exports.sandbox = function (files, /*optional*/sandbox) {
    var source, script, result;
    if (!(files instanceof Array)) {
        files = [files];
    }
    source = files.map(function (file) {
        return fs.readFileSync(file, 'utf8');
    }).join('');

    if (!sandbox) {
        sandbox = {};
    }
    script = new Script(source);
    result = script.runInNewContext(sandbox);
    return sandbox;
};

/**
 * Provides a http request, response testing environment.
 *
 * Example:
 *
 *  var httputil = require('nodeunit').utils.httputil
 *  exports.testSomething = function(test) {
 *    httputil(function (req, resp) {
 *        resp.writeHead(200, {});
 *        resp.end('test data');
 *      },
 *      function(server, client) {
 *        client.fetch('GET', '/', {}, function(resp) {
 *          test.equal('test data', resp.body);
 *          server.close();
 *          test.done();
 *        })
 *      });
 *  };
 *
 * @param {Function} cgi
 * @param {Function} envReady
 * @api public
 */
exports.httputil = function (cgi, envReady) {
    var hostname = process.env.HOSTNAME || 'localhost';
    var port = process.env.PORT || 3000;

    var server = http.createServer(cgi);
    server.listen(port, hostname);

    var client = http.createClient(port, hostname);
    client.fetch = function (method, path, headers, respReady) {
        var request = this.request(method, path, headers);
        request.end();
        request.on('response', function (response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                if (response.body) {
                    response.body += chunk;
                } else {
                    response.body = chunk;
                }
            });
            response.on('end', function () {
                if (response.headers['content-type'] === 'application/json') {
                    response.bodyAsObject = JSON.parse(response.body);
                }
                respReady(response);
            });
        });
    };

    process.nextTick(function () {
        if (envReady && typeof envReady === 'function') {
            envReady(server, client);
        }
    });
};


/**
 * Improves formatting of AssertionError messages to make deepEqual etc more
 * readable.
 *
 * @param {Object} assertion
 * @return {Object}
 * @api public
 */

exports.betterErrors = function (assertion) {
    if (!assertion.error) return;

    var e = assertion.error;
    // deepEqual error message is a bit sucky, lets improve it!
    // e.actual and e.expected could be null or undefined, so
    // using getOwnPropertyDescriptor to see if they exist:
    if (Object.getOwnPropertyDescriptor(e, 'actual') &&
        Object.getOwnPropertyDescriptor(e, 'expected')) {

        // alexgorbatchev 2010-10-22 :: Added a bit of depth to inspection
        var actual = sys.inspect(e.actual, false, 10).replace(/\n$/, '');
        var expected = sys.inspect(e.expected, false, 10).replace(/\n$/, '');
        var multiline = (
            actual.indexOf('\n') !== -1 ||
            expected.indexOf('\n') !== -1
        );
        var spacing = (multiline ? '\n' : ' ');
        e._message = e.message;
        e.stack = (
            e.name + ':' + spacing +
            actual + spacing + e.operator + spacing +
            expected + '\n' +
            e.stack.split('\n').slice(1).join('\n')
        );
    }
    return assertion;
};
