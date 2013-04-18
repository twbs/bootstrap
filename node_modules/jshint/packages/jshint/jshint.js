/*!
 * JSHint, by JSHint Community.
 *
 * Licensed under the same slightly modified MIT license that JSLint is.
 * It stops evil-doers everywhere.
 *
 * JSHint is a derivative work of JSLint:
 *
 *   Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)
 *
 *   Permission is hereby granted, free of charge, to any person obtaining
 *   a copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom
 *   the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   The Software shall be used for Good, not Evil.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 *
 * JSHint was forked from the 2010-12-16 edition of JSLint.
 *
 */

/*
 JSHINT is a global function. It takes two parameters.

     var myResult = JSHINT(source, option);

 The first parameter is either a string or an array of strings. If it is a
 string, it will be split on '\n' or '\r'. If it is an array of strings, it
 is assumed that each string represents one line. The source can be a
 JavaScript text or a JSON text.

 The second parameter is an optional object of options which control the
 operation of JSHINT. Most of the options are booleans: They are all
 optional and have a default value of false. One of the options, predef,
 can be an array of names, which will be used to declare global variables,
 or an object whose keys are used as global names, with a boolean value
 that determines if they are assignable.

 If it checks out, JSHINT returns true. Otherwise, it returns false.

 If false, you can inspect JSHINT.errors to find out the problems.
 JSHINT.errors is an array of objects containing these members:

 {
     line      : The line (relative to 1) at which the lint was found
     character : The character (relative to 1) at which the lint was found
     reason    : The problem
     evidence  : The text line in which the problem occurred
     raw       : The raw message before the details were inserted
     a         : The first detail
     b         : The second detail
     c         : The third detail
     d         : The fourth detail
 }

 If a fatal error was found, a null will be the last element of the
 JSHINT.errors array.

 You can request a data structure which contains JSHint's results.

     var myData = JSHINT.data();

 It returns a structure with this form:

 {
     errors: [
         {
             line: NUMBER,
             character: NUMBER,
             reason: STRING,
             evidence: STRING
         }
     ],
     functions: [
         name: STRING,
         line: NUMBER,
         character: NUMBER,
         last: NUMBER,
         lastcharacter: NUMBER,
         param: [
             STRING
         ],
         closure: [
             STRING
         ],
         var: [
             STRING
         ],
         exception: [
             STRING
         ],
         outer: [
             STRING
         ],
         unused: [
             STRING
         ],
         global: [
             STRING
         ],
         label: [
             STRING
         ]
     ],
     globals: [
         STRING
     ],
     member: {
         STRING: NUMBER
     },
     unused: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     implieds: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     urls: [
         STRING
     ],
     json: BOOLEAN
 }

 Empty arrays will not be included.

*/

/*jshint
 evil: true, nomen: false, onevar: false, regexp: false, strict: true, boss: true,
 undef: true, maxlen: 100, indent: 4, quotmark: double, unused: true
*/

/*members "\b", "\t", "\n", "\f", "\r", "!=", "!==", "\"", "%", "(begin)",
 "(breakage)", "(character)", "(context)", "(error)", "(explicitNewcap)", "(global)",
 "(identifier)", "(last)", "(lastcharacter)", "(line)", "(loopage)", "(metrics)",
 "(name)", "(onevar)", "(params)", "(scope)", "(statement)", "(verb)", "(tokens)", "(catch)",
 "*", "+", "++", "-", "--", "\/", "<", "<=", "==",
 "===", ">", ">=", $, $$, $A, $F, $H, $R, $break, $continue, $w, Abstract, Ajax,
 __filename, __dirname, ActiveXObject, Array, ArrayBuffer, ArrayBufferView, Audio,
 Autocompleter, Asset, Boolean, Builder, Buffer, Browser, Blob, COM, CScript, Canvas,
 CustomAnimation, Class, Control, ComplexityCount, Chain, Color, Cookie, Core, DataView, Date,
 Debug, Draggable, Draggables, Droppables, Document, DomReady, DOMEvent, DOMReady, DOMParser,
 Drag, E, Enumerator, Enumerable, Element, Elements, Error, Effect, EvalError, Event,
 Events, FadeAnimation, Field, Flash, Float32Array, Float64Array, Form,
 FormField, Frame, FormData, Function, Fx, GetObject, Group, Hash, HotKey,
 HTMLElement, HTMLAnchorElement, HTMLBaseElement, HTMLBlockquoteElement,
 HTMLBodyElement, HTMLBRElement, HTMLButtonElement, HTMLCanvasElement, HTMLDirectoryElement,
 HTMLDivElement, HTMLDListElement, HTMLFieldSetElement,
 HTMLFontElement, HTMLFormElement, HTMLFrameElement, HTMLFrameSetElement,
 HTMLHeadElement, HTMLHeadingElement, HTMLHRElement, HTMLHtmlElement,
 HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLIsIndexElement,
 HTMLLabelElement, HTMLLayerElement, HTMLLegendElement, HTMLLIElement,
 HTMLLinkElement, HTMLMapElement, HTMLMenuElement, HTMLMetaElement,
 HTMLModElement, HTMLObjectElement, HTMLOListElement, HTMLOptGroupElement,
 HTMLOptionElement, HTMLParagraphElement, HTMLParamElement, HTMLPreElement,
 HTMLQuoteElement, HTMLScriptElement, HTMLSelectElement, HTMLStyleElement,
 HtmlTable, HTMLTableCaptionElement, HTMLTableCellElement, HTMLTableColElement,
 HTMLTableElement, HTMLTableRowElement, HTMLTableSectionElement,
 HTMLTextAreaElement, HTMLTitleElement, HTMLUListElement, HTMLVideoElement,
 Iframe, IframeShim, Image, importScripts, Int16Array, Int32Array, Int8Array,
 Insertion, InputValidator, JSON, Keyboard, Locale, LN10, LN2, LOG10E, LOG2E,
 MAX_VALUE, MIN_VALUE, Map, Mask, Math, MenuItem, MessageChannel, MessageEvent, MessagePort,
 MoveAnimation, MooTools, MutationObserver, NaN, Native, NEGATIVE_INFINITY, Node, NodeFilter,
 Number, Object, ObjectRange,
 Option, Options, OverText, PI, POSITIVE_INFINITY, PeriodicalExecuter, Point, Position, Prototype,
 RangeError, Rectangle, ReferenceError, RegExp, ResizeAnimation, Request, RotateAnimation, Set,
 SQRT1_2, SQRT2, ScrollBar, ScriptEngine, ScriptEngineBuildVersion,
 ScriptEngineMajorVersion, ScriptEngineMinorVersion, Scriptaculous, Scroller,
 Slick, Slider, Selector, SharedWorker, String, Style, SyntaxError, Sortable, Sortables,
 SortableObserver, Sound, Spinner, System, Swiff, Text, TextArea, Template,
 Timer, Tips, Type, TypeError, Toggle, Try, "use strict", unescape, URI, URIError, URL,
 VBArray, WeakMap, WSH, WScript, XDomainRequest, Web, Window, XMLDOM, XMLHttpRequest, XMLSerializer,
 XPathEvaluator, XPathException, XPathExpression, XPathNamespace, XPathNSResolver, XPathResult,
 "\\", a, abs, addEventListener, address, alert, apply, applicationCache, arguments, arity,
 asi, atob, b, basic, basicToken, bitwise, blacklist, block, blur, boolOptions, boss,
 browser, btoa, c, call, callee, caller, camelcase, cases, charAt, charCodeAt, character,
 clearInterval, clearTimeout, close, closed, closure, comment, complexityCount, condition,
 confirm, console, constructor, content, couch, create, css, curly, d, data, datalist, dd, debug,
 decodeURI, decodeURIComponent, defaultStatus, defineClass, deserialize, devel, document,
 dojo, dijit, dojox, define, else, emit, encodeURI, encodeURIComponent, elem,
 eqeq, eqeqeq, eqnull, errors, es5, escape, esnext, eval, event, evidence, evil,
 ex, exception, exec, exps, expr, exports, FileReader, first, floor, focus, forEach,
 forin, fragment, frames, from, fromCharCode, fud, funcscope, funct, function, functions,
 g, gc, getComputedStyle, getRow, getter, getterToken, GLOBAL, global, globals, globalstrict,
 hasOwnProperty, help, history, i, id, identifier, immed, implieds, importPackage, include,
 indent, indexOf, init, ins, internals, instanceOf, isAlpha, isApplicationRunning, isArray,
 isDigit, isFinite, isNaN, iterator, java, join, jshint,
 JSHINT, json, jquery, jQuery, keys, label, labelled, last, lastcharacter, lastsemic, laxbreak,
 laxcomma, latedef, lbp, led, left, length, line, load, loadClass, localStorage, location,
 log, loopfunc, m, match, max, maxcomplexity, maxdepth, maxerr, maxlen, maxstatements, maxparams,
 member, message, meta, module, moveBy, moveTo, mootools, multistr, name, navigator, new, newcap,
 nestedBlockDepth, noarg, node, noempty, nomen, nonew, nonstandard, nud, onbeforeunload, onblur,
 onerror, onevar, onecase, onfocus, onload, onresize, onunload, open, openDatabase, openURL,
 opener, opera, options, outer, param, parent, parseFloat, parseInt, passfail, plusplus,
 postMessage, pop, predef, print, process, prompt, proto, prototype, prototypejs, provides, push,
 quit, quotmark, range, raw, reach, reason, regexp, readFile, readUrl, regexdash,
 removeEventListener, replace, report, require, reserved, resizeBy, resizeTo, resolvePath,
 resumeUpdates, respond, rhino, right, runCommand, scroll, scope, screen, scripturl, scrollBy,
 scrollTo, scrollbar, search, seal, self, send, serialize, sessionStorage, setInterval, setTimeout,
 setter, setterToken, shift, slice, smarttabs, sort, spawn, split, statement, statementCount, stack,
 status, start, strict, sub, substr, supernew, shadow, supplant, sum, sync, test, toLowerCase,
 toString, toUpperCase, toint32, token, tokens, top, trailing, type, typeOf, Uint16Array,
 Uint32Array, Uint8Array, undef, undefs, unused, urls, validthis, value, valueOf, var, vars,
 version, verifyMaxParametersPerFunction, verifyMaxStatementsPerFunction,
 verifyMaxComplexityPerFunction, verifyMaxNestedBlockDepthPerFunction, WebSocket, withstmt, white,
 window, windows, Worker, worker, wsh, yui, YUI, Y, YUI_config*/

/*global exports: false */

// We build the application inside a function so that we produce only a single
// global variable. That function will be invoked immediately, and its return
// value is the JSHINT function itself.

