//
// Stub out `require` in rhino
//
function require(arg) {
    return less[arg.split('/')[1]];
};


// ecma-5.js
//
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- tlrobinson Tom Robinson
// dantman Daniel Friesen

//
// Array
//
if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]" ||
               (obj instanceof Array);
    };
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach =  function(block, thisObject) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }
    };
}
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        var res = new Array(len);
        var thisp = arguments[1];

        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }
        return res;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (block /*, thisp */) {
        var values = [];
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++) {
            if (block.call(thisp, this[i])) {
                values.push(this[i]);
            }
        }
        return values;
    };
}
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        var i = 0;

        // no value to return if no initial value and an empty array
        if (len === 0 && arguments.length === 1) throw new TypeError();

        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }
                // if array contains no values, no initial value to return
                if (++i >= len) throw new TypeError();
            } while (true);
        }
        for (; i < len; i++) {
            if (i in this) {
                rv = fun.call(null, rv, this[i], i, this);
            }
        }
        return rv;
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (value /*, fromIndex */ ) {
        var length = this.length;
        var i = arguments[1] || 0;

        if (!length)     return -1;
        if (i >= length) return -1;
        if (i < 0)       i += length;

        for (; i < length; i++) {
            if (!Object.prototype.hasOwnProperty.call(this, i)) { continue }
            if (value === this[i]) return i;
        }
        return -1;
    };
}

//
// Object
//
if (!Object.keys) {
    Object.keys = function (object) {
        var keys = [];
        for (var name in object) {
            if (Object.prototype.hasOwnProperty.call(object, name)) {
                keys.push(name);
            }
        }
        return keys;
    };
}

//
// String
//
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
}


var less, tree;

var BROWSER = 0; var NODE = 1; var RHINO = 2;
var engine;

