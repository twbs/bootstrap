/*!
 * Bootstrap Grunt task for no-touch-ifying CSS
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict';

var extend = require('util')._extend;
var postcss = require('postcss');


var DEFAULT_OPTIONS = {
    selectorPrefix: '.no-touch', // the fragment that will be prefixed to every selector involving :hover
    // the following options are passed through to postcss(...).process():
    map: undefined,
    mapAnnotation: undefined,
    inlineMap: undefined
};

function startsWith(haystack, needle) {
    return haystack.lastIndexOf(needle, 0) === 0;
}

module.exports = function (grunt) {
    grunt.registerMultiTask('notouch', 'Adds no-touch prefix to :hover CSS selectors so they do not affect touch devices', function () {
        var options = this.options(DEFAULT_OPTIONS);
        var noTouchSelectorPrefix = options.selectorPrefix + ' ';
        var postcssOptions = {
            map: options.map,
            mapAnnotation: options.mapAnnotation,
            inlineMap: options.inlineMap
        };

        var processor = postcss(function (css) {
            css.eachRule(function (rule) {
                // Yes, this parsing is all horribly naive...
                var selectorsWithWhitespace = rule.selector.split(',');
                var revisedSelectors = selectorsWithWhitespace.map(function (selectorWithWhitespace) {
                    var quadruple = /^(\s*)(\S.*\S)(\s*)$/.exec(selectorWithWhitespace);
                    if (quadruple === null) {
                        return selectorWithWhitespace;
                    }

                    var prefix = quadruple[1];
                    var selector = quadruple[2];
                    var suffix = quadruple[3];

                    var alreadyRevised = startsWith(selector, noTouchSelectorPrefix);
                    if (!alreadyRevised && /:hover/.test(selector)) {
                        selector = noTouchSelectorPrefix + selector;
                    }
                    var revisedSelector = prefix + selector + suffix;
                    return revisedSelector;
                });
                rule.selector = revisedSelectors.join(',');
            });
        });

        this.files.forEach(function (f) {
            var originalCss = grunt.file.read(f.src);
            var sourceFile = Array.isArray(f.src) ? f.src[0] : f.src;
            var destFile = f.dest === undefined ? sourceFile : f.dest;

            var fileSpecificProcessorOptions = extend(extend({}, postcssOptions), {from: sourceFile, to: destFile});

            var revisedCss = null;
            try {
                revisedCss = processor.process(originalCss, fileSpecificProcessorOptions).css;
            }
            catch (err) {
                grunt.fail.warn(err);
            }

            grunt.file.write(destFile, revisedCss);
            grunt.log.writeln('File "' + destFile.cyan + '" created.');
        });
    });
};