var JSHINT = (function () {
    "use strict";

    var anonname,       // The guessed name for anonymous functions.

// These are operators that should not be used with the ! operator.

        bang = {
            "<"  : true,
            "<=" : true,
            "==" : true,
            "===": true,
            "!==": true,
            "!=" : true,
            ">"  : true,
            ">=" : true,
            "+"  : true,
            "-"  : true,
            "*"  : true,
            "/"  : true,
            "%"  : true
        },

        // These are the JSHint boolean options.
        boolOptions = {
            asi         : true, // if automatic semicolon insertion should be tolerated
            bitwise     : true, // if bitwise operators should not be allowed
            boss        : true, // if advanced usage of assignments should be allowed
            browser     : true, // if the standard browser globals should be predefined
            camelcase   : true, // if identifiers should be required in camel case
            couch       : true, // if CouchDB globals should be predefined
            curly       : true, // if curly braces around all blocks should be required
            debug       : true, // if debugger statements should be allowed
            devel       : true, // if logging globals should be predefined (console,
                                // alert, etc.)
            dojo        : true, // if Dojo Toolkit globals should be predefined
            eqeqeq      : true, // if === should be required
            eqnull      : true, // if == null comparisons should be tolerated
            es5         : true, // if ES5 syntax should be allowed
            esnext      : true, // if es.next specific syntax should be allowed
            evil        : true, // if eval should be allowed
            expr        : true, // if ExpressionStatement should be allowed as Programs
            forin       : true, // if for in statements must filter
            funcscope   : true, // if only function scope should be used for scope tests
            globalstrict: true, // if global "use strict"; should be allowed (also
                                // enables 'strict')
            immed       : true, // if immediate invocations must be wrapped in parens
            iterator    : true, // if the `__iterator__` property should be allowed
            jquery      : true, // if jQuery globals should be predefined
            lastsemic   : true, // if semicolons may be ommitted for the trailing
                                // statements inside of a one-line blocks.
            latedef     : true, // if the use before definition should not be tolerated
            laxbreak    : true, // if line breaks should not be checked
            laxcomma    : true, // if line breaks should not be checked around commas
            loopfunc    : true, // if functions should be allowed to be defined within
                                // loops
            mootools    : true, // if MooTools globals should be predefined
            multistr    : true, // allow multiline strings
            newcap      : true, // if constructor names must be capitalized
            noarg       : true, // if arguments.caller and arguments.callee should be
                                // disallowed
            node        : true, // if the Node.js environment globals should be
                                // predefined
            noempty     : true, // if empty blocks should be disallowed
            nonew       : true, // if using `new` for side-effects should be disallowed
            nonstandard : true, // if non-standard (but widely adopted) globals should
                                // be predefined
            nomen       : true, // if names should be checked
            onevar      : true, // if only one var statement per function should be
                                // allowed
            onecase     : true, // if one case switch statements should be allowed
            passfail    : true, // if the scan should stop on first error
            plusplus    : true, // if increment/decrement should not be allowed
            proto       : true, // if the `__proto__` property should be allowed
            prototypejs : true, // if Prototype and Scriptaculous globals should be
                                // predefined
            regexdash   : true, // if unescaped first/last dash (-) inside brackets
                                // should be tolerated
            regexp      : true, // if the . should not be allowed in regexp literals
            rhino       : true, // if the Rhino environment globals should be predefined
            undef       : true, // if variables should be declared before used
            unused      : true, // if variables should be always used
            scripturl   : true, // if script-targeted URLs should be tolerated
            shadow      : true, // if variable shadowing should be tolerated
            smarttabs   : true, // if smarttabs should be tolerated
                                // (http://www.emacswiki.org/emacs/SmartTabs)
            strict      : true, // require the "use strict"; pragma
            sub         : true, // if all forms of subscript notation are tolerated
            supernew    : true, // if `new function () { ... };` and `new Object;`
                                // should be tolerated
            trailing    : true, // if trailing whitespace rules apply
            validthis   : true, // if 'this' inside a non-constructor function is valid.
                                // This is a function scoped option only.
            withstmt    : true, // if with statements should be allowed
            white       : true, // if strict whitespace rules apply
            worker      : true, // if Web Worker script symbols should be allowed
            wsh         : true, // if the Windows Scripting Host environment globals
                                // should be predefined
            yui         : true  // YUI variables should be predefined
        },

        // These are the JSHint options that can take any value
        // (we use this object to detect invalid options)
        valOptions = {
            maxlen       : false,
            indent       : false,
            maxerr       : false,
            predef       : false,
            quotmark     : false, //'single'|'double'|true
            scope        : false,
            maxstatements: false, // {int} max statements per function
            maxdepth     : false, // {int} max nested block depth per function
            maxparams    : false, // {int} max params per function
            maxcomplexity: false  // {int} max cyclomatic complexity per function
        },

        // These are JSHint boolean options which are shared with JSLint
        // where the definition in JSHint is opposite JSLint
        invertedOptions = {
            bitwise     : true,
            forin       : true,
            newcap      : true,
            nomen       : true,
            plusplus    : true,
            regexp      : true,
            undef       : true,
            white       : true,

            // Inverted and renamed, use JSHint name here
            eqeqeq      : true,
            onevar      : true
        },

        // These are JSHint boolean options which are shared with JSLint
        // where the name has been changed but the effect is unchanged
        renamedOptions = {
            eqeq        : "eqeqeq",
            vars        : "onevar",
            windows     : "wsh"
        },


        // browser contains a set of global names which are commonly provided by a
        // web browser environment.
        browser = {
            ArrayBuffer              :  false,
            ArrayBufferView          :  false,
            Audio                    :  false,
            Blob                     :  false,
            addEventListener         :  false,
            applicationCache         :  false,
            atob                     :  false,
            blur                     :  false,
            btoa                     :  false,
            clearInterval            :  false,
            clearTimeout             :  false,
            close                    :  false,
            closed                   :  false,
            DataView                 :  false,
            DOMParser                :  false,
            defaultStatus            :  false,
            document                 :  false,
            event                    :  false,
            FileReader               :  false,
            Float32Array             :  false,
            Float64Array             :  false,
            FormData                 :  false,
            focus                    :  false,
            frames                   :  false,
            getComputedStyle         :  false,
            HTMLElement              :  false,
            HTMLAnchorElement        :  false,
            HTMLBaseElement          :  false,
            HTMLBlockquoteElement    :  false,
            HTMLBodyElement          :  false,
            HTMLBRElement            :  false,
            HTMLButtonElement        :  false,
            HTMLCanvasElement        :  false,
            HTMLDirectoryElement     :  false,
            HTMLDivElement           :  false,
            HTMLDListElement         :  false,
            HTMLFieldSetElement      :  false,
            HTMLFontElement          :  false,
            HTMLFormElement          :  false,
            HTMLFrameElement         :  false,
            HTMLFrameSetElement      :  false,
            HTMLHeadElement          :  false,
            HTMLHeadingElement       :  false,
            HTMLHRElement            :  false,
            HTMLHtmlElement          :  false,
            HTMLIFrameElement        :  false,
            HTMLImageElement         :  false,
            HTMLInputElement         :  false,
            HTMLIsIndexElement       :  false,
            HTMLLabelElement         :  false,
            HTMLLayerElement         :  false,
            HTMLLegendElement        :  false,
            HTMLLIElement            :  false,
            HTMLLinkElement          :  false,
            HTMLMapElement           :  false,
            HTMLMenuElement          :  false,
            HTMLMetaElement          :  false,
            HTMLModElement           :  false,
            HTMLObjectElement        :  false,
            HTMLOListElement         :  false,
            HTMLOptGroupElement      :  false,
            HTMLOptionElement        :  false,
            HTMLParagraphElement     :  false,
            HTMLParamElement         :  false,
            HTMLPreElement           :  false,
            HTMLQuoteElement         :  false,
            HTMLScriptElement        :  false,
            HTMLSelectElement        :  false,
            HTMLStyleElement         :  false,
            HTMLTableCaptionElement  :  false,
            HTMLTableCellElement     :  false,
            HTMLTableColElement      :  false,
            HTMLTableElement         :  false,
            HTMLTableRowElement      :  false,
            HTMLTableSectionElement  :  false,
            HTMLTextAreaElement      :  false,
            HTMLTitleElement         :  false,
            HTMLUListElement         :  false,
            HTMLVideoElement         :  false,
            history                  :  false,
            Int16Array               :  false,
            Int32Array               :  false,
            Int8Array                :  false,
            Image                    :  false,
            length                   :  false,
            localStorage             :  false,
            location                 :  false,
            MessageChannel           :  false,
            MessageEvent             :  false,
            MessagePort              :  false,
            moveBy                   :  false,
            moveTo                   :  false,
            MutationObserver         :  false,
            name                     :  false,
            Node                     :  false,
            NodeFilter               :  false,
            navigator                :  false,
            onbeforeunload           :  true,
            onblur                   :  true,
            onerror                  :  true,
            onfocus                  :  true,
            onload                   :  true,
            onresize                 :  true,
            onunload                 :  true,
            open                     :  false,
            openDatabase             :  false,
            opener                   :  false,
            Option                   :  false,
            parent                   :  false,
            print                    :  false,
            removeEventListener      :  false,
            resizeBy                 :  false,
            resizeTo                 :  false,
            screen                   :  false,
            scroll                   :  false,
            scrollBy                 :  false,
            scrollTo                 :  false,
            sessionStorage           :  false,
            setInterval              :  false,
            setTimeout               :  false,
            SharedWorker             :  false,
            status                   :  false,
            top                      :  false,
            Uint16Array              :  false,
            Uint32Array              :  false,
            Uint8Array               :  false,
            WebSocket                :  false,
            window                   :  false,
            Worker                   :  false,
            XMLHttpRequest           :  false,
            XMLSerializer            :  false,
            XPathEvaluator           :  false,
            XPathException           :  false,
            XPathExpression          :  false,
            XPathNamespace           :  false,
            XPathNSResolver          :  false,
            XPathResult              :  false
        },

        couch = {
            "require" : false,
            respond   : false,
            getRow    : false,
            emit      : false,
            send      : false,
            start     : false,
            sum       : false,
            log       : false,
            exports   : false,
            module    : false,
            provides  : false
        },

        declared, // Globals that were declared using /*global ... */ syntax.

        devel = {
            alert   : false,
            confirm : false,
            console : false,
            Debug   : false,
            opera   : false,
            prompt  : false
        },

        dojo = {
            dojo      : false,
            dijit     : false,
            dojox     : false,
            define    : false,
            "require" : false
        },

        funct,          // The current function

        functionicity = [
            "closure", "exception", "global", "label",
            "outer", "unused", "var"
        ],

        functions,      // All of the functions

        global,         // The global scope
        implied,        // Implied globals
        inblock,
        indent,
        jsonmode,

        jquery = {
            "$"    : false,
            jQuery : false
        },

        lines,
        lookahead,
        member,
        membersOnly,

        mootools = {
            "$"             : false,
            "$$"            : false,
            Asset           : false,
            Browser         : false,
            Chain           : false,
            Class           : false,
            Color           : false,
            Cookie          : false,
            Core            : false,
            Document        : false,
            DomReady        : false,
            DOMEvent        : false,
            DOMReady        : false,
            Drag            : false,
            Element         : false,
            Elements        : false,
            Event           : false,
            Events          : false,
            Fx              : false,
            Group           : false,
            Hash            : false,
            HtmlTable       : false,
            Iframe          : false,
            IframeShim      : false,
            InputValidator  : false,
            instanceOf      : false,
            Keyboard        : false,
            Locale          : false,
            Mask            : false,
            MooTools        : false,
            Native          : false,
            Options         : false,
            OverText        : false,
            Request         : false,
            Scroller        : false,
            Slick           : false,
            Slider          : false,
            Sortables       : false,
            Spinner         : false,
            Swiff           : false,
            Tips            : false,
            Type            : false,
            typeOf          : false,
            URI             : false,
            Window          : false
        },

        nexttoken,

        node = {
            __filename    : false,
            __dirname     : false,
            Buffer        : false,
            console       : false,
            exports       : true,  // In Node it is ok to exports = module.exports = foo();
            GLOBAL        : false,
            global        : false,
            module        : false,
            process       : false,
            require       : false,
            setTimeout    : false,
            clearTimeout  : false,
            setInterval   : false,
            clearInterval : false
        },

        noreach,
        option,
        predefined,     // Global variables defined by option
        prereg,
        prevtoken,

        prototypejs = {
            "$"               : false,
            "$$"              : false,
            "$A"              : false,
            "$F"              : false,
            "$H"              : false,
            "$R"              : false,
            "$break"          : false,
            "$continue"       : false,
            "$w"              : false,
            Abstract          : false,
            Ajax              : false,
            Class             : false,
            Enumerable        : false,
            Element           : false,
            Event             : false,
            Field             : false,
            Form              : false,
            Hash              : false,
            Insertion         : false,
            ObjectRange       : false,
            PeriodicalExecuter: false,
            Position          : false,
            Prototype         : false,
            Selector          : false,
            Template          : false,
            Toggle            : false,
            Try               : false,
            Autocompleter     : false,
            Builder           : false,
            Control           : false,
            Draggable         : false,
            Draggables        : false,
            Droppables        : false,
            Effect            : false,
            Sortable          : false,
            SortableObserver  : false,
            Sound             : false,
            Scriptaculous     : false
        },

        quotmark,

        rhino = {
            defineClass  : false,
            deserialize  : false,
            gc           : false,
            help         : false,
            importPackage: false,
            "java"       : false,
            load         : false,
            loadClass    : false,
            print        : false,
            quit         : false,
            readFile     : false,
            readUrl      : false,
            runCommand   : false,
            seal         : false,
            serialize    : false,
            spawn        : false,
            sync         : false,
            toint32      : false,
            version      : false
        },

        scope,      // The current scope
        stack,

        // standard contains the global names that are provided by the
        // ECMAScript standard.
        standard = {
            Array               : false,
            Boolean             : false,
            Date                : false,
            decodeURI           : false,
            decodeURIComponent  : false,
            encodeURI           : false,
            encodeURIComponent  : false,
            Error               : false,
            "eval"              : false,
            EvalError           : false,
            Function            : false,
            hasOwnProperty      : false,
            isFinite            : false,
            isNaN               : false,
            JSON                : false,
            Map                 : false,
            Math                : false,
            NaN                 : false,
            Number              : false,
            Object              : false,
            parseInt            : false,
            parseFloat          : false,
            RangeError          : false,
            ReferenceError      : false,
            RegExp              : false,
            Set                 : false,
            String              : false,
            SyntaxError         : false,
            TypeError           : false,
            URIError            : false,
            WeakMap             : false
        },

        // widely adopted global names that are not part of ECMAScript standard
        nonstandard = {
            escape              : false,
            unescape            : false
        },

        directive,
        syntax = {},
        tab,
        token,
        unuseds,
        urls,
        useESNextSyntax,
        warnings,

        worker = {
            importScripts       : true,
            postMessage         : true,
            self                : true
        },

        wsh = {
            ActiveXObject             : true,
            Enumerator                : true,
            GetObject                 : true,
            ScriptEngine              : true,
            ScriptEngineBuildVersion  : true,
            ScriptEngineMajorVersion  : true,
            ScriptEngineMinorVersion  : true,
            VBArray                   : true,
            WSH                       : true,
            WScript                   : true,
            XDomainRequest            : true
        },

        yui = {
            YUI             : false,
            Y               : false,
            YUI_config      : false
        };
    // Regular expressions. Some of these are stupidly long.
    var ax, cx, tx, nx, nxg, lx, ix, jx, ft;
    (function () {
        /*jshint maxlen:300 */

        // unsafe comment or string
        ax = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

        // unsafe characters that are silently deleted by one or more browsers
        cx = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

        // token
        tx = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/=(?!(\S*\/[gim]?))|\/(\*(jshint|jslint|members?|global)?|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/;

        // characters in strings that need escapement
        nx = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
        nxg = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        // star slash
        lx = /\*\//;

        // identifier
        ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;

        // javascript url
        jx = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i;

        // catches /* falls through */ comments
        ft = /^\s*\/\*\s*falls\sthrough\s*\*\/\s*$/;
    }());

    function F() {}     // Used by Object.create

    function is_own(object, name) {
        // The object.hasOwnProperty method fails when the property under consideration
        // is named 'hasOwnProperty'. So we have to use this more convoluted form.
        return Object.prototype.hasOwnProperty.call(object, name);
    }

    function checkOption(name, t) {
        if (valOptions[name] === undefined && boolOptions[name] === undefined) {
            warning("Bad option: '" + name + "'.", t);
        }
    }

    function isString(obj) {
        return Object.prototype.toString.call(obj) === "[object String]";
    }

    // Provide critical ES5 functions to ES3.

    if (typeof Array.isArray !== "function") {
        Array.isArray = function (o) {
            return Object.prototype.toString.apply(o) === "[object Array]";
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, scope) {
            var len = this.length;

            for (var i = 0; i < len; i++) {
                fn.call(scope || this, this[i], i, this);
            }
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            if (this === null || this === undefined) {
                throw new TypeError();
            }

            var t = new Object(this);
            var len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n !== 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            if (n >= len) {
                return -1;
            }

            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }

            return -1;
        };
    }

    if (typeof Object.create !== "function") {
        Object.create = function (o) {
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.keys !== "function") {
        Object.keys = function (o) {
            var a = [], k;
            for (k in o) {
                if (is_own(o, k)) {
                    a.push(k);
                }
            }
            return a;
        };
    }

    // Non standard methods

    function isAlpha(str) {
        return (str >= "a" && str <= "z\uffff") ||
            (str >= "A" && str <= "Z\uffff");
    }

    function isDigit(str) {
        return (str >= "0" && str <= "9");
    }

    function isIdentifier(token, value) {
        if (!token)
            return false;

        if (!token.identifier || token.value !== value)
            return false;

        return true;
    }

    function supplant(str, data) {
        return str.replace(/\{([^{}]*)\}/g, function (a, b) {
            var r = data[b];
            return typeof r === "string" || typeof r === "number" ? r : a;
        });
    }

    function combine(t, o) {
        var n;
        for (n in o) {
            if (is_own(o, n) && !is_own(JSHINT.blacklist, n)) {
                t[n] = o[n];
            }
        }
    }

    function updatePredefined() {
        Object.keys(JSHINT.blacklist).forEach(function (key) {
            delete predefined[key];
        });
    }

    function assume() {
        if (option.couch) {
            combine(predefined, couch);
        }

        if (option.rhino) {
            combine(predefined, rhino);
        }

        if (option.prototypejs) {
            combine(predefined, prototypejs);
        }

        if (option.node) {
            combine(predefined, node);
            option.globalstrict = true;
        }

        if (option.devel) {
            combine(predefined, devel);
        }

        if (option.dojo) {
            combine(predefined, dojo);
        }

        if (option.browser) {
            combine(predefined, browser);
        }

        if (option.nonstandard) {
            combine(predefined, nonstandard);
        }

        if (option.jquery) {
            combine(predefined, jquery);
        }

        if (option.mootools) {
            combine(predefined, mootools);
        }

        if (option.worker) {
            combine(predefined, worker);
        }

        if (option.wsh) {
            combine(predefined, wsh);
        }

        if (option.esnext) {
            useESNextSyntax();
        }

        if (option.globalstrict && option.strict !== false) {
            option.strict = true;
        }

        if (option.yui) {
            combine(predefined, yui);
        }
    }


    // Produce an error warning.
    function quit(message, line, chr) {
        var percentage = Math.floor((line / lines.length) * 100);

        throw {
            name: "JSHintError",
            line: line,
            character: chr,
            message: message + " (" + percentage + "% scanned).",
            raw: message
        };
    }

    function isundef(scope, m, t, a) {
        return JSHINT.undefs.push([scope, m, t, a]);
    }

    function warning(m, t, a, b, c, d) {
        var ch, l, w;
        t = t || nexttoken;
        if (t.id === "(end)") {  // `~
            t = token;
        }
        l = t.line || 0;
        ch = t.from || 0;
        w = {
            id: "(error)",
            raw: m,
            evidence: lines[l - 1] || "",
            line: l,
            character: ch,
            scope: JSHINT.scope,
            a: a,
            b: b,
            c: c,
            d: d
        };
        w.reason = supplant(m, w);
        JSHINT.errors.push(w);
        if (option.passfail) {
            quit("Stopping. ", l, ch);
        }
        warnings += 1;
        if (warnings >= option.maxerr) {
            quit("Too many errors.", l, ch);
        }
        return w;
    }

    function warningAt(m, l, ch, a, b, c, d) {
        return warning(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }

    function error(m, t, a, b, c, d) {
        warning(m, t, a, b, c, d);
    }

    function errorAt(m, l, ch, a, b, c, d) {
        return error(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }

    // Tracking of "internal" scripts, like eval containing a static string
    function addInternalSrc(elem, src) {
        var i;
        i = {
            id: "(internal)",
            elem: elem,
            value: src
        };
        JSHINT.internals.push(i);
        return i;
    }


// lexical analysis and token construction

    var lex = (function lex() {
        var character, from, line, s;

// Private lex methods

        function nextLine() {
            var at,
                match,
                tw; // trailing whitespace check

            if (line >= lines.length)
                return false;

            character = 1;
            s = lines[line];
            line += 1;

            // If smarttabs option is used check for spaces followed by tabs only.
            // Otherwise check for any occurence of mixed tabs and spaces.
            // Tabs and one space followed by block comment is allowed.
            if (option.smarttabs) {
                // negative look-behind for "//"
                match = s.match(/(\/\/)? \t/);
                at = match && !match[1] ? 0 : -1;
            } else {
                at = s.search(/ \t|\t [^\*]/);
            }

            if (at >= 0)
                warningAt("Mixed spaces and tabs.", line, at + 1);

            s = s.replace(/\t/g, tab);
            at = s.search(cx);

            if (at >= 0)
                warningAt("Unsafe character.", line, at);

            if (option.maxlen && option.maxlen < s.length)
                warningAt("Line too long.", line, s.length);

            // Check for trailing whitespaces
            tw = option.trailing && s.match(/^(.*?)\s+$/);
            if (tw && !/^\s+$/.test(s)) {
                warningAt("Trailing whitespace.", line, tw[1].length + 1);
            }
            return true;
        }

// Produce a token object.  The token inherits from a syntax symbol.

        function it(type, value) {
            var i, t;

            function checkName(name) {
                if (!option.proto && name === "__proto__") {
                    warningAt("The '{a}' property is deprecated.", line, from, name);
                    return;
                }

                if (!option.iterator && name === "__iterator__") {
                    warningAt("'{a}' is only available in JavaScript 1.7.", line, from, name);
                    return;
                }

                // Check for dangling underscores unless we're in Node
                // environment and this identifier represents built-in
                // Node globals with underscores.

                var hasDangling = /^(_+.*|.*_+)$/.test(name);

                if (option.nomen && hasDangling && name !== "_") {
                    if (option.node && token.id !== "." && /^(__dirname|__filename)$/.test(name))
                        return;

                    warningAt("Unexpected {a} in '{b}'.", line, from, "dangling '_'", name);
                    return;
                }

                // Check for non-camelcase names. Names like MY_VAR and
                // _myVar are okay though.

                if (option.camelcase) {
                    if (name.replace(/^_+/, "").indexOf("_") > -1 && !name.match(/^[A-Z0-9_]*$/)) {
                        warningAt("Identifier '{a}' is not in camel case.", line, from, value);
                    }
                }
            }

            if (type === "(color)" || type === "(range)") {
                t = {type: type};
            } else if (type === "(punctuator)" ||
                    (type === "(identifier)" && is_own(syntax, value))) {
                t = syntax[value] || syntax["(error)"];
            } else {
                t = syntax[type];
            }

            t = Object.create(t);

            if (type === "(string)" || type === "(range)") {
                if (!option.scripturl && jx.test(value)) {
                    warningAt("Script URL.", line, from);
                }
            }

            if (type === "(identifier)") {
                t.identifier = true;
                checkName(value);
            }

            t.value = value;
            t.line = line;
            t.character = character;
            t.from = from;
            i = t.id;
            if (i !== "(endline)") {
                prereg = i &&
                    (("(,=:[!&|?{};".indexOf(i.charAt(i.length - 1)) >= 0) ||
                    i === "return" ||
                    i === "case");
            }
            return t;
        }

        // Public lex methods
        return {
            init: function (source) {
                if (typeof source === "string") {
                    lines = source
                        .replace(/\r\n/g, "\n")
                        .replace(/\r/g, "\n")
                        .split("\n");
                } else {
                    lines = source;
                }

                // If the first line is a shebang (#!), make it a blank and move on.
                // Shebangs are used by Node scripts.
                if (lines[0] && lines[0].substr(0, 2) === "#!")
                    lines[0] = "";

                line = 0;
                nextLine();
                from = 1;
            },

            range: function (begin, end) {
                var c, value = "";
                from = character;
                if (s.charAt(0) !== begin) {
                    errorAt("Expected '{a}' and instead saw '{b}'.",
                            line, character, begin, s.charAt(0));
                }
                for (;;) {
                    s = s.slice(1);
                    character += 1;
                    c = s.charAt(0);
                    switch (c) {
                    case "":
                        errorAt("Missing '{a}'.", line, character, c);
                        break;
                    case end:
                        s = s.slice(1);
                        character += 1;
                        return it("(range)", value);
                    case "\\":
                        warningAt("Unexpected '{a}'.", line, character, c);
                    }
                    value += c;
                }

            },


            // token -- this is called by advance to get the next token
            token: function () {
                var b, c, captures, d, depth, high, i, l, low, q, t, isLiteral, isInRange, n;

                function match(x) {
                    var r = x.exec(s), r1;

                    if (r) {
                        l = r[0].length;
                        r1 = r[1];
                        c = r1.charAt(0);
                        s = s.substr(l);
                        from = character + l - r1.length;
                        character += l;
                        return r1;
                    }
                }

                function string(x) {
                    var c, j, r = "", allowNewLine = false;

                    if (jsonmode && x !== "\"") {
                        warningAt("Strings must use doublequote.",
                                line, character);
                    }

                    if (option.quotmark) {
                        if (option.quotmark === "single" && x !== "'") {
                            warningAt("Strings must use singlequote.",
                                    line, character);
                        } else if (option.quotmark === "double" && x !== "\"") {
                            warningAt("Strings must use doublequote.",
                                    line, character);
                        } else if (option.quotmark === true) {
                            quotmark = quotmark || x;
                            if (quotmark !== x) {
                                warningAt("Mixed double and single quotes.",
                                        line, character);
                            }
                        }
                    }

                    function esc(n) {
                        var i = parseInt(s.substr(j + 1, n), 16);
                        j += n;
                        if (i >= 32 && i <= 126 &&
                                i !== 34 && i !== 92 && i !== 39) {
                            warningAt("Unnecessary escapement.", line, character);
                        }
                        character += n;
                        c = String.fromCharCode(i);
                    }

                    j = 0;
unclosedString:     for (;;) {
                        while (j >= s.length) {
                            j = 0;

                            var cl = line, cf = from;
                            if (!nextLine()) {
                                errorAt("Unclosed string.", cl, cf);
                                break unclosedString;
                            }

                            if (allowNewLine) {
                                allowNewLine = false;
                            } else {
                                warningAt("Unclosed string.", cl, cf);
                            }
                        }

                        c = s.charAt(j);
                        if (c === x) {
                            character += 1;
                            s = s.substr(j + 1);
                            return it("(string)", r, x);
                        }

                        if (c < " ") {
                            if (c === "\n" || c === "\r") {
                                break;
                            }
                            warningAt("Control character in string: {a}.",
                                    line, character + j, s.slice(0, j));
                        } else if (c === "\\") {
                            j += 1;
                            character += 1;
                            c = s.charAt(j);
                            n = s.charAt(j + 1);
                            switch (c) {
                            case "\\":
                            case "\"":
                            case "/":
                                break;
                            case "\'":
                                if (jsonmode) {
                                    warningAt("Avoid \\'.", line, character);
                                }
                                break;
                            case "b":
                                c = "\b";
                                break;
                            case "f":
                                c = "\f";
                                break;
                            case "n":
                                c = "\n";
                                break;
                            case "r":
                                c = "\r";
                                break;
                            case "t":
                                c = "\t";
                                break;
                            case "0":
                                c = "\0";
                                // Octal literals fail in strict mode
                                // check if the number is between 00 and 07
                                // where 'n' is the token next to 'c'
                                if (n >= 0 && n <= 7 && directive["use strict"]) {
                                    warningAt(
                                    "Octal literals are not allowed in strict mode.",
                                    line, character);
                                }
                                break;
                            case "u":
                                esc(4);
                                break;
                            case "v":
                                if (jsonmode) {
                                    warningAt("Avoid \\v.", line, character);
                                }
                                c = "\v";
                                break;
                            case "x":
                                if (jsonmode) {
                                    warningAt("Avoid \\x-.", line, character);
                                }
                                esc(2);
                                break;
                            case "":
                                // last character is escape character
                                // always allow new line if escaped, but show
                                // warning if option is not set
                                allowNewLine = true;
                                if (option.multistr) {
                                    if (jsonmode) {
                                        warningAt("Avoid EOL escapement.", line, character);
                                    }
                                    c = "";
                                    character -= 1;
                                    break;
                                }
                                warningAt("Bad escapement of EOL. Use option multistr if needed.",
                                    line, character);
                                break;
                            case "!":
                                if (s.charAt(j - 2) === "<")
                                    break;
                                /*falls through*/
                            default:
                                warningAt("Bad escapement.", line, character);
                            }
                        }
                        r += c;
                        character += 1;
                        j += 1;
                    }
                }

                for (;;) {
                    if (!s) {
                        return it(nextLine() ? "(endline)" : "(end)", "");
                    }

                    t = match(tx);

                    if (!t) {
                        t = "";
                        c = "";
                        while (s && s < "!") {
                            s = s.substr(1);
                        }
                        if (s) {
                            errorAt("Unexpected '{a}'.", line, character, s.substr(0, 1));
                            s = "";
                        }
                    } else {

    //      identifier

                        if (isAlpha(c) || c === "_" || c === "$") {
                            return it("(identifier)", t);
                        }

    //      number

                        if (isDigit(c)) {
                            if (!isFinite(Number(t))) {
                                warningAt("Bad number '{a}'.",
                                    line, character, t);
                            }
                            if (isAlpha(s.substr(0, 1))) {
                                warningAt("Missing space after '{a}'.",
                                        line, character, t);
                            }
                            if (c === "0") {
                                d = t.substr(1, 1);
                                if (isDigit(d)) {
                                    if (token.id !== ".") {
                                        warningAt("Don't use extra leading zeros '{a}'.",
                                            line, character, t);
                                    }
                                } else if (jsonmode && (d === "x" || d === "X")) {
                                    warningAt("Avoid 0x-. '{a}'.",
                                            line, character, t);
                                }
                            }
                            if (t.substr(t.length - 1) === ".") {
                                warningAt(
"A trailing decimal point can be confused with a dot '{a}'.", line, character, t);
                            }
                            return it("(number)", t);
                        }
                        switch (t) {

    //      string

                        case "\"":
                        case "'":
                            return string(t);

    //      // comment

                        case "//":
                            s = "";
                            token.comment = true;
                            break;

    //      /* comment

                        case "/*":
                            for (;;) {
                                i = s.search(lx);
                                if (i >= 0) {
                                    break;
                                }
                                if (!nextLine()) {
                                    errorAt("Unclosed comment.", line, character);
                                }
                            }
                            s = s.substr(i + 2);
                            token.comment = true;
                            break;

    //      /*members /*jshint /*global

                        case "/*members":
                        case "/*member":
                        case "/*jshint":
                        case "/*jslint":
                        case "/*global":
                        case "*/":
                            return {
                                value: t,
                                type: "special",
                                line: line,
                                character: character,
                                from: from
                            };

                        case "":
                            break;
    //      /
                        case "/":
                            if (s.charAt(0) === "=") {
                                errorAt("A regular expression literal can be confused with '/='.",
                                    line, from);
                            }

                            if (prereg) {
                                depth = 0;
                                captures = 0;
                                l = 0;
                                for (;;) {
                                    b = true;
                                    c = s.charAt(l);
                                    l += 1;
                                    switch (c) {
                                    case "":
                                        errorAt("Unclosed regular expression.", line, from);
                                        return quit("Stopping.", line, from);
                                    case "/":
                                        if (depth > 0) {
                                            warningAt("{a} unterminated regular expression " +
                                                "group(s).", line, from + l, depth);
                                        }
                                        c = s.substr(0, l - 1);
                                        q = {
                                            g: true,
                                            i: true,
                                            m: true
                                        };
                                        while (q[s.charAt(l)] === true) {
                                            q[s.charAt(l)] = false;
                                            l += 1;
                                        }
                                        character += l;
                                        s = s.substr(l);
                                        q = s.charAt(0);
                                        if (q === "/" || q === "*") {
                                            errorAt("Confusing regular expression.",
                                                    line, from);
                                        }
                                        return it("(regexp)", c);
                                    case "\\":
                                        c = s.charAt(l);
                                        if (c < " ") {
                                            warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                        } else if (c === "<") {
                                            warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                        }
                                        l += 1;
                                        break;
                                    case "(":
                                        depth += 1;
                                        b = false;
                                        if (s.charAt(l) === "?") {
                                            l += 1;
                                            switch (s.charAt(l)) {
                                            case ":":
                                            case "=":
                                            case "!":
                                                l += 1;
                                                break;
                                            default:
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, ":", s.charAt(l));
                                            }
                                        } else {
                                            captures += 1;
                                        }
                                        break;
                                    case "|":
                                        b = false;
                                        break;
                                    case ")":
                                        if (depth === 0) {
                                            warningAt("Unescaped '{a}'.",
                                                    line, from + l, ")");
                                        } else {
                                            depth -= 1;
                                        }
                                        break;
                                    case " ":
                                        q = 1;
                                        while (s.charAt(l) === " ") {
                                            l += 1;
                                            q += 1;
                                        }
                                        if (q > 1) {
                                            warningAt(
"Spaces are hard to count. Use {{a}}.", line, from + l, q);
                                        }
                                        break;
                                    case "[":
                                        c = s.charAt(l);
                                        if (c === "^") {
                                            l += 1;
                                            if (s.charAt(l) === "]") {
                                                errorAt("Unescaped '{a}'.",
                                                    line, from + l, "^");
                                            }
                                        }
                                        if (c === "]") {
                                            warningAt("Empty class.", line,
                                                    from + l - 1);
                                        }
                                        isLiteral = false;
                                        isInRange = false;
klass:                                  do {
                                            c = s.charAt(l);
                                            l += 1;
                                            switch (c) {
                                            case "[":
                                            case "^":
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l, c);
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "-":
                                                if (isLiteral && !isInRange) {
                                                    isLiteral = false;
                                                    isInRange = true;
                                                } else if (isInRange) {
                                                    isInRange = false;
                                                } else if (s.charAt(l) === "]") {
                                                    isInRange = true;
                                                } else {
                                                    if (option.regexdash !== (l === 2 || (l === 3 &&
                                                        s.charAt(1) === "^"))) {
                                                        warningAt("Unescaped '{a}'.",
                                                            line, from + l - 1, "-");
                                                    }
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "]":
                                                if (isInRange && !option.regexdash) {
                                                    warningAt("Unescaped '{a}'.",
                                                            line, from + l - 1, "-");
                                                }
                                                break klass;
                                            case "\\":
                                                c = s.charAt(l);
                                                if (c < " ") {
                                                    warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                                } else if (c === "<") {
                                                    warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                                }
                                                l += 1;

                                                // \w, \s and \d are never part of a character range
                                                if (/[wsd]/i.test(c)) {
                                                    if (isInRange) {
                                                        warningAt("Unescaped '{a}'.",
                                                            line, from + l, "-");
                                                        isInRange = false;
                                                    }
                                                    isLiteral = false;
                                                } else if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "/":
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l - 1, "/");

                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "<":
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            default:
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                            }
                                        } while (c);
                                        break;
                                    case ".":
                                        if (option.regexp) {
                                            warningAt("Insecure '{a}'.", line,
                                                    from + l, c);
                                        }
                                        break;
                                    case "]":
                                    case "?":
                                    case "{":
                                    case "}":
                                    case "+":
                                    case "*":
                                        warningAt("Unescaped '{a}'.", line,
                                                from + l, c);
                                    }
                                    if (b) {
                                        switch (s.charAt(l)) {
                                        case "?":
                                        case "+":
                                        case "*":
                                            l += 1;
                                            if (s.charAt(l) === "?") {
                                                l += 1;
                                            }
                                            break;
                                        case "{":
                                            l += 1;
                                            c = s.charAt(l);
                                            if (c < "0" || c > "9") {
                                                warningAt(
"Expected a number and instead saw '{a}'.", line, from + l, c);
                                                break; // No reason to continue checking numbers.
                                            }
                                            l += 1;
                                            low = +c;
                                            for (;;) {
                                                c = s.charAt(l);
                                                if (c < "0" || c > "9") {
                                                    break;
                                                }
                                                l += 1;
                                                low = +c + (low * 10);
                                            }
                                            high = low;
                                            if (c === ",") {
                                                l += 1;
                                                high = Infinity;
                                                c = s.charAt(l);
                                                if (c >= "0" && c <= "9") {
                                                    l += 1;
                                                    high = +c;
                                                    for (;;) {
                                                        c = s.charAt(l);
                                                        if (c < "0" || c > "9") {
                                                            break;
                                                        }
                                                        l += 1;
                                                        high = +c + (high * 10);
                                                    }
                                                }
                                            }
                                            if (s.charAt(l) !== "}") {
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, "}", c);
                                            } else {
                                                l += 1;
                                            }
                                            if (s.charAt(l) === "?") {
                                                l += 1;
                                            }
                                            if (low > high) {
                                                warningAt(
"'{a}' should not be greater than '{b}'.", line, from + l, low, high);
                                            }
                                        }
                                    }
                                }
                                c = s.substr(0, l - 1);
                                character += l;
                                s = s.substr(l);
                                return it("(regexp)", c);
                            }
                            return it("(punctuator)", t);

    //      punctuator

                        case "#":
                            return it("(punctuator)", t);
                        default:
                            return it("(punctuator)", t);
                        }
                    }
                }
            }
        };
    }());


    function addlabel(t, type, token) {
        if (t === "hasOwnProperty") {
            warning("'hasOwnProperty' is a really bad name.");
        }

        // Define t in the current function in the current scope.
        if (type === "exception") {
            if (is_own(funct["(context)"], t)) {
                if (funct[t] !== true && !option.node) {
                    warning("Value of '{a}' may be overwritten in IE.", nexttoken, t);
                }
            }
        }

        if (is_own(funct, t) && !funct["(global)"]) {
            if (funct[t] === true) {
                if (option.latedef)
                    warning("'{a}' was used before it was defined.", nexttoken, t);
            } else {
                if (!option.shadow && type !== "exception") {
                    warning("'{a}' is already defined.", nexttoken, t);
                }
            }
        }

        funct[t] = type;

        if (token) {
            funct["(tokens)"][t] = token;
        }

        if (funct["(global)"]) {
            global[t] = funct;
            if (is_own(implied, t)) {
                if (option.latedef)
                    warning("'{a}' was used before it was defined.", nexttoken, t);
                delete implied[t];
            }
        } else {
            scope[t] = funct;
        }
    }


    function doOption() {
        var nt = nexttoken;
        var o  = nt.value;
        var quotmarkValue = option.quotmark;
        var predef = {};
        var b, obj, filter, t, tn, v, minus;

        switch (o) {
        case "*/":
            error("Unbegun comment.");
            break;
        case "/*members":
        case "/*member":
            o = "/*members";
            if (!membersOnly) {
                membersOnly = {};
            }
            obj = membersOnly;
            option.quotmark = false;
            break;
        case "/*jshint":
        case "/*jslint":
            obj = option;
            filter = boolOptions;
            break;
        case "/*global":
            obj = predef;
            break;
        default:
            error("What?");
        }

        t = lex.token();
loop:   for (;;) {
            minus = false;
            for (;;) {
                if (t.type === "special" && t.value === "*/") {
                    break loop;
                }
                if (t.id !== "(endline)" && t.id !== ",") {
                    break;
                }
                t = lex.token();
            }

            if (o === "/*global" && t.value === "-") {
                minus = true;
                t = lex.token();
            }

            if (t.type !== "(string)" && t.type !== "(identifier)" && o !== "/*members") {
                error("Bad option.", t);
            }

            v = lex.token();
            if (v.id === ":") {
                v = lex.token();

                if (obj === membersOnly) {
                    error("Expected '{a}' and instead saw '{b}'.", t, "*/", ":");
                }

                if (o === "/*jshint") {
                    checkOption(t.value, t);
                }

                var numericVals = [
                    "maxstatements",
                    "maxparams",
                    "maxdepth",
                    "maxcomplexity",
                    "maxerr",
                    "maxlen",
                    "indent"
                ];

                if (numericVals.indexOf(t.value) > -1 && (o === "/*jshint" || o === "/*jslint")) {
                    b = +v.value;

                    if (typeof b !== "number" || !isFinite(b) || b <= 0 || Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.", v, v.value);
                    }

                    if (t.value === "indent")
                        obj.white = true;

                    obj[t.value] = b;
                } else if (t.value === "validthis") {
                    if (funct["(global)"]) {
                        error("Option 'validthis' can't be used in a global scope.");
                    } else {
                        if (v.value === "true" || v.value === "false")
                            obj[t.value] = v.value === "true";
                        else
                            error("Bad option value.", v);
                    }
                } else if (t.value === "quotmark" && (o === "/*jshint")) {
                    switch (v.value) {
                    case "true":
                        obj.quotmark = true;
                        break;
                    case "false":
                        obj.quotmark = false;
                        break;
                    case "double":
                    case "single":
                        obj.quotmark = v.value;
                        break;
                    default:
                        error("Bad option value.", v);
                    }
                } else if (v.value === "true" || v.value === "false") {
                    if (o === "/*jslint") {
                        tn = renamedOptions[t.value] || t.value;
                        obj[tn] = v.value === "true";
                        if (invertedOptions[tn] !== undefined) {
                            obj[tn] = !obj[tn];
                        }
                    } else {
                        obj[t.value] = v.value === "true";
                    }

                    if (t.value === "newcap")
                        obj["(explicitNewcap)"] = true;
                } else {
                    error("Bad option value.", v);
                }
                t = lex.token();
            } else {
                if (o === "/*jshint" || o === "/*jslint") {
                    error("Missing option value.", t);
                }

                obj[t.value] = false;

                if (o === "/*global" && minus === true) {
                    JSHINT.blacklist[t.value] = t.value;
                    updatePredefined();
                }

                t = v;
            }
        }

        if (o === "/*members") {
            option.quotmark = quotmarkValue;
        }

        combine(predefined, predef);

        for (var key in predef) {
            if (is_own(predef, key)) {
                declared[key] = nt;
            }
        }

        if (filter) {
            assume();
        }
    }


// We need a peek function. If it has an argument, it peeks that much farther
// ahead. It is used to distinguish
//     for ( var i in ...
// from
//     for ( var i = ...

    function peek(p) {
        var i = p || 0, j = 0, t;

        while (j <= i) {
            t = lookahead[j];
            if (!t) {
                t = lookahead[j] = lex.token();
            }
            j += 1;
        }
        return t;
    }



// Produce the next token. It looks for programming errors.

    function advance(id, t) {
        switch (token.id) {
        case "(number)":
            if (nexttoken.id === ".") {
                warning("A dot following a number can be confused with a decimal point.", token);
            }
            break;
        case "-":
            if (nexttoken.id === "-" || nexttoken.id === "--") {
                warning("Confusing minusses.");
            }
            break;
        case "+":
            if (nexttoken.id === "+" || nexttoken.id === "++") {
                warning("Confusing plusses.");
            }
            break;
        }

        if (token.type === "(string)" || token.identifier) {
            anonname = token.value;
        }

        if (id && nexttoken.id !== id) {
            if (t) {
                if (nexttoken.id === "(end)") {
                    warning("Unmatched '{a}'.", t, t.id);
                } else {
                    warning("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
                            nexttoken, id, t.id, t.line, nexttoken.value);
                }
            } else if (nexttoken.type !== "(identifier)" ||
                            nexttoken.value !== id) {
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, id, nexttoken.value);
            }
        }

        prevtoken = token;
        token = nexttoken;
        for (;;) {
            nexttoken = lookahead.shift() || lex.token();
            if (nexttoken.id === "(end)" || nexttoken.id === "(error)") {
                return;
            }
            if (nexttoken.type === "special") {
                doOption();
            } else {
                if (nexttoken.id !== "(endline)") {
                    break;
                }
            }
        }
    }


// This is the heart of JSHINT, the Pratt parser. In addition to parsing, it
// is looking for ad hoc lint patterns. We add .fud to Pratt's model, which is
// like .nud except that it is only used on the first token of a statement.
// Having .fud makes it much easier to define statement-oriented languages like
// JavaScript. I retained Pratt's nomenclature.

// .nud     Null denotation
// .fud     First null denotation
// .led     Left denotation
//  lbp     Left binding power
//  rbp     Right binding power

// They are elements of the parsing method called Top Down Operator Precedence.

    function expression(rbp, initial) {
        var left, isArray = false, isObject = false;

        if (nexttoken.id === "(end)")
            error("Unexpected early end of program.", token);

        advance();
        if (initial) {
            anonname = "anonymous";
            funct["(verb)"] = token.value;
        }
        if (initial === true && token.fud) {
            left = token.fud();
        } else {
            if (token.nud) {
                left = token.nud();
            } else {
                if (nexttoken.type === "(number)" && token.id === ".") {
                    warning("A leading decimal point can be confused with a dot: '.{a}'.",
                            token, nexttoken.value);
                    advance();
                    return token;
                } else {
                    error("Expected an identifier and instead saw '{a}'.",
                            token, token.id);
                }
            }
            while (rbp < nexttoken.lbp) {
                isArray = token.value === "Array";
                isObject = token.value === "Object";

                // #527, new Foo.Array(), Foo.Array(), new Foo.Object(), Foo.Object()
                // Line breaks in IfStatement heads exist to satisfy the checkJSHint
                // "Line too long." error.
                if (left && (left.value || (left.first && left.first.value))) {
                    // If the left.value is not "new", or the left.first.value is a "."
                    // then safely assume that this is not "new Array()" and possibly
                    // not "new Object()"...
                    if (left.value !== "new" ||
                      (left.first && left.first.value && left.first.value === ".")) {
                        isArray = false;
                        // ...In the case of Object, if the left.value and token.value
                        // are not equal, then safely assume that this not "new Object()"
                        if (left.value !== token.value) {
                            isObject = false;
                        }
                    }
                }

                advance();
                if (isArray && token.id === "(" && nexttoken.id === ")")
                    warning("Use the array literal notation [].", token);
                if (isObject && token.id === "(" && nexttoken.id === ")")
                    warning("Use the object literal notation {}.", token);
                if (token.led) {
                    left = token.led(left);
                } else {
                    error("Expected an operator and instead saw '{a}'.",
                        token, token.id);
                }
            }
        }
        return left;
    }


// Functions for conformance of style.

    function adjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white) {
            if (left.character !== right.from && left.line === right.line) {
                left.from += (left.character - left.from);
                warning("Unexpected space after '{a}'.", left, left.value);
            }
        }
    }

    function nobreak(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && (left.character !== right.from || left.line !== right.line)) {
            warning("Unexpected space before '{a}'.", right, right.value);
        }
    }

    function nospace(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && !left.comment) {
            if (left.line === right.line) {
                adjacent(left, right);
            }
        }
    }

    function nonadjacent(left, right) {
        if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.value === ";" && right.value === ";") {
                return;
            }
            if (left.line === right.line && left.character === right.from) {
                left.from += (left.character - left.from);
                warning("Missing space after '{a}'.",
                        left, left.value);
            }
        }
    }

    function nobreaknonadjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (!option.laxbreak && left.line !== right.line) {
            warning("Bad line breaking before '{a}'.", right, right.id);
        } else if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.character === right.from) {
                left.from += (left.character - left.from);
                warning("Missing space after '{a}'.",
                        left, left.value);
            }
        }
    }

    function indentation(bias) {
        var i;
        if (option.white && nexttoken.id !== "(end)") {
            i = indent + (bias || 0);
            if (nexttoken.from !== i) {
                warning(
"Expected '{a}' to have an indentation at {b} instead at {c}.",
                        nexttoken, nexttoken.value, i, nexttoken.from);
            }
        }
    }

    function nolinebreak(t) {
        t = t || token;
        if (t.line !== nexttoken.line) {
            warning("Line breaking error '{a}'.", t, t.value);
        }
    }


    function comma() {
        if (token.line !== nexttoken.line) {
            if (!option.laxcomma) {
                if (comma.first) {
                    warning("Comma warnings can be turned off with 'laxcomma'");
                    comma.first = false;
                }
                warning("Bad line breaking before '{a}'.", token, nexttoken.id);
            }
        } else if (!token.comment && token.character !== nexttoken.from && option.white) {
            token.from += (token.character - token.from);
            warning("Unexpected space after '{a}'.", token, token.value);
        }
        advance(",");
        nonadjacent(token, nexttoken);
    }