if (typeof environment === "object" && ({}).toString.call(environment) === "[object Environment]") {
    // Rhino
    // Details on how to detect Rhino: https://github.com/ringo/ringojs/issues/88
    less = {};
    tree = less.tree = {};
    engine = RHINO;
} else if (typeof(window) === 'undefined') {
    // Node.js
    less = exports,
    tree = require('less/tree');
    engine = NODE;
} else {
    // Browser
    if (typeof(window.less) === 'undefined') { window.less = {} }
    less = window.less,
    tree = window.less.tree = {};
    engine = BROWSER;
}
//
// less.js - parser
//
//    A relatively straight-forward predictive parser.
//    There is no tokenization/lexing stage, the input is parsed
//    in one sweep.
//
//    To make the parser fast enough to run in the browser, several
//    optimization had to be made:
//
//    - Matching and slicing on a huge input is often cause of slowdowns.
//      The solution is to chunkify the input into smaller strings.
//      The chunks are stored in the `chunks` var,
//      `j` holds the current chunk index, and `current` holds
//      the index of the current chunk in relation to `input`.
//      This gives us an almost 4x speed-up.
//
//    - In many cases, we don't need to match individual tokens;
//      for example, if a value doesn't hold any variables, operations
//      or dynamic references, the parser can effectively 'skip' it,
//      treating it as a literal.
//      An example would be '1px solid #000' - which evaluates to itself,
//      we don't need to know what the individual components are.
//      The drawback, of course is that you don't get the benefits of
//      syntax-checking on the CSS. This gives us a 50% speed-up in the parser,
//      and a smaller speed-up in the code-gen.
//
//
//    Token matching is done with the `$` function, which either takes
//    a terminal string or regexp, or a non-terminal function to call.
//    It also takes care of moving all the indices forwards.
//
//
less.Parser = function Parser(env) {
    var input,       // LeSS input string
        i,           // current index in `input`
        j,           // current chunk
        temp,        // temporarily holds a chunk's state, for backtracking
        memo,        // temporarily holds `i`, when backtracking
        furthest,    // furthest index the parser has gone to
        chunks,      // chunkified input
        current,     // index of current chunk, in `input`
        parser;

    var that = this;

    // This function is called after all files
    // have been imported through `@import`.
    var finish = function () {};

    var imports = this.imports = {
        paths: env && env.paths || [],  // Search paths, when importing
        queue: [],                      // Files which haven't been imported yet
        files: {},                      // Holds the imported parse trees
        mime:  env && env.mime,         // MIME type of .less files
        push: function (path, callback) {
            var that = this;
            this.queue.push(path);

            //
            // Import a file asynchronously
            //
            less.Parser.importer(path, this.paths, function (root) {
                that.queue.splice(that.queue.indexOf(path), 1); // Remove the path from the queue
                that.files[path] = root;                        // Store the root

                callback(root);

                if (that.queue.length === 0) { finish() }       // Call `finish` if we're done importing
            }, env);
        }
    };

    function save()    { temp = chunks[j], memo = i, current = i }
    function restore() { chunks[j] = temp, i = memo, current = i }

    function sync() {
        if (i > current) {
            chunks[j] = chunks[j].slice(i - current);
            current = i;
        }
    }
    //
    // Parse from a token, regexp or string, and move forward if match
    //
    function $(tok) {
        var match, args, length, c, index, endIndex, k, mem;

        //
        // Non-terminal
        //
        if (tok instanceof Function) {
            return tok.call(parser.parsers);
        //
        // Terminal
        //
        //     Either match a single character in the input,
        //     or match a regexp in the current chunk (chunk[j]).
        //
        } else if (typeof(tok) === 'string') {
            match = input.charAt(i) === tok ? tok : null;
            length = 1;
            sync ();
        } else {
            sync ();

            if (match = tok.exec(chunks[j])) {
                length = match[0].length;
            } else {
                return null;
            }
        }

        // The match is confirmed, add the match length to `i`,
        // and consume any extra white-space characters (' ' || '\n')
        // which come after that. The reason for this is that LeSS's
        // grammar is mostly white-space insensitive.
        //
        if (match) {
            mem = i += length;
            endIndex = i + chunks[j].length - length;

            while (i < endIndex) {
                c = input.charCodeAt(i);
                if (! (c === 32 || c === 10 || c === 9)) { break }
                i++;
            }
            chunks[j] = chunks[j].slice(length + (i - mem));
            current = i;

            if (chunks[j].length === 0 && j < chunks.length - 1) { j++ }

            if(typeof(match) === 'string') {
                return match;
            } else {
                return match.length === 1 ? match[0] : match;
            }
        }
    }

    // Same as $(), but don't change the state of the parser,
    // just return the match.
    function peek(tok) {
        if (typeof(tok) === 'string') {
            return input.charAt(i) === tok;
        } else {
            if (tok.test(chunks[j])) {
                return true;
            } else {
                return false;
            }
        }
    }

    this.env = env = env || {};

    // The optimization level dictates the thoroughness of the parser,
    // the lower the number, the less nodes it will create in the tree.
    // This could matter for debugging, or if you want to access
    // the individual nodes in the tree.
    this.optimization = ('optimization' in this.env) ? this.env.optimization : 1;

    this.env.filename = this.env.filename || null;

    //
    // The Parser
    //
    return parser = {

        imports: imports,
        //
        // Parse an input string into an abstract syntax tree,
        // call `callback` when done.
        //
        parse: function (str, callback) {
            var root, start, end, zone, line, lines, buff = [], c, error = null;

            i = j = current = furthest = 0;
            chunks = [];
            input = str.replace(/\r\n/g, '\n');

            // Split the input into chunks.
            chunks = (function (chunks) {
                var j = 0,
                    skip = /[^"'`\{\}\/\(\)]+/g,
                    comment = /\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g,
                    level = 0,
                    match,
                    chunk = chunks[0],
                    inParam,
                    inString;

                for (var i = 0, c, cc; i < input.length; i++) {
                    skip.lastIndex = i;
                    if (match = skip.exec(input)) {
                        if (match.index === i) {
                            i += match[0].length;
                            chunk.push(match[0]);
                        }
                    }
                    c = input.charAt(i);
                    comment.lastIndex = i;

                    if (!inString && !inParam && c === '/') {
                        cc = input.charAt(i + 1);
                        if (cc === '/' || cc === '*') {
                            if (match = comment.exec(input)) {
                                if (match.index === i) {
                                    i += match[0].length;
                                    chunk.push(match[0]);
                                    c = input.charAt(i);
                                }
                            }
                        }
                    }

                    if        (c === '{' && !inString && !inParam) { level ++;
                        chunk.push(c);
                    } else if (c === '}' && !inString && !inParam) { level --;
                        chunk.push(c);
                        chunks[++j] = chunk = [];
                    } else if (c === '(' && !inString && !inParam) {
                        chunk.push(c);
                        inParam = true;
                    } else if (c === ')' && !inString && inParam) {
                        chunk.push(c);
                        inParam = false;
                    } else {
                        if (c === '"' || c === "'" || c === '`') {
                            if (! inString) {
                                inString = c;
                            } else {
                                inString = inString === c ? false : inString;
                            }
                        }
                        chunk.push(c);
                    }
                }
                if (level > 0) {
                    throw {
                        type: 'Syntax',
                        message: "Missing closing `}`",
                        filename: env.filename
                    };
                }

                return chunks.map(function (c) { return c.join('') });;
            })([[]]);

            // Start with the primary rule.
            // The whole syntax tree is held under a Ruleset node,
            // with the `root` property set to true, so no `{}` are
            // output. The callback is called when the input is parsed.
            root = new(tree.Ruleset)([], $(this.parsers.primary));
            root.root = true;

            root.toCSS = (function (evaluate) {
                var line, lines, column;

                return function (options, variables) {
                    var frames = [];

                    options = options || {};
                    //
                    // Allows setting variables with a hash, so:
                    //
                    //   `{ color: new(tree.Color)('#f01') }` will become:
                    //
                    //   new(tree.Rule)('@color',
                    //     new(tree.Value)([
                    //       new(tree.Expression)([
                    //         new(tree.Color)('#f01')
                    //       ])
                    //     ])
                    //   )
                    //
                    if (typeof(variables) === 'object' && !Array.isArray(variables)) {
                        variables = Object.keys(variables).map(function (k) {
                            var value = variables[k];

                            if (! (value instanceof tree.Value)) {
                                if (! (value instanceof tree.Expression)) {
                                    value = new(tree.Expression)([value]);
                                }
                                value = new(tree.Value)([value]);
                            }
                            return new(tree.Rule)('@' + k, value, false, 0);
                        });
                        frames = [new(tree.Ruleset)(null, variables)];
                    }

                    try {
                        var css = evaluate.call(this, { frames: frames })
                                          .toCSS([], { compress: options.compress || false });
                    } catch (e) {
                        lines = input.split('\n');
                        line = getLine(e.index);

                        for (var n = e.index, column = -1;
                                 n >= 0 && input.charAt(n) !== '\n';
                                 n--) { column++ }

                        // throw {
                        //     type: e.type,
                        //     message: e.message,
                        //     filename: env.filename,
                        //     index: e.index,
                        //     line: typeof(line) === 'number' ? line + 1 : null,
                        //     callLine: e.call && (getLine(e.call) + 1),
                        //     callExtract: lines[getLine(e.call)],
                        //     stack: e.stack,
                        //     column: column,
                        //     extract: [
                        //         lines[line - 1],
                        //         lines[line],
                        //         lines[line + 1]
                        //     ]
                        // };
                    }
                    if (options.compress) {
                        return css.replace(/(\s)+/g, "$1");
                    } else {
                        return css;
                    }

                    function getLine(index) {
                        return index ? (input.slice(0, index).match(/\n/g) || "").length : null;
                    }
                };
            })(root.eval);

            // If `i` is smaller than the `input.length - 1`,
            // it means the parser wasn't able to parse the whole
            // string, so we've got a parsing error.
            //
            // We try to extract a \n delimited string,
            // showing the line where the parse error occured.
            // We split it up into two parts (the part which parsed,
            // and the part which didn't), so we can color them differently.
            if (i < input.length - 1) {
                i = furthest;
                lines = input.split('\n');
                line = (input.slice(0, i).match(/\n/g) || "").length + 1;

                for (var n = i, column = -1; n >= 0 && input.charAt(n) !== '\n'; n--) { column++ }

                error = {
                    name: "ParseError",
                    message: "Syntax Error on line " + line,
                    index: i,
                    filename: env.filename,
                    line: line,
                    column: column,
                    extract: [
                        lines[line - 2],
                        lines[line - 1],
                        lines[line]
                    ]
                };
            }

            if (this.imports.queue.length > 0) {
                finish = function () { callback(error, root) };
            } else {
                callback(error, root);
            }
        },

        //
        // Here in, the parsing rules/functions
        //
        // The basic structure of the syntax tree generated is as follows:
        //
        //   Ruleset ->  Rule -> Value -> Expression -> Entity
        //
        // Here's some LESS code:
        //
        //    .class {
        //      color: #fff;
        //      border: 1px solid #000;
        //      width: @w + 4px;
        //      > .child {...}
        //    }
        //
        // And here's what the parse tree might look like:
        //
        //     Ruleset (Selector '.class', [
        //         Rule ("color",  Value ([Expression [Color #fff]]))
        //         Rule ("border", Value ([Expression [Dimension 1px][Keyword "solid"][Color #000]]))
        //         Rule ("width",  Value ([Expression [Operation "+" [Variable "@w"][Dimension 4px]]]))
        //         Ruleset (Selector [Element '>', '.child'], [...])
        //     ])
        //
        //  In general, most rules will try to parse a token with the `$()` function, and if the return
        //  value is truly, will return a new node, of the relevant type. Sometimes, we need to check
        //  first, before parsing, that's when we use `peek()`.
        //
        parsers: {
            //
            // The `primary` rule is the *entry* and *exit* point of the parser.
            // The rules here can appear at any level of the parse tree.
            //
            // The recursive nature of the grammar is an interplay between the `block`
            // rule, which represents `{ ... }`, the `ruleset` rule, and this `primary` rule,
            // as represented by this simplified grammar:
            //
            //     primary  →  (ruleset | rule)+
            //     ruleset  →  selector+ block
            //     block    →  '{' primary '}'
            //
            // Only at one point is the primary rule not called from the
            // block rule: at the root level.
            //
            primary: function () {
                var node, root = [];

                while ((node = $(this.mixin.definition) || $(this.rule)    ||  $(this.ruleset) ||
                               $(this.mixin.call)       || $(this.comment) ||  $(this.directive))
                               || $(/^[\s\n]+/)) {
                    node && root.push(node);
                }
                return root;
            },

            // We create a Comment node for CSS comments `/* */`,
            // but keep the LeSS comments `//` silent, by just skipping
            // over them.
            comment: function () {
                var comment;

                if (input.charAt(i) !== '/') return;

                if (input.charAt(i + 1) === '/') {
                    return new(tree.Comment)($(/^\/\/.*/), true);
                } else if (comment = $(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)) {
                    return new(tree.Comment)(comment);
                }
            },

            //
            // Entities are tokens which can be found inside an Expression
            //
            entities: {
                //
                // A string, which supports escaping " and '
                //
                //     "milky way" 'he\'s the one!'
                //
                quoted: function () {
                    var str, j = i, e;

                    if (input.charAt(j) === '~') { j++, e = true } // Escaped strings
                    if (input.charAt(j) !== '"' && input.charAt(j) !== "'") return;

                    e && $('~');

                    if (str = $(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)) {
                        return new(tree.Quoted)(str[0], str[1] || str[2], e);
                    }
                },

                //
                // A catch-all word, such as:
                //
                //     black border-collapse
                //
                keyword: function () {
                    var k;
                    if (k = $(/^[_A-Za-z-][_A-Za-z0-9-]*/)) { return new(tree.Keyword)(k) }
                },

                //
                // A function call
                //
                //     rgb(255, 0, 255)
                //
                // We also try to catch IE's `alpha()`, but let the `alpha` parser
                // deal with the details.
                //
                // The arguments are parsed with the `entities.arguments` parser.
                //
                call: function () {
                    var name, args, index = i;

                    if (! (name = /^([\w-]+|%)\(/.exec(chunks[j]))) return;

                    name = name[1].toLowerCase();

                    if (name === 'url') { return null }
                    else                { i += name.length }

                    if (name === 'alpha') { return $(this.alpha) }

                    $('('); // Parse the '(' and consume whitespace.

                    args = $(this.entities.arguments);

                    if (! $(')')) return;

                    if (name) { return new(tree.Call)(name, args, index) }
                },
                arguments: function () {
                    var args = [], arg;

                    while (arg = $(this.expression)) {
                        args.push(arg);
                        if (! $(',')) { break }
                    }
                    return args;
                },
                literal: function () {
                    return $(this.entities.dimension) ||
                           $(this.entities.color) ||
                           $(this.entities.quoted);
                },

                //
                // Parse url() tokens
                //
                // We use a specific rule for urls, because they don't really behave like
                // standard function calls. The difference is that the argument doesn't have
                // to be enclosed within a string, so it can't be parsed as an Expression.
                //
                url: function () {
                    var value;

                    if (input.charAt(i) !== 'u' || !$(/^url\(/)) return;
                    value = $(this.entities.quoted)  || $(this.entities.variable) ||
                            $(this.entities.dataURI) || $(/^[-\w%@$\/.&=:;#+?~]+/) || "";
                    if (! $(')')) throw new(Error)("missing closing ) for url()");

                    return new(tree.URL)((value.value || value.data || value instanceof tree.Variable)
                                        ? value : new(tree.Anonymous)(value), imports.paths);
                },

                dataURI: function () {
                    var obj;

                    if ($(/^data:/)) {
                        obj         = {};
                        obj.mime    = $(/^[^\/]+\/[^,;)]+/)     || '';
                        obj.charset = $(/^;\s*charset=[^,;)]+/) || '';
                        obj.base64  = $(/^;\s*base64/)          || '';
                        obj.data    = $(/^,\s*[^)]+/);

                        if (obj.data) { return obj }
                    }
                },

                //
                // A Variable entity, such as `@fink`, in
                //
                //     width: @fink + 2px
                //
                // We use a different parser for variable definitions,
                // see `parsers.variable`.
                //
                variable: function () {
                    var name, index = i;

                    if (input.charAt(i) === '@' && (name = $(/^@@?[\w-]+/))) {
                        return new(tree.Variable)(name, index);
                    }
                },

                //
                // A Hexadecimal color
                //
                //     #4F3C2F
                //
                // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
                //
                color: function () {
                    var rgb;

                    if (input.charAt(i) === '#' && (rgb = $(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/))) {
                        return new(tree.Color)(rgb[1]);
                    }
                },

                //
                // A Dimension, that is, a number and a unit
                //
                //     0.5em 95%
                //
                dimension: function () {
                    var value, c = input.charCodeAt(i);
                    if ((c > 57 || c < 45) || c === 47) return;

                    if (value = $(/^(-?\d*\.?\d+)(px|%|em|pc|ex|in|deg|s|ms|pt|cm|mm|rad|grad|turn)?/)) {
                        return new(tree.Dimension)(value[1], value[2]);
                    }
                },

                //
                // JavaScript code to be evaluated
                //
                //     `window.location.href`
                //
                javascript: function () {
                    var str, j = i, e;

                    if (input.charAt(j) === '~') { j++, e = true } // Escaped strings
                    if (input.charAt(j) !== '`') { return }

                    e && $('~');

                    if (str = $(/^`([^`]*)`/)) {
                        return new(tree.JavaScript)(str[1], i, e);
                    }
                }
            },

            //
            // The variable part of a variable definition. Used in the `rule` parser
            //
            //     @fink:
            //
            variable: function () {
                var name;

                if (input.charAt(i) === '@' && (name = $(/^(@[\w-]+)\s*:/))) { return name[1] }
            },

            //
            // A font size/line-height shorthand
            //
            //     small/12px
            //
            // We need to peek first, or we'll match on keywords and dimensions
            //
            shorthand: function () {
                var a, b;

                if (! peek(/^[@\w.%-]+\/[@\w.-]+/)) return;

                if ((a = $(this.entity)) && $('/') && (b = $(this.entity))) {
                    return new(tree.Shorthand)(a, b);
                }
            },

            //
            // Mixins
            //
            mixin: {
                //
                // A Mixin call, with an optional argument list
                //
                //     #mixins > .square(#fff);
                //     .rounded(4px, black);
                //     .button;
                //
                // The `while` loop is there because mixins can be
                // namespaced, but we only support the child and descendant
                // selector for now.
                //
                call: function () {
                    var elements = [], e, c, args, index = i, s = input.charAt(i);

                    if (s !== '.' && s !== '#') { return }

                    while (e = $(/^[#.](?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+/)) {
                        elements.push(new(tree.Element)(c, e));
                        c = $('>');
                    }
                    $('(') && (args = $(this.entities.arguments)) && $(')');

                    if (elements.length > 0 && ($(';') || peek('}'))) {
                        return new(tree.mixin.Call)(elements, args, index);
                    }
                },

                //
                // A Mixin definition, with a list of parameters
                //
                //     .rounded (@radius: 2px, @color) {
                //        ...
                //     }
                //
                // Until we have a finer grained state-machine, we have to
                // do a look-ahead, to make sure we don't have a mixin call.
                // See the `rule` function for more information.
                //
                // We start by matching `.rounded (`, and then proceed on to
                // the argument list, which has optional default values.
                // We store the parameters in `params`, with a `value` key,
                // if there is a value, such as in the case of `@radius`.
                //
                // Once we've got our params list, and a closing `)`, we parse
                // the `{...}` block.
                //
                definition: function () {
                    var name, params = [], match, ruleset, param, value;

                    if ((input.charAt(i) !== '.' && input.charAt(i) !== '#') ||
                        peek(/^[^{]*(;|})/)) return;

                    if (match = $(/^([#.](?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+)\s*\(/)) {
                        name = match[1];

                        while (param = $(this.entities.variable) || $(this.entities.literal)
                                                                 || $(this.entities.keyword)) {
                            // Variable
                            if (param instanceof tree.Variable) {
                                if ($(':')) {
                                    if (value = $(this.expression)) {
                                        params.push({ name: param.name, value: value });
                                    } else {
                                        throw new(Error)("Expected value");
                                    }
                                } else {
                                    params.push({ name: param.name });
                                }
                            } else {
                                params.push({ value: param });
                            }
                            if (! $(',')) { break }
                        }
                        if (! $(')')) throw new(Error)("Expected )");

                        ruleset = $(this.block);

                        if (ruleset) {
                            return new(tree.mixin.Definition)(name, params, ruleset);
                        }
                    }
                }
            },

            //
            // Entities are the smallest recognized token,
            // and can be found inside a rule's value.
            //
            entity: function () {
                return $(this.entities.literal) || $(this.entities.variable) || $(this.entities.url) ||
                       $(this.entities.call)    || $(this.entities.keyword)  || $(this.entities.javascript) ||
                       $(this.comment);
            },

            //
            // A Rule terminator. Note that we use `peek()` to check for '}',
            // because the `block` rule will be expecting it, but we still need to make sure
            // it's there, if ';' was ommitted.
            //
            end: function () {
                return $(';') || peek('}');
            },

            //
            // IE's alpha function
            //
            //     alpha(opacity=88)
            //
            alpha: function () {
                var value;

                if (! $(/^\(opacity=/i)) return;
                if (value = $(/^\d+/) || $(this.entities.variable)) {
                    if (! $(')')) throw new(Error)("missing closing ) for alpha()");
                    return new(tree.Alpha)(value);
                }
            },

            //
            // A Selector Element
            //
            //     div
            //     + h1
            //     #socks
            //     input[type="text"]
            //
            // Elements are the building blocks for Selectors,
            // they are made out of a `Combinator` (see combinator rule),
            // and an element name, such as a tag a class, or `*`.
            //
            element: function () {
                var e, t, c;

                c = $(this.combinator);
                e = $(/^(?:[.#]?|:*)(?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+/) || $('*') || $(this.attribute) || $(/^\([^)@]+\)/) || $(/^(?:\d*\.)?\d+%/);

                if (e) { return new(tree.Element)(c, e) }

                if (c.value && c.value[0] === '&') {
                  return new(tree.Element)(c, null);
                }
            },

            //
            // Combinators combine elements together, in a Selector.
            //
            // Because our parser isn't white-space sensitive, special care
            // has to be taken, when parsing the descendant combinator, ` `,
            // as it's an empty space. We have to check the previous character
            // in the input, to see if it's a ` ` character. More info on how
            // we deal with this in *combinator.js*.
            //
            combinator: function () {
                var match, c = input.charAt(i);

                if (c === '>' || c === '+' || c === '~') {
                    i++;
                    while (input.charAt(i) === ' ') { i++ }
                    return new(tree.Combinator)(c);
                } else if (c === '&') {
                    match = '&';
                    i++;
                    if(input.charAt(i) === ' ') {
                        match = '& ';
                    }
                    while (input.charAt(i) === ' ') { i++ }
                    return new(tree.Combinator)(match);
                } else if (c === ':' && input.charAt(i + 1) === ':') {
                    i += 2;
                    while (input.charAt(i) === ' ') { i++ }
                    return new(tree.Combinator)('::');
                } else if (input.charAt(i - 1) === ' ') {
                    return new(tree.Combinator)(" ");
                } else {
                    return new(tree.Combinator)(null);
                }
            },

            //
            // A CSS Selector
            //
            //     .class > div + h1
            //     li a:hover
            //
            // Selectors are made out of one or more Elements, see above.
            //
            selector: function () {
                var sel, e, elements = [], c, match;

                while (e = $(this.element)) {
                    c = input.charAt(i);
                    elements.push(e)
                    if (c === '{' || c === '}' || c === ';' || c === ',') { break }
                }

                if (elements.length > 0) { return new(tree.Selector)(elements) }
            },
            tag: function () {
                return $(/^[a-zA-Z][a-zA-Z-]*[0-9]?/) || $('*');
            },
            attribute: function () {
                var attr = '', key, val, op;

                if (! $('[')) return;

                if (key = $(/^[a-zA-Z-]+/) || $(this.entities.quoted)) {
                    if ((op = $(/^[|~*$^]?=/)) &&
                        (val = $(this.entities.quoted) || $(/^[\w-]+/))) {
                        attr = [key, op, val.toCSS ? val.toCSS() : val].join('');
                    } else { attr = key }
                }

                if (! $(']')) return;

                if (attr) { return "[" + attr + "]" }
            },

            //
            // The `block` rule is used by `ruleset` and `mixin.definition`.
            // It's a wrapper around the `primary` rule, with added `{}`.
            //
            block: function () {
                var content;

                if ($('{') && (content = $(this.primary)) && $('}')) {
                    return content;
                }
            },

            //
            // div, .class, body > p {...}
            //
            ruleset: function () {
                var selectors = [], s, rules, match;
                save();

                while (s = $(this.selector)) {
                    selectors.push(s);
                    $(this.comment);
                    if (! $(',')) { break }
                    $(this.comment);
                }

                if (selectors.length > 0 && (rules = $(this.block))) {
                    return new(tree.Ruleset)(selectors, rules);
                } else {
                    // Backtrack
                    furthest = i;
                    restore();
                }
            },
            rule: function () {
                var name, value, c = input.charAt(i), important, match;
                save();

                if (c === '.' || c === '#' || c === '&') { return }

                if (name = $(this.variable) || $(this.property)) {
                    if ((name.charAt(0) != '@') && (match = /^([^@+\/'"*`(;{}-]*);/.exec(chunks[j]))) {
                        i += match[0].length - 1;
                        value = new(tree.Anonymous)(match[1]);
                    } else if (name === "font") {
                        value = $(this.font);
                    } else {
                        value = $(this.value);
                    }
                    important = $(this.important);

                    if (value && $(this.end)) {
                        return new(tree.Rule)(name, value, important, memo);
                    } else {
                        furthest = i;
                        restore();
                    }
                }
            },

            //
            // An @import directive
            //
            //     @import "lib";
            //
            // Depending on our environemnt, importing is done differently:
            // In the browser, it's an XHR request, in Node, it would be a
            // file-system operation. The function used for importing is
            // stored in `import`, which we pass to the Import constructor.
            //
            "import": function () {
                var path;
                if ($(/^@import\s+/) &&
                    (path = $(this.entities.quoted) || $(this.entities.url)) &&
                    $(';')) {
                    return new(tree.Import)(path, imports);
                }
            },

            //
            // A CSS Directive
            //
            //     @charset "utf-8";
            //
            directive: function () {
                var name, value, rules, types;

                if (input.charAt(i) !== '@') return;

                if (value = $(this['import'])) {
                    return value;
                } else if (name = $(/^@media|@page/) || $(/^@(?:-webkit-|-moz-)?keyframes/)) {
                    types = ($(/^[^{]+/) || '').trim();
                    if (rules = $(this.block)) {
                        return new(tree.Directive)(name + " " + types, rules);
                    }
                } else if (name = $(/^@[-a-z]+/)) {
                    if (name === '@font-face') {
                        if (rules = $(this.block)) {
                            return new(tree.Directive)(name, rules);
                        }
                    } else if ((value = $(this.entity)) && $(';')) {
                        return new(tree.Directive)(name, value);
                    }
                }
            },
            font: function () {
                var value = [], expression = [], weight, shorthand, font, e;

                while (e = $(this.shorthand) || $(this.entity)) {
                    expression.push(e);
                }
                value.push(new(tree.Expression)(expression));

                if ($(',')) {
                    while (e = $(this.expression)) {
                        value.push(e);
                        if (! $(',')) { break }
                    }
                }
                return new(tree.Value)(value);
            },

            //
            // A Value is a comma-delimited list of Expressions
            //
            //     font-family: Baskerville, Georgia, serif;
            //
            // In a Rule, a Value represents everything after the `:`,
            // and before the `;`.
            //
            value: function () {
                var e, expressions = [], important;

                while (e = $(this.expression)) {
                    expressions.push(e);
                    if (! $(',')) { break }
                }

                if (expressions.length > 0) {
                    return new(tree.Value)(expressions);
                }
            },
            important: function () {
                if (input.charAt(i) === '!') {
                    return $(/^! *important/);
                }
            },
            sub: function () {
                var e;

                if ($('(') && (e = $(this.expression)) && $(')')) {
                    return e;
                }
            },
            multiplication: function () {
                var m, a, op, operation;
                if (m = $(this.operand)) {
                    while ((op = ($('/') || $('*'))) && (a = $(this.operand))) {
                        operation = new(tree.Operation)(op, [operation || m, a]);
                    }
                    return operation || m;
                }
            },
            addition: function () {
                var m, a, op, operation;
                if (m = $(this.multiplication)) {
                    while ((op = $(/^[-+]\s+/) || (input.charAt(i - 1) != ' ' && ($('+') || $('-')))) &&
                           (a = $(this.multiplication))) {
                        operation = new(tree.Operation)(op, [operation || m, a]);
                    }
                    return operation || m;
                }
            },

            //
            // An operand is anything that can be part of an operation,
            // such as a Color, or a Variable
            //
            operand: function () {
                var negate, p = input.charAt(i + 1);

                if (input.charAt(i) === '-' && (p === '@' || p === '(')) { negate = $('-') }
                var o = $(this.sub) || $(this.entities.dimension) ||
                        $(this.entities.color) || $(this.entities.variable) ||
                        $(this.entities.call);
                return negate ? new(tree.Operation)('*', [new(tree.Dimension)(-1), o])
                              : o;
            },

            //
            // Expressions either represent mathematical operations,
            // or white-space delimited Entities.
            //
            //     1px solid black
            //     @var * 2
            //
            expression: function () {
                var e, delim, entities = [], d;

                while (e = $(this.addition) || $(this.entity)) {
                    entities.push(e);
                }
                if (entities.length > 0) {
                    return new(tree.Expression)(entities);
                }
            },
            property: function () {
                var name;

                if (name = $(/^(\*?-?[-a-z_0-9]+)\s*:/)) {
                    return name[1];
                }
            }
        }
    };
};

