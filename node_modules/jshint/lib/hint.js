var fs = require('fs'),
    minimatch = require('minimatch'),
    path = require('path'),
    jshint = require('./../packages/jshint/jshint.js'),
    _reporter = require('./reporters/default').reporter,
    _cache = {
        directories: {}
    };

function _lint(file, results, config, data) {
    var buffer,
        globals,
        lintdata;

    // config may be a pointer, but we modify it below, which changes it the next time it is used.
    config = !config ? {} : Object.keys(config).reduce(function (obj, key) {
        obj[key] = config[key];
        return obj;
    }, {});

    try {
        buffer = fs.readFileSync(file, 'utf-8');
    } catch (e) {
        process.stdout.write("Error: Cant open: " + file);
        process.stdout.write(e + '\n');
    }

    // Remove potential Unicode Byte Order Mark.
    buffer = buffer.replace(/^\uFEFF/, '');

    // remove custom node-jshint option
    if (config.globals) {
        globals = config.globals;
        delete config.globals;
    }

    if (!jshint.JSHINT(buffer, config, globals)) {
        jshint.JSHINT.errors.forEach(function (error) {
            if (error) {
                results.push({file: file, error: error});
            }
        });
    }

    lintdata = jshint.JSHINT.data();

    if (lintdata) {
        lintdata.file = file;
        data.push(lintdata);
    }
}

function isDirectory(aPath) {
    var isDir;

    try {
        if (_cache.directories.hasOwnProperty(aPath)) {
            isDir = _cache.directories[aPath];
        } else {
            isDir = fs.statSync(aPath).isDirectory();
            _cache.directories[aPath] = isDir;
        }
    } catch (e) {
        isDir = false;
    }

    return isDir;
}


function _shouldIgnore(somePath, ignore) {
    function isIgnored(p) {
        var fnmatch = minimatch(somePath, p, {nocase: true}),
            absmatch = path.resolve(somePath) === p,
            lsmatch = isDirectory(p) && p.match(/^[^\/]*\/?$/) &&
                somePath.match(new RegExp("^" + p + ".*"));

        return !!(fnmatch || lsmatch || absmatch);
    }

    return ignore.some(function (ignorePath) {
        return isIgnored(ignorePath);
    });
}

function _collect(filePath, files, ignore, regExtension) {
    if (ignore && _shouldIgnore(filePath, ignore)) {
        return;
    }
    if (fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach(function (item) {
            _collect(path.join(filePath, item), files, ignore, regExtension);
        });
    } else if (filePath.match(regExtension)) {
        files.push(filePath);
    }
}

module.exports = {
    hint: function (targets, config, reporter, ignore, extraExtensionList) {
        var files = [],
            results = [],
            data = [],
            regExtension;

        extraExtensionList = extraExtensionList || "";
        regExtension = new RegExp('\\.(js' + (extraExtensionList === "" ? "" : "|" + extraExtensionList.replace(/,/g, "|").replace(/[\. ]/g, "")) + ")$");

        targets.forEach(function (target) {
            _collect(target, files, ignore, regExtension);
        });

        files.forEach(function (file) {
            _lint(file, results, config, data);
        });

        _cache = {
            directories: {}
        };

        (reporter || _reporter)(results, data);

        return results;
    }
};
