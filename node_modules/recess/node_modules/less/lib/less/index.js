var path = require('path'),
    sys = require('util'),
    url = require('url'),
    http = require('http'),
    fs = require('fs');

var less = {
    version: [1, 3, 3],
    Parser: require('./parser').Parser,
    importer: require('./parser').importer,
    tree: require('./tree'),
    render: function (input, options, callback) {
        options = options || {};

        if (typeof(options) === 'function') {
            callback = options, options = {};
        }

        var parser = new(less.Parser)(options),
            ee;

        if (callback) {
            parser.parse(input, function (e, root) {
                callback(e, root && root.toCSS && root.toCSS(options));
            });
        } else {
            ee = new(require('events').EventEmitter);

            process.nextTick(function () {
                parser.parse(input, function (e, root) {
                    if (e) { ee.emit('error', e) }
                    else   { ee.emit('success', root.toCSS(options)) }
                });
            });
            return ee;
        }
    },
    formatError: function(ctx, options) {
        options = options || {};

        var message = "";
        var extract = ctx.extract;
        var error = [];
        var stylize = options.color ? require('./lessc_helper').stylize : function (str) { return str };

        // only output a stack if it isn't a less error
        if (ctx.stack && !ctx.type) { return stylize(ctx.stack, 'red') }

        if (!ctx.hasOwnProperty('index') || !extract) {
            return ctx.stack || ctx.message;
        }

        if (typeof(extract[0]) === 'string') {
            error.push(stylize((ctx.line - 1) + ' ' + extract[0], 'grey'));
        }

        if (extract[1]) {
            error.push(ctx.line + ' ' + extract[1].slice(0, ctx.column)
                                + stylize(stylize(stylize(extract[1][ctx.column], 'bold')
                                + extract[1].slice(ctx.column + 1), 'red'), 'inverse'));
        }

        if (typeof(extract[2]) === 'string') {
            error.push(stylize((ctx.line + 1) + ' ' + extract[2], 'grey'));
        }
        error = error.join('\n') + stylize('', 'reset') + '\n';

        message += stylize(ctx.type + 'Error: ' + ctx.message, 'red');
        ctx.filename && (message += stylize(' in ', 'red') + ctx.filename +
                stylize(':' + ctx.line + ':' + ctx.column, 'grey'));

        message += '\n' + error;

        if (ctx.callLine) {
            message += stylize('from ', 'red') + (ctx.filename || '') + '/n';
            message += stylize(ctx.callLine, 'grey') + ' ' + ctx.callExtract + '/n';
        }

        return message;
    },
    writeError: function (ctx, options) {
        options = options || {};
        if (options.silent) { return }
        sys.error(less.formatError(ctx, options));
    }
};

['color',      'directive',  'operation',  'dimension',
 'keyword',    'variable',   'ruleset',    'element',
 'selector',   'quoted',     'expression', 'rule',
 'call',       'url',        'alpha',      'import',
 'mixin',      'comment',    'anonymous',  'value',
 'javascript', 'assignment', 'condition',  'paren',
 'media',      'ratio',      'unicode-descriptor'
].forEach(function (n) {
    require('./tree/' + n);
});


var isUrlRe = /^(?:https?:)?\/\//i;

less.Parser.importer = function (file, paths, callback, env) {
    var pathname, dirname, data;

    function parseFile(e, data) {
        if (e) return callback(e);
        
        var rootpath = env.rootpath,
            j = file.lastIndexOf('/');

        // Pass on an updated rootpath if path of imported file is relative and file 
        // is in a (sub|sup) directory
        // 
        // Examples: 
        // - If path of imported file is 'module/nav/nav.less' and rootpath is 'less/',
        //   then rootpath should become 'less/module/nav/'
        // - If path of imported file is '../mixins.less' and rootpath is 'less/', 
        //   then rootpath should become 'less/../'
        if(env.relativeUrls && !/^(?:[a-z-]+:|\/)/.test(file) && j != -1) {
            rootpath = rootpath + file.slice(0, j+1); // append (sub|sup) directory path of imported file
        }

        env.contents[pathname] = data;      // Updating top importing parser content cache.
        new(less.Parser)({
                paths: [dirname].concat(paths),
                filename: pathname,
                contents: env.contents,
                files: env.files,
                syncImport: env.syncImport,
                relativeUrls: env.relativeUrls,
                rootpath: rootpath,
                dumpLineNumbers: env.dumpLineNumbers
        }).parse(data, function (e, root) {
            callback(e, root, pathname);
        });
    };
    
    var isUrl = isUrlRe.test( file );
    if (isUrl || isUrlRe.test(paths[0])) {

        var urlStr = isUrl ? file : url.resolve(paths[0], file),
            urlObj = url.parse(urlStr),
            req = {
                host:   urlObj.hostname,
                port:   urlObj.port || 80,
                path:   urlObj.pathname + (urlObj.search||'')
            };

        http.get(req, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk.toString();
            });
            res.on('end', function () {
                if (res.statusCode === 404) {
                    callback({ type: 'File', message: "resource '" + urlStr + "' was not found\n" });
                }
                if (!body) {
                    sys.error( 'Warning: Empty body (HTTP '+ res.statusCode + ') returned by "' + urlStr +'"' );
                }
                pathname = urlStr;
                dirname = urlObj.protocol +'//'+ urlObj.host + urlObj.pathname.replace(/[^\/]*$/, '');
                parseFile(null, body);
            });
        }).on('error', function (err) {
            callback({ type: 'File', message: "resource '" + urlStr + "' gave this Error:\n  "+ err +"\n" });
        });

    } else {

        // TODO: Undo this at some point,
        // or use different approach.
        var paths = [].concat(paths);
        paths.push('.');

        for (var i = 0; i < paths.length; i++) {
            try {
                pathname = path.join(paths[i], file);
                fs.statSync(pathname);
                break;
            } catch (e) {
                pathname = null;
            }
        }
        
        paths = paths.slice(0, paths.length - 1);

        if (!pathname) {

            if (typeof(env.errback) === "function") {
                env.errback(file, paths, callback);
            } else {
                callback({ type: 'File', message: "'" + file + "' wasn't found.\n" });
            }
            return;
        }
        
        dirname = path.dirname(pathname);

        if (env.syncImport) {
            try {
                data = fs.readFileSync(pathname, 'utf-8');
                parseFile(null, data);
            } catch (e) {
                parseFile(e);
            }
        } else {
            fs.readFile(pathname, 'utf-8', parseFile);
        }
    }
}

require('./functions');
require('./colors');

for (var k in less) { exports[k] = less[k] }