if (engine === BROWSER || engine === RHINO) {
    //
    // Used by `@import` directives
    //
    less.Parser.importer = function (path, paths, callback, env) {
        if (path.charAt(0) !== '/' && paths.length > 0) {
            path = paths[0] + path;
        }
        // We pass `true` as 3rd argument, to force the reload of the import.
        // This is so we can get the syntax tree as opposed to just the CSS output,
        // as we need this to evaluate the current stylesheet.
        loadStyleSheet({ href: path, title: path, type: env.mime }, callback, true);
    };
}



(function (tree) {

tree.functions = {
    rgb: function (r, g, b) {
        return this.rgba(r, g, b, 1.0);
    },
    rgba: function (r, g, b, a) {
        var rgb = [r, g, b].map(function (c) { return number(c) }),
            a = number(a);
        return new(tree.Color)(rgb, a);
    },
    hsl: function (h, s, l) {
        return this.hsla(h, s, l, 1.0);
    },
    hsla: function (h, s, l, a) {
        h = (number(h) % 360) / 360;
        s = number(s); l = number(l); a = number(a);

        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var m1 = l * 2 - m2;

        return this.rgba(hue(h + 1/3) * 255,
                         hue(h)       * 255,
                         hue(h - 1/3) * 255,
                         a);

        function hue(h) {
            h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
            if      (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
            else if (h * 2 < 1) return m2;
            else if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
            else                return m1;
        }
    },
    hue: function (color) {
        return new(tree.Dimension)(Math.round(color.toHSL().h));
    },
    saturation: function (color) {
        return new(tree.Dimension)(Math.round(color.toHSL().s * 100), '%');
    },
    lightness: function (color) {
        return new(tree.Dimension)(Math.round(color.toHSL().l * 100), '%');
    },
    alpha: function (color) {
        return new(tree.Dimension)(color.toHSL().a);
    },
    saturate: function (color, amount) {
        var hsl = color.toHSL();

        hsl.s += amount.value / 100;
        hsl.s = clamp(hsl.s);
        return hsla(hsl);
    },
    desaturate: function (color, amount) {
        var hsl = color.toHSL();

        hsl.s -= amount.value / 100;
        hsl.s = clamp(hsl.s);
        return hsla(hsl);
    },
    lighten: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l += amount.value / 100;
        hsl.l = clamp(hsl.l);
        return hsla(hsl);
    },
    darken: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l -= amount.value / 100;
        hsl.l = clamp(hsl.l);
        return hsla(hsl);
    },
    fadein: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a += amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    fadeout: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a -= amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    spin: function (color, amount) {
        var hsl = color.toHSL();
        var hue = (hsl.h + amount.value) % 360;

        hsl.h = hue < 0 ? 360 + hue : hue;

        return hsla(hsl);
    },
    //
    // Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris Eppstein
    // http://sass-lang.com
    //
    mix: function (color1, color2, weight) {
        var p = weight.value / 100.0;
        var w = p * 2 - 1;
        var a = color1.toHSL().a - color2.toHSL().a;

        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;

        var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
                   color1.rgb[1] * w1 + color2.rgb[1] * w2,
                   color1.rgb[2] * w1 + color2.rgb[2] * w2];

        var alpha = color1.alpha * p + color2.alpha * (1 - p);

        return new(tree.Color)(rgb, alpha);
    },
    greyscale: function (color) {
        return this.desaturate(color, new(tree.Dimension)(100));
    },
    e: function (str) {
        return new(tree.Anonymous)(str instanceof tree.JavaScript ? str.evaluated : str);
    },
    escape: function (str) {
        return new(tree.Anonymous)(encodeURI(str.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B").replace(/\(/g, "%28").replace(/\)/g, "%29"));
    },
    '%': function (quoted /* arg, arg, ...*/) {
        var args = Array.prototype.slice.call(arguments, 1),
            str = quoted.value;

        for (var i = 0; i < args.length; i++) {
            str = str.replace(/%[sda]/i, function(token) {
                var value = token.match(/s/i) ? args[i].value : args[i].toCSS();
                return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
            });
        }
        str = str.replace(/%%/g, '%');
        return new(tree.Quoted)('"' + str + '"', str);
    },
    round: function (n) {
        if (n instanceof tree.Dimension) {
            return new(tree.Dimension)(Math.round(number(n)), n.unit);
        } else if (typeof(n) === 'number') {
            return Math.round(n);
        } else {
      throw {
                error: "RuntimeError",
                message: "math functions take numbers as parameters"
            };
        }
    }
};

function hsla(hsla) {
    return tree.functions.hsla(hsla.h, hsla.s, hsla.l, hsla.a);
}

function number(n) {
    if (n instanceof tree.Dimension) {
        return parseFloat(n.unit == '%' ? n.value / 100 : n.value);
    } else if (typeof(n) === 'number') {
        return n;
    } else {
        throw {
            error: "RuntimeError",
            message: "color functions take numbers as parameters"
        };
    }
}

function clamp(val) {
    return Math.min(1, Math.max(0, val));
}

})(require('less/tree'));
(function (tree) {

tree.Alpha = function (val) {
    this.value = val;
};
tree.Alpha.prototype = {
    toCSS: function () {
        return "alpha(opacity=" +
               (this.value.toCSS ? this.value.toCSS() : this.value) + ")";
    },
    eval: function (env) {
        if (this.value.eval) { this.value = this.value.eval(env) }
        return this;
    }
};

})(require('less/tree'));
(function (tree) {

tree.Anonymous = function (string) {
    this.value = string.value || string;
};
tree.Anonymous.prototype = {
    toCSS: function () {
        return this.value;
    },
    eval: function () { return this }
};

})(require('less/tree'));
(function (tree) {

//
// A function call node.
//
tree.Call = function (name, args, index) {
    this.name = name;
    this.args = args;
    this.index = index;
};
tree.Call.prototype = {
    //
    // When evaluating a function call,
    // we either find the function in `tree.functions` [1],
    // in which case we call it, passing the  evaluated arguments,
    // or we simply print it out as it appeared originally [2].
    //
    // The *functions.js* file contains the built-in functions.
    //
    // The reason why we evaluate the arguments, is in the case where
    // we try to pass a variable to a function, like: `saturate(@color)`.
    // The function should receive the value, not the variable.
    //
    eval: function (env) {
        var args = this.args.map(function (a) { return a.eval(env) });

        if (this.name in tree.functions) { // 1.
            try {
                return tree.functions[this.name].apply(tree.functions, args);
            } catch (e) {
                throw { message: "error evaluating function `" + this.name + "`",
                        index: this.index };
            }
        } else { // 2.
            return new(tree.Anonymous)(this.name +
                   "(" + args.map(function (a) { return a.toCSS() }).join(', ') + ")");
        }
    },

    toCSS: function (env) {
        return this.eval(env).toCSS();
    }
};

})(require('less/tree'));
(function (tree) {
//
// RGB Colors - #ff0014, #eee
//
tree.Color = function (rgb, a) {
    //
    // The end goal here, is to parse the arguments
    // into an integer triplet, such as `128, 255, 0`
    //
    // This facilitates operations and conversions.
    //
    if (Array.isArray(rgb)) {
        this.rgb = rgb;
    } else if (rgb.length == 6) {
        this.rgb = rgb.match(/.{2}/g).map(function (c) {
            return parseInt(c, 16);
        });
    } else if (rgb.length == 8) {
        this.alpha = parseInt(rgb.substring(0,2), 16) / 255.0;
        this.rgb = rgb.substr(2).match(/.{2}/g).map(function (c) {
            return parseInt(c, 16);
        });
    } else {
        this.rgb = rgb.split('').map(function (c) {
            return parseInt(c + c, 16);
        });
    }
    this.alpha = typeof(a) === 'number' ? a : 1;
};
tree.Color.prototype = {
    eval: function () { return this },

    //
    // If we have some transparency, the only way to represent it
    // is via `rgba`. Otherwise, we use the hex representation,
    // which has better compatibility with older browsers.
    // Values are capped between `0` and `255`, rounded and zero-padded.
    //
    toCSS: function () {
        if (this.alpha < 1.0) {
            return "rgba(" + this.rgb.map(function (c) {
                return Math.round(c);
            }).concat(this.alpha).join(', ') + ")";
        } else {
            return '#' + this.rgb.map(function (i) {
                i = Math.round(i);
                i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
                return i.length === 1 ? '0' + i : i;
            }).join('');
        }
    },

    //
    // Operations have to be done per-channel, if not,
    // channels will spill onto each other. Once we have
    // our result, in the form of an integer triplet,
    // we create a new Color node to hold the result.
    //
    operate: function (op, other) {
        var result = [];

        if (! (other instanceof tree.Color)) {
            other = other.toColor();
        }

        for (var c = 0; c < 3; c++) {
            result[c] = tree.operate(op, this.rgb[c], other.rgb[c]);
        }
        return new(tree.Color)(result, this.alpha + other.alpha);
    },

    toHSL: function () {
        var r = this.rgb[0] / 255,
            g = this.rgb[1] / 255,
            b = this.rgb[2] / 255,
            a = this.alpha;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2, d = max - min;

        if (max === min) {
            h = s = 0;
        } else {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2;               break;
                case b: h = (r - g) / d + 4;               break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s, l: l, a: a };
    }
};


})(require('less/tree'));
(function (tree) {

tree.Comment = function (value, silent) {
    this.value = value;
    this.silent = !!silent;
};
tree.Comment.prototype = {
    toCSS: function (env) {
        return env.compress ? '' : this.value;
    },
    eval: function () { return this }
};

})(require('less/tree'));
(function (tree) {

//
// A number with a unit
//
tree.Dimension = function (value, unit) {
    this.value = parseFloat(value);
    this.unit = unit || null;
};

tree.Dimension.prototype = {
    eval: function () { return this },
    toColor: function () {
        return new(tree.Color)([this.value, this.value, this.value]);
    },
    toCSS: function () {
        var css = this.value + this.unit;
        return css;
    },

    // In an operation between two Dimensions,
    // we default to the first Dimension's unit,
    // so `1px + 2em` will yield `3px`.
    // In the future, we could implement some unit
    // conversions such that `100cm + 10mm` would yield
    // `101cm`.
    operate: function (op, other) {
        return new(tree.Dimension)
                  (tree.operate(op, this.value, other.value),
                  this.unit || other.unit);
    }
};

})(require('less/tree'));
(function (tree) {

tree.Directive = function (name, value) {
    this.name = name;
    if (Array.isArray(value)) {
        this.ruleset = new(tree.Ruleset)([], value);
    } else {
        this.value = value;
    }
};
tree.Directive.prototype = {
    toCSS: function (ctx, env) {
        if (this.ruleset) {
            this.ruleset.root = true;
            return this.name + (env.compress ? '{' : ' {\n  ') +
                   this.ruleset.toCSS(ctx, env).trim().replace(/\n/g, '\n  ') +
                               (env.compress ? '}': '\n}\n');
        } else {
            return this.name + ' ' + this.value.toCSS() + ';\n';
        }
    },
    eval: function (env) {
        env.frames.unshift(this);
        this.ruleset = this.ruleset && this.ruleset.eval(env);
        env.frames.shift();
        return this;
    },
    variable: function (name) { return tree.Ruleset.prototype.variable.call(this.ruleset, name) },
    find: function () { return tree.Ruleset.prototype.find.apply(this.ruleset, arguments) },
    rulesets: function () { return tree.Ruleset.prototype.rulesets.apply(this.ruleset) }
};

})(require('less/tree'));
(function (tree) {

tree.Element = function (combinator, value) {
    this.combinator = combinator instanceof tree.Combinator ?
                      combinator : new(tree.Combinator)(combinator);
    this.value = value ? value.trim() : "";
};
tree.Element.prototype.toCSS = function (env) {
    return this.combinator.toCSS(env || {}) + this.value;
};

tree.Combinator = function (value) {
    if (value === ' ') {
        this.value = ' ';
    } else if (value === '& ') {
        this.value = '& ';
    } else {
        this.value = value ? value.trim() : "";
    }
};
tree.Combinator.prototype.toCSS = function (env) {
    return {
        ''  : '',
        ' ' : ' ',
        '&' : '',
        '& ' : ' ',
        ':' : ' :',
        '::': '::',
        '+' : env.compress ? '+' : ' + ',
        '~' : env.compress ? '~' : ' ~ ',
        '>' : env.compress ? '>' : ' > '
    }[this.value];
};

})(require('less/tree'));
(function (tree) {

tree.Expression = function (value) { this.value = value };
tree.Expression.prototype = {
    eval: function (env) {
        if (this.value.length > 1) {
            return new(tree.Expression)(this.value.map(function (e) {
                return e.eval(env);
            }));
        } else if (this.value.length === 1) {
            return this.value[0].eval(env);
        } else {
            return this;
        }
    },
    toCSS: function (env) {
        return this.value.map(function (e) {
            return e.toCSS(env);
        }).join(' ');
    }
};

})(require('less/tree'));
(function (tree) {
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
tree.Import = function (path, imports) {
    var that = this;

    this._path = path;

    // The '.less' extension is optional
    if (path instanceof tree.Quoted) {
        this.path = /\.(le?|c)ss$/.test(path.value) ? path.value : path.value + '.less';
    } else {
        this.path = path.value.value || path.value;
    }

    this.css = /css$/.test(this.path);

    // Only pre-compile .less files
    if (! this.css) {
        imports.push(this.path, function (root) {
            if (! root) {
                throw new(Error)("Error parsing " + that.path);
            }
            that.root = root;
        });
    }
};

//
// The actual import node doesn't return anything, when converted to CSS.
// The reason is that it's used at the evaluation stage, so that the rules
// it imports can be treated like any other rules.
//
// In `eval`, we make sure all Import nodes get evaluated, recursively, so
// we end up with a flat structure, which can easily be imported in the parent
// ruleset.
//
tree.Import.prototype = {
    toCSS: function () {
        if (this.css) {
            return "@import " + this._path.toCSS() + ';\n';
        } else {
            return "";
        }
    },
    eval: function (env) {
        var ruleset;

        if (this.css) {
            return this;
        } else {
            ruleset = new(tree.Ruleset)(null, this.root.rules.slice(0));

            for (var i = 0; i < ruleset.rules.length; i++) {
                if (ruleset.rules[i] instanceof tree.Import) {
                    Array.prototype
                         .splice
                         .apply(ruleset.rules,
                                [i, 1].concat(ruleset.rules[i].eval(env)));
                }
            }
            return ruleset.rules;
        }
    }
};

})(require('less/tree'));
(function (tree) {

tree.JavaScript = function (string, index, escaped) {
    this.escaped = escaped;
    this.expression = string;
    this.index = index;
};
tree.JavaScript.prototype = {
    eval: function (env) {
        var result,
            that = this,
            context = {};

        var expression = this.expression.replace(/@\{([\w-]+)\}/g, function (_, name) {
            return tree.jsify(new(tree.Variable)('@' + name, that.index).eval(env));
        });

        try {
            expression = new(Function)('return (' + expression + ')');
        } catch (e) {
            throw { message: "JavaScript evaluation error: `" + expression + "`" ,
                    index: this.index };
        }

        for (var k in env.frames[0].variables()) {
            context[k.slice(1)] = {
                value: env.frames[0].variables()[k].value,
                toJS: function () {
                    return this.value.eval(env).toCSS();
                }
            };
        }

        try {
            result = expression.call(context);
        } catch (e) {
            throw { message: "JavaScript evaluation error: '" + e.name + ': ' + e.message + "'" ,
                    index: this.index };
        }
        if (typeof(result) === 'string') {
            return new(tree.Quoted)('"' + result + '"', result, this.escaped, this.index);
        } else if (Array.isArray(result)) {
            return new(tree.Anonymous)(result.join(', '));
        } else {
            return new(tree.Anonymous)(result);
        }
    }
};

})(require('less/tree'));

