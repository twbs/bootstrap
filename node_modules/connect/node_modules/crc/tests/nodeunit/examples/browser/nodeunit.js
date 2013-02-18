/*!
 * Nodeunit
 * https://github.com/caolan/nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * json2.js
 * http://www.JSON.org/json2.js
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
nodeunit = (function(){
/*
    http://www.JSON.org/json2.js
    2010-11-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
var assert = {};
var types = {};
var core = {};
var nodeunit = {};
var reporter = {};
(function(){

    var async = {};

    // global on the server, window in the browser
    var root = this;
    var previous_async = root.async;

    if(typeof module !== 'undefined' && module.exports) module.exports = async;
    else root.async = async;

    async.noConflict = function(){
        root.async = previous_async;
        return async;
    };

    //// cross-browser compatiblity functions ////

    var _forEach = function(arr, iterator){
        if(arr.forEach) return arr.forEach(iterator);
        for(var i=0; i<arr.length; i++){
            iterator(arr[i], i, arr);
        }
    };

    var _map = function(arr, iterator){
        if(arr.map) return arr.map(iterator);
        var results = [];
        _forEach(arr, function(x, i, a){
            results.push(iterator(x, i, a));
        })
        return results;
    };

    var _reduce = function(arr, iterator, memo){
        if(arr.reduce) return arr.reduce(iterator, memo);
        _forEach(arr, function(x, i, a){
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function(obj){
        if(Object.keys) return Object.keys(obj);
        var keys = [];
        for(var k in obj){
            if(obj.hasOwnProperty(k)) keys.push(k);
        }
        return keys;
    };

    var _indexOf = function(arr, item){
        if(arr.indexOf) return arr.indexOf(item);
        for(var i=0; i<arr.length; i++){
            if(arr[i] === item) return i;
        }
        return -1;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    async.nextTick = function(fn){
        if(typeof process == 'undefined' || !(process.nextTick)){
            setTimeout(fn, 0);
        }
        else process.nextTick(fn);
    };

    async.forEach = function(arr, iterator, callback){
        if(!arr.length) return callback();
        var completed = 0;
        _forEach(arr, function(x){
            iterator(x, function(err){
                if(err){
                    callback(err);
                    callback = function(){};
                }
                else {
                    completed++;
                    if(completed == arr.length) callback();
                }
            });
        });
    };

    async.forEachSeries = function(arr, iterator, callback){
        if(!arr.length) return callback();
        var completed = 0;
        var iterate = function(){
            iterator(arr[completed], function(err){
                if(err){
                    callback(err);
                    callback = function(){};
                }
                else {
                    completed++;
                    if(completed == arr.length) callback();
                    else iterate();
                }
            });
        };
        iterate();
    };


    var doParallel = function(fn){
        return function(){
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEach].concat(args));
        };
    };
    var doSeries = function(fn){
        return function(){
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEachSeries].concat(args));
        };
    };


    var _asyncMap = function(eachfn, arr, iterator, callback){
        var results = [];
        arr = _map(arr, function(x, i){
            return {index: i, value: x};
        });
        eachfn(arr, function(x, callback){
            iterator(x.value, function(err, v){
                results[x.index] = v;
                callback(err);
            });
        }, function(err){
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);


    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function(arr, memo, iterator, callback){
        async.forEachSeries(arr, function(x, callback){
            iterator(memo, x, function(err, v){
                memo = v;
                callback(err);
            });
        }, function(err){
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function(arr, memo, iterator, callback){
        var reversed = _map(arr, function(x){return x;}).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function(eachfn, arr, iterator, callback){
        var results = [];
        arr = _map(arr, function(x, i){
            return {index: i, value: x};
        });
        eachfn(arr, function(x, callback){
            iterator(x.value, function(v){
                if(v) results.push(x);
                callback();
            });
        }, function(err){
            callback(_map(results.sort(function(a,b){
                return a.index - b.index;
            }), function(x){
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function(eachfn, arr, iterator, callback){
        var results = [];
        arr = _map(arr, function(x, i){
            return {index: i, value: x};
        });
        eachfn(arr, function(x, callback){
            iterator(x.value, function(v){
                if(!v) results.push(x);
                callback();
            });
        }, function(err){
            callback(_map(results.sort(function(a,b){
                return a.index - b.index;
            }), function(x){
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function(eachfn, arr, iterator, main_callback){
        eachfn(arr, function(x, callback){
            iterator(x, function(result){
                if(result) main_callback(x);
                else callback();
            });
        }, function(err){
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function(arr, iterator, main_callback){
        async.forEach(arr, function(x, callback){
            iterator(x, function(v){
                if(v){
                    main_callback(true);
                    main_callback = function(){};
                }
                callback();
            });
        }, function(err){
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function(arr, iterator, main_callback){
        async.forEach(arr, function(x, callback){
            iterator(x, function(v){
                if(!v){
                    main_callback(false);
                    main_callback = function(){};
                }
                callback();
            });
        }, function(err){
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function(arr, iterator, callback){
        async.map(arr, function(x, callback){
            iterator(x, function(err, criteria){
                if(err) callback(err);
                else callback(null, {value: x, criteria: criteria});
            });
        }, function(err, results){
            if(err) return callback(err);
            else callback(null, _map(results.sort(function(left, right){
                var a = left.criteria, b = right.criteria;
                return a < b ? -1 : a > b ? 1 : 0;
            }), function(x){return x.value;}));
        })
    };

    async.auto = function(tasks, callback){
        callback = callback || function(){};
        var keys = _keys(tasks);
        if(!keys.length) return callback(null);

        var completed = [];

        var listeners = [];
        var addListener = function(fn){
            listeners.unshift(fn);
        };
        var removeListener = function(fn){
            for(var i=0; i<listeners.length; i++){
                if(listeners[i] === fn){
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function(){
            _forEach(listeners, function(fn){fn();});
        };

        addListener(function(){
            if(completed.length == keys.length){
                callback(null);
            }
        });

        _forEach(keys, function(k){
            var task = (tasks[k] instanceof Function)? [tasks[k]]: tasks[k];
            var taskCallback = function(err){
                if(err){
                    callback(err);
                    // stop subsequent errors hitting callback multiple times
                    callback = function(){};
                }
                else {
                    completed.push(k);
                    taskComplete();
                }
            };
            var requires = task.slice(0, Math.abs(task.length-1)) || [];
            var ready = function(){
                return _reduce(requires, function(a,x){
                    return (a && _indexOf(completed, x) != -1);
                }, true);
            };
            if(ready()) task[task.length-1](taskCallback);
            else {
                var listener = function(){
                    if(ready()){
                        removeListener(listener);
                        task[task.length-1](taskCallback);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function(tasks, callback){
        if(!tasks.length) return callback();
        callback = callback || function(){};
        var wrapIterator = function(iterator){
            return function(err){
                if(err){
                    callback(err);
                    callback = function(){};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if(next) args.push(wrapIterator(next));
                    else     args.push(callback);
                    async.nextTick(function(){iterator.apply(null, args);});
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    async.parallel = function(tasks, callback){
        callback = callback || function(){};
        async.map(tasks, function(fn, callback){
            if(fn){
                fn(function(err){
                    var args = Array.prototype.slice.call(arguments,1);
                    if(args.length <= 1) args = args[0];
                    callback.call(null, err, args || null);
                });
            }
        }, callback);
    };

    async.series = function(tasks, callback){
        callback = callback || function(){};
        async.mapSeries(tasks, function(fn, callback){
            if(fn){
                fn(function(err){
                    var args = Array.prototype.slice.call(arguments,1);
                    if(args.length <= 1) args = args[0];
                    callback.call(null, err, args || null);
                });
            }
        }, callback);
    };

    async.iterator = function(tasks){
        var makeCallback = function(index){
            var fn = function(){
                if(tasks.length) tasks[index].apply(null, arguments);
                return fn.next();
            };
            fn.next = function(){
                return (index < tasks.length-1)? makeCallback(index+1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function(fn){
        var args = Array.prototype.slice.call(arguments, 1);
        return function(){
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function(eachfn, arr, fn, callback){
        var r = [];
        eachfn(arr, function(x, cb){
            fn(x, function(err, y){
                r = r.concat(y || []);
                cb(err);
            });
        }, function(err){
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    var _console_fn = function(name){
        return function(fn){
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function(err){
                var args = Array.prototype.slice.call(arguments, 1);
                if(typeof console != 'undefined'){
                    if(err){
                        if(console.error) console.error(err);
                    }
                    else if(console[name]){
                        _forEach(args, function(x){console[name](x);});
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

})();
(function(exports){
/**
 * This file is based on the node.js assert module, but with some small
 * changes for browser-compatibility
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 */


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



// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var pSlice = Array.prototype.slice;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = exports;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({message: message, actual: actual, expected: expected})

assert.AssertionError = function AssertionError (options) {
  this.name = "AssertionError";
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
// code from util.inherits in node
assert.AssertionError.super_ = Error;


// EDITED FOR BROWSER COMPATIBILITY: replaced Object.create call
// TODO: test what effect this may have
var ctor = function () { this.constructor = assert.AssertionError; };
ctor.prototype = Error.prototype;
assert.AssertionError.prototype = new ctor();


assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name+":", this.message].join(' ');
  } else {
    return [ this.name+":"
           , JSON.stringify(this.expected )
           , this.operator
           , JSON.stringify(this.actual)
           ].join(" ");
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

assert.ok = function ok(value, message) {
  if (!!!value) fail(value, true, message, "==", assert.ok);
};

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, "==", assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, "!=", assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, "deepEqual", assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == "object",
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical "prototype" property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull (value) {
  return value === null || value === undefined;
}

function isArguments (object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv (a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical "prototype" property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try{
    var ka = _keys(a),
      kb = _keys(b),
      key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key] ))
       return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, "===", assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as determined by !==.
// assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, "!==", assert.notStrictEqual);
  }
};

function _throws (shouldThrow, block, err, message) {
  var exception = null,
      threw = false,
      typematters = true;

  message = message || "";

  //handle optional arguments
  if (arguments.length == 3) {
    if (typeof(err) == "string") {
      message = err;
      typematters = false;
    }
  } else if (arguments.length == 2) {
    typematters = false;
  }

  try {
    block();
  } catch (e) {
    threw = true;
    exception = e;
  }

  if (shouldThrow && !threw) {
    fail( "Missing expected exception"
        + (err && err.name ? " ("+err.name+")." : '.')
        + (message ? " " + message : "")
        );
  }
  if (!shouldThrow && threw && typematters && exception instanceof err) {
    fail( "Got unwanted exception"
        + (err && err.name ? " ("+err.name+")." : '.')
        + (message ? " " + message : "")
        );
  }
  if ((shouldThrow && threw && typematters && !(exception instanceof err)) ||
      (!shouldThrow && threw)) {
    throw exception;
  }
};

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function (err) { if (err) {throw err;}};
})(assert);
(function(exports){
/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 * Only code on that line will be removed, its mostly to avoid requiring code
 * that is node specific
 */

/**
 * Module dependencies
 */



/**
 * Creates assertion objects representing the result of an assert call.
 * Accepts an object or AssertionError as its argument.
 *
 * @param {object} obj
 * @api public
 */

exports.assertion = function (obj) {
    return {
        method: obj.method || '',
        message: obj.message || (obj.error && obj.error.message) || '',
        error: obj.error,
        passed: function () {
            return !this.error;
        },
        failed: function () {
            return Boolean(this.error);
        }
    };
};

/**
 * Creates an assertion list object representing a group of assertions.
 * Accepts an array of assertion objects.
 *
 * @param {Array} arr
 * @param {Number} duration
 * @api public
 */

exports.assertionList = function (arr, duration) {
    var that = arr || [];
    that.failures = function () {
        var failures = 0;
        for (var i=0; i<this.length; i++) {
            if (this[i].failed()) failures++;
        }
        return failures;
    };
    that.duration = duration || 0;
    return that;
};

/**
 * Create a wrapper function for assert module methods. Executes a callback
 * after the it's complete with an assertion object representing the result.
 *
 * @param {Function} callback
 * @api private
 */

var assertWrapper = function (callback) {
    return function (new_method, assert_method, arity) {
        return function () {
            var message = arguments[arity-1];
            var a = exports.assertion({method: new_method, message: message});
            try {
                assert[assert_method].apply(null, arguments);
            }
            catch (e) {
                a.error = e;
            }
            callback(a);
        };
    };
};

/**
 * Creates the 'test' object that gets passed to every test function.
 * Accepts the name of the test function as its first argument, followed by
 * the start time in ms, the options object and a callback function.
 *
 * @param {String} name
 * @param {Number} start
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

exports.test = function (name, start, options, callback) {
    var expecting;
    var a_list = [];

    var wrapAssert = assertWrapper(function (a) {
        a_list.push(a);
        async.nextTick(function () {
            options.log(a);
        });
    });

    var test = {
        done: function (err) {
            if (expecting !== undefined && expecting !== a_list.length) {
                var e = new Error(
                    'Expected ' + expecting + ' assertions, ' +
                    a_list.length + ' ran'
                );
                var a1 = exports.assertion({method: 'expect', error: e});
                a_list.push(a1);
                async.nextTick(function () {
                    options.log(a1);
                });
            }
            if (err) {
                var a2 = exports.assertion({error: err});
                a_list.push(a2);
                async.nextTick(function () {
                    options.log(a2);
                });
            }
            var end = new Date().getTime();
            async.nextTick(function () {
                var assertion_list = exports.assertionList(a_list, end - start);
                options.testDone(name, assertion_list);
                callback(null, a_list);
            });
        },
        ok: wrapAssert('ok', 'ok', 2),
        same: wrapAssert('same', 'deepEqual', 3),
        equals: wrapAssert('equals', 'equal', 3),
        expect: function (num) {
            expecting = num;
        },
        _assertion_list: a_list
    };
    // add all functions from the assert module
    for (var k in assert) {
        if (assert.hasOwnProperty(k)) {
            test[k] = wrapAssert(k, k, assert[k].length);
        }
    }
    return test;
};

/**
 * Ensures an options object has all callbacks, adding empty callback functions
 * if any are missing.
 *
 * @param {Object} opt
 * @return {Object}
 * @api public
 */

exports.options = function (opt) {
    var optionalCallback = function (name) {
        opt[name] = opt[name] || function () {};
    };

    optionalCallback('moduleStart');
    optionalCallback('moduleDone');
    optionalCallback('testStart');
    optionalCallback('testDone');
    optionalCallback('log');

    // 'done' callback is not optional.

    return opt;
};
})(types);
(function(exports){
/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 * Only code on that line will be removed, its mostly to avoid requiring code
 * that is node specific
 */

/**
 * Module dependencies
 */



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
 * Utility for wrapping a suite of test functions with setUp and tearDown
 * functions.
 *
 * @param {Object} suite
 * @return {Object}
 * @api public
 */

exports.testCase = function (suite) {
    var tests = {};

    var setUp = suite.setUp;
    var tearDown = suite.tearDown;
    delete suite.setUp;
    delete suite.tearDown;

    var keys = _keys(suite);

    // TODO: replace reduce here with browser-safe alternative
    return keys.reduce(function (tests, k) {
        tests[k] = function (test) {
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
                    suite[k].call(context, test);
                });
            }
            else {
                suite[k].call(context, test);
            }
        };

        return tests;
    }, {});
};
})(core);
(function(exports){
/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 * Only code on that line will be removed, its mostly to avoid requiring code
 * that is node specific
 */


/**
 * NOTE: this test runner is not listed in index.js because it cannot be
 * used with the command-line tool, only inside the browser.
 */


/**
 * Reporter info string
 */

exports.info = "Browser-based test reporter";


exports.addStyles = function () {
    document.body.innerHTML += '<style type="text/css">' +
        'body { font: 12px Helvetica Neue }' +
        'h2 { margin:0 ; padding:0 }' +
        'pre {' +
            'font: 11px Andale Mono;' +
            'margin-left: 1em;' +
            'padding-left: 1em;' +
            'margin-top: 0;' +
            'font-size:smaller;' +
        '}' +
        '.assertion_message { margin-left: 1em; }' +
        '  ol {' +
            'list-style: none;' +
            'margin-left: 1em;' +
            'padding-left: 1em;' +
            'text-indent: -1em;' +
        '}' +
        '  ol li.pass:before { content: "\\2714 \\0020"; }' +
        '  ol li.fail:before { content: "\\2716 \\0020"; }' +
    '</style>';
};


/**
 * Run all tests within each module, reporting the results
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (modules, options) {
    var start = new Date().getTime();
    exports.addStyles();

    var html = '';
    nodeunit.runModules(modules, {
        moduleStart: function (name) {
            html += '<h2>' + name + '</h2>';
            html += '<ol>';
        },
        testDone: function (name, assertions) {
            if (!assertions.failures()) {
                html += '<li class="pass">' + name + '</li>';
            }
            else {
                html += '<li class="fail">' + name;
                for (var i=0; i<assertions.length; i++) {
                    var a = assertions[i];
                    if (a.failed()) {
                        if (a.error instanceof assert.AssertionError && a.message) {
                            html += '<div class="assertion_message">' +
                                'Assertion Message: ' + a.message +
                            '</div>';
                        }
                        html += '<pre>';
                        html += a.error.stack || a.error;
                        html += '</pre>';
                    }
                };
                html += '</li>';
            }
        },
        moduleDone: function () {
            html += '</ol>';
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start;
            if (assertions.failures()) {
                html += '<h3>FAILURES: '  + assertions.failures() +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)</h3>';
            }
            else {
                html += '<h3>OK: ' + assertions.length +
                    ' assertions (' + assertions.duration + 'ms)</h3>';
            }
            document.body.innerHTML += html;
        }
    });
};
})(reporter);
nodeunit = core;
nodeunit.assert = assert;
nodeunit.reporter = reporter;
nodeunit.run = reporter.run;
return nodeunit; })();