// Functional constructors for making the symbols that will be inherited by
// tokens.

    function symbol(s, p) {
        var x = syntax[s];
        if (!x || typeof x !== "object") {
            syntax[s] = x = {
                id: s,
                lbp: p,
                value: s
            };
        }
        return x;
    }


    function delim(s) {
        return symbol(s, 0);
    }


    function stmt(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        x.fud = f;
        return x;
    }


    function blockstmt(s, f) {
        var x = stmt(s, f);
        x.block = true;
        return x;
    }


    function reserveName(x) {
        var c = x.id.charAt(0);
        if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
            x.identifier = x.reserved = true;
        }
        return x;
    }


    function prefix(s, f) {
        var x = symbol(s, 150);
        reserveName(x);
        x.nud = (typeof f === "function") ? f : function () {
            this.right = expression(150);
            this.arity = "unary";
            if (this.id === "++" || this.id === "--") {
                if (option.plusplus) {
                    warning("Unexpected use of '{a}'.", this, this.id);
                } else if ((!this.right.identifier || this.right.reserved) &&
                        this.right.id !== "." && this.right.id !== "[") {
                    warning("Bad operand.", this);
                }
            }
            return this;
        };
        return x;
    }


    function type(s, f) {
        var x = delim(s);
        x.type = s;
        x.nud = f;
        return x;
    }


    function reserve(s, f) {
        var x = type(s, f);
        x.identifier = x.reserved = true;
        return x;
    }


    function reservevar(s, v) {
        return reserve(s, function () {
            if (typeof v === "function") {
                v(this);
            }
            return this;
        });
    }


    function infix(s, f, p, w) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = function (left) {
            if (!w) {
                nobreaknonadjacent(prevtoken, token);
                nonadjacent(token, nexttoken);
            }
            if (s === "in" && left.id === "!") {
                warning("Confusing use of '{a}'.", left, "!");
            }
            if (typeof f === "function") {
                return f(left, this);
            } else {
                this.left = left;
                this.right = expression(p);
                return this;
            }
        };
        return x;
    }


    function relation(s, f) {
        var x = symbol(s, 100);
        x.led = function (left) {
            nobreaknonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            var right = expression(100);

            if (isIdentifier(left, "NaN") || isIdentifier(right, "NaN")) {
                warning("Use the isNaN function to compare with NaN.", this);
            } else if (f) {
                f.apply(this, [left, right]);
            }
            if (left.id === "!") {
                warning("Confusing use of '{a}'.", left, "!");
            }
            if (right.id === "!") {
                warning("Confusing use of '{a}'.", right, "!");
            }
            this.left = left;
            this.right = right;
            return this;
        };
        return x;
    }


    function isPoorRelation(node) {
        return node &&
              ((node.type === "(number)" && +node.value === 0) ||
               (node.type === "(string)" && node.value === "") ||
               (node.type === "null" && !option.eqnull) ||
                node.type === "true" ||
                node.type === "false" ||
                node.type === "undefined");
    }


    function assignop(s) {
        symbol(s, 20).exps = true;

        return infix(s, function (left, that) {
            that.left = left;

            if (predefined[left.value] === false &&
                    scope[left.value]["(global)"] === true) {
                warning("Read only.", left);
            } else if (left["function"]) {
                warning("'{a}' is a function.", left, left.value);
            }

            if (left) {
                if (option.esnext && funct[left.value] === "const") {
                    warning("Attempting to override '{a}' which is a constant", left, left.value);
                }

                if (left.id === "." || left.id === "[") {
                    if (!left.left || left.left.value === "arguments") {
                        warning("Bad assignment.", that);
                    }
                    that.right = expression(19);
                    return that;
                } else if (left.identifier && !left.reserved) {
                    if (funct[left.value] === "exception") {
                        warning("Do not assign to the exception parameter.", left);
                    }
                    that.right = expression(19);
                    return that;
                }

                if (left === syntax["function"]) {
                    warning(
"Expected an identifier in an assignment and instead saw a function invocation.",
                                token);
                }
            }

            error("Bad assignment.", that);
        }, 20);
    }


    function bitwise(s, f, p) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = (typeof f === "function") ? f : function (left) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", this, this.id);
            }
            this.left = left;
            this.right = expression(p);
            return this;
        };
        return x;
    }


    function bitwiseassignop(s) {
        symbol(s, 20).exps = true;
        return infix(s, function (left, that) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", that, that.id);
            }
            nonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            if (left) {
                if (left.id === "." || left.id === "[" ||
                        (left.identifier && !left.reserved)) {
                    expression(19);
                    return that;
                }
                if (left === syntax["function"]) {
                    warning(
"Expected an identifier in an assignment, and instead saw a function invocation.",
                                token);
                }
                return that;
            }
            error("Bad assignment.", that);
        }, 20);
    }


    function suffix(s) {
        var x = symbol(s, 150);
        x.led = function (left) {
            if (option.plusplus) {
                warning("Unexpected use of '{a}'.", this, this.id);
            } else if ((!left.identifier || left.reserved) &&
                    left.id !== "." && left.id !== "[") {
                warning("Bad operand.", this);
            }
            this.left = left;
            return this;
        };
        return x;
    }


    // fnparam means that this identifier is being defined as a function
    // argument (see identifier())
    function optionalidentifier(fnparam) {
        if (nexttoken.identifier) {
            advance();
            if (token.reserved && !option.es5) {
                // `undefined` as a function param is a common pattern to protect
                // against the case when somebody does `undefined = true` and
                // help with minification. More info: https://gist.github.com/315916
                if (!fnparam || token.value !== "undefined") {
                    warning("Expected an identifier and instead saw '{a}' (a reserved word).",
                            token, token.id);
                }
            }
            return token.value;
        }
    }

    // fnparam means that this identifier is being defined as a function
    // argument
    function identifier(fnparam) {
        var i = optionalidentifier(fnparam);
        if (i) {
            return i;
        }
        if (token.id === "function" && nexttoken.id === "(") {
            warning("Missing name in function declaration.");
        } else {
            error("Expected an identifier and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
        }
    }


    function reachable(s) {
        var i = 0, t;
        if (nexttoken.id !== ";" || noreach) {
            return;
        }
        for (;;) {
            t = peek(i);
            if (t.reach) {
                return;
            }
            if (t.id !== "(endline)") {
                if (t.id === "function") {
                    if (!option.latedef) {
                        break;
                    }
                    warning(
"Inner functions should be listed at the top of the outer function.", t);
                    break;
                }
                warning("Unreachable '{a}' after '{b}'.", t, t.value, s);
                break;
            }
            i += 1;
        }
    }


    function statement(noindent) {
        var i = indent, r, s = scope, t = nexttoken;

        if (t.id === ";") {
            advance(";");
            return;
        }

        // Is this a labelled statement?

        if (t.identifier && !t.reserved && peek().id === ":") {
            advance();
            advance(":");
            scope = Object.create(s);
            addlabel(t.value, "label");

            if (!nexttoken.labelled && nexttoken.value !== "{") {
                warning("Label '{a}' on {b} statement.", nexttoken, t.value, nexttoken.value);
            }

            if (jx.test(t.value + ":")) {
                warning("Label '{a}' looks like a javascript url.", t, t.value);
            }

            nexttoken.label = t.value;
            t = nexttoken;
        }

        // Is it a lonely block?

        if (t.id === "{") {
            block(true, true);
            return;
        }

        // Parse the statement.

        if (!noindent) {
            indentation();
        }
        r = expression(0, true);

        // Look for the final semicolon.

        if (!t.block) {
            if (!option.expr && (!r || !r.exps)) {
                warning("Expected an assignment or function call and instead saw an expression.",
                    token);
            } else if (option.nonew && r.id === "(" && r.left.id === "new") {
                warning("Do not use 'new' for side effects.", t);
            }

            if (nexttoken.id === ",") {
                return comma();
            }

            if (nexttoken.id !== ";") {
                if (!option.asi) {
                    // If this is the last statement in a block that ends on
                    // the same line *and* option lastsemic is on, ignore the warning.
                    // Otherwise, complain about missing semicolon.
                    if (!option.lastsemic || nexttoken.id !== "}" ||
                            nexttoken.line !== token.line) {
                        warningAt("Missing semicolon.", token.line, token.character);
                    }
                }
            } else {
                adjacent(token, nexttoken);
                advance(";");
                nonadjacent(token, nexttoken);
            }
        }

// Restore the indentation.

        indent = i;
        scope = s;
        return r;
    }


    function statements(startLine) {
        var a = [], p;

        while (!nexttoken.reach && nexttoken.id !== "(end)") {
            if (nexttoken.id === ";") {
                p = peek();
                if (!p || p.id !== "(") {
                    warning("Unnecessary semicolon.");
                }
                advance(";");
            } else {
                a.push(statement(startLine === nexttoken.line));
            }
        }
        return a;
    }


    /*
     * read all directives
     * recognizes a simple form of asi, but always
     * warns, if it is used
     */
    function directives() {
        var i, p, pn;

        for (;;) {
            if (nexttoken.id === "(string)") {
                p = peek(0);
                if (p.id === "(endline)") {
                    i = 1;
                    do {
                        pn = peek(i);
                        i = i + 1;
                    } while (pn.id === "(endline)");

                    if (pn.id !== ";") {
                        if (pn.id !== "(string)" && pn.id !== "(number)" &&
                            pn.id !== "(regexp)" && pn.identifier !== true &&
                            pn.id !== "}") {
                            break;
                        }
                        warning("Missing semicolon.", nexttoken);
                    } else {
                        p = pn;
                    }
                } else if (p.id === "}") {
                    // directive with no other statements, warn about missing semicolon
                    warning("Missing semicolon.", p);
                } else if (p.id !== ";") {
                    break;
                }

                indentation();
                advance();
                if (directive[token.value]) {
                    warning("Unnecessary directive \"{a}\".", token, token.value);
                }

                if (token.value === "use strict") {
                    if (!option["(explicitNewcap)"])
                        option.newcap = true;
                    option.undef = true;
                }

                // there's no directive negation, so always set to true
                directive[token.value] = true;

                if (p.id === ";") {
                    advance(";");
                }
                continue;
            }
            break;
        }
    }


    /*
     * Parses a single block. A block is a sequence of statements wrapped in
     * braces.
     *
     * ordinary - true for everything but function bodies and try blocks.
     * stmt     - true if block can be a single statement (e.g. in if/for/while).
     * isfunc   - true if block is a function body
     */
    function block(ordinary, stmt, isfunc) {
        var a,
            b = inblock,
            old_indent = indent,
            m,
            s = scope,
            t,
            line,
            d;

        inblock = ordinary;

        if (!ordinary || !option.funcscope)
            scope = Object.create(scope);

        nonadjacent(token, nexttoken);
        t = nexttoken;

        var metrics = funct["(metrics)"];
        metrics.nestedBlockDepth += 1;
        metrics.verifyMaxNestedBlockDepthPerFunction();

        if (nexttoken.id === "{") {
            advance("{");
            line = token.line;
            if (nexttoken.id !== "}") {
                indent += option.indent;
                while (!ordinary && nexttoken.from > indent) {
                    indent += option.indent;
                }

                if (isfunc) {
                    m = {};
                    for (d in directive) {
                        if (is_own(directive, d)) {
                            m[d] = directive[d];
                        }
                    }
                    directives();

                    if (option.strict && funct["(context)"]["(global)"]) {
                        if (!m["use strict"] && !directive["use strict"]) {
                            warning("Missing \"use strict\" statement.");
                        }
                    }
                }

                a = statements(line);

                metrics.statementCount += a.length;

                if (isfunc) {
                    directive = m;
                }

                indent -= option.indent;
                if (line !== nexttoken.line) {
                    indentation();
                }
            } else if (line !== nexttoken.line) {
                indentation();
            }
            advance("}", t);
            indent = old_indent;
        } else if (!ordinary) {
            error("Expected '{a}' and instead saw '{b}'.",
                  nexttoken, "{", nexttoken.value);
        } else {
            if (!stmt || option.curly)
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, "{", nexttoken.value);

            noreach = true;
            indent += option.indent;
            // test indentation only if statement is in new line
            a = [statement(nexttoken.line === token.line)];
            indent -= option.indent;
            noreach = false;
        }
        funct["(verb)"] = null;
        if (!ordinary || !option.funcscope) scope = s;
        inblock = b;
        if (ordinary && option.noempty && (!a || a.length === 0)) {
            warning("Empty block.");
        }
        metrics.nestedBlockDepth -= 1;
        return a;
    }


    function countMember(m) {
        if (membersOnly && typeof membersOnly[m] !== "boolean") {
            warning("Unexpected /*member '{a}'.", token, m);
        }
        if (typeof member[m] === "number") {
            member[m] += 1;
        } else {
            member[m] = 1;
        }
    }


    function note_implied(token) {
        var name = token.value, line = token.line, a = implied[name];
        if (typeof a === "function") {
            a = false;
        }

        if (!a) {
            a = [line];
            implied[name] = a;
        } else if (a[a.length - 1] !== line) {
            a.push(line);
        }
    }


    // Build the syntax table by declaring the syntactic elements of the language.

    type("(number)", function () {
        return this;
    });

    type("(string)", function () {
        return this;
    });

    syntax["(identifier)"] = {
        type: "(identifier)",
        lbp: 0,
        identifier: true,
        nud: function () {
            var v = this.value,
                s = scope[v],
                f;

            if (typeof s === "function") {
                // Protection against accidental inheritance.
                s = undefined;
            } else if (typeof s === "boolean") {
                f = funct;
                funct = functions[0];
                addlabel(v, "var");
                s = funct;
                funct = f;
            }

            // The name is in scope and defined in the current function.
            if (funct === s) {
                // Change 'unused' to 'var', and reject labels.
                switch (funct[v]) {
                case "unused":
                    funct[v] = "var";
                    break;
                case "unction":
                    funct[v] = "function";
                    this["function"] = true;
                    break;
                case "function":
                    this["function"] = true;
                    break;
                case "label":
                    warning("'{a}' is a statement label.", token, v);
                    break;
                }
            } else if (funct["(global)"]) {
                // The name is not defined in the function.  If we are in the global
                // scope, then we have an undefined variable.
                //
                // Operators typeof and delete do not raise runtime errors even if
                // the base object of a reference is null so no need to display warning
                // if we're inside of typeof or delete.

                if (option.undef && typeof predefined[v] !== "boolean") {
                    // Attempting to subscript a null reference will throw an
                    // error, even within the typeof and delete operators
                    if (!(anonname === "typeof" || anonname === "delete") ||
                        (nexttoken && (nexttoken.value === "." || nexttoken.value === "["))) {

                        isundef(funct, "'{a}' is not defined.", token, v);
                    }
                }

                note_implied(token);
            } else {
                // If the name is already defined in the current
                // function, but not as outer, then there is a scope error.

                switch (funct[v]) {
                case "closure":
                case "function":
                case "var":
                case "unused":
                    warning("'{a}' used out of scope.", token, v);
                    break;
                case "label":
                    warning("'{a}' is a statement label.", token, v);
                    break;
                case "outer":
                case "global":
                    break;
                default:
                    // If the name is defined in an outer function, make an outer entry,
                    // and if it was unused, make it var.
                    if (s === true) {
                        funct[v] = true;
                    } else if (s === null) {
                        warning("'{a}' is not allowed.", token, v);
                        note_implied(token);
                    } else if (typeof s !== "object") {
                        // Operators typeof and delete do not raise runtime errors even
                        // if the base object of a reference is null so no need to
                        // display warning if we're inside of typeof or delete.
                        if (option.undef) {
                            // Attempting to subscript a null reference will throw an
                            // error, even within the typeof and delete operators
                            if (!(anonname === "typeof" || anonname === "delete") ||
                                (nexttoken &&
                                    (nexttoken.value === "." || nexttoken.value === "["))) {

                                isundef(funct, "'{a}' is not defined.", token, v);
                            }
                        }
                        funct[v] = true;
                        note_implied(token);
                    } else {
                        switch (s[v]) {
                        case "function":
                        case "unction":
                            this["function"] = true;
                            s[v] = "closure";
                            funct[v] = s["(global)"] ? "global" : "outer";
                            break;
                        case "var":
                        case "unused":
                            s[v] = "closure";
                            funct[v] = s["(global)"] ? "global" : "outer";
                            break;
                        case "closure":
                            funct[v] = s["(global)"] ? "global" : "outer";
                            break;
                        case "label":
                            warning("'{a}' is a statement label.", token, v);
                        }
                    }
                }
            }
            return this;
        },
        led: function () {
            error("Expected an operator and instead saw '{a}'.",
                nexttoken, nexttoken.value);
        }
    };

    type("(regexp)", function () {
        return this;
    });