(function (tree) {

tree.Keyword = function (value) { this.value = value };
tree.Keyword.prototype = {
    eval: function () { return this },
    toCSS: function () { return this.value }
};

})(require('less/tree'));
(function (tree) {

tree.mixin = {};
tree.mixin.Call = function (elements, args, index) {
    this.selector = new(tree.Selector)(elements);
    this.arguments = args;
    this.index = index;
};
tree.mixin.Call.prototype = {
    eval: function (env) {
        var mixins, args, rules = [], match = false;

        for (var i = 0; i < env.frames.length; i++) {
            if ((mixins = env.frames[i].find(this.selector)).length > 0) {
                args = this.arguments && this.arguments.map(function (a) { return a.eval(env) });
                for (var m = 0; m < mixins.length; m++) {
                    if (mixins[m].match(args, env)) {
                        try {
                            Array.prototype.push.apply(
                                  rules, mixins[m].eval(env, this.arguments).rules);
                            match = true;
                        } catch (e) {
                            throw { message: e.message, index: e.index, stack: e.stack, call: this.index };
                        }
                    }
                }
                if (match) {
                    return rules;
                } else {
                    throw { message: 'No matching definition was found for `' +
                                      this.selector.toCSS().trim() + '('      +
                                      this.arguments.map(function (a) {
                                          return a.toCSS();
                                      }).join(', ') + ")`",
                            index:   this.index };
                }
            }
        }
        throw { message: this.selector.toCSS().trim() + " is undefined",
                index: this.index };
    }
};

tree.mixin.Definition = function (name, params, rules) {
    this.name = name;
    this.selectors = [new(tree.Selector)([new(tree.Element)(null, name)])];
    this.params = params;
    this.arity = params.length;
    this.rules = rules;
    this._lookups = {};
    this.required = params.reduce(function (count, p) {
        if (!p.name || (p.name && !p.value)) { return count + 1 }
        else                                 { return count }
    }, 0);
    this.parent = tree.Ruleset.prototype;
    this.frames = [];
};
tree.mixin.Definition.prototype = {
    toCSS:     function ()     { return "" },
    variable:  function (name) { return this.parent.variable.call(this, name) },
    variables: function ()     { return this.parent.variables.call(this) },
    find:      function ()     { return this.parent.find.apply(this, arguments) },
    rulesets:  function ()     { return this.parent.rulesets.apply(this) },

    eval: function (env, args) {
        var frame = new(tree.Ruleset)(null, []), context, _arguments = [];

        for (var i = 0, val; i < this.params.length; i++) {
            if (this.params[i].name) {
                if (val = (args && args[i]) || this.params[i].value) {
                    frame.rules.unshift(new(tree.Rule)(this.params[i].name, val.eval(env)));
                } else {
                    throw { message: "wrong number of arguments for " + this.name +
                            ' (' + args.length + ' for ' + this.arity + ')' };
                }
            }
        }
        for (var i = 0; i < Math.max(this.params.length, args && args.length); i++) {
            _arguments.push(args[i] || this.params[i].value);
        }
        frame.rules.unshift(new(tree.Rule)('@arguments', new(tree.Expression)(_arguments).eval(env)));

        return new(tree.Ruleset)(null, this.rules.slice(0)).eval({
            frames: [this, frame].concat(this.frames, env.frames)
        });
    },
    match: function (args, env) {
        var argsLength = (args && args.length) || 0, len;

        if (argsLength < this.required)                               { return false }
        if ((this.required > 0) && (argsLength > this.params.length)) { return false }

        len = Math.min(argsLength, this.arity);

        for (var i = 0; i < len; i++) {
            if (!this.params[i].name) {
                if (args[i].eval(env).toCSS() != this.params[i].value.eval(env).toCSS()) {
                    return false;
                }
            }
        }
        return true;
    }
};

})(require('less/tree'));
(function (tree) {

tree.Operation = function (op, operands) {
    this.op = op.trim();
    this.operands = operands;
};
tree.Operation.prototype.eval = function (env) {
    var a = this.operands[0].eval(env),
        b = this.operands[1].eval(env),
        temp;

    if (a instanceof tree.Dimension && b instanceof tree.Color) {
        if (this.op === '*' || this.op === '+') {
            temp = b, b = a, a = temp;
        } else {
            throw { name: "OperationError",
                    message: "Can't substract or divide a color from a number" };
        }
    }
    return a.operate(this.op, b);
};

tree.operate = function (op, a, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
};

})(require('less/tree'));
(function (tree) {

tree.Quoted = function (str, content, escaped, i) {
    this.escaped = escaped;
    this.value = content || '';
    this.quote = str.charAt(0);
    this.index = i;
};
tree.Quoted.prototype = {
    toCSS: function () {
        if (this.escaped) {
            return this.value;
        } else {
            return this.quote + this.value + this.quote;
        }
    },
    eval: function (env) {
        var that = this;
        var value = this.value.replace(/`([^`]+)`/g, function (_, exp) {
            return new(tree.JavaScript)(exp, that.index, true).eval(env).value;
        }).replace(/@\{([\w-]+)\}/g, function (_, name) {
            var v = new(tree.Variable)('@' + name, that.index).eval(env);
            return v.value || v.toCSS();
        });
        return new(tree.Quoted)(this.quote + value + this.quote, value, this.escaped, this.index);
    }
};

})(require('less/tree'));
(function (tree) {

tree.Rule = function (name, value, important, index) {
    this.name = name;
    this.value = (value instanceof tree.Value) ? value : new(tree.Value)([value]);
    this.important = important ? ' ' + important.trim() : '';
    this.index = index;

    if (name.charAt(0) === '@') {
        this.variable = true;
    } else { this.variable = false }
};
tree.Rule.prototype.toCSS = function (env) {
    if (this.variable) { return "" }
    else {
        return this.name + (env.compress ? ':' : ': ') +
               this.value.toCSS(env) +
               this.important + ";";
    }
};

tree.Rule.prototype.eval = function (context) {
    return new(tree.Rule)(this.name, this.value.eval(context), this.important, this.index);
};

tree.Shorthand = function (a, b) {
    this.a = a;
    this.b = b;
};

tree.Shorthand.prototype = {
    toCSS: function (env) {
        return this.a.toCSS(env) + "/" + this.b.toCSS(env);
    },
    eval: function () { return this }
};

})(require('less/tree'));
(function (tree) {

tree.Ruleset = function (selectors, rules) {
    this.selectors = selectors;
    this.rules = rules;
    this._lookups = {};
};
tree.Ruleset.prototype = {
    eval: function (env) {
        var ruleset = new(tree.Ruleset)(this.selectors, this.rules.slice(0));

        ruleset.root = this.root;

        // push the current ruleset to the frames stack
        env.frames.unshift(ruleset);

        // Evaluate imports
        if (ruleset.root) {
            for (var i = 0; i < ruleset.rules.length; i++) {
                if (ruleset.rules[i] instanceof tree.Import) {
                    Array.prototype.splice
                         .apply(ruleset.rules, [i, 1].concat(ruleset.rules[i].eval(env)));
                }
            }
        }

        // Store the frames around mixin definitions,
        // so they can be evaluated like closures when the time comes.
        for (var i = 0; i < ruleset.rules.length; i++) {
            if (ruleset.rules[i] instanceof tree.mixin.Definition) {
                ruleset.rules[i].frames = env.frames.slice(0);
            }
        }

        // Evaluate mixin calls.
        for (var i = 0; i < ruleset.rules.length; i++) {
            if (ruleset.rules[i] instanceof tree.mixin.Call) {
                Array.prototype.splice
                     .apply(ruleset.rules, [i, 1].concat(ruleset.rules[i].eval(env)));
            }
        }

        // Evaluate everything else
        for (var i = 0, rule; i < ruleset.rules.length; i++) {
            rule = ruleset.rules[i];

            if (! (rule instanceof tree.mixin.Definition)) {
                ruleset.rules[i] = rule.eval ? rule.eval(env) : rule;
            }
        }

        // Pop the stack
        env.frames.shift();

        return ruleset;
    },
    match: function (args) {
        return !args || args.length === 0;
    },
    variables: function () {
        if (this._variables) { return this._variables }
        else {
            return this._variables = this.rules.reduce(function (hash, r) {
                if (r instanceof tree.Rule && r.variable === true) {
                    hash[r.name] = r;
                }
                return hash;
            }, {});
        }
    },
    variable: function (name) {
        return this.variables()[name];
    },
    rulesets: function () {
        if (this._rulesets) { return this._rulesets }
        else {
            return this._rulesets = this.rules.filter(function (r) {
                return (r instanceof tree.Ruleset) || (r instanceof tree.mixin.Definition);
            });
        }
    },
    find: function (selector, self) {
        self = self || this;
        var rules = [], rule, match,
            key = selector.toCSS();

        if (key in this._lookups) { return this._lookups[key] }

        this.rulesets().forEach(function (rule) {
            if (rule !== self) {
                for (var j = 0; j < rule.selectors.length; j++) {
                    if (match = selector.match(rule.selectors[j])) {
                        if (selector.elements.length > 1) {
                            Array.prototype.push.apply(rules, rule.find(
                                new(tree.Selector)(selector.elements.slice(1)), self));
                        } else {
                            rules.push(rule);
                        }
                        break;
                    }
                }
            }
        });
        return this._lookups[key] = rules;
    },
    //
    // Entry point for code generation
    //
    //     `context` holds an array of arrays.
    //
    //
    // Entry point for code generation
    //
    //     `context` holds an array of arrays.
    //
    toCSS: function (context, env) {
        var css = [],      // The CSS output
            rules = [],    // node.Rule instances
            rulesets = [], // node.Ruleset instances
            paths = [],    // Current selectors
            selector,      // The fully rendered selector
            rule;

        if (! this.root) {
            if (context.length === 0) {
                paths = this.selectors.map(function (s) { return [s] });
            } else {
                this.joinSelectors( paths, context, this.selectors );
            }
        }

        // Compile rules and rulesets
        for (var i = 0; i < this.rules.length; i++) {
            rule = this.rules[i];

            if (rule.rules || (rule instanceof tree.Directive)) {
                rulesets.push(rule.toCSS(paths, env));
            } else if (rule instanceof tree.Comment) {
                if (!rule.silent) {
                    if (this.root) {
                        rulesets.push(rule.toCSS(env));
                    } else {
                        rules.push(rule.toCSS(env));
                    }
                }
            } else {
                if (rule.toCSS && !rule.variable) {
                    rules.push(rule.toCSS(env));
                } else if (rule.value && !rule.variable) {
                    rules.push(rule.value.toString());
                }
            }
        }

        rulesets = rulesets.join('');

        // If this is the root node, we don't render
        // a selector, or {}.
        // Otherwise, only output if this ruleset has rules.
        if (this.root) {
            css.push(rules.join(env.compress ? '' : '\n'));
        } else {
            if (rules.length > 0) {
                selector = paths.map(function (p) {
                    return p.map(function (s) {
                        return s.toCSS(env);
                    }).join('').trim();
                }).join(env.compress ? ',' : (paths.length > 3 ? ',\n' : ', '));
                css.push(selector,
                        (env.compress ? '{' : ' {\n  ') +
                        rules.join(env.compress ? '' : '\n  ') +
                        (env.compress ? '}' : '\n}\n'));
            }
        }
        css.push(rulesets);

        return css.join('') + (env.compress ? '\n' : '');
    },

    joinSelectors: function( paths, context, selectors ) {
        for (var s = 0; s < selectors.length; s++) {
            this.joinSelector(paths, context, selectors[s]);
        }
    },

    joinSelector: function( paths, context, selector ) {
        var before = [], after = [], beforeElements = [], afterElements = [], hasParentSelector = false, el;

        for (var i = 0; i < selector.elements.length; i++) {
            el = selector.elements[i];
            if (el.combinator.value[0] === '&') {
                hasParentSelector = true;
            }
            if(!hasParentSelector) {
                beforeElements.push(el);
            } else {
                afterElements.push(el);
            }
        }

        if(!hasParentSelector) {
            afterElements = beforeElements;
            beforeElements = [];
        }

        if(beforeElements.length > 0) {
            before.push(new (tree.Selector)(beforeElements));
        }
        if(afterElements.length > 0) {
            after.push(new (tree.Selector)(afterElements));
        }

        for (var c = 0; c < context.length; c++) {
            paths.push(before.concat(context[c]).concat(after));
        }
    }
};
})(require('less/tree'));
(function (tree) {

tree.Selector = function (elements) {
    this.elements = elements;
    if (this.elements[0].combinator.value === "") {
        this.elements[0].combinator.value = ' ';
    }
};
tree.Selector.prototype.match = function (other) {
    if (this.elements[0].value === other.elements[0].value) {
        return true;
    } else {
        return false;
    }
};
tree.Selector.prototype.toCSS = function (env) {
    if (this._css) { return this._css }

    return this._css = this.elements.map(function (e) {
        if (typeof(e) === 'string') {
            return ' ' + e.trim();
        } else {
            return e.toCSS(env);
        }
    }).join('');
};

})(require('less/tree'));
(function (tree) {

tree.URL = function (val, paths) {
    if (val.data) {
        this.attrs = val;
    } else {
        // Add the base path if the URL is relative and we are in the browser
        if (!/^(?:https?:\/|file:\/|data:\/)?\//.test(val.value) && paths.length > 0 && typeof(window) !== 'undefined') {
            val.value = paths[0] + (val.value.charAt(0) === '/' ? val.value.slice(1) : val.value);
        }
        this.value = val;
        this.paths = paths;
    }
};
tree.URL.prototype = {
    toCSS: function () {
        return "url(" + (this.attrs ? 'data:' + this.attrs.mime + this.attrs.charset + this.attrs.base64 + this.attrs.data
                                    : this.value.toCSS()) + ")";
    },
    eval: function (ctx) {
        return this.attrs ? this : new(tree.URL)(this.value.eval(ctx), this.paths);
    }
};

})(require('less/tree'));
(function (tree) {

tree.Value = function (value) {
    this.value = value;
    this.is = 'value';
};
tree.Value.prototype = {
    eval: function (env) {
        if (this.value.length === 1) {
            return this.value[0].eval(env);
        } else {
            return new(tree.Value)(this.value.map(function (v) {
                return v.eval(env);
            }));
        }
    },
    toCSS: function (env) {
        return this.value.map(function (e) {
            return e.toCSS(env);
        }).join(env.compress ? ',' : ', ');
    }
};

})(require('less/tree'));
(function (tree) {

tree.Variable = function (name, index) { this.name = name, this.index = index };
tree.Variable.prototype = {
    eval: function (env) {
        var variable, v, name = this.name;

        if (name.indexOf('@@') == 0) {
            name = '@' + new(tree.Variable)(name.slice(1)).eval(env).value;
        }

        if (variable = tree.find(env.frames, function (frame) {
            if (v = frame.variable(name)) {
                return v.value.eval(env);
            }
        })) { return variable }
        else {
            throw { message: "variable " + name + " is undefined",
                    index: this.index };
        }
    }
};

})(require('less/tree'));
require('less/tree').find = function (obj, fun) {
    for (var i = 0, r; i < obj.length; i++) {
        if (r = fun.call(obj, obj[i])) { return r }
    }
    return null;
};
require('less/tree').jsify = function (obj) {
    if (Array.isArray(obj.value) && (obj.value.length > 1)) {
        return '[' + obj.value.map(function (v) { return v.toCSS(false) }).join(', ') + ']';
    } else {
        return obj.toCSS(false);
    }
};
var name;

function loadStyleSheet(sheet, callback, reload, remaining) {
    var sheetName = name.slice(0, name.lastIndexOf('/') + 1) + sheet.href;
    var input = readFile(sheetName);
    var parser = new less.Parser();
    parser.parse(input, function (e, root) {
        if (e) {
            print("Error: " + e);
            quit(1);
        }
        callback(root, sheet, { local: false, lastModified: 0, remaining: remaining });
    });

    // callback({}, sheet, { local: true, remaining: remaining });
}

function writeFile(filename, content) {
    var fstream = new java.io.FileWriter(filename);
    var out = new java.io.BufferedWriter(fstream);
    out.write(content);
    out.close();
}

// Command line integration via Rhino
(function (args) {
    name = args[0];
    var output = args[1];

    if (!name) {
        print('No files present in the fileset; Check your pattern match in build.xml');
        quit(1);
    }
    path = name.split("/");path.pop();path=path.join("/")

    var input = readFile(name);

    if (!input) {
        print('lesscss: couldn\'t open file ' + name);
        quit(1);
    }

    var result;
    var parser = new less.Parser();
    parser.parse(input, function (e, root) {
        if (e) {
            quit(1);
        } else {
            result = root.toCSS();
            if (output) {
                writeFile(output, result);
                print("Written to " + output);
            } else {
                print(result);
            }
            quit(0);
        }
    });
    print("done");
}(arguments));
