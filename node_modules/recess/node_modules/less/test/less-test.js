var path = require('path'),
    fs = require('fs'),
    sys = require('util');

var less = require('../lib/less');
var stylize = require('../lib/less/lessc_helper').stylize;

var oneTestOnly = process.argv[2];

var totalTests = 0,
    failedTests = 0,
    passedTests = 0;

less.tree.functions.add = function (a, b) {
    return new(less.tree.Dimension)(a.value + b.value);
};
less.tree.functions.increment = function (a) {
    return new(less.tree.Dimension)(a.value + 1);
};
less.tree.functions._color = function (str) {
    if (str.value === "evil red") { return new(less.tree.Color)("600") }
};

sys.puts("\n" + stylize("LESS", 'underline') + "\n");

runTestSet({relativeUrls: true});

runTestSet(null, "errors/", function(name, err, compiledLess, doReplacements) {
    fs.readFile(path.join('test/less/', name) + '.txt', 'utf8', function (e, expectedErr) {
        sys.print("- " + name + ": ");
        expectedErr = doReplacements(expectedErr, 'test/less/errors/');
        if (!err) {
            if (compiledLess) {
                fail("No Error", 'red');
            } else {
                fail("No Error, No Output");
            }
        } else {
            var errMessage = less.formatError(err);
            if (errMessage === expectedErr) {
                ok('OK');                    
            } else {
                difference("FAIL", expectedErr, errMessage);
            }
        }
        sys.puts("");
    });}, null, function(input, directory) {
        return input.replace(
            "{path}", path.join(process.cwd(), "/test/less/errors/"))
            .replace("{pathrel}", path.join("test", "less", "errors/"))
            .replace(/\r\n/g, '\n');
    });

runTestSet({dumpLineNumbers: 'comments'}, "debug/", null,
           function(name) { return name + '-comments'; });
runTestSet({dumpLineNumbers: 'mediaquery'}, "debug/", null,
           function(name) { return name + '-mediaquery'; });
runTestSet({dumpLineNumbers: 'all'}, "debug/", null,
           function(name) { return name + '-all'; });
runTestSet({relativeUrls: false, rootpath: "folder (1)/"}, "static-urls/");

function globalReplacements(input, directory) {
    var p = path.join(process.cwd(), directory),
        pathimport = path.join(process.cwd(), directory + "import/"),
        pathesc = p.replace(/[.:\/]/g, '\\$&'),
        pathimportesc = pathimport.replace(/[.:\/]/g, '\\$&');

    return input.replace(/\{path\}/g, p)
            .replace(/\{pathesc\}/g, pathesc)
            .replace(/\{pathimport\}/g, pathimport)
            .replace(/\{pathimportesc\}/g, pathimportesc)
            .replace(/\r\n/g, '\n');
}

function runTestSet(options, foldername, verifyFunction, nameModifier, doReplacements) {
    foldername = foldername || "";

    if(!doReplacements)
        doReplacements = globalReplacements;

    fs.readdirSync(path.join('test/less/', foldername)).forEach(function (file) {
        if (! /\.less/.test(file)) { return }
        
        var name = foldername + path.basename(file, '.less');
        
        if (oneTestOnly && name !== oneTestOnly) { return; }
        
        totalTests++;

        toCSS(options, path.join('test/less/', foldername + file), function (err, less) {

            if (verifyFunction) {
                return verifyFunction(name, err, less, doReplacements);
            }
            var css_name = name;
            if(nameModifier) css_name=nameModifier(name);
            fs.readFile(path.join('test/css', css_name) + '.css', 'utf8', function (e, css) {
                sys.print("- " + css_name + ": ")
                
                css = css && doReplacements(css, 'test/less/' + foldername);
                if (less === css) { ok('OK'); }
                else if (err) {
                    fail("ERROR: " + (err && err.message));
                } else {
                    difference("FAIL", css, less);
                }
                sys.puts("");
            });
        });
    });
}

function diff(left, right) {
    sys.puts("");
    require('diff').diffLines(left, right).forEach(function(item) {
      if(item.added || item.removed) {
        sys.print(stylize(item.value, item.added ? 'green' : 'red'));
      } else {
        sys.print(item.value);
      }
    });
}

function fail(msg) {
    sys.print(stylize(msg, 'red'));
    failedTests++;
    endTest();
}

function difference(msg, left, right) {
    sys.print(stylize(msg, 'yellow'));
    failedTests++;
                
    diff(left, right);
    endTest();
}

function ok(msg) {
    sys.print(stylize(msg, 'green'));
    passedTests++;
    endTest();
}

function endTest() {
    if (failedTests + passedTests === totalTests) {
        sys.puts("");
        sys.puts("");
        if (failedTests > 0) {
            sys.print(failedTests);
            sys.print(stylize(" Failed", "red"));
            sys.print(", " + passedTests + " passed");
        } else {
            sys.print(stylize("All Passed ", "green"));
            sys.print(passedTests + " run");
        }
    }
}

function toCSS(options, path, callback) {
    var tree, css;
    options = options || {};
    fs.readFile(path, 'utf8', function (e, str) {
        if (e) { return callback(e) }
        
        options.paths = [require('path').dirname(path)];
        options.filename = require('path').resolve(process.cwd(), path);
        options.optimization = options.optimization || 0;

        new(less.Parser)(options).parse(str, function (err, tree) {
            if (err) {
                callback(err);
            } else {
                try {
                    css = tree.toCSS();
                    callback(null, css);
                } catch (e) {
                    callback(e);
                }
            }
        });
    });
}