// ECMAScript parser

    delim("(endline)");
    delim("(begin)");
    delim("(end)").reach = true;
    delim("</").reach = true;
    delim("<!");
    delim("<!--");
    delim("-->");
    delim("(error)").reach = true;
    delim("}").reach = true;
    delim(")");
    delim("]");
    delim("\"").reach = true;
    delim("'").reach = true;
    delim(";");
    delim(":").reach = true;
    delim(",");
    delim("#");
    delim("@");
    reserve("else");
    reserve("case").reach = true;
    reserve("catch");
    reserve("default").reach = true;
    reserve("finally");
    reservevar("arguments", function (x) {
        if (directive["use strict"] && funct["(global)"]) {
            warning("Strict violation.", x);
        }
    });
    reservevar("eval");
    reservevar("false");
    reservevar("Infinity");
    reservevar("null");
    reservevar("this", function (x) {
        if (directive["use strict"] && !option.validthis && ((funct["(statement)"] &&
                funct["(name)"].charAt(0) > "Z") || funct["(global)"])) {
            warning("Possible strict violation.", x);
        }
    });
    reservevar("true");
    reservevar("undefined");
    assignop("=", "assign", 20);
    assignop("+=", "assignadd", 20);
    assignop("-=", "assignsub", 20);
    assignop("*=", "assignmult", 20);
    assignop("/=", "assigndiv", 20).nud = function () {
        error("A regular expression literal can be confused with '/='.");
    };
    assignop("%=", "assignmod", 20);
    bitwiseassignop("&=", "assignbitand", 20);
    bitwiseassignop("|=", "assignbitor", 20);
    bitwiseassignop("^=", "assignbitxor", 20);
    bitwiseassignop("<<=", "assignshiftleft", 20);
    bitwiseassignop(">>=", "assignshiftright", 20);
    bitwiseassignop(">>>=", "assignshiftrightunsigned", 20);
    infix("?", function (left, that) {
        that.left = left;
        that.right = expression(10);
        advance(":");
        that["else"] = expression(10);
        return that;
    }, 30);

    infix("||", "or", 40);
    infix("&&", "and", 50);
    bitwise("|", "bitor", 70);
    bitwise("^", "bitxor", 80);
    bitwise("&", "bitand", 90);
    relation("==", function (left, right) {
        var eqnull = option.eqnull && (left.value === "null" || right.value === "null");

        if (!eqnull && option.eqeqeq)
            warning("Expected '{a}' and instead saw '{b}'.", this, "===", "==");
        else if (isPoorRelation(left))
            warning("Use '{a}' to compare with '{b}'.", this, "===", left.value);
        else if (isPoorRelation(right))
            warning("Use '{a}' to compare with '{b}'.", this, "===", right.value);

        return this;
    });
    relation("===");
    relation("!=", function (left, right) {
        var eqnull = option.eqnull &&
                (left.value === "null" || right.value === "null");

        if (!eqnull && option.eqeqeq) {
            warning("Expected '{a}' and instead saw '{b}'.",
                    this, "!==", "!=");
        } else if (isPoorRelation(left)) {
            warning("Use '{a}' to compare with '{b}'.",
                    this, "!==", left.value);
        } else if (isPoorRelation(right)) {
            warning("Use '{a}' to compare with '{b}'.",
                    this, "!==", right.value);
        }
        return this;
    });
    relation("!==");
    relation("<");
    relation(">");
    relation("<=");
    relation(">=");
    bitwise("<<", "shiftleft", 120);
    bitwise(">>", "shiftright", 120);
    bitwise(">>>", "shiftrightunsigned", 120);
    infix("in", "in", 120);
    infix("instanceof", "instanceof", 120);
    infix("+", function (left, that) {
        var right = expression(130);
        if (left && right && left.id === "(string)" && right.id === "(string)") {
            left.value += right.value;
            left.character = right.character;
            if (!option.scripturl && jx.test(left.value)) {
                warning("JavaScript URL.", left);
            }
            return left;
        }
        that.left = left;
        that.right = right;
        return that;
    }, 130);
    prefix("+", "num");
    prefix("+++", function () {
        warning("Confusing pluses.");
        this.right = expression(150);
        this.arity = "unary";
        return this;
    });
    infix("+++", function (left) {
        warning("Confusing pluses.");
        this.left = left;
        this.right = expression(130);
        return this;
    }, 130);
    infix("-", "sub", 130);
    prefix("-", "neg");
    prefix("---", function () {
        warning("Confusing minuses.");
        this.right = expression(150);
        this.arity = "unary";
        return this;
    });
    infix("---", function (left) {
        warning("Confusing minuses.");
        this.left = left;
        this.right = expression(130);
        return this;
    }, 130);
    infix("*", "mult", 140);
    infix("/", "div", 140);
    infix("%", "mod", 140);

    suffix("++", "postinc");
    prefix("++", "preinc");
    syntax["++"].exps = true;

    suffix("--", "postdec");
    prefix("--", "predec");
    syntax["--"].exps = true;
    prefix("delete", function () {
        var p = expression(0);
        if (!p || (p.id !== "." && p.id !== "[")) {
            warning("Variables should not be deleted.");
        }
        this.first = p;
        return this;
    }).exps = true;

    prefix("~", function () {
        if (option.bitwise) {
            warning("Unexpected '{a}'.", this, "~");
        }
        expression(150);
        return this;
    });

    prefix("!", function () {
        this.right = expression(150);
        this.arity = "unary";
        if (bang[this.right.id] === true) {
            warning("Confusing use of '{a}'.", this, "!");
        }
        return this;
    });
    prefix("typeof", "typeof");
    prefix("new", function () {
        var c = expression(155), i;
        if (c && c.id !== "function") {
            if (c.identifier) {
                c["new"] = true;
                switch (c.value) {
                case "Number":
                case "String":
                case "Boolean":
                case "Math":
                case "JSON":
                    warning("Do not use {a} as a constructor.", prevtoken, c.value);
                    break;
                case "Function":
                    if (!option.evil) {
                        warning("The Function constructor is eval.");
                    }
                    break;
                case "Date":
                case "RegExp":
                    break;
                default:
                    if (c.id !== "function") {
                        i = c.value.substr(0, 1);
                        if (option.newcap && (i < "A" || i > "Z") && !is_own(global, c.value)) {
                            warning("A constructor name should start with an uppercase letter.",
                                token);
                        }
                    }
                }
            } else {
                if (c.id !== "." && c.id !== "[" && c.id !== "(") {
                    warning("Bad constructor.", token);
                }
            }
        } else {
            if (!option.supernew)
                warning("Weird construction. Delete 'new'.", this);
        }
        adjacent(token, nexttoken);
        if (nexttoken.id !== "(" && !option.supernew) {
            warning("Missing '()' invoking a constructor.",
                token, token.value);
        }
        this.first = c;
        return this;
    });
    syntax["new"].exps = true;

    prefix("void").exps = true;

    infix(".", function (left, that) {
        adjacent(prevtoken, token);
        nobreak();
        var m = identifier();
        if (typeof m === "string") {
            countMember(m);
        }
        that.left = left;
        that.right = m;
        if (left && left.value === "arguments" && (m === "callee" || m === "caller")) {
            if (option.noarg)
                warning("Avoid arguments.{a}.", left, m);
            else if (directive["use strict"])
                error("Strict violation.");
        } else if (!option.evil && left && left.value === "document" &&
                (m === "write" || m === "writeln")) {
            warning("document.write can be a form of eval.", left);
        }
        if (!option.evil && (m === "eval" || m === "execScript")) {
            warning("eval is evil.");
        }
        return that;
    }, 160, true);

    infix("(", function (left, that) {
        if (prevtoken.id !== "}" && prevtoken.id !== ")") {
            nobreak(prevtoken, token);
        }
        nospace();
        if (option.immed && !left.immed && left.id === "function") {
            warning("Wrap an immediate function invocation in parentheses " +
                "to assist the reader in understanding that the expression " +
                "is the result of a function, and not the function itself.");
        }
        var n = 0,
            p = [];
        if (left) {
            if (left.type === "(identifier)") {
                if (left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
                    if ("Number String Boolean Date Object".indexOf(left.value) === -1) {
                        if (left.value === "Math") {
                            warning("Math is not a function.", left);
                        } else if (option.newcap) {
                            warning("Missing 'new' prefix when invoking a constructor.", left);
                        }
                    }
                }
            }
        }
        if (nexttoken.id !== ")") {
            for (;;) {
                p[p.length] = expression(10);
                n += 1;
                if (nexttoken.id !== ",") {
                    break;
                }
                comma();
            }
        }
        advance(")");
        nospace(prevtoken, token);
        if (typeof left === "object") {
            if (left.value === "parseInt" && n === 1) {
                warning("Missing radix parameter.", token);
            }
            if (!option.evil) {
                if (left.value === "eval" || left.value === "Function" ||
                        left.value === "execScript") {
                    warning("eval is evil.", left);

                    if (p[0] && [0].id === "(string)") {
                        addInternalSrc(left, p[0].value);
                    }
                } else if (p[0] && p[0].id === "(string)" &&
                       (left.value === "setTimeout" ||
                        left.value === "setInterval")) {
                    warning(
    "Implied eval is evil. Pass a function instead of a string.", left);
                    addInternalSrc(left, p[0].value);

                // window.setTimeout/setInterval
                } else if (p[0] && p[0].id === "(string)" &&
                       left.value === "." &&
                       left.left.value === "window" &&
                       (left.right === "setTimeout" ||
                        left.right === "setInterval")) {
                    warning(
    "Implied eval is evil. Pass a function instead of a string.", left);
                    addInternalSrc(left, p[0].value);
                }
            }
            if (!left.identifier && left.id !== "." && left.id !== "[" &&
                    left.id !== "(" && left.id !== "&&" && left.id !== "||" &&
                    left.id !== "?") {
                warning("Bad invocation.", left);
            }
        }
        that.left = left;
        return that;
    }, 155, true).exps = true;

    prefix("(", function () {
        nospace();
        if (nexttoken.id === "function") {
            nexttoken.immed = true;
        }
        var v = expression(0);
        advance(")", this);
        nospace(prevtoken, token);
        if (option.immed && v.id === "function") {
            if (nexttoken.id !== "(" &&
              (nexttoken.id !== "." || (peek().value !== "call" && peek().value !== "apply"))) {
                warning(
"Do not wrap function literals in parens unless they are to be immediately invoked.",
                        this);
            }
        }

        return v;
    });

    infix("[", function (left, that) {
        nobreak(prevtoken, token);
        nospace();
        var e = expression(0), s;
        if (e && e.type === "(string)") {
            if (!option.evil && (e.value === "eval" || e.value === "execScript")) {
                warning("eval is evil.", that);
            }
            countMember(e.value);
            if (!option.sub && ix.test(e.value)) {
                s = syntax[e.value];
                if (!s || !s.reserved) {
                    warning("['{a}'] is better written in dot notation.",
                            prevtoken, e.value);
                }
            }
        }
        advance("]", that);
        nospace(prevtoken, token);
        that.left = left;
        that.right = e;
        return that;
    }, 160, true);

    prefix("[", function () {
        var b = token.line !== nexttoken.line;
        this.first = [];
        if (b) {
            indent += option.indent;
            if (nexttoken.from === indent + option.indent) {
                indent += option.indent;
            }
        }
        while (nexttoken.id !== "(end)") {
            while (nexttoken.id === ",") {
                if (!option.es5)
                    warning("Extra comma.");
                advance(",");
            }
            if (nexttoken.id === "]") {
                break;
            }
            if (b && token.line !== nexttoken.line) {
                indentation();
            }
            this.first.push(expression(10));
            if (nexttoken.id === ",") {
                comma();
                if (nexttoken.id === "]" && !option.es5) {
                    warning("Extra comma.", token);
                    break;
                }
            } else {
                break;
            }
        }
        if (b) {
            indent -= option.indent;
            indentation();
        }
        advance("]", this);
        return this;
    }, 160);


    function property_name() {
        var id = optionalidentifier(true);
        if (!id) {
            if (nexttoken.id === "(string)") {
                id = nexttoken.value;
                advance();
            } else if (nexttoken.id === "(number)") {
                id = nexttoken.value.toString();
                advance();
            }
        }
        return id;
    }


    function functionparams() {
        var next   = nexttoken;
        var params = [];
        var ident;

        advance("(");
        nospace();

        if (nexttoken.id === ")") {
            advance(")");
            return;
        }

        for (;;) {
            ident = identifier(true);
            params.push(ident);
            addlabel(ident, "unused", token);
            if (nexttoken.id === ",") {
                comma();
            } else {
                advance(")", next);
                nospace(prevtoken, token);
                return params;
            }
        }
    }


    function doFunction(name, statement) {
        var f;
        var oldOption = option;
        var oldScope  = scope;

        option = Object.create(option);
        scope  = Object.create(scope);

        funct = {
            "(name)"     : name || "\"" + anonname + "\"",
            "(line)"     : nexttoken.line,
            "(character)": nexttoken.character,
            "(context)"  : funct,
            "(breakage)" : 0,
            "(loopage)"  : 0,
            "(metrics)"  : createMetrics(nexttoken),
            "(scope)"    : scope,
            "(statement)": statement,
            "(tokens)"   : {}
        };

        f = funct;
        token.funct = funct;

        functions.push(funct);

        if (name) {
            addlabel(name, "function");
        }

        funct["(params)"] = functionparams();
        funct["(metrics)"].verifyMaxParametersPerFunction(funct["(params)"]);

        block(false, false, true);

        funct["(metrics)"].verifyMaxStatementsPerFunction();
        funct["(metrics)"].verifyMaxComplexityPerFunction();

        scope = oldScope;
        option = oldOption;
        funct["(last)"] = token.line;
        funct["(lastcharacter)"] = token.character;
        funct = funct["(context)"];

        return f;
    }

    function createMetrics(functionStartToken) {
        return {
            statementCount: 0,
            nestedBlockDepth: -1,
            ComplexityCount: 1,
            verifyMaxStatementsPerFunction: function () {
                if (option.maxstatements &&
                    this.statementCount > option.maxstatements) {
                    var message = "Too many statements per function (" + this.statementCount + ").";
                    warning(message, functionStartToken);
                }
            },

            verifyMaxParametersPerFunction: function (params) {
                params = params || [];

                if (option.maxparams && params.length > option.maxparams) {
                    var message = "Too many parameters per function (" + params.length + ").";
                    warning(message, functionStartToken);
                }
            },

            verifyMaxNestedBlockDepthPerFunction: function () {
                if (option.maxdepth &&
                    this.nestedBlockDepth > 0 &&
                    this.nestedBlockDepth === option.maxdepth + 1) {
                    var message = "Blocks are nested too deeply (" + this.nestedBlockDepth + ").";
                    warning(message);
                }
            },

            verifyMaxComplexityPerFunction: function () {
                var max = option.maxcomplexity;
                var cc = this.ComplexityCount;
                if (max && cc > max) {
                    var message = "Cyclomatic complexity is too high per function (" + cc + ").";
                    warning(message, functionStartToken);
                }
            }
        };
    }

    function increaseComplexityCount() {
        funct["(metrics)"].ComplexityCount += 1;
    }


    (function (x) {
        x.nud = function () {
            var b, f, i, p, t;
            var props = {}; // All properties, including accessors

            function saveProperty(name, token) {
                if (props[name] && is_own(props, name))
                    warning("Duplicate member '{a}'.", nexttoken, i);
                else
                    props[name] = {};

                props[name].basic = true;
                props[name].basicToken = token;
            }

            function saveSetter(name, token) {
                if (props[name] && is_own(props, name)) {
                    if (props[name].basic || props[name].setter)
                        warning("Duplicate member '{a}'.", nexttoken, i);
                } else {
                    props[name] = {};
                }

                props[name].setter = true;
                props[name].setterToken = token;
            }

            function saveGetter(name) {
                if (props[name] && is_own(props, name)) {
                    if (props[name].basic || props[name].getter)
                        warning("Duplicate member '{a}'.", nexttoken, i);
                } else {
                    props[name] = {};
                }

                props[name].getter = true;
                props[name].getterToken = token;
            }

            b = token.line !== nexttoken.line;
            if (b) {
                indent += option.indent;
                if (nexttoken.from === indent + option.indent) {
                    indent += option.indent;
                }
            }
            for (;;) {
                if (nexttoken.id === "}") {
                    break;
                }
                if (b) {
                    indentation();
                }
                if (nexttoken.value === "get" && peek().id !== ":") {
                    advance("get");
                    if (!option.es5) {
                        error("get/set are ES5 features.");
                    }
                    i = property_name();
                    if (!i) {
                        error("Missing property name.");
                    }
                    saveGetter(i);
                    t = nexttoken;
                    adjacent(token, nexttoken);
                    f = doFunction();
                    p = f["(params)"];
                    if (p) {
                        warning("Unexpected parameter '{a}' in get {b} function.", t, p[0], i);
                    }
                    adjacent(token, nexttoken);
                } else if (nexttoken.value === "set" && peek().id !== ":") {
                    advance("set");
                    if (!option.es5) {
                        error("get/set are ES5 features.");
                    }
                    i = property_name();
                    if (!i) {
                        error("Missing property name.");
                    }
                    saveSetter(i, nexttoken);
                    t = nexttoken;
                    adjacent(token, nexttoken);
                    f = doFunction();
                    p = f["(params)"];
                    if (!p || p.length !== 1) {
                        warning("Expected a single parameter in set {a} function.", t, i);
                    }
                } else {
                    i = property_name();
                    saveProperty(i, nexttoken);
                    if (typeof i !== "string") {
                        break;
                    }
                    advance(":");
                    nonadjacent(token, nexttoken);
                    expression(10);
                }

                countMember(i);
                if (nexttoken.id === ",") {
                    comma();
                    if (nexttoken.id === ",") {
                        warning("Extra comma.", token);
                    } else if (nexttoken.id === "}" && !option.es5) {
                        warning("Extra comma.", token);
                    }
                } else {
                    break;
                }
            }
            if (b) {
                indent -= option.indent;
                indentation();
            }
            advance("}", this);

            // Check for lonely setters if in the ES5 mode.
            if (option.es5) {
                for (var name in props) {
                    if (is_own(props, name) && props[name].setter && !props[name].getter) {
                        warning("Setter is defined without getter.", props[name].setterToken);
                    }
                }
            }
            return this;
        };
        x.fud = function () {
            error("Expected to see a statement and instead saw a block.", token);
        };
    }(delim("{")));

// This Function is called when esnext option is set to true
// it adds the `const` statement to JSHINT

    useESNextSyntax = function () {
        var conststatement = stmt("const", function (prefix) {
            var id, name, value;

            this.first = [];
            for (;;) {
                nonadjacent(token, nexttoken);
                id = identifier();
                if (funct[id] === "const") {
                    warning("const '" + id + "' has already been declared");
                }
                if (funct["(global)"] && predefined[id] === false) {
                    warning("Redefinition of '{a}'.", token, id);
                }
                addlabel(id, "const");
                if (prefix) {
                    break;
                }
                name = token;
                this.first.push(token);

                if (nexttoken.id !== "=") {
                    warning("const " +
                      "'{a}' is initialized to 'undefined'.", token, id);
                }

                if (nexttoken.id === "=") {
                    nonadjacent(token, nexttoken);
                    advance("=");
                    nonadjacent(token, nexttoken);
                    if (nexttoken.id === "undefined") {
                        warning("It is not necessary to initialize " +
                          "'{a}' to 'undefined'.", token, id);
                    }
                    if (peek(0).id === "=" && nexttoken.identifier) {
                        error("Constant {a} was not declared correctly.",
                                nexttoken, nexttoken.value);
                    }
                    value = expression(0);
                    name.first = value;
                }

                if (nexttoken.id !== ",") {
                    break;
                }
                comma();
            }
            return this;
        });
        conststatement.exps = true;
    };

    var varstatement = stmt("var", function (prefix) {
        // JavaScript does not have block scope. It only has function scope. So,
        // declaring a variable in a block can have unexpected consequences.
        var id, name, value;

        if (funct["(onevar)"] && option.onevar) {
            warning("Too many var statements.");
        } else if (!funct["(global)"]) {
            funct["(onevar)"] = true;
        }

        this.first = [];

        for (;;) {
            nonadjacent(token, nexttoken);
            id = identifier();

            if (option.esnext && funct[id] === "const") {
                warning("const '" + id + "' has already been declared");
            }

            if (funct["(global)"] && predefined[id] === false) {
                warning("Redefinition of '{a}'.", token, id);
            }

            addlabel(id, "unused", token);

            if (prefix) {
                break;
            }

            name = token;
            this.first.push(token);

            if (nexttoken.id === "=") {
                nonadjacent(token, nexttoken);
                advance("=");
                nonadjacent(token, nexttoken);
                if (nexttoken.id === "undefined") {
                    warning("It is not necessary to initialize '{a}' to 'undefined'.", token, id);
                }
                if (peek(0).id === "=" && nexttoken.identifier) {
                    error("Variable {a} was not declared correctly.",
                            nexttoken, nexttoken.value);
                }
                value = expression(0);
                name.first = value;
            }
            if (nexttoken.id !== ",") {
                break;
            }
            comma();
        }
        return this;
    });
    varstatement.exps = true;

    blockstmt("function", function () {
        if (inblock) {
            warning("Function declarations should not be placed in blocks. " +
                "Use a function expression or move the statement to the top of " +
                "the outer function.", token);

        }
        var i = identifier();
        if (option.esnext && funct[i] === "const") {
            warning("const '" + i + "' has already been declared");
        }
        adjacent(token, nexttoken);
        addlabel(i, "unction", token);

        doFunction(i, { statement: true });
        if (nexttoken.id === "(" && nexttoken.line === token.line) {
            error(
"Function declarations are not invocable. Wrap the whole function invocation in parens.");
        }
        return this;
    });

    prefix("function", function () {
        var i = optionalidentifier();
        if (i) {
            adjacent(token, nexttoken);
        } else {
            nonadjacent(token, nexttoken);
        }
        doFunction(i);
        if (!option.loopfunc && funct["(loopage)"]) {
            warning("Don't make functions within a loop.");
        }
        return this;
    });

    blockstmt("if", function () {
        var t = nexttoken;
        increaseComplexityCount();
        advance("(");
        nonadjacent(this, t);
        nospace();
        expression(20);
        if (nexttoken.id === "=") {
            if (!option.boss)
                warning("Expected a conditional expression and instead saw an assignment.");
            advance("=");
            expression(20);
        }
        advance(")", t);
        nospace(prevtoken, token);
        block(true, true);
        if (nexttoken.id === "else") {
            nonadjacent(token, nexttoken);
            advance("else");
            if (nexttoken.id === "if" || nexttoken.id === "switch") {
                statement(true);
            } else {
                block(true, true);
            }
        }
        return this;
    });

    blockstmt("try", function () {
        var b;

        function doCatch() {
            var oldScope = scope;
            var e;

            advance("catch");
            nonadjacent(token, nexttoken);
            advance("(");

            scope = Object.create(oldScope);

            e = nexttoken.value;
            if (nexttoken.type !== "(identifier)") {
                e = null;
                warning("Expected an identifier and instead saw '{a}'.", nexttoken, e);
            }

            advance();
            advance(")");

            funct = {
                "(name)"     : "(catch)",
                "(line)"     : nexttoken.line,
                "(character)": nexttoken.character,
                "(context)"  : funct,
                "(breakage)" : funct["(breakage)"],
                "(loopage)"  : funct["(loopage)"],
                "(scope)"    : scope,
                "(statement)": false,
                "(metrics)"  : createMetrics(nexttoken),
                "(catch)"    : true,
                "(tokens)"   : {}
            };

            if (e) {
                addlabel(e, "exception");
            }

            token.funct = funct;
            functions.push(funct);

            block(false);

            scope = oldScope;

            funct["(last)"] = token.line;
            funct["(lastcharacter)"] = token.character;
            funct = funct["(context)"];
        }

        block(false);

        if (nexttoken.id === "catch") {
            increaseComplexityCount();
            doCatch();
            b = true;
        }

        if (nexttoken.id === "finally") {
            advance("finally");
            block(false);
            return;
        } else if (!b) {
            error("Expected '{a}' and instead saw '{b}'.",
                    nexttoken, "catch", nexttoken.value);
        }

        return this;
    });

    blockstmt("while", function () {
        var t = nexttoken;
        funct["(breakage)"] += 1;
        funct["(loopage)"] += 1;
        increaseComplexityCount();
        advance("(");
        nonadjacent(this, t);
        nospace();
        expression(20);
        if (nexttoken.id === "=") {
            if (!option.boss)
                warning("Expected a conditional expression and instead saw an assignment.");
            advance("=");
            expression(20);
        }
        advance(")", t);
        nospace(prevtoken, token);
        block(true, true);
        funct["(breakage)"] -= 1;
        funct["(loopage)"] -= 1;
        return this;
    }).labelled = true;

    blockstmt("with", function () {
        var t = nexttoken;
        if (directive["use strict"]) {
            error("'with' is not allowed in strict mode.", token);
        } else if (!option.withstmt) {
            warning("Don't use 'with'.", token);
        }

        advance("(");
        nonadjacent(this, t);
        nospace();
        expression(0);
        advance(")", t);
        nospace(prevtoken, token);
        block(true, true);

        return this;
    });

    blockstmt("switch", function () {
        var t = nexttoken,
            g = false;
        funct["(breakage)"] += 1;
        advance("(");
        nonadjacent(this, t);
        nospace();
        this.condition = expression(20);
        advance(")", t);
        nospace(prevtoken, token);
        nonadjacent(token, nexttoken);
        t = nexttoken;
        advance("{");
        nonadjacent(token, nexttoken);
        indent += option.indent;
        this.cases = [];
        for (;;) {
            switch (nexttoken.id) {
            case "case":
                switch (funct["(verb)"]) {
                case "break":
                case "case":
                case "continue":
                case "return":
                case "switch":
                case "throw":
                    break;
                default:
                    // You can tell JSHint that you don't use break intentionally by
                    // adding a comment /* falls through */ on a line just before
                    // the next `case`.
                    if (!ft.test(lines[nexttoken.line - 2])) {
                        warning(
                            "Expected a 'break' statement before 'case'.",
                            token);
                    }
                }
                indentation(-option.indent);
                advance("case");
                this.cases.push(expression(20));
                increaseComplexityCount();
                g = true;
                advance(":");
                funct["(verb)"] = "case";
                break;
            case "default":
                switch (funct["(verb)"]) {
                case "break":
                case "continue":
                case "return":
                case "throw":
                    break;
                default:
                    if (!ft.test(lines[nexttoken.line - 2])) {
                        warning(
                            "Expected a 'break' statement before 'default'.",
                            token);
                    }
                }
                indentation(-option.indent);
                advance("default");
                g = true;
                advance(":");
                break;
            case "}":
                indent -= option.indent;
                indentation();
                advance("}", t);
                if (this.cases.length === 1 || this.condition.id === "true" ||
                        this.condition.id === "false") {
                    if (!option.onecase)
                        warning("This 'switch' should be an 'if'.", this);
                }
                funct["(breakage)"] -= 1;
                funct["(verb)"] = undefined;
                return;
            case "(end)":
                error("Missing '{a}'.", nexttoken, "}");
                return;
            default:
                if (g) {
                    switch (token.id) {
                    case ",":
                        error("Each value should have its own case label.");
                        return;
                    case ":":
                        g = false;
                        statements();
                        break;
                    default:
                        error("Missing ':' on a case clause.", token);
                        return;
                    }
                } else {
                    if (token.id === ":") {
                        advance(":");
                        error("Unexpected '{a}'.", token, ":");
                        statements();
                    } else {
                        error("Expected '{a}' and instead saw '{b}'.",
                            nexttoken, "case", nexttoken.value);
                        return;
                    }
                }
            }
        }
    }).labelled = true;

    stmt("debugger", function () {
        if (!option.debug) {
            warning("All 'debugger' statements should be removed.");
        }
        return this;
    }).exps = true;

    (function () {
        var x = stmt("do", function () {
            funct["(breakage)"] += 1;
            funct["(loopage)"] += 1;
            increaseComplexityCount();

            this.first = block(true);
            advance("while");
            var t = nexttoken;
            nonadjacent(token, t);
            advance("(");
            nospace();
            expression(20);
            if (nexttoken.id === "=") {
                if (!option.boss)
                    warning("Expected a conditional expression and instead saw an assignment.");
                advance("=");
                expression(20);
            }
            advance(")", t);
            nospace(prevtoken, token);
            funct["(breakage)"] -= 1;
            funct["(loopage)"] -= 1;
            return this;
        });
        x.labelled = true;
        x.exps = true;
    }());

    blockstmt("for", function () {
        var s, t = nexttoken;
        funct["(breakage)"] += 1;
        funct["(loopage)"] += 1;
        increaseComplexityCount();
        advance("(");
        nonadjacent(this, t);
        nospace();
        if (peek(nexttoken.id === "var" ? 1 : 0).id === "in") {
            if (nexttoken.id === "var") {
                advance("var");
                varstatement.fud.call(varstatement, true);
            } else {
                switch (funct[nexttoken.value]) {
                case "unused":
                    funct[nexttoken.value] = "var";
                    break;
                case "var":
                    break;
                default:
                    warning("Bad for in variable '{a}'.",
                            nexttoken, nexttoken.value);
                }
                advance();
            }
            advance("in");
            expression(20);
            advance(")", t);
            s = block(true, true);
            if (option.forin && s && (s.length > 1 || typeof s[0] !== "object" ||
                    s[0].value !== "if")) {
                warning("The body of a for in should be wrapped in an if statement to filter " +
                        "unwanted properties from the prototype.", this);
            }
            funct["(breakage)"] -= 1;
            funct["(loopage)"] -= 1;
            return this;
        } else {
            if (nexttoken.id !== ";") {
                if (nexttoken.id === "var") {
                    advance("var");
                    varstatement.fud.call(varstatement);
                } else {
                    for (;;) {
                        expression(0, "for");
                        if (nexttoken.id !== ",") {
                            break;
                        }
                        comma();
                    }
                }
            }
            nolinebreak(token);
            advance(";");
            if (nexttoken.id !== ";") {
                expression(20);
                if (nexttoken.id === "=") {
                    if (!option.boss)
                        warning("Expected a conditional expression and instead saw an assignment.");
                    advance("=");
                    expression(20);
                }
            }
            nolinebreak(token);
            advance(";");
            if (nexttoken.id === ";") {
                error("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, ")", ";");
            }
            if (nexttoken.id !== ")") {
                for (;;) {
                    expression(0, "for");
                    if (nexttoken.id !== ",") {
                        break;
                    }
                    comma();
                }
            }
            advance(")", t);
            nospace(prevtoken, token);
            block(true, true);
            funct["(breakage)"] -= 1;
            funct["(loopage)"] -= 1;
            return this;
        }
    }).labelled = true;


    stmt("break", function () {
        var v = nexttoken.value;

        if (funct["(breakage)"] === 0)
            warning("Unexpected '{a}'.", nexttoken, this.value);

        if (!option.asi)
            nolinebreak(this);

        if (nexttoken.id !== ";") {
            if (token.line === nexttoken.line) {
                if (funct[v] !== "label") {
                    warning("'{a}' is not a statement label.", nexttoken, v);
                } else if (scope[v] !== funct) {
                    warning("'{a}' is out of scope.", nexttoken, v);
                }
                this.first = nexttoken;
                advance();
            }
        }
        reachable("break");
        return this;
    }).exps = true;


    stmt("continue", function () {
        var v = nexttoken.value;

        if (funct["(breakage)"] === 0)
            warning("Unexpected '{a}'.", nexttoken, this.value);

        if (!option.asi)
            nolinebreak(this);

        if (nexttoken.id !== ";") {
            if (token.line === nexttoken.line) {
                if (funct[v] !== "label") {
                    warning("'{a}' is not a statement label.", nexttoken, v);
                } else if (scope[v] !== funct) {
                    warning("'{a}' is out of scope.", nexttoken, v);
                }
                this.first = nexttoken;
                advance();
            }
        } else if (!funct["(loopage)"]) {
            warning("Unexpected '{a}'.", nexttoken, this.value);
        }
        reachable("continue");
        return this;
    }).exps = true;


    stmt("return", function () {
        if (this.line === nexttoken.line) {
            if (nexttoken.id === "(regexp)")
                warning("Wrap the /regexp/ literal in parens to disambiguate the slash operator.");

            if (nexttoken.id !== ";" && !nexttoken.reach) {
                nonadjacent(token, nexttoken);
                if (peek().value === "=" && !option.boss) {
                    warningAt("Did you mean to return a conditional instead of an assignment?",
                              token.line, token.character + 1);
                }
                this.first = expression(0);
            }
        } else if (!option.asi) {
            nolinebreak(this); // always warn (Line breaking error)
        }
        reachable("return");
        return this;
    }).exps = true;


    stmt("throw", function () {
        nolinebreak(this);
        nonadjacent(token, nexttoken);
        this.first = expression(20);
        reachable("throw");
        return this;
    }).exps = true;

//  Superfluous reserved words

    reserve("class");
    reserve("const");
    reserve("enum");
    reserve("export");
    reserve("extends");
    reserve("import");
    reserve("super");

    reserve("let");
    reserve("yield");
    reserve("implements");
    reserve("interface");
    reserve("package");
    reserve("private");
    reserve("protected");
    reserve("public");
    reserve("static");


// Parse JSON

    function jsonValue() {

        function jsonObject() {
            var o = {}, t = nexttoken;
            advance("{");
            if (nexttoken.id !== "}") {
                for (;;) {
                    if (nexttoken.id === "(end)") {
                        error("Missing '}' to match '{' from line {a}.",
                                nexttoken, t.line);
                    } else if (nexttoken.id === "}") {
                        warning("Unexpected comma.", token);
                        break;
                    } else if (nexttoken.id === ",") {
                        error("Unexpected comma.", nexttoken);
                    } else if (nexttoken.id !== "(string)") {
                        warning("Expected a string and instead saw {a}.",
                                nexttoken, nexttoken.value);
                    }
                    if (o[nexttoken.value] === true) {
                        warning("Duplicate key '{a}'.",
                                nexttoken, nexttoken.value);
                    } else if ((nexttoken.value === "__proto__" &&
                        !option.proto) || (nexttoken.value === "__iterator__" &&
                        !option.iterator)) {
                        warning("The '{a}' key may produce unexpected results.",
                            nexttoken, nexttoken.value);
                    } else {
                        o[nexttoken.value] = true;
                    }
                    advance();
                    advance(":");
                    jsonValue();
                    if (nexttoken.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("}");
        }

        function jsonArray() {
            var t = nexttoken;
            advance("[");
            if (nexttoken.id !== "]") {
                for (;;) {
                    if (nexttoken.id === "(end)") {
                        error("Missing ']' to match '[' from line {a}.",
                                nexttoken, t.line);
                    } else if (nexttoken.id === "]") {
                        warning("Unexpected comma.", token);
                        break;
                    } else if (nexttoken.id === ",") {
                        error("Unexpected comma.", nexttoken);
                    }
                    jsonValue();
                    if (nexttoken.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("]");
        }

        switch (nexttoken.id) {
        case "{":
            jsonObject();
            break;
        case "[":
            jsonArray();
            break;
        case "true":
        case "false":
        case "null":
        case "(number)":
        case "(string)":
            advance();
            break;
        case "-":
            advance("-");
            if (token.character !== nexttoken.from) {
                warning("Unexpected space after '-'.", token);
            }
            adjacent(token, nexttoken);
            advance("(number)");
            break;
        default:
            error("Expected a JSON value.", nexttoken);
        }
    }


    // The actual JSHINT function itself.
    var itself = function (s, o, g) {
        var a, i, k, x;
        var optionKeys;
        var newOptionObj = {};

        if (o && o.scope) {
            JSHINT.scope = o.scope;
        } else {
            JSHINT.errors = [];
            JSHINT.undefs = [];
            JSHINT.internals = [];
            JSHINT.blacklist = {};
            JSHINT.scope = "(main)";
        }

        predefined = Object.create(standard);
        declared = Object.create(null);
        combine(predefined, g || {});

        if (o) {
            a = o.predef;
            if (a) {
                if (!Array.isArray(a) && typeof a === "object") {
                    a = Object.keys(a);
                }
                a.forEach(function (item) {
                    var slice;
                    if (item[0] === "-") {
                        slice = item.slice(1);
                        JSHINT.blacklist[slice] = slice;
                    } else {
                        predefined[item] = true;
                    }
                });
            }

            optionKeys = Object.keys(o);
            for (x = 0; x < optionKeys.length; x++) {
                newOptionObj[optionKeys[x]] = o[optionKeys[x]];

                if (optionKeys[x] === "newcap" && o[optionKeys[x]] === false)
                    newOptionObj["(explicitNewcap)"] = true;

                if (optionKeys[x] === "indent")
                    newOptionObj.white = true;
            }
        }

        option = newOptionObj;

        option.indent = option.indent || 4;
        option.maxerr = option.maxerr || 50;

        tab = "";
        for (i = 0; i < option.indent; i += 1) {
            tab += " ";
        }
        indent = 1;
        global = Object.create(predefined);
        scope = global;
        funct = {
            "(global)":   true,
            "(name)":     "(global)",
            "(scope)":    scope,
            "(breakage)": 0,
            "(loopage)":  0,
            "(tokens)":   {},
            "(metrics)":   createMetrics(nexttoken)
        };
        functions = [funct];
        urls = [];
        stack = null;
        member = {};
        membersOnly = null;
        implied = {};
        inblock = false;
        lookahead = [];
        jsonmode = false;
        warnings = 0;
        lines = [];
        unuseds = [];

        if (!isString(s) && !Array.isArray(s)) {
            errorAt("Input is neither a string nor an array of strings.", 0);
            return false;
        }

        if (isString(s) && /^\s*$/g.test(s)) {
            errorAt("Input is an empty string.", 0);
            return false;
        }

        if (s.length === 0) {
            errorAt("Input is an empty array.", 0);
            return false;
        }

        lex.init(s);

        prereg = true;
        directive = {};

        prevtoken = token = nexttoken = syntax["(begin)"];

        // Check options
        for (var name in o) {
            if (is_own(o, name)) {
                checkOption(name, token);
            }
        }

        assume();

        // combine the passed globals after we've assumed all our options
        combine(predefined, g || {});

        //reset values
        comma.first = true;
        quotmark = undefined;

        try {
            advance();
            switch (nexttoken.id) {
            case "{":
            case "[":
                option.laxbreak = true;
                jsonmode = true;
                jsonValue();
                break;
            default:
                directives();
                if (directive["use strict"] && !option.globalstrict) {
                    warning("Use the function form of \"use strict\".", prevtoken);
                }

                statements();
            }
            advance((nexttoken && nexttoken.value !== ".")  ? "(end)" : undefined);

            var markDefined = function (name, context) {
                do {
                    if (typeof context[name] === "string") {
                        // JSHINT marks unused variables as 'unused' and
                        // unused function declaration as 'unction'. This
                        // code changes such instances back 'var' and
                        // 'closure' so that the code in JSHINT.data()
                        // doesn't think they're unused.

                        if (context[name] === "unused")
                            context[name] = "var";
                        else if (context[name] === "unction")
                            context[name] = "closure";

                        return true;
                    }

                    context = context["(context)"];
                } while (context);

                return false;
            };

            var clearImplied = function (name, line) {
                if (!implied[name])
                    return;

                var newImplied = [];
                for (var i = 0; i < implied[name].length; i += 1) {
                    if (implied[name][i] !== line)
                        newImplied.push(implied[name][i]);
                }

                if (newImplied.length === 0)
                    delete implied[name];
                else
                    implied[name] = newImplied;
            };

            var warnUnused = function (name, token) {
                var line = token.line;
                var chr  = token.character;

                if (option.unused)
                    warningAt("'{a}' is defined but never used.", line, chr, name);

                unuseds.push({
                    name: name,
                    line: line,
                    character: chr
                });
            };

            var checkUnused = function (func, key) {
                var type = func[key];
                var token = func["(tokens)"][key];

                if (key.charAt(0) === "(")
                    return;

                if (type !== "unused" && type !== "unction")
                    return;

                // Params are checked separately from other variables.
                if (func["(params)"] && func["(params)"].indexOf(key) !== -1)
                    return;

                warnUnused(key, token);
            };

            // Check queued 'x is not defined' instances to see if they're still undefined.
            for (i = 0; i < JSHINT.undefs.length; i += 1) {
                k = JSHINT.undefs[i].slice(0);

                if (markDefined(k[2].value, k[0])) {
                    clearImplied(k[2].value, k[2].line);
                } else {
                    warning.apply(warning, k.slice(1));
                }
            }

            functions.forEach(function (func) {
                for (var key in func) {
                    if (is_own(func, key)) {
                        checkUnused(func, key);
                    }
                }

                if (!func["(params)"])
                    return;

                var params = func["(params)"].slice();
                var param  = params.pop();
                var type;

                while (param) {
                    type = func[param];

                    // 'undefined' is a special case for (function (window, undefined) { ... })();
                    // patterns.

                    if (param === "undefined")
                        return;

                    if (type !== "unused" && type !== "unction")
                        return;

                    warnUnused(param, func["(tokens)"][param]);
                    param = params.pop();
                }
            });

            for (var key in declared) {
                if (is_own(declared, key) && !is_own(global, key)) {
                    warnUnused(key, declared[key]);
                }
            }
        } catch (e) {
            if (e) {
                var nt = nexttoken || {};
                JSHINT.errors.push({
                    raw       : e.raw,
                    reason    : e.message,
                    line      : e.line || nt.line,
                    character : e.character || nt.from
                }, null);
            }
        }

        // Loop over the listed "internals", and check them as well.

        if (JSHINT.scope === "(main)") {
            o = o || {};

            for (i = 0; i < JSHINT.internals.length; i += 1) {
                k = JSHINT.internals[i];
                o.scope = k.elem;
                itself(k.value, o, g);
            }
        }

        return JSHINT.errors.length === 0;
    };

    // Data summary.
    itself.data = function () {
        var data = {
            functions: [],
            options: option
        };
        var implieds = [];
        var members = [];
        var fu, f, i, j, n, globals;

        if (itself.errors.length) {
            data.errors = itself.errors;
        }

        if (jsonmode) {
            data.json = true;
        }

        for (n in implied) {
            if (is_own(implied, n)) {
                implieds.push({
                    name: n,
                    line: implied[n]
                });
            }
        }

        if (implieds.length > 0) {
            data.implieds = implieds;
        }

        if (urls.length > 0) {
            data.urls = urls;
        }

        globals = Object.keys(scope);
        if (globals.length > 0) {
            data.globals = globals;
        }

        for (i = 1; i < functions.length; i += 1) {
            f = functions[i];
            fu = {};

            for (j = 0; j < functionicity.length; j += 1) {
                fu[functionicity[j]] = [];
            }

            for (j = 0; j < functionicity.length; j += 1) {
                if (fu[functionicity[j]].length === 0) {
                    delete fu[functionicity[j]];
                }
            }

            fu.name = f["(name)"];
            fu.param = f["(params)"];
            fu.line = f["(line)"];
            fu.character = f["(character)"];
            fu.last = f["(last)"];
            fu.lastcharacter = f["(lastcharacter)"];
            data.functions.push(fu);
        }

        if (unuseds.length > 0) {
            data.unused = unuseds;
        }

        members = [];
        for (n in member) {
            if (typeof member[n] === "number") {
                data.member = member;
                break;
            }
        }

        return data;
    };

    itself.jshint = itself;

    return itself;
}());

// Make JSHINT a Node module, if possible.
if (typeof exports === "object" && exports) {
    exports.JSHINT = JSHINT;
}
