/*global quit:false, readFile: false */

// Rhino Edition


// jslint.js
// 2011-03-29

// Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// The Software shall be used for Good, not Evil.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// JSLINT is a global function. It takes two parameters.

//     var myResult = JSLINT(source, option);

// The first parameter is either a string or an array of strings. If it is a
// string, it will be split on '\n' or '\r'. If it is an array of strings, it
// is assumed that each string represents one line. The source can be a
// JavaScript text, or HTML text, or a JSON text, or a CSS text.

// The second parameter is an optional object of options that control the
// operation of JSLINT. Most of the options are booleans: They are all
// optional and have a default value of false. One of the options, predef,
// can be an array of names, which will be used to declare global variables,
// or an object whose keys are used as global names, with a boolean value
// that determines if they are assignable.

// If it checks out, JSLINT returns true. Otherwise, it returns false.

// If false, you can inspect JSLINT.errors to find out the problems.
// JSLINT.errors is an array of objects containing these properties:

//  {
//      line      : The line (relative to 0) at which the lint was found
//      character : The character (relative to 0) at which the lint was found
//      reason    : The problem
//      evidence  : The text line in which the problem occurred
//      raw       : The raw message before the details were inserted
//      a         : The first detail
//      b         : The second detail
//      c         : The third detail
//      d         : The fourth detail
//  }

// If a stopping error was found, a null will be the last element of the
// JSLINT.errors array. A stopping error means that JSLint was not confident
// enough to continue. It does not necessarily mean that the error was
// especailly heinous.

// You can request a Function Report, which shows all of the functions
// and the parameters and vars that they use. This can be used to find
// implied global variables and other problems. The report is in HTML and
// can be inserted in an HTML <body>.

//     var myReport = JSLINT.report(errors_only);

// If errors_only is true, then the report will be limited to only errors.

// You can request a data structure that contains JSLint's results.

//     var myData = JSLINT.data();

// It returns a structure with this form:

//     {
//         errors: [
//             {
//                 line: NUMBER,
//                 character: NUMBER,
//                 reason: STRING,
//                 evidence: STRING
//             }
//         ],
//         functions: [
//             name: STRING,
//             line: NUMBER,
//             last: NUMBER,
//             param: [
//                 TOKEN
//             ],
//             closure: [
//                 STRING
//             ],
//             var: [
//                 STRING
//             ],
//             exception: [
//                 STRING
//             ],
//             outer: [
//                 STRING
//             ],
//             unused: [
//                 STRING
//             ],
//             global: [
//                 STRING
//             ],
//             label: [
//                 STRING
//             ]
//         ],
//         globals: [
//             STRING
//         ],
//         member: {
//             STRING: NUMBER
//         },
//         unuseds: [
//             {
//                 name: STRING,
//                 line: NUMBER
//             }
//         ],
//         implieds: [
//             {
//                 name: STRING,
//                 line: NUMBER
//             }
//         ],
//         urls: [
//             STRING
//         ],
//         json: BOOLEAN
//     }

// Empty arrays will not be included.

// You can obtain the parse tree that JSLint constructed while parsing. The
// latest tree is kept in JSLINT.tree. A nice stringication can be produced
// with

//     JSON.stringify(JSLINT.tree, [
//         'value',  'arity', 'name',  'first',
//         'second', 'third', 'block', 'else'
//     ], 4));

// JSLint provides three directives. They look like slashstar comments, and
// allow for setting options, declaring global variables, and establishing a
// set of allowed property names.

// These directives respect function scope.

// The jslint directive is a special comment that can set one or more options.
// The current option set is

//     adsafe     true, if ADsafe rules should be enforced
//     bitwise    true, if bitwise operators should not be allowed
//     browser    true, if the standard browser globals should be predefined
//     cap        true, if upper case HTML should be allowed
//     'continue' true, if the continuation statement should be tolerated
//     css        true, if CSS workarounds should be tolerated
//     debug      true, if debugger statements should be allowed
//     devel      true, if logging should be allowed (console, alert, etc.)
//     es5        true, if ES5 syntax should be allowed
//     evil       true, if eval should be allowed
//     forin      true, if for in statements need not filter
//     fragment   true, if HTML fragments should be allowed
//     indent     the indentation factor
//     maxerr     the maximum number of errors to allow
//     maxlen     the maximum length of a source line
//     newcap     true, if constructor names must be capitalized
//     node       true, if Node.js globals should be predefined
//     nomen      true, if names should be checked
//     on         true, if HTML event handlers should be allowed
//     onevar     true, if only one var statement per function should be allowed
//     passfail   true, if the scan should stop on first error
//     plusplus   true, if increment/decrement should not be allowed
//     regexp     true, if the . should not be allowed in regexp literals
//     rhino      true, if the Rhino environment globals should be predefined
//     undef      true, if variables should be declared before used
//     safe       true, if use of some browser features should be restricted
//     windows    true, if MS Windows-specific globals should be predefined
//     strict     true, require the "use strict"; pragma
//     sub        true, if all forms of subscript notation are tolerated
//     white      true, if strict whitespace rules apply
//     widget     true  if the Yahoo Widgets globals should be predefined

// For example:

/*jslint
    evil: true, nomen: false, onevar: false, regexp: false, strict: true
*/

// The properties directive declares an exclusive list of property names.
// Any properties named in the program that are not in the list will
// produce a warning.

// For example:

/*properties "\b", "\t", "\n", "\f", "\r", "!=", "!==", "\"", "%", "'",
    "(begin)", "(breakage)", "(context)", "(error)", "(global)",
    "(identifier)", "(line)", "(loopage)", "(name)", "(onevar)", "(params)",
    "(scope)", "(statement)", "(token)", "(verb)", ")", "*", "+", "-", "\/",
    ";", "<", "<=", "==", "===", ">", ">=", ADSAFE, ActiveXObject,
    Array, Boolean, Buffer, COM, CScript, Canvas, CustomAnimation, Date,
    Debug, E, Enumerator, Error, EvalError, FadeAnimation, Flash, FormField,
    Frame, Function, HotKey, Image, JSON, LN10, LN2, LOG10E, LOG2E,
    MAX_VALUE, MIN_VALUE, Math, MenuItem, MoveAnimation, NEGATIVE_INFINITY,
    Number, Object, Option, PI, POSITIVE_INFINITY, Point, RangeError,
    Rectangle, ReferenceError, RegExp, ResizeAnimation, RotateAnimation,
    SQRT1_2, SQRT2, ScrollBar, String, Style, SyntaxError, System, Text,
    TextArea, Timer, TypeError, URIError, URL, VBArray, WScript, Web,
    Window, XMLDOM, XMLHttpRequest, "\\", __dirname, __filename, a,
    a_function, a_label, a_not_allowed, a_not_defined, a_scope, abbr,
    acronym, activeborder, activecaption, address, adsafe, adsafe_a,
    adsafe_autocomplete, adsafe_bad_id, adsafe_div, adsafe_fragment,
    adsafe_go, adsafe_html, adsafe_id, adsafe_id_go, adsafe_lib,
    adsafe_lib_second, adsafe_missing_id, adsafe_name_a, adsafe_placement,
    adsafe_prefix_a, adsafe_script, adsafe_source, adsafe_subscript_a,
    adsafe_tag, alert, aliceblue, all, already_defined, and, animator,
    antiquewhite, appleScript, applet, apply, approved, appworkspace, aqua,
    aquamarine, area, arguments, arity, article, aside, assign,
    assign_exception, assignment_function_expression, at, attribute_case_a,
    audio, autocomplete, avoid_a, azure, b, background,
    "background-attachment", "background-color", "background-image",
    "background-position", "background-repeat", bad_assignment, bad_color_a,
    bad_constructor, bad_entity, bad_html, bad_id_a, bad_in_a,
    bad_invocation, bad_name_a, bad_new, bad_number, bad_operand, bad_type,
    bad_url, bad_wrap, base, bdo, beep, beige, big, bisque, bitwise, black,
    blanchedalmond, block, blockquote, blue, blueviolet, body, border,
    "border-bottom", "border-bottom-color", "border-bottom-style",
    "border-bottom-width", "border-collapse", "border-color", "border-left",
    "border-left-color", "border-left-style", "border-left-width",
    "border-right", "border-right-color", "border-right-style",
    "border-right-width", "border-spacing", "border-style", "border-top",
    "border-top-color", "border-top-style", "border-top-width",
    "border-width", bottom, br, braille, brown, browser, burlywood, button,
    buttonface, buttonhighlight, buttonshadow, buttontext, bytesToUIString,
    c, cadetblue, call, callee, caller, canvas, cap, caption,
    "caption-side", captiontext, center, charAt, charCodeAt, character,
    chartreuse, chocolate, chooseColor, chooseFile, chooseFolder, cite,
    clear, clearInterval, clearTimeout, clearTimout, clip, closeWidget,
    closure, cm, code, col, colgroup, color, combine_var, command, comment,
    comments, concat, conditional_assignment, confirm, confusing_a,
    confusing_regexp, console, constructor, constructor_name_a, content,
    continue, control_a, convertPathToHFS, convertPathToPlatform, coral,
    cornflowerblue, cornsilk, "counter-increment", "counter-reset", create,
    crimson, css, cursor, cyan, d, dangerous_comment, dangling_a, darkblue,
    darkcyan, darkgoldenrod, darkgray, darkgreen, darkkhaki, darkmagenta,
    darkolivegreen, darkorange, darkorchid, darkred, darksalmon,
    darkseagreen, darkslateblue, darkslategray, darkturquoise, darkviolet,
    data, datalist, dd, debug, decodeURI, decodeURIComponent, deeppink,
    deepskyblue, defineClass, del, deleted, deserialize, details, devel,
    dfn, dialog, dimgray, dir, direction, display, disrupt, div, dl,
    document, dodgerblue, dt, duplicate_a, edge, edition, else, em, embed,
    embossed, empty, "empty-cells", empty_block, empty_case, empty_class,
    encodeURI, encodeURIComponent, entityify, errors, es5, escape, eval,
    event, evidence, evil, ex, exception, exec, expected_a,
    expected_a_at_b_c, expected_a_b, expected_a_b_from_c_d, expected_at_a,
    expected_attribute_a, expected_attribute_value_a, expected_class_a,
    expected_fraction_a, expected_id_a, expected_identifier_a,
    expected_identifier_a_reserved, expected_lang_a, expected_linear_a,
    expected_media_a, expected_name_a, expected_nonstandard_style_attribute,
    expected_number_a, expected_operator_a, expected_percent_a,
    expected_positive_a, expected_pseudo_a, expected_selector_a,
    expected_small_a, expected_space_a_b, expected_string_a,
    expected_style_attribute, expected_style_pattern, expected_tagname_a,
    fieldset, figure, filesystem, filter, firebrick, first, float, floor,
    floralwhite, focusWidget, font, "font-family", "font-size",
    "font-size-adjust", "font-stretch", "font-style", "font-variant",
    "font-weight", footer, for_if, forestgreen, forin, form, fragment,
    frame, frames, frameset, from, fromCharCode, fuchsia, fud, funct,
    function, function_block, function_eval, function_loop,
    function_statement, function_strict, functions, g, gainsboro, gc,
    get_set, ghostwhite, global, globals, gold, goldenrod, gray, graytext,
    green, greenyellow, h1, h2, h3, h4, h5, h6, handheld, hasOwnProperty,
    head, header, height, help, hgroup, highlight, highlighttext, history,
    honeydew, hotpink, hr, "hta:application", html, html_confusion_a,
    html_handlers, i, iTunes, id, identifier, identifier_function, iframe,
    img, immed, implied_evil, implieds, in, inactiveborder, inactivecaption,
    inactivecaptiontext, include, indent, indexOf, indianred, indigo,
    infix_in, infobackground, infotext, init, input, ins, insecure_a,
    isAlpha, isApplicationRunning, isArray, isDigit, isFinite, isNaN, ivory,
    join, jslint, json, kbd, keygen, keys, khaki, konfabulatorVersion,
    label, label_a_b, labeled, lang, lavender, lavenderblush, lawngreen,
    lbp, leading_decimal_a, led, left, legend, lemonchiffon, length,
    "letter-spacing", li, lib, lightblue, lightcoral, lightcyan,
    lightgoldenrodyellow, lightgreen, lightpink, lightsalmon, lightseagreen,
    lightskyblue, lightslategray, lightsteelblue, lightyellow, lime,
    limegreen, line, "line-height", linen, link, "list-style",
    "list-style-image", "list-style-position", "list-style-type", load,
    loadClass, location, log, m, magenta, map, margin, "margin-bottom",
    "margin-left", "margin-right", "margin-top", mark, "marker-offset",
    maroon, match, "max-height", "max-width", maxerr, maxlen, md5,
    mediumaquamarine, mediumblue, mediumorchid, mediumpurple,
    mediumseagreen, mediumslateblue, mediumspringgreen, mediumturquoise,
    mediumvioletred, member, menu, menutext, message, meta, meter,
    midnightblue, "min-height", "min-width", mintcream, missing_a,
    missing_a_after_b, missing_option, missing_property, missing_space_a_b,
    missing_url, missing_use_strict, mistyrose, mixed, mm, moccasin, mode,
    module, move_invocation, move_var, name, name_function, nav,
    navajowhite, navigator, navy, nested_comment, newcap, next, node,
    noframes, nomen, noscript, not, not_a_constructor, not_a_defined,
    not_a_function, not_a_label, not_a_scope, not_greater, nud, object, ol,
    oldlace, olive, olivedrab, on, onevar, opacity, open, openURL, opera,
    optgroup, option, orange, orangered, orchid, outer, outline,
    "outline-color", "outline-style", "outline-width", output, overflow,
    "overflow-x", "overflow-y", p, padding, "padding-bottom",
    "padding-left", "padding-right", "padding-top", "page-break-after",
    "page-break-before", palegoldenrod, palegreen, paleturquoise,
    palevioletred, papayawhip, param, parameter_a_get_b, parameter_set_a,
    paren, parent, parseFloat, parseInt, passfail, pc, peachpuff, peru,
    pink, play, plum, plusplus, pop, popupMenu, position, postscript,
    powderblue, pre, predef, preferenceGroups, preferences, prev, print,
    process, progress, projection, prompt, prototype, pt, purple, push, px,
    q, querystring, quit, quote, quotes, radix, random, range, raw,
    readFile, readUrl, read_only, reason, red, redefinition_a, regexp,
    reloadWidget, replace, report, require, reserved, reserved_a,
    resolvePath, resumeUpdates, rhino, right, rosybrown, royalblue, rp, rt,
    ruby, runCommand, runCommandInBg, saddlebrown, safe, salmon, samp,
    sandybrown, saveAs, savePreferences, scanned_a_b, screen, script,
    scrollbar, seagreen, seal, search, seashell, second, section, select,
    serialize, setInterval, setTimeout, shift, showWidgetPreferences,
    sienna, silver, skyblue, slash_equal, slateblue, slategray, sleep,
    slice, small, snow, sort, source, span, spawn, speak, speech, split,
    springgreen, src, stack, statement_block, steelblue, stopping,
    strange_loop, strict, strong, style, styleproperty, sub, subscript,
    substr, sup, supplant, suppressUpdates, sync, system, table,
    "table-layout", tag_a_in_b, tan, tbody, td, teal, tellWidget, test,
    "text-align", "text-decoration", "text-indent", "text-shadow",
    "text-transform", textarea, tfoot, th, thead, third, thistle,
    threeddarkshadow, threedface, threedhighlight, threedlightshadow,
    threedshadow, thru, time, title, toLowerCase, toString, toUpperCase,
    toint32, token, tomato, too_long, too_many, top, tr, trailing_decimal_a,
    tree, tt, tty, turquoise, tv, type, u, ul, unclosed, unclosed_comment,
    unclosed_regexp, undef, unescape, unescaped_a, unexpected_a,
    unexpected_char_a_b, unexpected_comment, unexpected_member_a,
    unexpected_space_a_b, "unicode-bidi", unnecessary_initialize,
    unnecessary_use, unreachable_a_b, unrecognized_style_attribute_a,
    unrecognized_tag_a, unsafe, unused, unwatch, updateNow, url, urls,
    use_array, use_braces, use_object, used_before_a, util, value, valueOf,
    var, var_a_not, version, "vertical-align", video, violet, visibility,
    was, watch, weird_assignment, weird_condition, weird_new, weird_program,
    weird_relation, weird_ternary, wheat, white, "white-space", whitesmoke,
    widget, width, window, windowframe, windows, windowtext, "word-spacing",
    "word-wrap", wrap, wrap_immediate, wrap_regexp, write_is_wrong,
    yahooCheckLogin, yahooLogin, yahooLogout, yellow, yellowgreen,
    "z-index"
*/

// The global directive is used to declare global variables that can
// be accessed by the program. If a declaration is true, then the variable
// is writeable. Otherwise, it is read-only.

// We build the application inside a function so that we produce only a single
// global variable. That function will be invoked immediately, and its return
// value is the JSLINT function itself. That function is also an object that
// can contain data and other functions.

var JSLINT = (function () {
    "use strict";

    var adsafe_id,      // The widget's ADsafe id.
        adsafe_may,     // The widget may load approved scripts.
        adsafe_top,     // At the top of the widget script.
        adsafe_went,    // ADSAFE.go has been called.
        anonname,       // The guessed name for anonymous functions.
        approved,       // ADsafe approved urls.

// These are operators that should not be used with the ! operator.

        bang = {
            '<'  : true,
            '<=' : true,
            '==' : true,
            '===': true,
            '!==': true,
            '!=' : true,
            '>'  : true,
            '>=' : true,
            '+'  : true,
            '-'  : true,
            '*'  : true,
            '/'  : true,
            '%'  : true
        },

// These are property names that should not be permitted in the safe subset.

        banned = {
            'arguments' : true,
            callee      : true,
            caller      : true,
            constructor : true,
            'eval'      : true,
            prototype   : true,
            stack       : true,
            unwatch     : true,
            valueOf     : true,
            watch       : true
        },
        begin,          // The root token

// browser contains a set of global names that are commonly provided by a
// web browser environment.

        browser = {
            clearInterval  : false,
            clearTimeout   : false,
            document       : false,
            event          : false,
            frames         : false,
            history        : false,
            Image          : false,
            location       : false,
            name           : false,
            navigator      : false,
            Option         : false,
            parent         : false,
            screen         : false,
            setInterval    : false,
            setTimeout     : false,
            window         : false,
            XMLHttpRequest : false
        },

// bundle contains the text messages.

        bundle = {
            a_function: "'{a}' is a function.",
            a_label: "'{a}' is a statement label.",
            a_not_allowed: "'{a}' is not allowed.",
            a_not_defined: "'{a}' is not defined.",
            a_scope: "'{a}' used out of scope.",
            adsafe: "ADsafe violation.",
            adsafe_a: "ADsafe violation: '{a}'.",
            adsafe_autocomplete: "ADsafe autocomplete violation.",
            adsafe_bad_id: "ADSAFE violation: bad id.",
            adsafe_div: "ADsafe violation: Wrap the widget in a div.",
            adsafe_fragment: "ADSAFE: Use the fragment option.",
            adsafe_go: "ADsafe violation: Missing ADSAFE.go.",
            adsafe_html: "Currently, ADsafe does not operate on whole HTML documents. It operates on <div> fragments and .js files.",
            adsafe_id: "ADsafe violation: id does not match.",
            adsafe_id_go: "ADsafe violation: Missing ADSAFE.id or ADSAFE.go.",
            adsafe_lib: "ADsafe lib violation.",
            adsafe_lib_second: "ADsafe: The second argument to lib must be a function.",
            adsafe_missing_id: "ADSAFE violation: missing ID_.",
            adsafe_name_a: "ADsafe name violation: '{a}'.",
            adsafe_placement: "ADsafe script placement violation.",
            adsafe_prefix_a: "ADsafe violation: An id must have a '{a}' prefix",
            adsafe_script: "ADsafe script violation.",
            adsafe_source: "ADsafe unapproved script source.",
            adsafe_subscript_a: "ADsafe subscript '{a}'.",
            adsafe_tag: "ADsafe violation: Disallowed tag '{a}'.",
            already_defined: "'{a}' is already defined.",
            and: "The '&&' subexpression should be wrapped in parens.",
            assign_exception: "Do not assign to the exception parameter.",
            assignment_function_expression: "Expected an assignment or function call and instead saw an expression.",
            attribute_case_a: "Attribute '{a}' not all lower case.",
            avoid_a: "Avoid '{a}'.",
            bad_assignment: "Bad assignment.",
            bad_color_a: "Bad hex color '{a}'.",
            bad_constructor: "Bad constructor.",
            bad_entity: "Bad entity.",
            bad_html: "Bad HTML string",
            bad_id_a: "Bad id: '{a}'.",
            bad_in_a: "Bad for in variable '{a}'.",
            bad_invocation: "Bad invocation.",
            bad_name_a: "Bad name: '{a}'.",
            bad_new: "Do not use 'new' for side effects.",
            bad_number: "Bad number '{a}'.",
            bad_operand: "Bad operand.",
            bad_type: "Bad type.",
            bad_url: "Bad url string.",
            bad_wrap: "Do not wrap function literals in parens unless they are to be immediately invoked.",
            combine_var: "Combine this with the previous 'var' statement.",
            conditional_assignment: "Expected a conditional expression and instead saw an assignment.",
            confusing_a: "Confusing use of '{a}'.",
            confusing_regexp: "Confusing regular expression.",
            constructor_name_a: "A constructor name '{a}' should start with an uppercase letter.",
            control_a: "Unexpected control character '{a}'.",
            css: "A css file should begin with @charset 'UTF-8';",
            dangling_a: "Unexpected dangling '_' in '{a}'.",
            dangerous_comment: "Dangerous comment.",
            deleted: "Only properties should be deleted.",
            duplicate_a: "Duplicate '{a}'.",
            empty_block: "Empty block.",
            empty_case: "Empty case.",
            empty_class: "Empty class.",
            evil: "eval is evil.",
            expected_a: "Expected '{a}'.",
            expected_a_b: "Expected '{a}' and instead saw '{b}'.",
            expected_a_b_from_c_d: "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
            expected_at_a: "Expected an at-rule, and instead saw @{a}.",
            expected_a_at_b_c: "Expected '{a}' at column {b}, not column {c}.",
            expected_attribute_a: "Expected an attribute, and instead saw [{a}].",
            expected_attribute_value_a: "Expected an attribute value and instead saw '{a}'.",
            expected_class_a: "Expected a class, and instead saw .{a}.",
            expected_fraction_a: "Expected a number between 0 and 1 and instead saw '{a}'",
            expected_id_a: "Expected an id, and instead saw #{a}.",
            expected_identifier_a: "Expected an identifier and instead saw '{a}'.",
            expected_identifier_a_reserved: "Expected an identifier and instead saw '{a}' (a reserved word).",
            expected_linear_a: "Expected a linear unit and instead saw '{a}'.",
            expected_lang_a: "Expected a lang code, and instead saw :{a}.",
            expected_media_a: "Expected a CSS media type, and instead saw '{a}'.",
            expected_name_a: "Expected a name and instead saw '{a}'.",
            expected_nonstandard_style_attribute: "Expected a non-standard style attribute and instead saw '{a}'.",
            expected_number_a: "Expected a number and instead saw '{a}'.",
            expected_operator_a: "Expected an operator and instead saw '{a}'.",
            expected_percent_a: "Expected a percentage and instead saw '{a}'",
            expected_positive_a: "Expected a positive number and instead saw '{a}'",
            expected_pseudo_a: "Expected a pseudo, and instead saw :{a}.",
            expected_selector_a: "Expected a CSS selector, and instead saw {a}.",
            expected_small_a: "Expected a small number and instead saw '{a}'",
            expected_space_a_b: "Expected exactly one space between '{a}' and '{b}'.",
            expected_string_a: "Expected a string and instead saw {a}.",
            expected_style_attribute: "Excepted a style attribute, and instead saw '{a}'.",
            expected_style_pattern: "Expected a style pattern, and instead saw '{a}'.",
            expected_tagname_a: "Expected a tagName, and instead saw {a}.",
            for_if: "The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.",
            function_block: "Function statements should not be placed in blocks. " +
                "Use a function expression or move the statement to the top of " +
                "the outer function.",
            function_eval: "The Function constructor is eval.",
            function_loop: "Don't make functions within a loop.",
            function_statement: "Function statements are not invocable. " +
                "Wrap the whole function invocation in parens.",
            function_strict: "Use the function form of \"use strict\".",
            get_set: "get/set are ES5 features.",
            html_confusion_a: "HTML confusion in regular expression '<{a}'.",
            html_handlers: "Avoid HTML event handlers.",
            identifier_function: "Expected an identifier in an assignment and instead saw a function invocation.",
            implied_evil: "Implied eval is evil. Pass a function instead of a string.",
            infix_in: "Unexpected 'in'. Compare with undefined, or use the hasOwnProperty method instead.",
            insecure_a: "Insecure '{a}'.",
            isNaN: "Use the isNaN function to compare with NaN.",
            label_a_b: "Label '{a}' on '{b}' statement.",
            lang: "lang is deprecated.",
            leading_decimal_a: "A leading decimal point can be confused with a dot: '.{a}'.",
            missing_a: "Missing '{a}'.",
            missing_a_after_b: "Missing '{a}' after '{b}'.",
            missing_option: "Missing option value.",
            missing_property: "Missing property name.",
            missing_space_a_b: "Missing space between '{a}' and '{b}'.",
            missing_url: "Missing url.",
            missing_use_strict: "Missing \"use strict\" statement.",
            mixed: "Mixed spaces and tabs.",
            move_invocation: "Move the invocation into the parens that contain the function.",
            move_var: "Move 'var' declarations to the top of the function.",
            name_function: "Missing name in function statement.",
            nested_comment: "Nested comment.",
            not: "Nested not.",
            not_a_constructor: "Do not use {a} as a constructor.",
            not_a_defined: "'{a}' has not been fully defined yet.",
            not_a_function: "'{a}' is not a function.",
            not_a_label: "'{a}' is not a label.",
            not_a_scope: "'{a}' is out of scope.",
            not_greater: "'{a}' should not be greater than '{b}'.",
            parameter_a_get_b: "Unexpected parameter '{a}' in get {b} function.",
            parameter_set_a: "Expected parameter (value) in set {a} function.",
            radix: "Missing radix parameter.",
            read_only: "Read only.",
            redefinition_a: "Redefinition of '{a}'.",
            reserved_a: "Reserved name '{a}'.",
            scanned_a_b: "{a} ({b}% scanned).",
            slash_equal: "A regular expression literal can be confused with '/='.",
            statement_block: "Expected to see a statement and instead saw a block.",
            stopping: "Stopping. ",
            strange_loop: "Strange loop.",
            strict: "Strict violation.",
            subscript: "['{a}'] is better written in dot notation.",
            tag_a_in_b: "A '<{a}>' must be within '<{b}>'.",
            too_long: "Line too long.",
            too_many: "Too many errors.",
            trailing_decimal_a: "A trailing decimal point can be confused with a dot: '.{a}'.",
            type: "type is unnecessary.",
            unclosed: "Unclosed string.",
            unclosed_comment: "Unclosed comment.",
            unclosed_regexp: "Unclosed regular expression.",
            unescaped_a: "Unescaped '{a}'.",
            unexpected_a: "Unexpected '{a}'.",
            unexpected_char_a_b: "Unexpected character '{a}' in {b}.",
            unexpected_comment: "Unexpected comment.",
            unexpected_member_a: "Unexpected property '{a}'.",
            unexpected_space_a_b: "Unexpected space between '{a}' and '{b}'.",
            unnecessary_initialize: "It is not necessary to initialize '{a}' to 'undefined'.",
            unnecessary_use: "Unnecessary \"use strict\".",
            unreachable_a_b: "Unreachable '{a}' after '{b}'.",
            unrecognized_style_attribute_a: "Unrecognized style attribute '{a}'.",
            unrecognized_tag_a: "Unrecognized tag '<{a}>'.",
            unsafe: "Unsafe character.",
            url: "JavaScript URL.",
            use_array: "Use the array literal notation [].",
            use_braces: "Spaces are hard to count. Use {{a}}.",
            use_object: "Use the object literal notation {}.",
            used_before_a: "'{a}' was used before it was defined.",
            var_a_not: "Variable {a} was not declared correctly.",
            weird_assignment: "Weird assignment.",
            weird_condition: "Weird condition.",
            weird_new: "Weird construction. Delete 'new'.",
            weird_program: "Weird program.",
            weird_relation: "Weird relation.",
            weird_ternary: "Weird ternary.",
            wrap_immediate: "Wrap an immediate function invocation in parentheses " +
                "to assist the reader in understanding that the expression " +
                "is the result of a function, and not the function itself.",
            wrap_regexp: "Wrap the /regexp/ literal in parens to disambiguate the slash operator.",
            write_is_wrong: "document.write can be a form of eval."
        },
        comments_off,
        css_attribute_data,
        css_any,

        css_colorData = {
            "aliceblue"             : true,
            "antiquewhite"          : true,
            "aqua"                  : true,
            "aquamarine"            : true,
            "azure"                 : true,
            "beige"                 : true,
            "bisque"                : true,
            "black"                 : true,
            "blanchedalmond"        : true,
            "blue"                  : true,
            "blueviolet"            : true,
            "brown"                 : true,
            "burlywood"             : true,
            "cadetblue"             : true,
            "chartreuse"            : true,
            "chocolate"             : true,
            "coral"                 : true,
            "cornflowerblue"        : true,
            "cornsilk"              : true,
            "crimson"               : true,
            "cyan"                  : true,
            "darkblue"              : true,
            "darkcyan"              : true,
            "darkgoldenrod"         : true,
            "darkgray"              : true,
            "darkgreen"             : true,
            "darkkhaki"             : true,
            "darkmagenta"           : true,
            "darkolivegreen"        : true,
            "darkorange"            : true,
            "darkorchid"            : true,
            "darkred"               : true,
            "darksalmon"            : true,
            "darkseagreen"          : true,
            "darkslateblue"         : true,
            "darkslategray"         : true,
            "darkturquoise"         : true,
            "darkviolet"            : true,
            "deeppink"              : true,
            "deepskyblue"           : true,
            "dimgray"               : true,
            "dodgerblue"            : true,
            "firebrick"             : true,
            "floralwhite"           : true,
            "forestgreen"           : true,
            "fuchsia"               : true,
            "gainsboro"             : true,
            "ghostwhite"            : true,
            "gold"                  : true,
            "goldenrod"             : true,
            "gray"                  : true,
            "green"                 : true,
            "greenyellow"           : true,
            "honeydew"              : true,
            "hotpink"               : true,
            "indianred"             : true,
            "indigo"                : true,
            "ivory"                 : true,
            "khaki"                 : true,
            "lavender"              : true,
            "lavenderblush"         : true,
            "lawngreen"             : true,
            "lemonchiffon"          : true,
            "lightblue"             : true,
            "lightcoral"            : true,
            "lightcyan"             : true,
            "lightgoldenrodyellow"  : true,
            "lightgreen"            : true,
            "lightpink"             : true,
            "lightsalmon"           : true,
            "lightseagreen"         : true,
            "lightskyblue"          : true,
            "lightslategray"        : true,
            "lightsteelblue"        : true,
            "lightyellow"           : true,
            "lime"                  : true,
            "limegreen"             : true,
            "linen"                 : true,
            "magenta"               : true,
            "maroon"                : true,
            "mediumaquamarine"      : true,
            "mediumblue"            : true,
            "mediumorchid"          : true,
            "mediumpurple"          : true,
            "mediumseagreen"        : true,
            "mediumslateblue"       : true,
            "mediumspringgreen"     : true,
            "mediumturquoise"       : true,
            "mediumvioletred"       : true,
            "midnightblue"          : true,
            "mintcream"             : true,
            "mistyrose"             : true,
            "moccasin"              : true,
            "navajowhite"           : true,
            "navy"                  : true,
            "oldlace"               : true,
            "olive"                 : true,
            "olivedrab"             : true,
            "orange"                : true,
            "orangered"             : true,
            "orchid"                : true,
            "palegoldenrod"         : true,
            "palegreen"             : true,
            "paleturquoise"         : true,
            "palevioletred"         : true,
            "papayawhip"            : true,
            "peachpuff"             : true,
            "peru"                  : true,
            "pink"                  : true,
            "plum"                  : true,
            "powderblue"            : true,
            "purple"                : true,
            "red"                   : true,
            "rosybrown"             : true,
            "royalblue"             : true,
            "saddlebrown"           : true,
            "salmon"                : true,
            "sandybrown"            : true,
            "seagreen"              : true,
            "seashell"              : true,
            "sienna"                : true,
            "silver"                : true,
            "skyblue"               : true,
            "slateblue"             : true,
            "slategray"             : true,
            "snow"                  : true,
            "springgreen"           : true,
            "steelblue"             : true,
            "tan"                   : true,
            "teal"                  : true,
            "thistle"               : true,
            "tomato"                : true,
            "turquoise"             : true,
            "violet"                : true,
            "wheat"                 : true,
            "white"                 : true,
            "whitesmoke"            : true,
            "yellow"                : true,
            "yellowgreen"           : true,

            "activeborder"          : true,
            "activecaption"         : true,
            "appworkspace"          : true,
            "background"            : true,
            "buttonface"            : true,
            "buttonhighlight"       : true,
            "buttonshadow"          : true,
            "buttontext"            : true,
            "captiontext"           : true,
            "graytext"              : true,
            "highlight"             : true,
            "highlighttext"         : true,
            "inactiveborder"        : true,
            "inactivecaption"       : true,
            "inactivecaptiontext"   : true,
            "infobackground"        : true,
            "infotext"              : true,
            "menu"                  : true,
            "menutext"              : true,
            "scrollbar"             : true,
            "threeddarkshadow"      : true,
            "threedface"            : true,
            "threedhighlight"       : true,
            "threedlightshadow"     : true,
            "threedshadow"          : true,
            "window"                : true,
            "windowframe"           : true,
            "windowtext"            : true
        },

        css_border_style,
        css_break,

        css_lengthData = {
            '%': true,
            'cm': true,
            'em': true,
            'ex': true,
            'in': true,
            'mm': true,
            'pc': true,
            'pt': true,
            'px': true
        },

        css_media,
        css_overflow,

        devel = {
            alert           : false,
            confirm         : false,
            console         : false,
            Debug           : false,
            opera           : false,
            prompt          : false
        },

        escapes = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '/' : '\\/',
            '\\': '\\\\'
        },

        funct,          // The current function

        functionicity = [
            'closure', 'exception', 'global', 'label', 'outer', 'unused', 'var'
        ],

        functions,      // All of the functions
        global,         // The global scope
        html_tag = {
            a:        {},
            abbr:     {},
            acronym:  {},
            address:  {},
            applet:   {},
            area:     {empty: true, parent: ' map '},
            article:  {},
            aside:    {},
            audio:    {},
            b:        {},
            base:     {empty: true, parent: ' head '},
            bdo:      {},
            big:      {},
            blockquote: {},
            body:     {parent: ' html noframes '},
            br:       {empty: true},
            button:   {},
            canvas:   {parent: ' body p div th td '},
            caption:  {parent: ' table '},
            center:   {},
            cite:     {},
            code:     {},
            col:      {empty: true, parent: ' table colgroup '},
            colgroup: {parent: ' table '},
            command:  {parent: ' menu '},
            datalist: {},
            dd:       {parent: ' dl '},
            del:      {},
            details:  {},
            dialog:   {},
            dfn:      {},
            dir:      {},
            div:      {},
            dl:       {},
            dt:       {parent: ' dl '},
            em:       {},
            embed:    {},
            fieldset: {},
            figure:   {},
            font:     {},
            footer:   {},
            form:     {},
            frame:    {empty: true, parent: ' frameset '},
            frameset: {parent: ' html frameset '},
            h1:       {},
            h2:       {},
            h3:       {},
            h4:       {},
            h5:       {},
            h6:       {},
            head:     {parent: ' html '},
            header:   {},
            hgroup:   {},
            hr:       {empty: true},
            'hta:application':
                      {empty: true, parent: ' head '},
            html:     {parent: '*'},
            i:        {},
            iframe:   {},
            img:      {empty: true},
            input:    {empty: true},
            ins:      {},
            kbd:      {},
            keygen:   {},
            label:    {},
            legend:   {parent: ' details fieldset figure '},
            li:       {parent: ' dir menu ol ul '},
            link:     {empty: true, parent: ' head '},
            map:      {},
            mark:     {},
            menu:     {},
            meta:     {empty: true, parent: ' head noframes noscript '},
            meter:    {},
            nav:      {},
            noframes: {parent: ' html body '},
            noscript: {parent: ' body head noframes '},
            object:   {},
            ol:       {},
            optgroup: {parent: ' select '},
            option:   {parent: ' optgroup select '},
            output:   {},
            p:        {},
            param:    {empty: true, parent: ' applet object '},
            pre:      {},
            progress: {},
            q:        {},
            rp:       {},
            rt:       {},
            ruby:     {},
            samp:     {},
            script:   {empty: true, parent: ' body div frame head iframe p pre span '},
            section:  {},
            select:   {},
            small:    {},
            span:     {},
            source:   {},
            strong:   {},
            style:    {parent: ' head ', empty: true},
            sub:      {},
            sup:      {},
            table:    {},
            tbody:    {parent: ' table '},
            td:       {parent: ' tr '},
            textarea: {},
            tfoot:    {parent: ' table '},
            th:       {parent: ' tr '},
            thead:    {parent: ' table '},
            time:     {},
            title:    {parent: ' head '},
            tr:       {parent: ' table tbody thead tfoot '},
            tt:       {},
            u:        {},
            ul:       {},
            'var':    {},
            video:    {}
        },

        ids,            // HTML ids
        implied,        // Implied globals
        in_block,
        indent,
        json_mode,
        lines,
        lookahead,
        member,
        node = {
            Buffer       : false,
            clearInterval: false,
            clearTimout  : false,
            console      : false,
            global       : false,
            module       : false,
            process      : false,
            querystring  : false,
            require      : false,
            setInterval  : false,
            setTimeout   : false,
            util         : false,
            __filename   : false,
            __dirname    : false
        },
        properties,
        next_token,
        older_token,
        option,
        predefined,     // Global variables defined by option
        prereg,
        prev_token,
        regexp_flag = {
            g: true,
            i: true,
            m: true
        },
        rhino = {
            defineClass : false,
            deserialize : false,
            gc          : false,
            help        : false,
            load        : false,
            loadClass   : false,
            print       : false,
            quit        : false,
            readFile    : false,
            readUrl     : false,
            runCommand  : false,
            seal        : false,
            serialize   : false,
            spawn       : false,
            sync        : false,
            toint32     : false,
            version     : false
        },

        scope,      // The current scope
        semicolon_coda = {
            ';' : true,
            '"' : true,
            '\'': true,
            ')' : true
        },
        src,
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
            'eval'              : false,
            EvalError           : false,
            Function            : false,
            hasOwnProperty      : false,
            isFinite            : false,
            isNaN               : false,
            JSON                : false,
            Math                : false,
            Number              : false,
            Object              : false,
            parseInt            : false,
            parseFloat          : false,
            RangeError          : false,
            ReferenceError      : false,
            RegExp              : false,
            String              : false,
            SyntaxError         : false,
            TypeError           : false,
            URIError            : false
        },

        standard_property = {
            E                   : true,
            LN2                 : true,
            LN10                : true,
            LOG2E               : true,
            LOG10E              : true,
            MAX_VALUE           : true,
            MIN_VALUE           : true,
            NEGATIVE_INFINITY   : true,
            PI                  : true,
            POSITIVE_INFINITY   : true,
            SQRT1_2             : true,
            SQRT2               : true
        },

        strict_mode,
        syntax = {},
        tab,
        token,
        urls,
        var_mode,
        warnings,

// widget contains the global names which are provided to a Yahoo
// (fna Konfabulator) widget.

        widget = {
            alert                   : true,
            animator                : true,
            appleScript             : true,
            beep                    : true,
            bytesToUIString         : true,
            Canvas                  : true,
            chooseColor             : true,
            chooseFile              : true,
            chooseFolder            : true,
            closeWidget             : true,
            COM                     : true,
            convertPathToHFS        : true,
            convertPathToPlatform   : true,
            CustomAnimation         : true,
            escape                  : true,
            FadeAnimation           : true,
            filesystem              : true,
            Flash                   : true,
            focusWidget             : true,
            form                    : true,
            FormField               : true,
            Frame                   : true,
            HotKey                  : true,
            Image                   : true,
            include                 : true,
            isApplicationRunning    : true,
            iTunes                  : true,
            konfabulatorVersion     : true,
            log                     : true,
            md5                     : true,
            MenuItem                : true,
            MoveAnimation           : true,
            openURL                 : true,
            play                    : true,
            Point                   : true,
            popupMenu               : true,
            preferenceGroups        : true,
            preferences             : true,
            print                   : true,
            prompt                  : true,
            random                  : true,
            Rectangle               : true,
            reloadWidget            : true,
            ResizeAnimation         : true,
            resolvePath             : true,
            resumeUpdates           : true,
            RotateAnimation         : true,
            runCommand              : true,
            runCommandInBg          : true,
            saveAs                  : true,
            savePreferences         : true,
            screen                  : true,
            ScrollBar               : true,
            showWidgetPreferences   : true,
            sleep                   : true,
            speak                   : true,
            Style                   : true,
            suppressUpdates         : true,
            system                  : true,
            tellWidget              : true,
            Text                    : true,
            TextArea                : true,
            Timer                   : true,
            unescape                : true,
            updateNow               : true,
            URL                     : true,
            Web                     : true,
            widget                  : true,
            Window                  : true,
            XMLDOM                  : true,
            XMLHttpRequest          : true,
            yahooCheckLogin         : true,
            yahooLogin              : true,
            yahooLogout             : true
        },

        windows = {
            ActiveXObject: false,
            CScript      : false,
            Debug        : false,
            Enumerator   : false,
            System       : false,
            VBArray      : false,
            WScript      : false
        },

//  xmode is used to adapt to the exceptions in html parsing.
//  It can have these states:
//      false   .js script file
//      html
//      outer
//      script
//      style
//      scriptstring
//      styleproperty

        xmode,
        xquote,

// Regular expressions. Some of these are stupidly long.

// unsafe comment or string
        ax = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i,
// unsafe characters that are silently deleted by one or more browsers
        cx = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
// token
        tx = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/(\*(jslint|properties|members|global)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/,
// html token
        hx = /^\s*(['"=>\/&#]|<(?:\/|\!(?:--)?)?|[a-zA-Z][a-zA-Z0-9_\-:]*|[0-9]+|--)/,
// characters in strings that need escapement
        nx = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
        nxg = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
// outer html token
        ox = /[>&]|<[\/!]?|--/,
// star slash
        lx = /\*\/|\/\*/,
// identifier
        ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/,
// javascript url
        jx = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i,
// url badness
        ux = /&|\+|\u00AD|\.\.|\/\*|%[^;]|base64|url|expression|data|mailto/i,
// style
        sx = /^\s*([{:#%.=,>+\[\]@()"';]|\*=?|\$=|\|=|\^=|~=|[a-zA-Z_][a-zA-Z0-9_\-]*|[0-9]+|<\/|\/\*)/,
        ssx = /^\s*([@#!"'};:\-%.=,+\[\]()*_]|[a-zA-Z][a-zA-Z0-9._\-]*|\/\*?|\d+(?:\.\d+)?|<\/)/,
// attributes characters
        qx = /[^a-zA-Z0-9+\-_\/ ]/,
// query characters for ids
        dx = /[\[\]\/\\"'*<>.&:(){}+=#]/,

        rx = {
            outer: hx,
            html: hx,
            style: sx,
            styleproperty: ssx
        };


    function return_this() {
        return this;
    }

    function F() {}     // Used by Object.create

// Provide critical ES5 functions to ES3.

    if (typeof Array.prototype.filter !== 'function') {
        Array.prototype.filter = function (f) {
            var i, length = this.length, result = [];
            for (i = 0; i < length; i += 1) {
                try {
                    result.push(f(this[i]));
                } catch (ignore) {
                }
            }
            return result;
        };
    }

    if (typeof Array.isArray !== 'function') {
        Array.isArray = function (o) {
            return Object.prototype.toString.apply(o) === '[object Array]';
        };
    }

    if (!Object.hasOwnProperty('create')) {
        Object.create = function (o) {
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = function (o) {
            var array = [], key;
            for (key in o) {
                if (Object.prototype.hasOwnProperty.call(o, key)) {
                    array.push(key);
                }
            }
            return array;
        };
    }

// Substandard methods

    if (typeof String.prototype.entityify !== 'function') {
        String.prototype.entityify = function () {
            return this
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
    }

    if (typeof String.prototype.isAlpha !== 'function') {
        String.prototype.isAlpha = function () {
            return (this >= 'a' && this <= 'z\uffff') ||
                (this >= 'A' && this <= 'Z\uffff');
        };
    }

    if (typeof String.prototype.isDigit !== 'function') {
        String.prototype.isDigit = function () {
            return (this >= '0' && this <= '9');
        };
    }

    if (typeof String.prototype.supplant !== 'function') {
        String.prototype.supplant = function (o) {
            return this.replace(/\{([^{}]*)\}/g, function (a, b) {
                var replacement = o[b];
                return typeof replacement === 'string' ||
                    typeof replacement === 'number' ? replacement : a;
            });
        };
    }

    if (typeof String.prototype.name !== 'function') {
        String.prototype.name = function () {

// If the string looks like an identifier, then we can return it as is.
// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can simply slap some quotes around it.
// Otherwise we must also replace the offending characters with safe
// sequences.

            if (ix.test(this)) {
                return this;
            }
            if (nx.test(this)) {
                return '"' + this.replace(nxg, function (a) {
                    if (escapes[a]) {
                        return escapes[a];
                    }
                    return '\\u' + ('0000' + a.charCodeAt().toString(16)).slice(-4);
                }) + '"';
            }
            return '"' + this + '"';
        };
    }


    function combine(a, b) {
        var name;
        for (name in b) {
            if (Object.prototype.hasOwnProperty.call(b, name)) {
                a[name] = b[name];
            }
        }
    }

    function assume() {
        if (!option.safe) {
            if (option.rhino) {
                combine(predefined, rhino);
            }
            if (option.devel) {
                combine(predefined, devel);
            }
            if (option.browser) {
                combine(predefined, browser);
            }
            if (option.windows) {
                combine(predefined, windows);
            }
            if (option.node) {
                combine(predefined, node);
            }
            if (option.widget) {
                combine(predefined, widget);
            }
        }
    }


// Produce an error warning.

    function quit(message, line, character) {
        throw {
            name: 'JSLintError',
            line: line,
            character: character,
            message: bundle.scanned_a_b.supplant({
                a: message,
                b: Math.floor((line / lines.length) * 100)
            })
        };
    }

    function warn(message, offender, a, b, c, d) {
        var character, line, warning;
        offender = offender || next_token;  // `~
        line = offender.line || 0;
        character = offender.from || 0;
        warning = {
            id: '(error)',
            raw: bundle[message] || message,
            evidence: lines[line - 1] || '',
            line: line,
            character: character,
            a: a || offender.value,
            b: b,
            c: c,
            d: d
        };
        warning.reason = warning.raw.supplant(warning);
        JSLINT.errors.push(warning);
        if (option.passfail) {
            quit(bundle.stopping, line, character);
        }
        warnings += 1;
        if (warnings >= option.maxerr) {
            quit(bundle.too_many, line, character);
        }
        return warning;
    }

    function warn_at(message, line, character, a, b, c, d) {
        return warn(message, {
            line: line,
            from: character
        }, a, b, c, d);
    }

    function fail(message, offender, a, b, c, d) {
        var warning = warn(message, offender, a, b, c, d);
        quit(bundle.stopping, warning.line, warning.character);
    }

    function fail_at(message, line, character, a, b, c, d) {
        return fail(message, {
            line: line,
            from: character
        }, a, b, c, d);
    }

    function expected_at(at) {
        if (option.white && next_token.from !== at) {
            warn('expected_a_at_b_c', next_token, next_token.value, at,
                next_token.from);
        }
    }

    function aint(it, name, expected) {
        if (it[name] !== expected) {
            warn('expected_a_b', it, expected, it[name]);
            return true;
        } else {
            return false;
        }
    }


// lexical analysis and token construction

    var lex = (function lex() {
        var character, from, line, source_row;

// Private lex methods

        function collect_comment(comment, quote, line, at) {
            var comment_object = {
                comment: comment,
                quote: quote,
                at: at,
                line: line
            };
            if (comments_off || src || (xmode && xmode !== 'script' &&
                    xmode !== 'style' && xmode !== 'styleproperty')) {
                warn_at('unexpected_comment', line, character);
            } else if (xmode === 'script' && /<\//i.test(source_row)) {
                warn_at('unexpected_a', line, character, '<\/');
            } else if (option.safe && ax.test(comment)) {
                warn_at('dangerous_comment', line, at);
            }
            if (older_token.comments) {
                older_token.comments.push(comment_object);
            } else {
                older_token.comments = [comment_object];
            }
            JSLINT.comments.push(comment_object);
        }

        function next_line() {
            var at;
            if (line >= lines.length) {
                return false;
            }
            character = 1;
            source_row = lines[line];
            line += 1;
            at = source_row.search(/ \t/);
            if (at >= 0) {
                warn_at('mixed', line, at + 1);
            }
            source_row = source_row.replace(/\t/g, tab);
            at = source_row.search(cx);
            if (at >= 0) {
                warn_at('unsafe', line, at);
            }
            if (option.maxlen && option.maxlen < source_row.length) {
                warn_at('too_long', line, source_row.length);
            }
            return true;
        }

// Produce a token object.  The token inherits from a syntax symbol.

        function it(type, value, quote) {
            var id, the_token;
            if (type === '(string)' || type === '(range)') {
                if (jx.test(value)) {
                    warn_at('url', line, from);
                }
            }
            the_token = Object.create(syntax[(
                type === '(punctuator)' ||
                    (type === '(identifier)' &&
                    Object.prototype.hasOwnProperty.call(syntax, value)) ?
                value :
                type
            )] || syntax['(error)']);
            if (type === '(identifier)') {
                the_token.identifier = true;
                if (value === '__iterator__' || value === '__proto__') {
                    fail_at('reserved_a', line, from, value);
                } else if (option.nomen &&
                        (value.charAt(0) === '_' ||
                        value.charAt(value.length - 1) === '_')) {
                    warn_at('dangling_a', line, from, value);
                }
            }
            if (value !== undefined) {
                the_token.value = value;
            }
            if (quote) {
                the_token.quote = quote;
            }
            the_token.line = line;
            the_token.from = from;
            the_token.thru = character;
            the_token.prev = older_token;
            id = the_token.id;
            prereg = id && (
                ('(,=:[!&|?{};'.indexOf(id.charAt(id.length - 1)) >= 0) ||
                id === 'return'
            );
            older_token.next = the_token;
            older_token = the_token;
            return the_token;
        }

// Public lex methods

        return {
            init: function (source) {
                if (typeof source === 'string') {
                    lines = source
                        .replace(/\r\n/g, '\n')
                        .replace(/\r/g, '\n')
                        .split('\n');
                } else {
                    lines = source;
                }
                line = 0;
                next_line();
                from = 1;
            },

            range: function (begin, end) {
                var c, value = '';
                from = character;
                if (source_row.charAt(0) !== begin) {
                    fail_at('expected_a_b', line, character, begin,
                        source_row.charAt(0));
                }
                for (;;) {
                    source_row = source_row.slice(1);
                    character += 1;
                    c = source_row.charAt(0);
                    switch (c) {
                    case '':
                        fail_at('missing_a', line, character, c);
                        break;
                    case end:
                        source_row = source_row.slice(1);
                        character += 1;
                        return it('(range)', value);
                    case xquote:
                    case '\\':
                        warn_at('unexpected_a', line, character, c);
                        break;
                    }
                    value += c;
                }
            },

// token -- this is called by advance to get the next token.

            token: function () {
                var b, c, captures, digit, depth, flag, high, i, j, length, low, quote, symbol;

                function match(x) {
                    var exec = x.exec(source_row), first;
                    if (exec) {
                        length = exec[0].length;
                        first = exec[1];
                        c = first.charAt(0);
                        source_row = source_row.substr(length);
                        from = character + length - first.length;
                        character += length;
                        return first;
                    }
                }

                function string(x) {
                    var c, j, r = '';

                    function hex(n) {
                        var i = parseInt(source_row.substr(j + 1, n), 16);
                        j += n;
                        if (i >= 32 && i <= 126 &&
                                i !== 34 && i !== 92 && i !== 39) {
                            warn_at('unexpected_a', line, character, '\\');
                        }
                        character += n;
                        c = String.fromCharCode(i);
                    }

                    if (json_mode && x !== '"') {
                        warn_at('expected_a', line, character, '"');
                    }

                    if (xquote === x || (xmode === 'scriptstring' && !xquote)) {
                        return it('(punctuator)', x);
                    }

                    j = 0;
                    for (;;) {
                        while (j >= source_row.length) {
                            j = 0;
                            if (xmode !== 'html' || !next_line()) {
                                fail_at('unclosed', line, from);
                            }
                        }
                        c = source_row.charAt(j);
                        if (c === x) {
                            character += 1;
                            source_row = source_row.substr(j + 1);
                            return it('(string)', r, x);
                        }
                        if (c < ' ') {
                            if (c === '\n' || c === '\r') {
                                break;
                            }
                            warn_at('control_a',
                                line, character + j, source_row.slice(0, j));
                        } else if (c === xquote) {
                            warn_at('bad_html', line, character + j);
                        } else if (c === '<') {
                            if (option.safe && xmode === 'html') {
                                warn_at('adsafe_a', line, character + j, c);
                            } else if (source_row.charAt(j + 1) === '/' && (xmode || option.safe)) {
                                warn_at('expected_a_b', line, character,
                                    '<\\/', '</');
                            } else if (source_row.charAt(j + 1) === '!' && (xmode || option.safe)) {
                                warn_at('unexpected_a', line, character, '<!');
                            }
                        } else if (c === '\\') {
                            if (xmode === 'html') {
                                if (option.safe) {
                                    warn_at('adsafe_a', line, character + j, c);
                                }
                            } else if (xmode === 'styleproperty') {
                                j += 1;
                                character += 1;
                                c = source_row.charAt(j);
                                if (c !== x) {
                                    warn_at('unexpected_a', line, character, '\\');
                                }
                            } else {
                                j += 1;
                                character += 1;
                                c = source_row.charAt(j);
                                switch (c) {
                                case xquote:
                                    warn_at('bad_html', line, character + j);
                                    break;
                                case '\\':
                                case '"':
                                case '/':
                                    break;
                                case '\'':
                                    if (json_mode) {
                                        warn_at('unexpected_a', line, character, '\\\'');
                                    }
                                    break;
                                case 'b':
                                    c = '\b';
                                    break;
                                case 'f':
                                    c = '\f';
                                    break;
                                case 'n':
                                    c = '\n';
                                    break;
                                case 'r':
                                    c = '\r';
                                    break;
                                case 't':
                                    c = '\t';
                                    break;
                                case 'u':
                                    hex(4);
                                    break;
                                case 'v':
                                    if (json_mode) {
                                        warn_at('unexpected_a', line, character, '\\v');
                                    }
                                    c = '\v';
                                    break;
                                case 'x':
                                    if (json_mode) {
                                        warn_at('unexpected_a', line, character, '\\x');
                                    }
                                    hex(2);
                                    break;
                                default:
                                    warn_at('unexpected_a', line, character, '\\');
                                }
                            }
                        }
                        r += c;
                        character += 1;
                        j += 1;
                    }
                }

                for (;;) {
                    while (!source_row) {
                        if (!next_line()) {
                            return it('(end)');
                        }
                    }
                    while (xmode === 'outer') {
                        i = source_row.search(ox);
                        if (i === 0) {
                            break;
                        } else if (i > 0) {
                            character += 1;
                            source_row = source_row.slice(i);
                            break;
                        } else {
                            if (!next_line()) {
                                return it('(end)', '');
                            }
                        }
                    }
                    symbol = match(rx[xmode] || tx);
                    if (!symbol) {
                        symbol = '';
                        c = '';
                        while (source_row && source_row < '!') {
                            source_row = source_row.substr(1);
                        }
                        if (source_row) {
                            if (xmode === 'html') {
                                return it('(error)', source_row.charAt(0));
                            } else {
                                fail_at('unexpected_a',
                                    line, character, source_row.substr(0, 1));
                            }
                        }
                    } else {

//      identifier

                        if (c.isAlpha() || c === '_' || c === '$') {
                            return it('(identifier)', symbol);
                        }

//      number

                        if (c.isDigit()) {
                            if (xmode !== 'style' &&
                                    xmode !== 'styleproperty' &&
                                    source_row.substr(0, 1).isAlpha()) {
                                warn_at('expected_space_a_b',
                                    line, character, c, source_row.charAt(0));
                            }
                            if (c === '0') {
                                digit = symbol.substr(1, 1);
                                if (digit.isDigit()) {
                                    if (token.id !== '.' && xmode !== 'styleproperty') {
                                        warn_at('unexpected_a',
                                            line, character, symbol);
                                    }
                                } else if (json_mode && (digit === 'x' || digit === 'X')) {
                                    warn_at('unexpected_a', line, character, '0x');
                                }
                            }
                            if (symbol.substr(symbol.length - 1) === '.') {
                                warn_at('trailing_decimal_a', line,
                                    character, symbol);
                            }
                            if (xmode !== 'style') {
                                digit = +symbol;
                                if (!isFinite(digit)) {
                                    warn_at('bad_number', line, character, symbol);
                                }
                                symbol = digit;
                            }
                            return it('(number)', symbol);
                        }
                        switch (symbol) {

//      string

                        case '"':
                        case "'":
                            return string(symbol);

//      // comment

                        case '//':
                            collect_comment(source_row, '//', line, character);
                            source_row = '';
                            break;

//      /* comment

                        case '/*':
                            quote = '/*';
                            for (;;) {
                                i = source_row.search(lx);
                                if (i >= 0) {
                                    break;
                                }
                                collect_comment(source_row, quote, line, character);
                                quote = '';
                                if (!next_line()) {
                                    fail_at('unclosed_comment', line, character);
                                }
                            }
                            collect_comment(source_row.slice(0, i), quote, character, line);
                            character += i + 2;
                            if (source_row.substr(i, 1) === '/') {
                                fail_at('nested_comment', line, character);
                            }
                            source_row = source_row.substr(i + 2);
                            break;

                        case '':
                            break;
//      /
                        case '/':
                            if (token.id === '/=') {
                                fail_at(
                                    bundle.slash_equal,
                                    line,
                                    from
                                );
                            }
                            if (prereg) {
                                depth = 0;
                                captures = 0;
                                length = 0;
                                for (;;) {
                                    b = true;
                                    c = source_row.charAt(length);
                                    length += 1;
                                    switch (c) {
                                    case '':
                                        fail_at('unclosed_regexp', line, from);
                                        return;
                                    case '/':
                                        if (depth > 0) {
                                            warn_at('unescaped_a',
                                                line, from + length, '/');
                                        }
                                        c = source_row.substr(0, length - 1);
                                        flag = Object.create(regexp_flag);
                                        while (flag[source_row.charAt(length)] === true) {
                                            flag[source_row.charAt(length)] = false;
                                            length += 1;
                                        }
                                        if (source_row.charAt(length).isAlpha()) {
                                            fail_at('unexpected_a',
                                                line, from, source_row.charAt(length));
                                        }
                                        character += length;
                                        source_row = source_row.substr(length);
                                        quote = source_row.charAt(0);
                                        if (quote === '/' || quote === '*') {
                                            fail_at('confusing_regexp',
                                                line, from);
                                        }
                                        return it('(regexp)', c);
                                    case '\\':
                                        c = source_row.charAt(length);
                                        if (c < ' ') {
                                            warn_at('control_a',
                                                line, from + length, String(c));
                                        } else if (c === '<') {
                                            warn_at(
                                                bundle.unexpected_a,
                                                line,
                                                from + length,
                                                '\\'
                                            );
                                        }
                                        length += 1;
                                        break;
                                    case '(':
                                        depth += 1;
                                        b = false;
                                        if (source_row.charAt(length) === '?') {
                                            length += 1;
                                            switch (source_row.charAt(length)) {
                                            case ':':
                                            case '=':
                                            case '!':
                                                length += 1;
                                                break;
                                            default:
                                                warn_at(
                                                    bundle.expected_a_b,
                                                    line,
                                                    from + length,
                                                    ':',
                                                    source_row.charAt(length)
                                                );
                                            }
                                        } else {
                                            captures += 1;
                                        }
                                        break;
                                    case '|':
                                        b = false;
                                        break;
                                    case ')':
                                        if (depth === 0) {
                                            warn_at('unescaped_a',
                                                line, from + length, ')');
                                        } else {
                                            depth -= 1;
                                        }
                                        break;
                                    case ' ':
                                        j = 1;
                                        while (source_row.charAt(length) === ' ') {
                                            length += 1;
                                            j += 1;
                                        }
                                        if (j > 1) {
                                            warn_at('use_braces',
                                                line, from + length, j);
                                        }
                                        break;
                                    case '[':
                                        c = source_row.charAt(length);
                                        if (c === '^') {
                                            length += 1;
                                            if (option.regexp) {
                                                warn_at('insecure_a',
                                                    line, from + length, c);
                                            } else if (source_row.charAt(length) === ']') {
                                                fail_at('unescaped_a',
                                                    line, from + length, '^');
                                            }
                                        }
                                        quote = false;
                                        if (c === ']') {
                                            warn_at('empty_class', line,
                                                from + length - 1);
                                            quote = true;
                                        }
klass:                                  do {
                                            c = source_row.charAt(length);
                                            length += 1;
                                            switch (c) {
                                            case '[':
                                            case '^':
                                                warn_at('unescaped_a',
                                                    line, from + length, c);
                                                quote = true;
                                                break;
                                            case '-':
                                                if (quote) {
                                                    quote = false;
                                                } else {
                                                    warn_at('unescaped_a',
                                                        line, from + length, '-');
                                                    quote = true;
                                                }
                                                break;
                                            case ']':
                                                if (!quote) {
                                                    warn_at('unescaped_a',
                                                        line, from + length - 1, '-');
                                                }
                                                break klass;
                                            case '\\':
                                                c = source_row.charAt(length);
                                                if (c < ' ') {
                                                    warn_at(
                                                        bundle.control_a,
                                                        line,
                                                        from + length,
                                                        String(c)
                                                    );
                                                } else if (c === '<') {
                                                    warn_at(
                                                        bundle.unexpected_a,
                                                        line,
                                                        from + length,
                                                        '\\'
                                                    );
                                                }
                                                length += 1;
                                                quote = true;
                                                break;
                                            case '/':
                                                warn_at('unescaped_a',
                                                    line, from + length - 1, '/');
                                                quote = true;
                                                break;
                                            case '<':
                                                if (xmode === 'script') {
                                                    c = source_row.charAt(length);
                                                    if (c === '!' || c === '/') {
                                                        warn_at(
                                                            bundle.html_confusion_a,
                                                            line,
                                                            from + length,
                                                            c
                                                        );
                                                    }
                                                }
                                                quote = true;
                                                break;
                                            default:
                                                quote = true;
                                            }
                                        } while (c);
                                        break;
                                    case '.':
                                        if (option.regexp) {
                                            warn_at('insecure_a', line,
                                                from + length, c);
                                        }
                                        break;
                                    case ']':
                                    case '?':
                                    case '{':
                                    case '}':
                                    case '+':
                                    case '*':
                                        warn_at('unescaped_a', line,
                                            from + length, c);
                                        break;
                                    case '<':
                                        if (xmode === 'script') {
                                            c = source_row.charAt(length);
                                            if (c === '!' || c === '/') {
                                                warn_at(
                                                    bundle.html_confusion_a,
                                                    line,
                                                    from + length,
                                                    c
                                                );
                                            }
                                        }
                                        break;
                                    }
                                    if (b) {
                                        switch (source_row.charAt(length)) {
                                        case '?':
                                        case '+':
                                        case '*':
                                            length += 1;
                                            if (source_row.charAt(length) === '?') {
                                                length += 1;
                                            }
                                            break;
                                        case '{':
                                            length += 1;
                                            c = source_row.charAt(length);
                                            if (c < '0' || c > '9') {
                                                warn_at(
                                                    bundle.expected_number_a,
                                                    line,
                                                    from + length,
                                                    c
                                                );
                                            }
                                            length += 1;
                                            low = +c;
                                            for (;;) {
                                                c = source_row.charAt(length);
                                                if (c < '0' || c > '9') {
                                                    break;
                                                }
                                                length += 1;
                                                low = +c + (low * 10);
                                            }
                                            high = low;
                                            if (c === ',') {
                                                length += 1;
                                                high = Infinity;
                                                c = source_row.charAt(length);
                                                if (c >= '0' && c <= '9') {
                                                    length += 1;
                                                    high = +c;
                                                    for (;;) {
                                                        c = source_row.charAt(length);
                                                        if (c < '0' || c > '9') {
                                                            break;
                                                        }
                                                        length += 1;
                                                        high = +c + (high * 10);
                                                    }
                                                }
                                            }
                                            if (source_row.charAt(length) !== '}') {
                                                warn_at(
                                                    bundle.expected_a_b,
                                                    line,
                                                    from + length,
                                                    '}',
                                                    c
                                                );
                                            } else {
                                                length += 1;
                                            }
                                            if (source_row.charAt(length) === '?') {
                                                length += 1;
                                            }
                                            if (low > high) {
                                                warn_at(
                                                    bundle.not_greater,
                                                    line,
                                                    from + length,
                                                    low,
                                                    high
                                                );
                                            }
                                            break;
                                        }
                                    }
                                }
                                c = source_row.substr(0, length - 1);
                                character += length;
                                source_row = source_row.substr(length);
                                return it('(regexp)', c);
                            }
                            return it('(punctuator)', symbol);

//      punctuator

                        case '<!--':
                            length = line;
                            c = character;
                            for (;;) {
                                i = source_row.indexOf('--');
                                if (i >= 0) {
                                    break;
                                }
                                i = source_row.indexOf('<!');
                                if (i >= 0) {
                                    fail_at('nested_comment',
                                        line, character + i);
                                }
                                if (!next_line()) {
                                    fail_at('unclosed_comment', length, c);
                                }
                            }
                            length = source_row.indexOf('<!');
                            if (length >= 0 && length < i) {
                                fail_at('nested_comment',
                                    line, character + length);
                            }
                            character += i;
                            if (source_row.charAt(i + 2) !== '>') {
                                fail_at('expected_a', line, character, '-->');
                            }
                            character += 3;
                            source_row = source_row.slice(i + 3);
                            break;
                        case '#':
                            if (xmode === 'html' || xmode === 'styleproperty') {
                                for (;;) {
                                    c = source_row.charAt(0);
                                    if ((c < '0' || c > '9') &&
                                            (c < 'a' || c > 'f') &&
                                            (c < 'A' || c > 'F')) {
                                        break;
                                    }
                                    character += 1;
                                    source_row = source_row.substr(1);
                                    symbol += c;
                                }
                                if (symbol.length !== 4 && symbol.length !== 7) {
                                    warn_at('bad_color_a', line,
                                        from + length, symbol);
                                }
                                return it('(color)', symbol);
                            }
                            return it('(punctuator)', symbol);

                        default:
                            if (xmode === 'outer' && c === '&') {
                                character += 1;
                                source_row = source_row.substr(1);
                                for (;;) {
                                    c = source_row.charAt(0);
                                    character += 1;
                                    source_row = source_row.substr(1);
                                    if (c === ';') {
                                        break;
                                    }
                                    if (!((c >= '0' && c <= '9') ||
                                            (c >= 'a' && c <= 'z') ||
                                            c === '#')) {
                                        fail_at('bad_entity', line, from + length,
                                            character);
                                    }
                                }
                                break;
                            }
                            return it('(punctuator)', symbol);
                        }
                    }
                }
            }
        };
    }());


    function add_label(symbol, type) {

        if (option.safe && funct['(global)'] &&
                typeof predefined[symbol] !== 'boolean') {
            warn('adsafe_a', token, symbol);
        } else if (symbol === 'hasOwnProperty') {
            warn('bad_name_a', token, symbol);
        }

// Define symbol in the current function in the current scope.

        if (Object.prototype.hasOwnProperty.call(funct, symbol) && !funct['(global)']) {
            warn(funct[symbol] === true ?
                bundle.used_before_a :
                bundle.already_defined,
                next_token, symbol);
        }
        funct[symbol] = type;
        if (funct['(global)']) {
            if (global[symbol] === false) {
                warn('read_only');
            }
            global[symbol] = true;
            if (Object.prototype.hasOwnProperty.call(implied, symbol)) {
                warn('used_before_a', next_token, symbol);
                delete implied[symbol];
            }
        } else {
            scope[symbol] = funct;
        }
    }


    function peek(distance) {

// Peek ahead to a future token. The distance is how far ahead to look. The
// default is the next token.

        var found, slot = 0;

        distance = distance || 0;
        while (slot <= distance) {
            found = lookahead[slot];
            if (!found) {
                found = lookahead[slot] = lex.token();
            }
            slot += 1;
        }
        return found;
    }


    function discard(it) {

// The token will not be included in the parse tree, so move the comments
// that are attached to the token to tokens that are in the tree.

        it = it || token;
        if (it.comments) {
            var prev = it.prev;
            while (prev.comments === null) {
                prev = prev.prev;
            }
            if (prev.comments) {
                prev.comments = prev.comments.concat(it.comments);
            } else {
                prev.comments = it.comments;
            }
        }
        it.comments = null;
    }


    function advance(id, match) {

// Produce the next token, also looking for programming errors.

        if (indent) {

// In indentation checking was requested, then inspect all of the line breakings.
// The var statement is tricky because the names might be aligned or not. We
// look at the first line break after the var to determine the programmer's
// intention.

            if (var_mode && next_token.line !== token.line) {
                if ((var_mode !== indent || !next_token.edge) &&
                        next_token.from === indent.at -
                        (next_token.edge ? option.indent : 0)) {
                    var dent = indent;
                    for (;;) {
                        dent.at -= option.indent;
                        if (dent === var_mode) {
                            break;
                        }
                        dent = dent.was;
                    }
                    dent.open = false;
                }
                var_mode = false;
            }
            if (indent.open) {

// If the token is an edge.

                if (next_token.edge) {
                    if (next_token.edge === 'label') {
                        expected_at(1);
                    } else if (next_token.edge === 'case') {
                        expected_at(indent.at - option.indent);
                    } else if (indent.mode !== 'array' || next_token.line !== token.line) {
                        expected_at(indent.at);
                    }

// If the token is not an edge, but is the first token on the line.

                } else if (next_token.line !== token.line &&
                        next_token.from < indent.at + (indent.mode ===
                        'expression' ? 0 : option.indent)) {
                    expected_at(indent.at + option.indent);
                }
            } else if (next_token.line !== token.line) {
                if (next_token.edge) {
                    expected_at(indent.at);
                } else {
                    indent.wrap = true;
                    if (indent.mode === 'statement' || indent.mode === 'var') {
                        expected_at(indent.at + option.indent);
                    } else if (next_token.from < indent.at + (indent.mode ===
                            'expression' ? 0 : option.indent)) {
                        expected_at(indent.at + option.indent);
                    }
                }
            }
        }

        switch (token.id) {
        case '(number)':
            if (next_token.id === '.') {
                warn('trailing_decimal_a');
            }
            break;
        case '-':
            if (next_token.id === '-' || next_token.id === '--') {
                warn('confusing_a');
            }
            break;
        case '+':
            if (next_token.id === '+' || next_token.id === '++') {
                warn('confusing_a');
            }
            break;
        }
        if (token.arity === 'string' || token.identifier) {
            anonname = token.value;
        }

        if (id && next_token.id !== id) {
            if (match) {
                warn('expected_a_b_from_c_d', next_token, id,
                    match.id, match.line, next_token.value);
            } else if (!next_token.identifier || next_token.value !== id) {
                warn('expected_a_b', next_token, id, next_token.value);
            }
        }
        prev_token = token;
        token = next_token;
        next_token = lookahead.shift() || lex.token();
        if (token.id === '(end)') {
            discard();
        }
    }


    function directive() {
        var command = this.id,
            name,
            old_comments_off = comments_off,
            old_option_white = option.white,
            value;
        comments_off = true;
        option.white = false;
        if (lookahead.length > 0 || next_token.comments) {
            warn('unexpected_a', this);
        }
        switch (command) {
        case '/*properties':
        case '/*members':
            command = '/*properties';
            if (!properties) {
                properties = {};
            }
            break;
        case '/*jslint':
            if (option.safe) {
                warn('adsafe_a', this);
            }
            break;
        case '/*global':
            if (option.safe) {
                warn('adsafe_a', this);
            }
            break;
        default:
            fail('unpexpected_a', this);
        }
loop:   for (;;) {
            for (;;) {
                if (next_token.id === '*/') {
                    break loop;
                }
                if (next_token.id !== ',') {
                    break;
                }
                advance();
            }
            if (next_token.arity !== 'string' && !next_token.identifier) {
                fail('unexpected_a', next_token);
            }
            name = next_token.value;
            advance();
            switch (command) {
            case '/*global':
                if (next_token.id === ':') {
                    advance(':');
                    switch (next_token.id) {
                    case 'true':
                        if (typeof scope[name] === 'object' ||
                                global[name] === false) {
                            fail('unexpected_a');
                        }
                        global[name] = true;
                        advance('true');
                        break;
                    case 'false':
                        if (typeof scope[name] === 'object') {
                            fail('unexpected_a');
                        }
                        global[name] = false;
                        advance('false');
                        break;
                    default:
                        fail('unexpected_a');
                    }
                } else {
                    if (typeof scope[name] === 'object') {
                        fail('unexpected_a');
                    }
                    global[name] = false;
                }
                break;
            case '/*jslint':
                if (next_token.id !== ':') {
                    fail('expected_a_b', next_token, ':', next_token.value);
                }
                advance(':');
                switch (name) {
                case 'indent':
                    value = +next_token.value;
                    if (typeof value !== 'number' ||
                            !isFinite(value) || value < 0 ||
                            Math.floor(value) !== value) {
                        fail('expected_small_a');
                    }
                    if (value > 0) {
                        old_option_white = true;
                    }
                    option.indent = value;
                    break;
                case 'maxerr':
                    value = +next_token.value;
                    if (typeof value !== 'number' ||
                            !isFinite(value) ||
                            value <= 0 ||
                            Math.floor(value) !== value) {
                        fail('expected_small_a', next_token);
                    }
                    option.maxerr = value;
                    break;
                case 'maxlen':
                    value = +next_token.value;
                    if (typeof value !== 'number' || !isFinite(value) || value < 0 ||
                            Math.floor(value) !== value) {
                        fail('expected_small_a');
                    }
                    option.maxlen = value;
                    break;
                case 'white':
                    if (next_token.id === 'true') {
                        old_option_white = true;
                    } else if (next_token.id === 'false') {
                        old_option_white = false;
                    } else {
                        fail('unexpected_a');
                    }
                    break;
                default:
                    if (next_token.id === 'true') {
                        option[name] = true;
                    } else if (next_token.id === 'false') {
                        option[name] = false;
                    } else {
                        fail('unexpected_a');
                    }
                }
                advance();
                break;
            case '/*properties':
                properties[name] = true;
                break;
            default:
                fail('unexpected_a');
            }
        }
        if (command === '/*jslint') {
            assume();
        }
        comments_off = old_comments_off;
        advance('*/');
        option.white = old_option_white;
    }


// Indentation intention

    function edge(mode) {
        next_token.edge = !indent || (indent.open && (mode || true));
    }


    function step_in(mode) {
        var open, was;
        if (typeof mode === 'number') {
            indent = {
                at: mode,
                open: true,
                was: was
            };
        } else if (!indent) {
            indent = {
                at: 1,
                mode: 'statement',
                open: true
            };
        } else {
            was = indent;
            open = mode === 'var' ||
                (next_token.line !== token.line && mode !== 'statement');
            indent = {
                at: (open || mode === 'control' ?
                    was.at + option.indent : was.at) +
                    (was.wrap ? option.indent : 0),
                mode: mode,
                open: open,
                was: was
            };
            if (mode === 'var' && open) {
                var_mode = indent;
            }
        }
    }

    function step_out(id, symbol) {
        if (id) {
            if (indent && indent.open) {
                indent.at -= option.indent;
                edge();
            }
            advance(id, symbol);
        }
        if (indent) {
            indent = indent.was;
        }
    }

// Functions for conformance of whitespace.

    function one_space(left, right) {
        left = left || token;
        right = right || next_token;
        if (right.id !== '(end)' && option.white &&
                (token.line !== right.line ||
                token.thru + 1 !== right.from)) {
            warn('expected_space_a_b', right, token.value, right.value);
        }
    }

    function one_space_only(left, right) {
        left = left || token;
        right = right || next_token;
        if (right.id !== '(end)' && (left.line !== right.line ||
                (option.white && left.thru + 1 !== right.from))) {
            warn('expected_space_a_b', right, left.value, right.value);
        }
    }

    function no_space(left, right) {
        left = left || token;
        right = right || next_token;
        if ((option.white || xmode === 'styleproperty' || xmode === 'style') &&
                left.thru !== right.from && left.line === right.line) {
            warn('unexpected_space_a_b', right, left.value, right.value);
        }
    }

    function no_space_only(left, right) {
        left = left || token;
        right = right || next_token;
        if (right.id !== '(end)' && (left.line !== right.line ||
                (option.white && left.thru !== right.from))) {
            warn('unexpected_space_a_b', right, left.value, right.value);
        }
    }

    function spaces(left, right) {
        if (option.white) {
            left = left || token;
            right = right || next_token;
            if (left.thru === right.from && left.line === right.line) {
                warn('missing_space_a_b', right, left.value, right.value);
            }
        }
    }

    function comma() {
        if (next_token.id !== ',') {
            warn_at('expected_a_b', token.line, token.thru, ',', next_token.value);
        } else {
            if (option.white) {
                no_space_only();
            }
            advance(',');
            discard();
            spaces();
        }
    }


    function semicolon() {
        if (next_token.id !== ';') {
            warn_at('expected_a_b', token.line, token.thru, ';', next_token.value);
        } else {
            if (option.white) {
                no_space_only();
            }
            advance(';');
            discard();
            if (semicolon_coda[next_token.id] !== true) {
                spaces();
            }
        }
    }

    function use_strict() {
        if (next_token.value === 'use strict') {
            if (strict_mode) {
                warn('unnecessary_use');
            }
            edge();
            advance();
            semicolon();
            strict_mode = true;
            option.newcap = true;
            option.undef = true;
            return true;
        } else {
            return false;
        }
    }


    function are_similar(a, b) {
        if (a === b) {
            return true;
        }
        if (Array.isArray(a)) {
            if (Array.isArray(b) && a.length === b.length) {
                var i;
                for (i = 0; i < a.length; i += 1) {
                    if (!are_similar(a[i], b[i])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        if (Array.isArray(b)) {
            return false;
        }
        if (a.arity === b.arity && a.value === b.value) {
            switch (a.arity) {
            case 'prefix':
            case 'suffix':
            case undefined:
                return are_similar(a.first, b.first);
            case 'infix':
                return are_similar(a.first, b.first) &&
                    are_similar(a.second, b.second);
            case 'ternary':
                return are_similar(a.first, b.first) &&
                    are_similar(a.second, b.second) &&
                    are_similar(a.third, b.third);
            case 'function':
            case 'regexp':
                return false;
            default:
                return true;
            }
        } else {
            if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
                return a.second.value === b.second.value && b.second.arity === 'string';
            } else if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
                return a.second.value === b.second.value && a.second.arity === 'string';
            }
        }
        return false;
    }


// This is the heart of JSLINT, the Pratt parser. In addition to parsing, it
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

// rbp is the right binding power.
// initial indicates that this is the first expression of a statement.

        var left;
        if (next_token.id === '(end)') {
            fail('unexpected_a', token, next_token.id);
        }
        advance();
        if (option.safe && typeof predefined[token.value] === 'boolean' &&
                (next_token.id !== '(' && next_token.id !== '.')) {
            warn('adsafe', token);
        }
        if (initial) {
            anonname = 'anonymous';
            funct['(verb)'] = token.value;
        }
        if (initial === true && token.fud) {
            left = token.fud();
        } else {
            if (token.nud) {
                left = token.nud();
            } else {
                if (next_token.arity === 'number' && token.id === '.') {
                    warn('leading_decimal_a', token,
                        next_token.value);
                    advance();
                    return token;
                } else {
                    fail('expected_identifier_a', token, token.id);
                }
            }
            while (rbp < next_token.lbp) {
                advance();
                if (token.led) {
                    left = token.led(left);
                } else {
                    fail('expected_operator_a', token, token.id);
                }
            }
        }
        return left;
    }


// Functional constructors for making the symbols that will be inherited by
// tokens.

    function symbol(s, p) {
        var x = syntax[s];
        if (!x || typeof x !== 'object') {
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


    function postscript(x) {
        x.postscript = true;
        return x;
    }

    function ultimate(s) {
        var x = symbol(s, 0);
        x.from = 1;
        x.thru = 1;
        x.line = 0;
        x.edge = true;
        s.value = s;
        return postscript(x);
    }


    function stmt(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        x.fud = f;
        return x;
    }

    function labeled_stmt(s, f) {
        var x = stmt(s, f);
        x.labeled = true;
    }

    function disrupt_stmt(s, f) {
        var x = stmt(s, f);
        x.disrupt = true;
    }


    function reserve_name(x) {
        var c = x.id.charAt(0);
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            x.identifier = x.reserved = true;
        }
        return x;
    }


    function prefix(s, f) {
        var x = symbol(s, 150);
        reserve_name(x);
        x.nud = (typeof f === 'function') ? f : function () {
            if (s === 'typeof') {
                one_space();
            } else {
                no_space_only();
            }
            this.first = expression(150);
            this.arity = 'prefix';
            if (this.id === '++' || this.id === '--') {
                if (option.plusplus) {
                    warn('unexpected_a', this);
                } else if ((!this.first.identifier || this.first.reserved) &&
                        this.first.id !== '.' && this.first.id !== '[') {
                    warn('bad_operand', this);
                }
            }
            return this;
        };
        return x;
    }


    function type(s, arity, nud) {
        var x = delim(s);
        x.arity = arity;
        if (nud) {
            x.nud = nud;
        }
        return x;
    }


    function reserve(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        if (typeof f === 'function') {
            x.nud = f;
        }
        return x;
    }


    function reservevar(s, v) {
        return reserve(s, function () {
            if (typeof v === 'function') {
                v(this);
            }
            return this;
        });
    }


    function infix(s, p, f, w) {
        var x = symbol(s, p);
        reserve_name(x);
        x.led = function (left) {
            this.arity = 'infix';
            if (!w) {
                spaces(prev_token, token);
                spaces();
            }
            if (typeof f === 'function') {
                return f(left, this);
            } else {
                this.first = left;
                this.second = expression(p);
                return this;
            }
        };
        return x;
    }

    function expected_relation(node, message) {
        if (node.assign) {
            warn(message || bundle.conditional_assignment, node);
        }
        return node;
    }

    function expected_condition(node, message) {
        switch (node.id) {
        case '[':
        case '-':
            if (node.arity !== 'infix') {
                warn(message || bundle.weird_condition, node);
            }
            break;
        case 'false':
        case 'function':
        case 'Infinity':
        case 'NaN':
        case 'null':
        case 'true':
        case 'undefined':
        case 'void':
        case '(number)':
        case '(regexp)':
        case '(string)':
        case '{':
            warn(message || bundle.weird_condition, node);
            break;
        }
        return node;
    }

    function check_relation(node) {
        switch (node.arity) {
        case 'prefix':
            switch (node.id) {
            case '{':
            case '[':
                warn('unexpected_a', node);
                break;
            case '!':
                warn('confusing_a', node);
                break;
            }
            break;
        case 'function':
        case 'regexp':
            warn('unexpected_a', node);
            break;
        default:
            if (node.id  === 'NaN') {
                warn('isnan', node);
            }
        }
        return node;
    }


    function relation(s, eqeq) {
        var x = infix(s, 100, function (left, that) {
            check_relation(left);
            if (eqeq) {
                warn('expected_a_b', that, eqeq, that.id);
            }
            var right = expression(100);
            if (are_similar(left, right) ||
                    ((left.arity === 'string' || left.arity === 'number') &&
                    (right.arity === 'string' || right.arity === 'number'))) {
                warn('weird_relation', that);
            }
            that.first = left;
            that.second = check_relation(right);
            return that;
        });
        return x;
    }


    function assignop(s, bit) {
        var x = infix(s, 20, function (left, that) {
            var l;
            if (option.bitwise && bit) {
                warn('unexpected_a', that);
            }
            that.first = left;
            if (funct[left.value] === false) {
                warn('read_only', left);
            } else if (left['function']) {
                warn('a_function', left);
            }
            if (option.safe) {
                l = left;
                do {
                    if (typeof predefined[l.value] === 'boolean') {
                        warn('adsafe', l);
                    }
                    l = l.first;
                } while (l);
            }
            if (left) {
                if (left === syntax['function']) {
                    warn('identifier_function', token);
                }
                if (left.id === '.' || left.id === '[') {
                    if (!left.first || left.first.value === 'arguments') {
                        warn('bad_assignment', that);
                    }
                    that.second = expression(19);
                    if (that.id === '=' && are_similar(that.first, that.second)) {
                        warn('weird_assignment', that);
                    }
                    return that;
                } else if (left.identifier && !left.reserved) {
                    if (funct[left.value] === 'exception') {
                        warn('assign_exception', left);
                    }
                    that.second = expression(19);
                    if (that.id === '=' && are_similar(that.first, that.second)) {
                        warn('weird_assignment', that);
                    }
                    return that;
                }
            }
            fail('bad_assignment', that);
        });
        x.assign = true;
        return x;
    }


    function bitwise(s, p) {
        return infix(s, p, function (left, that) {
            if (option.bitwise) {
                warn('unexpected_a', that);
            }
            that.first = left;
            that.second = expression(p);
            return that;
        });
    }


    function suffix(s, f) {
        var x = symbol(s, 150);
        x.led = function (left) {
            no_space_only(prev_token, token);
            if (option.plusplus) {
                warn('unexpected_a', this);
            } else if ((!left.identifier || left.reserved) &&
                    left.id !== '.' && left.id !== '[') {
                warn('bad_operand', this);
            }
            this.first = left;
            this.arity = 'suffix';
            return this;
        };
        return x;
    }


    function optional_identifier() {
        if (next_token.identifier) {
            advance();
            if (option.safe && banned[token.value]) {
                warn('adsafe_a', token);
            } else if (token.reserved && !option.es5) {
                warn('expected_identifier_a_reserved', token);
            }
            return token.value;
        }
    }


    function identifier() {
        var i = optional_identifier();
        if (i) {
            return i;
        }
        if (token.id === 'function' && next_token.id === '(') {
            warn('name_function');
        } else {
            fail('expected_identifier_a');
        }
    }


    function statement(no_indent) {

// Usually a statement starts a line. Exceptions include the var statement in the
// initialization part of a for statement, and an if after an else.

        var label, old_scope = scope, the_statement;

// We don't like the empty statement.

        if (next_token.id === ';') {
            warn('unexpected_a');
            semicolon();
            return;
        }

// Is this a labeled statement?

        if (next_token.identifier && !next_token.reserved && peek().id === ':') {
            edge('label');
            label = next_token;
            advance();
            discard();
            advance(':');
            discard();
            scope = Object.create(old_scope);
            add_label(label.value, 'label');
            if (next_token.labeled !== true) {
                warn('label_a_b', next_token, label.value, next_token.value);
            }
            if (jx.test(label.value + ':')) {
                warn('url', label);
            }
            next_token.label = label;
        }

// Parse the statement.

        edge();
        step_in('statement');
        the_statement = expression(0, true);
        if (the_statement) {

// Look for the final semicolon.

            if (the_statement.arity === 'statement') {
                if (the_statement.id === 'switch' ||
                        (the_statement.block && the_statement.id !== 'do')) {
                    spaces();
                } else {
                    semicolon();
                }
            } else {

// If this is an expression statement, determine if it is acceptble.
// We do not like
//      new Blah();
// statments. If it is to be used at all, new should only be used to make
// objects, not side effects. The expression statements we do like do
// assignment or invocation or delete.

                if (the_statement.id === '(') {
                    if (the_statement.first.id === 'new') {
                        warn('bad_new');
                    }
                } else if (!the_statement.assign &&
                        the_statement.id !== 'delete' &&
                        the_statement.id !== '++' &&
                        the_statement.id !== '--') {
                    warn('assignment_function_expression', token);
                }
                semicolon();
            }
        }
        step_out();
        scope = old_scope;
        return the_statement;
    }


    function statements() {
        var array = [], disruptor, the_statement;

// A disrupt statement may not be followed by any other statement.
// If the last statement is disrupt, then the sequence is disrupt.

        while (next_token.postscript !== true) {
            if (next_token.id === ';') {
                warn('unexpected_a', next_token);
                semicolon();
            } else {
                if (disruptor) {
                    warn('unreachable_a_b', next_token, next_token.value,
                        disruptor.value);
                    disruptor = null;
                }
                the_statement = statement();
                if (the_statement) {
                    array.push(the_statement);
                    if (the_statement.disrupt) {
                        disruptor = the_statement;
                        array.disrupt = true;
                    }
                }
            }
        }
        return array;
    }


    function block(ordinary) {

// array block is array sequence of statements wrapped in braces.
// ordinary is false for function bodies and try blocks.
// ordinary is true for if statements, while, etc.

        var array,
            curly = next_token,
            old_inblock = in_block,
            old_scope = scope,
            old_strict_mode = strict_mode;

        in_block = ordinary;
        scope = Object.create(scope);
        spaces();
        if (next_token.id === '{') {
            advance('{');
            step_in();
            if (!ordinary && !use_strict() && !old_strict_mode &&
                    option.strict && funct['(context)']['(global)']) {
                warn('missing_use_strict');
            }
            array = statements();
            strict_mode = old_strict_mode;
            step_out('}', curly);
            discard();
        } else if (!ordinary) {
            fail('expected_a_b', next_token, '{', next_token.value);
        } else {
            warn('expected_a_b', next_token, '{', next_token.value);
            array = [statement()];
            array.disrupt = array[0].disrupt;
        }
        funct['(verb)'] = null;
        scope = old_scope;
        in_block = old_inblock;
        if (ordinary && array.length === 0) {
            warn('empty_block');
        }
        return array;
    }


    function tally_property(name) {
        if (properties && typeof properties[name] !== 'boolean') {
            warn('unexpected_member_a', token, name);
        }
        if (typeof member[name] === 'number') {
            member[name] += 1;
        } else {
            member[name] = 1;
        }
    }


    function note_implied(token) {
        var name = token.value, line = token.line, a = implied[name];
        if (typeof a === 'function') {
            a = false;
        }
        if (!a) {
            a = [line];
            implied[name] = a;
        } else if (a[a.length - 1] !== line) {
            a.push(line);
        }
    }


// ECMAScript parser

    syntax['(identifier)'] = {
        type: '(identifier)',
        lbp: 0,
        identifier: true,
        nud: function () {
            var variable = this.value,
                site = scope[variable];
            if (typeof site === 'function') {
                site = undefined;
            }

// The name is in scope and defined in the current function.

            if (funct === site) {

//      Change 'unused' to 'var', and reject labels.

                switch (funct[variable]) {
                case 'error':
                    warn('unexpected_a', token);
                    funct[variable] = 'var';
                    break;
                case 'unused':
                    funct[variable] = 'var';
                    break;
                case 'unction':
                    funct[variable] = 'function';
                    this['function'] = true;
                    break;
                case 'function':
                    this['function'] = true;
                    break;
                case 'label':
                    warn('a_label', token, variable);
                    break;
                }

// The name is not defined in the function.  If we are in the global scope,
// then we have an undefined variable.

            } else if (funct['(global)']) {
                if (typeof global[variable] === 'boolean') {
                    funct[variable] = global[variable];
                } else {
                    if (option.undef) {
                        warn('not_a_defined', token, variable);
                    } else {
                        note_implied(token);
                    }
                }

// If the name is already defined in the current
// function, but not as outer, then there is a scope error.

            } else {
                switch (funct[variable]) {
                case 'closure':
                case 'function':
                case 'var':
                case 'unused':
                    warn('a_scope', token, variable);
                    break;
                case 'label':
                    warn('a_label', token, variable);
                    break;
                case 'outer':
                case true:
                case false:
                    break;
                default:

// If the name is defined in an outer function, make an outer entry, and if
// it was unused, make it var.

                    if (typeof site === 'boolean') {
                        funct[variable] = site;
                        functions[0][variable] = true;
                    } else if (site === null) {
                        warn('a_not_allowed', token, variable);
                        note_implied(token);
                    } else if (typeof site !== 'object') {
                        if (option.undef) {
                            warn('a_not_defined', token, variable);
                        } else {
                            funct[variable] = true;
                        }
                        note_implied(token);
                    } else {
                        switch (site[variable]) {
                        case 'function':
                        case 'unction':
                            this['function'] = true;
                            site[variable] = 'closure';
                            funct[variable] = site['(global)'] ? false : 'outer';
                            break;
                        case 'var':
                        case 'unused':
                            site[variable] = 'closure';
                            funct[variable] = site['(global)'] ? true : 'outer';
                            break;
                        case 'closure':
                        case 'parameter':
                            funct[variable] = site['(global)'] ? true : 'outer';
                            break;
                        case 'error':
                            warn('not_a_defined', token);
                            break;
                        case 'label':
                            warn('a_label', token, variable);
                            break;
                        }
                    }
                }
            }
            return this;
        },
        led: function () {
            fail('expected_operator_a');
        }
    };

// Build the syntax table by declaring the syntactic elements.

    type('(color)', 'color');
    type('(number)', 'number', return_this);
    type('(string)', 'string', return_this);
    type('(range)', 'range');
    type('(regexp)', 'regexp', return_this);

    ultimate('(begin)');
    ultimate('(end)');
    ultimate('(error)');
    postscript(delim('</'));
    delim('<!');
    delim('<!--');
    delim('-->');
    postscript(delim('}'));
    delim(')');
    delim(']');
    postscript(delim('"'));
    postscript(delim('\''));
    delim(';');
    delim(':');
    delim(',');
    delim('#');
    delim('@');
    delim('*/');
    postscript(reserve('case'));
    reserve('catch');
    postscript(reserve('default'));
    reserve('else');
    reserve('finally');

    reservevar('arguments', function (x) {
        if (strict_mode && funct['(global)']) {
            warn('strict', x);
        } else if (option.safe) {
            warn('adsafe', x);
        }
    });
    reservevar('eval', function (x) {
        if (option.safe) {
            warn('adsafe', x);
        }
    });
    reservevar('false');
    reservevar('Infinity');
    reservevar('NaN');
    reservevar('null');
    reservevar('this', function (x) {
        if (strict_mode && ((funct['(statement)'] &&
                funct['(name)'].charAt(0) > 'Z') || funct['(global)'])) {
            warn('strict', x);
        } else if (option.safe) {
            warn('adsafe', x);
        }
    });
    reservevar('true');
    reservevar('undefined');

    assignop('=');
    assignop('+=');
    assignop('-=');
    assignop('*=');
    assignop('/=').nud = function () {
        fail('slash_equal');
    };
    assignop('%=');
    assignop('&=', true);
    assignop('|=', true);
    assignop('^=', true);
    assignop('<<=', true);
    assignop('>>=', true);
    assignop('>>>=', true);

    infix('?', 30, function (left, that) {
        that.first = expected_condition(expected_relation(left));
        that.second = expression(0);
        spaces();
        advance(':');
        discard();
        spaces();
        that.third = expression(10);
        that.arity = 'ternary';
        if (are_similar(that.second, that.third)) {
            warn('weird_ternary', that);
        }
        return that;
    });

    infix('||', 40, function (left, that) {
        function paren_check(that) {
            if (that.id === '&&' && !that.paren) {
                warn('and', that);
            }
            return that;
        }

        that.first = paren_check(expected_condition(expected_relation(left)));
        that.second = paren_check(expected_relation(expression(40)));
        if (are_similar(that.first, that.second)) {
            warn('weird_condition', that);
        }
        return that;
    });

    infix('&&', 50, function (left, that) {
        that.first = expected_condition(expected_relation(left));
        that.second = expected_relation(expression(50));
        if (are_similar(that.first, that.second)) {
            warn('weird_condition', that);
        }
        return that;
    });

    prefix('void', function () {
        this.first = expression(0);
        if (this.first.arity !== 'number' || this.first.value) {
            warn('unexpected_a', this);
            return this;
        }
        return this;
    });

    bitwise('|', 70);
    bitwise('^', 80);
    bitwise('&', 90);

    relation('==', '===');
    relation('===');
    relation('!=', '!==');
    relation('!==');
    relation('<');
    relation('>');
    relation('<=');
    relation('>=');

    bitwise('<<', 120);
    bitwise('>>', 120);
    bitwise('>>>', 120);

    infix('in', 120, function (left, that) {
        warn('infix_in', that);
        that.left = left;
        that.right = expression(130);
        return that;
    });
    infix('instanceof', 120);
    infix('+', 130, function (left, that) {
        if (!left.value) {
            if (left.arity === 'number') {
                warn('unexpected_a', left);
            } else if (left.arity === 'string') {
                warn('expected_a_b', left, 'String', '\'\'');
            }
        }
        var right = expression(130);
        if (!right.value) {
            if (right.arity === 'number') {
                warn('unexpected_a', right);
            } else if (right.arity === 'string') {
                warn('expected_a_b', right, 'String', '\'\'');
            }
        }
        if (left.arity === right.arity &&
                (left.arity === 'string' || left.arity === 'number')) {
            left.value += right.value;
            left.thru = right.thru;
            if (left.arity === 'string' && jx.test(left.value)) {
                warn('url', left);
            }
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    prefix('+', 'num');
    prefix('+++', function () {
        warn('confusing_a', token);
        this.first = expression(150);
        this.arity = 'prefix';
        return this;
    });
    infix('+++', 130, function (left) {
        warn('confusing_a', token);
        this.first = left;
        this.second = expression(130);
        return this;
    });
    infix('-', 130, function (left, that) {
        if ((left.arity === 'number' && left.value === 0) || left.arity === 'string') {
            warn('unexpected_a', left);
        }
        var right = expression(130);
        if ((right.arity === 'number' && right.value === 0) || right.arity === 'string') {
            warn('unexpected_a', left);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value -= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    prefix('-');
    prefix('---', function () {
        warn('confusing_a', token);
        this.first = expression(150);
        this.arity = 'prefix';
        return this;
    });
    infix('---', 130, function (left) {
        warn('confusing_a', token);
        this.first = left;
        this.second = expression(130);
        return this;
    });
    infix('*', 140, function (left, that) {
        if ((left.arity === 'number' && (left.value === 0 || left.value === 1)) || left.arity === 'string') {
            warn('unexpected_a', left);
        }
        var right = expression(140);
        if ((right.arity === 'number' && (right.value === 0 || right.value === 1)) || right.arity === 'string') {
            warn('unexpected_a', right);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value *= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    infix('/', 140, function (left, that) {
        if ((left.arity === 'number' && left.value === 0) || left.arity === 'string') {
            warn('unexpected_a', left);
        }
        var right = expression(140);
        if ((right.arity === 'number' && (right.value === 0 || right.value === 1)) || right.arity === 'string') {
            warn('unexpected_a', right);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value /= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    infix('%', 140, function (left, that) {
        if ((left.arity === 'number' && (left.value === 0 || left.value === 1)) || left.arity === 'string') {
            warn('unexpected_a', left);
        }
        var right = expression(140);
        if ((right.arity === 'number' && (right.value === 0 || right.value === 1)) || right.arity === 'string') {
            warn('unexpected_a', right);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value %= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });

    suffix('++');
    prefix('++');

    suffix('--');
    prefix('--');
    prefix('delete', function () {
        one_space();
        var p = expression(0);
        if (!p || (p.id !== '.' && p.id !== '[')) {
            warn('deleted');
        }
        this.first = p;
        return this;
    });


    prefix('~', function () {
        no_space_only();
        if (option.bitwise) {
            warn('unexpected_a', this);
        }
        expression(150);
        return this;
    });
    prefix('!', function () {
        no_space_only();
        this.first = expression(150);
        this.arity = 'prefix';
        if (bang[this.first.id] === true) {
            warn('confusing_a', this);
        }
        return this;
    });
    prefix('typeof');
    prefix('new', function () {
        one_space();
        var c = expression(160), i, p;
        this.first = c;
        if (c.id !== 'function') {
            if (c.identifier) {
                switch (c.value) {
                case 'Object':
                    warn('use_object', token);
                    break;
                case 'Array':
                    if (next_token.id === '(') {
                        p = next_token;
                        p.first = this;
                        advance('(');
                        if (next_token.id !== ')') {
                            p.second = expression(0);
                            if (p.second.arity !== 'number' || !p.second.value) {
                                expected_condition(p.second,  bundle.use_array);
                                i = false;
                            } else {
                                i = true;
                            }
                            while (next_token.id !== ')' && next_token.id !== '(end)') {
                                if (i) {
                                    warn('use_array', p);
                                    i = false;
                                }
                                advance();
                            }
                        } else {
                            warn('use_array', token);
                        }
                        advance(')', p);
                        discard();
                        return p;
                    }
                    warn('use_array', token);
                    break;
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Math':
                case 'JSON':
                    warn('not_a_constructor', c);
                    break;
                case 'Function':
                    if (!option.evil) {
                        warn('function_eval');
                    }
                    break;
                case 'Date':
                case 'RegExp':
                    break;
                default:
                    if (c.id !== 'function') {
                        i = c.value.substr(0, 1);
                        if (option.newcap && (i < 'A' || i > 'Z')) {
                            warn('constructor_name_a', token);
                        }
                    }
                }
            } else {
                if (c.id !== '.' && c.id !== '[' && c.id !== '(') {
                    warn('bad_constructor', token);
                }
            }
        } else {
            warn('weird_new', this);
        }
        if (next_token.id !== '(') {
            warn('missing_a', next_token, '()');
        }
        return this;
    });

    infix('(', 160, function (left, that) {
        if (indent && indent.mode === 'expression') {
            no_space(prev_token, token);
        } else {
            no_space_only(prev_token, token);
        }
        if (!left.immed && left.id === 'function') {
            warn('wrap_immediate');
        }
        var p = [];
        if (left) {
            if (left.identifier) {
                if (left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
                    if (left.value !== 'Number' && left.value !== 'String' &&
                            left.value !== 'Boolean' && left.value !== 'Date') {
                        if (left.value === 'Math' || left.value === 'JSON') {
                            warn('not_a_function', left);
                        } else if (left.value === 'Object') {
                            warn('use_object', token);
                        } else if (left.value === 'Array' || option.newcap) {
                            warn('missing_a', left, 'new');
                        }
                    }
                }
            } else if (left.id === '.') {
                if (option.safe && left.first.value === 'Math' &&
                        left.second === 'random') {
                    warn('adsafe', left);
                }
            }
        }
        step_in();
        if (next_token.id !== ')') {
            no_space();
            for (;;) {
                edge();
                p.push(expression(10));
                if (next_token.id !== ',') {
                    break;
                }
                comma();
            }
        }
        no_space();
        step_out(')', that);
        if (typeof left === 'object') {
            if (left.value === 'parseInt' && p.length === 1) {
                warn('radix', left);
            }
            if (!option.evil) {
                if (left.value === 'eval' || left.value === 'Function' ||
                        left.value === 'execScript') {
                    warn('evil', left);
                } else if (p[0] && p[0].arity === 'string' &&
                        (left.value === 'setTimeout' ||
                        left.value === 'setInterval')) {
                    warn('implied_evil', left);
                }
            }
            if (!left.identifier && left.id !== '.' && left.id !== '[' &&
                    left.id !== '(' && left.id !== '&&' && left.id !== '||' &&
                    left.id !== '?') {
                warn('bad_invocation', left);
            }
        }
        that.first = left;
        that.second = p;
        return that;
    }, true);

    prefix('(', function () {
        step_in('expression');
        discard();
        no_space();
        edge();
        if (next_token.id === 'function') {
            next_token.immed = true;
        }
        var value = expression(0);
        value.paren = true;
        no_space();
        step_out(')', this);
        discard();
        if (value.id === 'function') {
            if (next_token.id === '(') {
                warn('move_invocation');
            } else {
                warn('bad_wrap', this);
            }
        }
        return value;
    });

    infix('.', 170, function (left, that) {
        no_space(prev_token, token);
        no_space();
        var name = identifier();
        if (typeof name === 'string') {
            tally_property(name);
        }
        that.first = left;
        that.second = token;
        if (left && left.value === 'arguments' &&
                (name === 'callee' || name === 'caller')) {
            warn('avoid_a', left, 'arguments.' + name);
        } else if (!option.evil && left && left.value === 'document' &&
                (name === 'write' || name === 'writeln')) {
            warn('write_is_wrong', left);
        } else if (option.adsafe) {
            if (!adsafe_top && left.value === 'ADSAFE') {
                if (name === 'id' || name === 'lib') {
                    warn('adsafe', that);
                } else if (name === 'go') {
                    if (xmode !== 'script') {
                        warn('adsafe', that);
                    } else if (adsafe_went || next_token.id !== '(' ||
                            peek(0).arity !== 'string' ||
                            peek(0).value !== adsafe_id ||
                            peek(1).id !== ',') {
                        fail('adsafe_a', that, 'go');
                    }
                    adsafe_went = true;
                    adsafe_may = false;
                }
            }
            adsafe_top = false;
        }
        if (!option.evil && (name === 'eval' || name === 'execScript')) {
            warn('evil');
        } else if (option.safe) {
            for (;;) {
                if (banned[name] === true) {
                    warn('adsafe_a', token, name);
                }
                if (typeof predefined[left.value] !== 'boolean' ||
                        next_token.id === '(') {
                    break;
                }
                if (standard_property[name] === true) {
                    if (next_token.id === '.') {
                        warn('adsafe', that);
                    }
                    break;
                }
                if (next_token.id !== '.') {
                    warn('adsafe', that);
                    break;
                }
                advance('.');
                token.first = that;
                token.second = name;
                that = token;
                name = identifier();
                if (typeof name === 'string') {
                    tally_property(name);
                }
            }
        }
        return that;
    }, true);

    infix('[', 170, function (left, that) {
        no_space_only(prev_token, token);
        no_space();
        step_in();
        edge();
        var e = expression(0), s;
        if (e.arity === 'string') {
            if (option.safe && banned[e.value] === true) {
                warn('adsafe_a', e);
            } else if (!option.evil &&
                    (e.value === 'eval' || e.value === 'execScript')) {
                warn('evil', e);
            } else if (option.safe &&
                    (e.value.charAt(0) === '_' || e.value.charAt(0) === '-')) {
                warn('adsafe_subscript_a', e);
            }
            tally_property(e.value);
            if (!option.sub && ix.test(e.value)) {
                s = syntax[e.value];
                if (!s || !s.reserved) {
                    warn('subscript', e);
                }
            }
        } else if (e.arity !== 'number' || e.value < 0) {
            if (option.safe) {
                warn('adsafe_subscript_a', e);
            }
        }
        step_out(']', that);
        discard();
        no_space(prev_token, token);
        that.first = left;
        that.second = e;
        return that;
    }, true);

    prefix('[', function () {
        this.arity = 'prefix';
        this.first = [];
        step_in('array');
        while (next_token.id !== '(end)') {
            while (next_token.id === ',') {
                warn('unexpected_a', next_token);
                advance(',');
                discard();
            }
            if (next_token.id === ']') {
                break;
            }
            edge();
            this.first.push(expression(10));
            if (next_token.id === ',') {
                comma();
                if (next_token.id === ']' && !option.es5) {
                    warn('unexpected_a', token);
                    break;
                }
            } else {
                break;
            }
        }
        step_out(']', this);
        discard();
        return this;
    }, 170);


    function property_name() {
        var id = optional_identifier(true);
        if (!id) {
            if (next_token.arity === 'string') {
                id = next_token.value;
                if (option.safe) {
                    if (banned[id]) {
                        warn('adsafe_a');
                    } else if (id.charAt(0) === '_' ||
                            id.charAt(id.length - 1) === '_') {
                        warn('dangling_a');
                    }
                }
                advance();
            } else if (next_token.arity === 'number') {
                id = next_token.value.toString();
                advance();
            }
        }
        return id;
    }


    function function_params() {
        var id, paren = next_token, params = [];
        advance('(');
        step_in();
        discard();
        no_space();
        if (next_token.id === ')') {
            no_space();
            step_out(')', paren);
            discard();
            return;
        }
        for (;;) {
            edge();
            id = identifier();
            params.push(token);
            add_label(id, 'parameter');
            if (next_token.id === ',') {
                comma();
            } else {
                no_space();
                step_out(')', paren);
                discard();
                return params;
            }
        }
    }


    function do_function(func, name) {
        var old_properties = properties,
            old_option     = option,
            old_global     = global,
            old_scope      = scope;
        funct = {
            '(name)'     : name || '"' + anonname + '"',
            '(line)'     : next_token.line,
            '(context)'  : funct,
            '(breakage)' : 0,
            '(loopage)'  : 0,
            '(scope)'    : scope,
            '(token)'    : func
        };
        properties  = old_properties && Object.create(old_properties);
        option      = Object.create(old_option);
        global      = Object.create(old_global);
        scope       = Object.create(old_scope);
        token.funct = funct;
        functions.push(funct);
        if (name) {
            add_label(name, 'function');
        }
        func.name = name || '';
        func.first = funct['(params)'] = function_params();
        one_space();
        func.block = block(false);
        funct      = funct['(context)'];
        properties = old_properties;
        option     = old_option;
        global     = old_global;
        scope      = old_scope;
    }


    prefix('{', function () {
        var get, i, j, name, p, set, seen = {};
        this.arity = 'prefix';
        this.first = [];
        step_in();
        while (next_token.id !== '}') {

// JSLint recognizes the ES5 extension for get/set in object literals,
// but requires that they be used in pairs.

            edge();
            if (next_token.value === 'get' && peek().id !== ':') {
                if (!option.es5) {
                    warn('get_set');
                }
                get = next_token;
                advance('get');
                one_space_only();
                name = next_token;
                i = property_name();
                if (!i) {
                    fail('missing_property');
                }
                do_function(get, '');
                if (funct['(loopage)']) {
                    warn('function_loop', get);
                }
                p = get.first;
                if (p) {
                    warn('parameter_a_get_b', p[0], p[0].value, i);
                }
                comma();
                set = next_token;
                spaces();
                edge();
                advance('set');
                one_space_only();
                j = property_name();
                if (i !== j) {
                    fail('expected_a_b', token, i, j || next_token.value);
                }
                do_function(set, '');
                p = set.first;
                if (!p || p.length !== 1) {
                    fail('parameter_set_a', set, 'value');
                } else if (p[0].value !== 'value') {
                    fail('expected_a_b', p[0], 'value', p[0].value);
                }
                name.first = [get, set];
            } else {
                name = next_token;
                i = property_name();
                if (typeof i !== 'string') {
                    fail('missing_property');
                }
                advance(':');
                discard();
                spaces();
                name.first = expression(10);
            }
            this.first.push(name);
            if (seen[i] === true) {
                warn('duplicate_a', next_token, i);
            }
            seen[i] = true;
            tally_property(i);
            if (next_token.id !== ',') {
                break;
            }
            for (;;) {
                comma();
                if (next_token.id !== ',') {
                    break;
                }
                warn('unexpected_a', next_token);
            }
            if (next_token.id === '}' && !option.es5) {
                warn('unexpected_a', token);
            }
        }
        step_out('}', this);
        discard();
        return this;
    });

    stmt('{', function () {
        discard();
        warn('statement_block');
        this.arity = 'statement';
        this.block = statements();
        this.disrupt = this.block.disrupt;
        advance('}', this);
        discard();
        return this;
    });

    stmt('/*global', directive);
    stmt('/*jslint', directive);
    stmt('/*members', directive);
    stmt('/*properties', directive);

    stmt('var', function () {

// JavaScript does not have block scope. It only has function scope. So,
// declaring a variable in a block can have unexpected consequences.

// var.first will contain an array, the array containing name tokens
// and assignment tokens.

        var assign, id, name;

        if (funct['(onevar)'] && option.onevar) {
            warn('combine_var');
        } else if (!funct['(global)']) {
            funct['(onevar)'] = true;
        }
        this.arity = 'statement';
        this.first = [];
        step_in('var');
        for (;;) {
            name = next_token;
            id = identifier();
            if (funct['(global)'] && predefined[id] === false) {
                warn('redefinition_a', token, id);
            }
            add_label(id, 'error');

            if (next_token.id === '=') {
                assign = next_token;
                assign.first = name;
                spaces();
                advance('=');
                spaces();
                if (next_token.id === 'undefined') {
                    warn('unnecessary_initialize', token, id);
                }
                if (peek(0).id === '=' && next_token.identifier) {
                    fail('var_a_not');
                }
                assign.second = expression(0);
                assign.arity = 'infix';
                this.first.push(assign);
            } else {
                this.first.push(name);
            }
            funct[id] = 'unused';
            if (next_token.id !== ',') {
                break;
            }
            comma();
            if (var_mode && next_token.line === token.line &&
                    this.first.length === 1) {
                var_mode = false;
                indent.open = false;
                indent.at -= option.indent;
            }
            spaces();
            edge();
        }
        var_mode = false;
        step_out();
        return this;
    });

    stmt('function', function () {
        one_space();
        if (in_block) {
            warn('function_block', token);
        }
        var i = identifier();
        if (i) {
            add_label(i, 'unction');
            no_space();
        }
        do_function(this, i, true);
        if (next_token.id === '(' && next_token.line === token.line) {
            fail('function_statement');
        }
        this.arity = 'statement';
        return this;
    });

    prefix('function', function () {
        one_space();
        var i = optional_identifier();
        if (i) {
            no_space();
        }
        do_function(this, i);
        if (funct['(loopage)']) {
            warn('function_loop');
        }
        this.arity = 'function';
        return this;
    });

    stmt('if', function () {
        var paren = next_token;
        one_space();
        advance('(');
        step_in('control');
        discard();
        no_space();
        edge();
        this.arity = 'statement';
        this.first = expected_condition(expected_relation(expression(0)));
        no_space();
        step_out(')', paren);
        discard();
        one_space();
        this.block = block(true);
        if (next_token.id === 'else') {
            one_space();
            advance('else');
            discard();
            one_space();
            this['else'] = next_token.id === 'if' || next_token.id === 'switch' ?
                statement(true) : block(true);
            if (this['else'].disrupt && this.block.disrupt) {
                this.disrupt = true;
            }
        }
        return this;
    });

    stmt('try', function () {

// try.first    The catch variable
// try.second   The catch clause
// try.third    The finally clause
// try.block    The try block

        var exception_variable, old_scope, paren;
        if (option.adsafe) {
            warn('adsafe_a', this);
        }
        one_space();
        this.arity = 'statement';
        this.block = block(false);
        if (next_token.id === 'catch') {
            one_space();
            advance('catch');
            discard();
            one_space();
            paren = next_token;
            advance('(');
            step_in('control');
            discard();
            no_space();
            edge();
            old_scope = scope;
            scope = Object.create(old_scope);
            exception_variable = next_token.value;
            this.first = exception_variable;
            if (!next_token.identifier) {
                warn('expected_identifier_a', next_token);
            } else {
                add_label(exception_variable, 'exception');
            }
            advance();
            no_space();
            step_out(')', paren);
            discard();
            one_space();
            this.second = block(false);
            scope = old_scope;
        }
        if (next_token.id === 'finally') {
            discard();
            one_space();
            advance('finally');
            discard();
            one_space();
            this.third = block(false);
        } else if (!this.second) {
            fail('expected_a_b', next_token, 'catch', next_token.value);
        }
        return this;
    });

    labeled_stmt('while', function () {
        one_space();
        var paren = next_token;
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        step_in('control');
        discard();
        no_space();
        edge();
        this.arity = 'statement';
        this.first = expected_relation(expression(0));
        if (this.first.id !== 'true') {
            expected_condition(this.first, bundle.unexpected_a);
        }
        no_space();
        step_out(')', paren);
        discard();
        one_space();
        this.block = block(true);
        if (this.block.disrupt) {
            warn('strange_loop', prev_token);
        }
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    reserve('with');

    labeled_stmt('switch', function () {

// switch.first             the switch expression
// switch.second            the array of cases. A case is 'case' or 'default' token:
//    case.first            the array of case expressions
//    case.second           the array of statements
// If all of the arrays of statements are disrupt, then the switch is disrupt.

        var particular,
            the_case = next_token,
            unbroken = true;
        funct['(breakage)'] += 1;
        one_space();
        advance('(');
        discard();
        no_space();
        step_in();
        this.arity = 'statement';
        this.first = expected_condition(expected_relation(expression(0)));
        no_space();
        step_out(')', the_case);
        discard();
        one_space();
        advance('{');
        step_in();
        this.second = [];
        while (next_token.id === 'case') {
            the_case = next_token;
            the_case.first = [];
            spaces();
            edge('case');
            advance('case');
            for (;;) {
                one_space();
                particular = expression(0);
                the_case.first.push(particular);
                if (particular.id === 'NaN') {
                    warn('unexpected_a', particular);
                }
                no_space_only();
                advance(':');
                discard();
                if (next_token.id !== 'case') {
                    break;
                }
                spaces();
                edge('case');
                advance('case');
                discard();
            }
            spaces();
            the_case.second = statements();
            if (the_case.second && the_case.second.length > 0) {
                particular = the_case.second[the_case.second.length - 1];
                if (particular.disrupt) {
                    if (particular.id === 'break') {
                        unbroken = false;
                    }
                } else {
                    warn('missing_a_after_b', next_token, 'break', 'case');
                }
            } else {
                warn('empty_case');
            }
            this.second.push(the_case);
        }
        if (this.second.length === 0) {
            warn('missing_a', next_token, 'case');
        }
        if (next_token.id === 'default') {
            spaces();
            the_case = next_token;
            edge('case');
            advance('default');
            discard();
            no_space_only();
            advance(':');
            discard();
            spaces();
            the_case.second = statements();
            if (the_case.second && the_case.second.length > 0) {
                particular = the_case.second[the_case.second.length - 1];
                if (unbroken && particular.disrupt && particular.id !== 'break') {
                    this.disrupt = true;
                }
            }
            this.second.push(the_case);
        }
        funct['(breakage)'] -= 1;
        spaces();
        step_out('}', this);
        return this;
    });

    stmt('debugger', function () {
        if (!option.debug) {
            warn('unexpected_a', this);
        }
        this.arity = 'statement';
        return this;
    });

    labeled_stmt('do', function () {
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        one_space();
        this.arity = 'statement';
        this.block = block(true);
        if (this.block.disrupt) {
            warn('strange_loop', prev_token);
        }
        one_space();
        advance('while');
        discard();
        var paren = next_token;
        one_space();
        advance('(');
        step_in();
        discard();
        no_space();
        edge();
        this.first = expected_condition(expected_relation(expression(0)), bundle.unexpected_a);
        no_space();
        step_out(')', paren);
        discard();
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    labeled_stmt('for', function () {
        var blok, filter, ok = false, paren = next_token, the_in, value;
        this.arity = 'statement';
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        step_in('control');
        discard();
        spaces(this, paren);
        no_space();
        if (next_token.id === 'var') {
            fail('move_var');
        }
        edge();
        if (peek(0).id === 'in') {
            value = next_token;
            switch (funct[value.value]) {
            case 'unused':
                funct[value.value] = 'var';
                break;
            case 'var':
                break;
            default:
                warn('bad_in_a', value);
            }
            advance();
            the_in = next_token;
            advance('in');
            the_in.first = value;
            the_in.second = expression(20);
            step_out(')', paren);
            discard();
            this.first = the_in;
            blok = block(true);
            if (!option.forin) {
                if (blok.length === 1 && typeof blok[0] === 'object' &&
                        blok[0].value === 'if' && !blok[0]['else']) {
                    filter = blok[0].first;
                    while (filter.id === '&&') {
                        filter = filter.first;
                    }
                    switch (filter.id) {
                    case '===':
                    case '!==':
                        ok = filter.first.id === '[' ? (
                            filter.first.first.value === the_in.second.value &&
                            filter.first.second.value === the_in.first.value
                        ) : (
                            filter.first.id === 'typeof' &&
                            filter.first.first.id === '[' &&
                            filter.first.first.first.value === the_in.second.value &&
                            filter.first.first.second.value === the_in.first.value
                        );
                        break;
                    case '(':
                        ok = filter.first.id === '.' && ((
                            filter.first.first.value === the_in.second.value &&
                            filter.first.second.value === 'hasOwnProperty' &&
                            filter.second[0].value === the_in.first.value
                        ) || (
                            filter.first.first.value === 'ADSAFE' &&
                            filter.first.second.value === 'has' &&
                            filter.second[0].value === the_in.second.value &&
                            filter.second[1].value === the_in.first.value
                        ) || (
                            filter.first.first.id === '.' &&
                            filter.first.first.first.id === '.' &&
                            filter.first.first.first.first.value === 'Object' &&
                            filter.first.first.first.second.value === 'prototype' &&
                            filter.first.first.second.value === 'hasOwnProperty' &&
                            filter.first.second.value === 'call' &&
                            filter.second[0].value === the_in.second.value &&
                            filter.second[1].value === the_in.first.value
                        ));
                        break;
                    }
                }
                if (!ok) {
                    warn('for_if', this);
                }
            }
        } else {
            if (next_token.id !== ';') {
                edge();
                this.first = [];
                for (;;) {
                    this.first.push(expression(0, 'for'));
                    if (next_token.id !== ',') {
                        break;
                    }
                    comma();
                }
            }
            semicolon();
            if (next_token.id !== ';') {
                edge();
                this.second = expected_relation(expression(0));
                if (this.second.id !== 'true') {
                    expected_condition(this.second, bundle.unexpected_a);
                }
            }
            semicolon(token);
            if (next_token.id === ';') {
                fail('expected_a_b', next_token, ')', ';');
            }
            if (next_token.id !== ')') {
                this.third = [];
                edge();
                for (;;) {
                    this.third.push(expression(0, 'for'));
                    if (next_token.id !== ',') {
                        break;
                    }
                    comma();
                }
            }
            no_space();
            step_out(')', paren);
            discard();
            one_space();
            blok = block(true);
        }
        if (blok.disrupt) {
            warn('strange_loop', prev_token);
        }
        this.block = blok;
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    disrupt_stmt('break', function () {
        var label = next_token.value;
        this.arity = 'statement';
        if (funct['(breakage)'] === 0) {
            warn('unexpected_a', this);
        }
        if (next_token.identifier && token.line === next_token.line) {
            one_space_only();
            if (funct[label] !== 'label') {
                warn('not_a_label', next_token);
            } else if (scope[label] !== funct) {
                warn('not_a_scope', next_token);
            }
            this.first = next_token;
            advance();
        }
        return this;
    });

    disrupt_stmt('continue', function () {
        if (!option['continue']) {
            warn('unexpected_a', this);
        }
        var label = next_token.value;
        this.arity = 'statement';
        if (funct['(breakage)'] === 0) {
            warn('unexpected_a', this);
        }
        if (next_token.identifier && token.line === next_token.line) {
            one_space_only();
            if (funct[label] !== 'label') {
                warn('not_a_label', next_token);
            } else if (scope[label] !== funct) {
                warn('not_a_scope', next_token);
            }
            this.first = next_token;
            advance();
        }
        return this;
    });

    disrupt_stmt('return', function () {
        this.arity = 'statement';
        if (next_token.id !== ';' && next_token.line === token.line) {
            one_space_only();
            if (next_token.id === '/' || next_token.id === '(regexp)') {
                warn('wrap_regexp');
            }
            this.first = expression(20);
        }
        return this;
    });

    disrupt_stmt('throw', function () {
        this.arity = 'statement';
        one_space_only();
        this.first = expression(20);
        return this;
    });


//  Superfluous reserved words

    reserve('class');
    reserve('const');
    reserve('enum');
    reserve('export');
    reserve('extends');
    reserve('import');
    reserve('super');

// Harmony reserved words

    reserve('let');
    reserve('yield');
    reserve('implements');
    reserve('interface');
    reserve('package');
    reserve('private');
    reserve('protected');
    reserve('public');
    reserve('static');


// Parse JSON

    function json_value() {

        function json_object() {
            var brace = next_token, object = {};
            advance('{');
            if (next_token.id !== '}') {
                while (next_token.id !== '(end)') {
                    while (next_token.id === ',') {
                        warn('unexpected_a', next_token);
                        comma();
                    }
                    if (next_token.arity !== 'string') {
                        warn('expected_string_a');
                    }
                    if (object[next_token.value] === true) {
                        warn('duplicate_a');
                    } else if (next_token.value === '__proto__') {
                        warn('dangling_a');
                    } else {
                        object[next_token.value] = true;
                    }
                    advance();
                    advance(':');
                    json_value();
                    if (next_token.id !== ',') {
                        break;
                    }
                    comma();
                    if (next_token.id === '}') {
                        warn('unexpected_a', token);
                        break;
                    }
                }
            }
            advance('}', brace);
        }

        function json_array() {
            var bracket = next_token;
            advance('[');
            if (next_token.id !== ']') {
                while (next_token.id !== '(end)') {
                    while (next_token.id === ',') {
                        warn('unexpected_a', next_token);
                        comma();
                    }
                    json_value();
                    if (next_token.id !== ',') {
                        break;
                    }
                    comma();
                    if (next_token.id === ']') {
                        warn('unexpected_a', token);
                        break;
                    }
                }
            }
            advance(']', bracket);
        }

        switch (next_token.id) {
        case '{':
            json_object();
            break;
        case '[':
            json_array();
            break;
        case 'true':
        case 'false':
        case 'null':
        case '(number)':
        case '(string)':
            advance();
            break;
        case '-':
            advance('-');
            no_space_only();
            advance('(number)');
            break;
        default:
            fail('unexpected_a');
        }
    }


// CSS parsing.

    function css_name() {
        if (next_token.identifier) {
            advance();
            return true;
        }
    }


    function css_number() {
        if (next_token.id === '-') {
            advance('-');
            no_space_only();
        }
        if (next_token.arity === 'number') {
            advance('(number)');
            return true;
        }
    }


    function css_string() {
        if (next_token.arity === 'string') {
            advance();
            return true;
        }
    }

    function css_color() {
        var i, number, paren, value;
        if (next_token.identifier) {
            value = next_token.value;
            if (value === 'rgb' || value === 'rgba') {
                advance();
                paren = next_token;
                advance('(');
                for (i = 0; i < 3; i += 1) {
                    if (i) {
                        comma();
                    }
                    number = next_token.value;
                    if (next_token.arity !== 'number' || number < 0) {
                        warn('expected_positive_a', next_token);
                        advance();
                    } else {
                        advance();
                        if (next_token.id === '%') {
                            advance('%');
                            if (number > 100) {
                                warn('expected_percent_a', token, number);
                            }
                        } else {
                            if (number > 255) {
                                warn('expected_small_a', token, number);
                            }
                        }
                    }
                }
                if (value === 'rgba') {
                    comma();
                    number = +next_token.value;
                    if (next_token.arity !== 'number' || number < 0 || number > 1) {
                        warn('expected_fraction_a', next_token);
                    }
                    advance();
                    if (next_token.id === '%') {
                        warn('unexpected_a');
                        advance('%');
                    }
                }
                advance(')', paren);
                return true;
            } else if (css_colorData[next_token.value] === true) {
                advance();
                return true;
            }
        } else if (next_token.id === '(color)') {
            advance();
            return true;
        }
        return false;
    }


    function css_length() {
        if (next_token.id === '-') {
            advance('-');
            no_space_only();
        }
        if (next_token.arity === 'number') {
            advance();
            if (next_token.arity !== 'string' &&
                    css_lengthData[next_token.value] === true) {
                no_space_only();
                advance();
            } else if (+token.value !== 0) {
                warn('expected_linear_a');
            }
            return true;
        }
        return false;
    }


    function css_line_height() {
        if (next_token.id === '-') {
            advance('-');
            no_space_only();
        }
        if (next_token.arity === 'number') {
            advance();
            if (next_token.arity !== 'string' &&
                    css_lengthData[next_token.value] === true) {
                no_space_only();
                advance();
            }
            return true;
        }
        return false;
    }


    function css_width() {
        if (next_token.identifier) {
            switch (next_token.value) {
            case 'thin':
            case 'medium':
            case 'thick':
                advance();
                return true;
            }
        } else {
            return css_length();
        }
    }


    function css_margin() {
        if (next_token.identifier) {
            if (next_token.value === 'auto') {
                advance();
                return true;
            }
        } else {
            return css_length();
        }
    }

    function css_attr() {
        if (next_token.identifier && next_token.value === 'attr') {
            advance();
            advance('(');
            if (!next_token.identifier) {
                warn('expected_name_a');
            }
            advance();
            advance(')');
            return true;
        }
        return false;
    }


    function css_comma_list() {
        while (next_token.id !== ';') {
            if (!css_name() && !css_string()) {
                warn('expected_name_a');
            }
            if (next_token.id !== ',') {
                return true;
            }
            comma();
        }
    }


    function css_counter() {
        if (next_token.identifier && next_token.value === 'counter') {
            advance();
            advance('(');
            advance();
            if (next_token.id === ',') {
                comma();
                if (next_token.arity !== 'string') {
                    warn('expected_string_a');
                }
                advance();
            }
            advance(')');
            return true;
        }
        if (next_token.identifier && next_token.value === 'counters') {
            advance();
            advance('(');
            if (!next_token.identifier) {
                warn('expected_name_a');
            }
            advance();
            if (next_token.id === ',') {
                comma();
                if (next_token.arity !== 'string') {
                    warn('expected_string_a');
                }
                advance();
            }
            if (next_token.id === ',') {
                comma();
                if (next_token.arity !== 'string') {
                    warn('expected_string_a');
                }
                advance();
            }
            advance(')');
            return true;
        }
        return false;
    }


    function css_shape() {
        var i;
        if (next_token.identifier && next_token.value === 'rect') {
            advance();
            advance('(');
            for (i = 0; i < 4; i += 1) {
                if (!css_length()) {
                    warn('expected_number_a');
                    break;
                }
            }
            advance(')');
            return true;
        }
        return false;
    }


    function css_url() {
        var c, url;
        if (next_token.identifier && next_token.value === 'url') {
            next_token = lex.range('(', ')');
            url = next_token.value;
            c = url.charAt(0);
            if (c === '"' || c === '\'') {
                if (url.slice(-1) !== c) {
                    warn('bad_url');
                } else {
                    url = url.slice(1, -1);
                    if (url.indexOf(c) >= 0) {
                        warn('bad_url');
                    }
                }
            }
            if (!url) {
                warn('missing_url');
            }
            if (option.safe && ux.test(url)) {
                fail('adsafe_a', next_token, url);
            }
            urls.push(url);
            advance();
            return true;
        }
        return false;
    }


    css_any = [css_url, function () {
        for (;;) {
            if (next_token.identifier) {
                switch (next_token.value.toLowerCase()) {
                case 'url':
                    css_url();
                    break;
                case 'expression':
                    warn('unexpected_a');
                    advance();
                    break;
                default:
                    advance();
                }
            } else {
                if (next_token.id === ';' || next_token.id === '!'  ||
                        next_token.id === '(end)' || next_token.id === '}') {
                    return true;
                }
                advance();
            }
        }
    }];


    css_border_style = [
        'none', 'dashed', 'dotted', 'double', 'groove',
        'hidden', 'inset', 'outset', 'ridge', 'solid'
    ];

    css_break = [
        'auto', 'always', 'avoid', 'left', 'right'
    ];

    css_media = {
        'all': true,
        'braille': true,
        'embossed': true,
        'handheld': true,
        'print': true,
        'projection': true,
        'screen': true,
        'speech': true,
        'tty': true,
        'tv': true
    };

    css_overflow = [
        'auto', 'hidden', 'scroll', 'visible'
    ];

    css_attribute_data = {
        background: [
            true, 'background-attachment', 'background-color',
            'background-image', 'background-position', 'background-repeat'
        ],
        'background-attachment': ['scroll', 'fixed'],
        'background-color': ['transparent', css_color],
        'background-image': ['none', css_url],
        'background-position': [
            2, [css_length, 'top', 'bottom', 'left', 'right', 'center']
        ],
        'background-repeat': [
            'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
        ],
        'border': [true, 'border-color', 'border-style', 'border-width'],
        'border-bottom': [
            true, 'border-bottom-color', 'border-bottom-style',
            'border-bottom-width'
        ],
        'border-bottom-color': css_color,
        'border-bottom-style': css_border_style,
        'border-bottom-width': css_width,
        'border-collapse': ['collapse', 'separate'],
        'border-color': ['transparent', 4, css_color],
        'border-left': [
            true, 'border-left-color', 'border-left-style', 'border-left-width'
        ],
        'border-left-color': css_color,
        'border-left-style': css_border_style,
        'border-left-width': css_width,
        'border-right': [
            true, 'border-right-color', 'border-right-style',
            'border-right-width'
        ],
        'border-right-color': css_color,
        'border-right-style': css_border_style,
        'border-right-width': css_width,
        'border-spacing': [2, css_length],
        'border-style': [4, css_border_style],
        'border-top': [
            true, 'border-top-color', 'border-top-style', 'border-top-width'
        ],
        'border-top-color': css_color,
        'border-top-style': css_border_style,
        'border-top-width': css_width,
        'border-width': [4, css_width],
        bottom: [css_length, 'auto'],
        'caption-side' : ['bottom', 'left', 'right', 'top'],
        clear: ['both', 'left', 'none', 'right'],
        clip: [css_shape, 'auto'],
        color: css_color,
        content: [
            'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote',
            css_string, css_url, css_counter, css_attr
        ],
        'counter-increment': [
            css_name, 'none'
        ],
        'counter-reset': [
            css_name, 'none'
        ],
        cursor: [
            css_url, 'auto', 'crosshair', 'default', 'e-resize', 'help', 'move',
            'n-resize', 'ne-resize', 'nw-resize', 'pointer', 's-resize',
            'se-resize', 'sw-resize', 'w-resize', 'text', 'wait'
        ],
        direction: ['ltr', 'rtl'],
        display: [
            'block', 'compact', 'inline', 'inline-block', 'inline-table',
            'list-item', 'marker', 'none', 'run-in', 'table', 'table-caption',
            'table-cell', 'table-column', 'table-column-group',
            'table-footer-group', 'table-header-group', 'table-row',
            'table-row-group'
        ],
        'empty-cells': ['show', 'hide'],
        'float': ['left', 'none', 'right'],
        font: [
            'caption', 'icon', 'menu', 'message-box', 'small-caption',
            'status-bar', true, 'font-size', 'font-style', 'font-weight',
            'font-family'
        ],
        'font-family': css_comma_list,
        'font-size': [
            'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large',
            'xx-large', 'larger', 'smaller', css_length
        ],
        'font-size-adjust': ['none', css_number],
        'font-stretch': [
            'normal', 'wider', 'narrower', 'ultra-condensed',
            'extra-condensed', 'condensed', 'semi-condensed',
            'semi-expanded', 'expanded', 'extra-expanded'
        ],
        'font-style': [
            'normal', 'italic', 'oblique'
        ],
        'font-variant': [
            'normal', 'small-caps'
        ],
        'font-weight': [
            'normal', 'bold', 'bolder', 'lighter', css_number
        ],
        height: [css_length, 'auto'],
        left: [css_length, 'auto'],
        'letter-spacing': ['normal', css_length],
        'line-height': ['normal', css_line_height],
        'list-style': [
            true, 'list-style-image', 'list-style-position', 'list-style-type'
        ],
        'list-style-image': ['none', css_url],
        'list-style-position': ['inside', 'outside'],
        'list-style-type': [
            'circle', 'disc', 'square', 'decimal', 'decimal-leading-zero',
            'lower-roman', 'upper-roman', 'lower-greek', 'lower-alpha',
            'lower-latin', 'upper-alpha', 'upper-latin', 'hebrew', 'katakana',
            'hiragana-iroha', 'katakana-oroha', 'none'
        ],
        margin: [4, css_margin],
        'margin-bottom': css_margin,
        'margin-left': css_margin,
        'margin-right': css_margin,
        'margin-top': css_margin,
        'marker-offset': [css_length, 'auto'],
        'max-height': [css_length, 'none'],
        'max-width': [css_length, 'none'],
        'min-height': css_length,
        'min-width': css_length,
        opacity: css_number,
        outline: [true, 'outline-color', 'outline-style', 'outline-width'],
        'outline-color': ['invert', css_color],
        'outline-style': [
            'dashed', 'dotted', 'double', 'groove', 'inset', 'none',
            'outset', 'ridge', 'solid'
        ],
        'outline-width': css_width,
        overflow: css_overflow,
        'overflow-x': css_overflow,
        'overflow-y': css_overflow,
        padding: [4, css_length],
        'padding-bottom': css_length,
        'padding-left': css_length,
        'padding-right': css_length,
        'padding-top': css_length,
        'page-break-after': css_break,
        'page-break-before': css_break,
        position: ['absolute', 'fixed', 'relative', 'static'],
        quotes: [8, css_string],
        right: [css_length, 'auto'],
        'table-layout': ['auto', 'fixed'],
        'text-align': ['center', 'justify', 'left', 'right'],
        'text-decoration': [
            'none', 'underline', 'overline', 'line-through', 'blink'
        ],
        'text-indent': css_length,
        'text-shadow': ['none', 4, [css_color, css_length]],
        'text-transform': ['capitalize', 'uppercase', 'lowercase', 'none'],
        top: [css_length, 'auto'],
        'unicode-bidi': ['normal', 'embed', 'bidi-override'],
        'vertical-align': [
            'baseline', 'bottom', 'sub', 'super', 'top', 'text-top', 'middle',
            'text-bottom', css_length
        ],
        visibility: ['visible', 'hidden', 'collapse'],
        'white-space': [
            'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'inherit'
        ],
        width: [css_length, 'auto'],
        'word-spacing': ['normal', css_length],
        'word-wrap': ['break-word', 'normal'],
        'z-index': ['auto', css_number]
    };

    function style_attribute() {
        var v;
        while (next_token.id === '*' || next_token.id === '#' ||
                next_token.value === '_') {
            if (!option.css) {
                warn('unexpected_a');
            }
            advance();
        }
        if (next_token.id === '-') {
            if (!option.css) {
                warn('unexpected_a');
            }
            advance('-');
            if (!next_token.identifier) {
                warn('expected_nonstandard_style_attribute');
            }
            advance();
            return css_any;
        } else {
            if (!next_token.identifier) {
                warn('expected_style_attribute');
            } else {
                if (Object.prototype.hasOwnProperty.call(css_attribute_data, next_token.value)) {
                    v = css_attribute_data[next_token.value];
                } else {
                    v = css_any;
                    if (!option.css) {
                        warn('unrecognized_style_attribute_a');
                    }
                }
            }
            advance();
            return v;
        }
    }


    function style_value(v) {
        var i = 0,
            n,
            once,
            match,
            round,
            start = 0,
            vi;
        switch (typeof v) {
        case 'function':
            return v();
        case 'string':
            if (next_token.identifier && next_token.value === v) {
                advance();
                return true;
            }
            return false;
        }
        for (;;) {
            if (i >= v.length) {
                return false;
            }
            vi = v[i];
            i += 1;
            if (vi === true) {
                break;
            } else if (typeof vi === 'number') {
                n = vi;
                vi = v[i];
                i += 1;
            } else {
                n = 1;
            }
            match = false;
            while (n > 0) {
                if (style_value(vi)) {
                    match = true;
                    n -= 1;
                } else {
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        start = i;
        once = [];
        for (;;) {
            round = false;
            for (i = start; i < v.length; i += 1) {
                if (!once[i]) {
                    if (style_value(css_attribute_data[v[i]])) {
                        match = true;
                        round = true;
                        once[i] = true;
                        break;
                    }
                }
            }
            if (!round) {
                return match;
            }
        }
    }

    function style_child() {
        if (next_token.arity === 'number') {
            advance();
            if (next_token.value === 'n' && next_token.identifier) {
                no_space_only();
                advance();
                if (next_token.id === '+') {
                    no_space_only();
                    advance('+');
                    no_space_only();
                    advance('(number)');
                }
            }
            return;
        } else {
            if (next_token.identifier &&
                    (next_token.value === 'odd' || next_token.value === 'even')) {
                advance();
                return;
            }
        }
        warn('unexpected_a');
    }

    function substyle() {
        var v;
        for (;;) {
            if (next_token.id === '}' || next_token.id === '(end)' ||
                    (xquote && next_token.id === xquote)) {
                return;
            }
            while (next_token.id === ';') {
                warn('unexpected_a');
                semicolon();
            }
            v = style_attribute();
            advance(':');
            if (next_token.identifier && next_token.value === 'inherit') {
                advance();
            } else {
                if (!style_value(v)) {
                    warn('unexpected_a');
                    advance();
                }
            }
            if (next_token.id === '!') {
                advance('!');
                no_space_only();
                if (next_token.identifier && next_token.value === 'important') {
                    advance();
                } else {
                    warn('expected_a_b',
                        next_token, 'important', next_token.value);
                }
            }
            if (next_token.id === '}' || next_token.id === xquote) {
                warn('expected_a_b', next_token, ';', next_token.value);
            } else {
                semicolon();
            }
        }
    }

    function style_selector() {
        if (next_token.identifier) {
            if (!Object.prototype.hasOwnProperty.call(html_tag, option.cap ?
                    next_token.value.toLowerCase() : next_token.value)) {
                warn('expected_tagname_a');
            }
            advance();
        } else {
            switch (next_token.id) {
            case '>':
            case '+':
                advance();
                style_selector();
                break;
            case ':':
                advance(':');
                switch (next_token.value) {
                case 'active':
                case 'after':
                case 'before':
                case 'checked':
                case 'disabled':
                case 'empty':
                case 'enabled':
                case 'first-child':
                case 'first-letter':
                case 'first-line':
                case 'first-of-type':
                case 'focus':
                case 'hover':
                case 'last-child':
                case 'last-of-type':
                case 'link':
                case 'only-of-type':
                case 'root':
                case 'target':
                case 'visited':
                    advance();
                    break;
                case 'lang':
                    advance();
                    advance('(');
                    if (!next_token.identifier) {
                        warn('expected_lang_a');
                    }
                    advance(')');
                    break;
                case 'nth-child':
                case 'nth-last-child':
                case 'nth-last-of-type':
                case 'nth-of-type':
                    advance();
                    advance('(');
                    style_child();
                    advance(')');
                    break;
                case 'not':
                    advance();
                    advance('(');
                    if (next_token.id === ':' && peek(0).value === 'not') {
                        warn('not');
                    }
                    style_selector();
                    advance(')');
                    break;
                default:
                    warn('expected_pseudo_a');
                }
                break;
            case '#':
                advance('#');
                if (!next_token.identifier) {
                    warn('expected_id_a');
                }
                advance();
                break;
            case '*':
                advance('*');
                break;
            case '.':
                advance('.');
                if (!next_token.identifier) {
                    warn('expected_class_a');
                }
                advance();
                break;
            case '[':
                advance('[');
                if (!next_token.identifier) {
                    warn('expected_attribute_a');
                }
                advance();
                if (next_token.id === '=' || next_token.value === '~=' ||
                        next_token.value === '$=' ||
                        next_token.value === '|=' ||
                        next_token.id === '*=' ||
                        next_token.id === '^=') {
                    advance();
                    if (next_token.arity !== 'string') {
                        warn('expected_string_a');
                    }
                    advance();
                }
                advance(']');
                break;
            default:
                fail('expected_selector_a');
            }
        }
    }

    function style_pattern() {
        if (next_token.id === '{') {
            warn('expected_style_pattern');
        }
        for (;;) {
            style_selector();
            if (next_token.id === '</' || next_token.id === '{' ||
                    next_token.id === '(end)') {
                return '';
            }
            if (next_token.id === ',') {
                comma();
            }
        }
    }

    function style_list() {
        while (next_token.id !== '</' && next_token.id !== '(end)') {
            style_pattern();
            xmode = 'styleproperty';
            if (next_token.id === ';') {
                semicolon();
            } else {
                advance('{');
                substyle();
                xmode = 'style';
                advance('}');
            }
        }
    }

    function styles() {
        var i;
        while (next_token.id === '@') {
            i = peek();
            advance('@');
            if (next_token.identifier) {
                switch (next_token.value) {
                case 'import':
                    advance();
                    if (!css_url()) {
                        warn('expected_a_b',
                            next_token, 'url', next_token.value);
                        advance();
                    }
                    semicolon();
                    break;
                case 'media':
                    advance();
                    for (;;) {
                        if (!next_token.identifier || css_media[next_token.value] === true) {
                            fail('expected_media_a');
                        }
                        advance();
                        if (next_token.id !== ',') {
                            break;
                        }
                        comma();
                    }
                    advance('{');
                    style_list();
                    advance('}');
                    break;
                default:
                    warn('expected_at_a');
                }
            } else {
                warn('expected_at_a');
            }
        }
        style_list();
    }


// Parse HTML

    function do_begin(n) {
        if (n !== 'html' && !option.fragment) {
            if (n === 'div' && option.adsafe) {
                fail('adsafe_fragment');
            } else {
                fail('expected_a_b', token, 'html', n);
            }
        }
        if (option.adsafe) {
            if (n === 'html') {
                fail('adsafe_html', token);
            }
            if (option.fragment) {
                if (n !== 'div') {
                    fail('adsafe_div', token);
                }
            } else {
                fail('adsafe_fragment', token);
            }
        }
        option.browser = true;
        assume();
    }

    function do_attribute(n, a, v) {
        var u, x;
        if (a === 'id') {
            u = typeof v === 'string' ? v.toUpperCase() : '';
            if (ids[u] === true) {
                warn('duplicate_a', next_token, v);
            }
            if (!/^[A-Za-z][A-Za-z0-9._:\-]*$/.test(v)) {
                warn('bad_id_a', next_token, v);
            } else if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warn('adsafe_prefix_a', next_token, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warn('adsafe_bad_id');
                    }
                } else {
                    adsafe_id = v;
                    if (!/^[A-Z]+_$/.test(v)) {
                        warn('adsafe_bad_id');
                    }
                }
            }
            x = v.search(dx);
            if (x >= 0) {
                warn('unexpected_char_a_b', token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'class' || a === 'type' || a === 'name') {
            x = v.search(qx);
            if (x >= 0) {
                warn('unexpected_char_a_b', token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'href' || a === 'background' ||
                a === 'content' || a === 'data' ||
                a.indexOf('src') >= 0 || a.indexOf('url') >= 0) {
            if (option.safe && ux.test(v)) {
                fail('bad_url', next_token, v);
            }
            urls.push(v);
        } else if (a === 'for') {
            if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warn('adsafe_prefix_a', next_token, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warn('adsafe_bad_id');
                    }
                } else {
                    warn('adsafe_bad_id');
                }
            }
        } else if (a === 'name') {
            if (option.adsafe && v.indexOf('_') >= 0) {
                warn('adsafe_name_a', next_token, v);
            }
        }
    }

    function do_tag(name, attribute) {
        var i, tag = html_tag[name], script, x;
        src = false;
        if (!tag) {
            fail(
                bundle.unrecognized_tag_a,
                next_token,
                name === name.toLowerCase() ? name : name + ' (capitalization error)'
            );
        }
        if (stack.length > 0) {
            if (name === 'html') {
                fail('unexpected_a', token, name);
            }
            x = tag.parent;
            if (x) {
                if (x.indexOf(' ' + stack[stack.length - 1].name + ' ') < 0) {
                    fail('tag_a_in_b', token, name, x);
                }
            } else if (!option.adsafe && !option.fragment) {
                i = stack.length;
                do {
                    if (i <= 0) {
                        fail('tag_a_in_b', token, name, 'body');
                    }
                    i -= 1;
                } while (stack[i].name !== 'body');
            }
        }
        switch (name) {
        case 'div':
            if (option.adsafe && stack.length === 1 && !adsafe_id) {
                warn('adsafe_missing_id');
            }
            break;
        case 'script':
            xmode = 'script';
            advance('>');
            if (attribute.lang) {
                warn('lang', token);
            }
            if (option.adsafe && stack.length !== 1) {
                warn('adsafe_placement', token);
            }
            if (attribute.src) {
                if (option.adsafe && (!adsafe_may || !approved[attribute.src])) {
                    warn('adsafe_source', token);
                }
                if (attribute.type) {
                    warn('type', token);
                }
            } else {
                step_in(next_token.from);
                edge();
                use_strict();
                adsafe_top = true;
                script = statements();

// JSLint is also the static analyzer for ADsafe. See www.ADsafe.org.

                if (option.adsafe) {
                    if (adsafe_went) {
                        fail('adsafe_script', token);
                    }
                    if (script.length !== 1 ||
                            aint(script[0],             'id',    '(') ||
                            aint(script[0].first,       'id',    '.') ||
                            aint(script[0].first.first, 'value', 'ADSAFE') ||
                            aint(script[0].second[0],   'value', adsafe_id)) {
                        fail('adsafe_id_go');
                    }
                    switch (script[0].first.second.value) {
                    case 'id':
                        if (adsafe_may || script[0].second.length !== 1) {
                            fail('adsafe_id', next_token);
                        }
                        adsafe_may = true;
                        break;
                    case 'go':
                        if (!adsafe_may) {
                            fail('adsafe_id');
                        }
                        if (script[0].second.length !== 2 ||
                                aint(script[0].second[1], 'id', 'function') ||
                                script[0].second[1].first.length !== 2 ||
                                aint(script[0].second[1].first[0], 'value', 'dom') ||
                                aint(script[0].second[1].first[1], 'value', 'lib')) {
                            fail('adsafe_go', next_token);
                        }
                        adsafe_went = true;
                        break;
                    default:
                        fail('adsafe_id_go');
                    }
                }
                indent = null;
            }
            xmode = 'html';
            advance('</');
            if (!next_token.identifier && next_token.value !== 'script') {
                warn('expected_a_b', next_token, 'script', next_token.value);
            }
            advance();
            xmode = 'outer';
            break;
        case 'style':
            xmode = 'style';
            advance('>');
            styles();
            xmode = 'html';
            advance('</');
            if (!next_token.identifier && next_token.value !== 'style') {
                warn('expected_a_b', next_token, 'style', next_token.value);
            }
            advance();
            xmode = 'outer';
            break;
        case 'input':
            switch (attribute.type) {
            case 'radio':
            case 'checkbox':
            case 'button':
            case 'reset':
            case 'submit':
                break;
            case 'text':
            case 'file':
            case 'password':
            case 'file':
            case 'hidden':
            case 'image':
                if (option.adsafe && attribute.autocomplete !== 'off') {
                    warn('adsafe_autocomplete');
                }
                break;
            default:
                warn('bad_type');
            }
            break;
        case 'applet':
        case 'body':
        case 'embed':
        case 'frame':
        case 'frameset':
        case 'head':
        case 'iframe':
        case 'noembed':
        case 'noframes':
        case 'object':
        case 'param':
            if (option.adsafe) {
                warn('adsafe_tag', next_token, name);
            }
            break;
        }
    }


    function closetag(name) {
        return '</' + name + '>';
    }

    function html() {
        var attribute, attributes, is_empty, name, old_white = option.white,
            quote, tag_name, tag, wmode;
        xmode = 'html';
        xquote = '';
        stack = null;
        for (;;) {
            switch (next_token.value) {
            case '<':
                xmode = 'html';
                advance('<');
                attributes = {};
                tag_name = next_token;
                if (!tag_name.identifier) {
                    warn('bad_name_a', tag_name);
                }
                name = tag_name.value;
                if (option.cap) {
                    name = name.toLowerCase();
                }
                tag_name.name = name;
                advance();
                if (!stack) {
                    stack = [];
                    do_begin(name);
                }
                tag = html_tag[name];
                if (typeof tag !== 'object') {
                    fail('unrecognized_tag_a', tag_name, name);
                }
                is_empty = tag.empty;
                tag_name.type = name;
                for (;;) {
                    if (next_token.id === '/') {
                        advance('/');
                        if (next_token.id !== '>') {
                            warn('expected_a_b', next_token, '>', next_token.value);
                        }
                        break;
                    }
                    if (next_token.id && next_token.id.substr(0, 1) === '>') {
                        break;
                    }
                    if (!next_token.identifier) {
                        if (next_token.id === '(end)' || next_token.id === '(error)') {
                            warn('expected_a_b', next_token, '>', next_token.value);
                        }
                        warn('bad_name_a');
                    }
                    option.white = true;
                    spaces();
                    attribute = next_token.value;
                    option.white = old_white;
                    advance();
                    if (!option.cap && attribute !== attribute.toLowerCase()) {
                        warn('attribute_case_a', token);
                    }
                    attribute = attribute.toLowerCase();
                    xquote = '';
                    if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
                        warn('duplicate_a', token, attribute);
                    }
                    if (attribute.slice(0, 2) === 'on') {
                        if (!option.on) {
                            warn('html_handlers');
                        }
                        xmode = 'scriptstring';
                        advance('=');
                        quote = next_token.id;
                        if (quote !== '"' && quote !== '\'') {
                            fail('expected_a_b', next_token, '"', next_token.value);
                        }
                        xquote = quote;
                        wmode = option.white;
                        option.white = false;
                        advance(quote);
                        use_strict();
                        statements();
                        option.white = wmode;
                        if (next_token.id !== quote) {
                            fail('expected_a_b', next_token, quote, next_token.value);
                        }
                        xmode = 'html';
                        xquote = '';
                        advance(quote);
                        tag = false;
                    } else if (attribute === 'style') {
                        xmode = 'scriptstring';
                        advance('=');
                        quote = next_token.id;
                        if (quote !== '"' && quote !== '\'') {
                            fail('expected_a_b', next_token, '"', next_token.value);
                        }
                        xmode = 'styleproperty';
                        xquote = quote;
                        advance(quote);
                        substyle();
                        xmode = 'html';
                        xquote = '';
                        advance(quote);
                        tag = false;
                    } else {
                        if (next_token.id === '=') {
                            advance('=');
                            tag = next_token.value;
                            if (!next_token.identifier &&
                                    next_token.id !== '"' &&
                                    next_token.id !== '\'' &&
                                    next_token.arity !== 'string' &&
                                    next_token.arity !== 'number' &&
                                    next_token.id !== '(color)') {
                                warn('expected_attribute_value_a', token, attribute);
                            }
                            advance();
                        } else {
                            tag = true;
                        }
                    }
                    attributes[attribute] = tag;
                    do_attribute(name, attribute, tag);
                }
                do_tag(name, attributes);
                if (!is_empty) {
                    stack.push(tag_name);
                }
                xmode = 'outer';
                advance('>');
                break;
            case '</':
                xmode = 'html';
                advance('</');
                if (!next_token.identifier) {
                    warn('bad_name_a');
                }
                name = next_token.value;
                if (option.cap) {
                    name = name.toLowerCase();
                }
                advance();
                if (!stack) {
                    fail('unexpected_a', next_token, closetag(name));
                }
                tag_name = stack.pop();
                if (!tag_name) {
                    fail('unexpected_a', next_token, closetag(name));
                }
                if (tag_name.name !== name) {
                    fail('expected_a_b',
                        next_token, closetag(tag_name.name), closetag(name));
                }
                if (next_token.id !== '>') {
                    fail('expected_a_b', next_token, '>', next_token.value);
                }
                xmode = 'outer';
                advance('>');
                break;
            case '<!':
                if (option.safe) {
                    warn('adsafe_a');
                }
                xmode = 'html';
                for (;;) {
                    advance();
                    if (next_token.id === '>' || next_token.id === '(end)') {
                        break;
                    }
                    if (next_token.value.indexOf('--') >= 0) {
                        fail('unexpected_a', next_token, '--');
                    }
                    if (next_token.value.indexOf('<') >= 0) {
                        fail('unexpected_a', next_token, '<');
                    }
                    if (next_token.value.indexOf('>') >= 0) {
                        fail('unexpected_a', next_token, '>');
                    }
                }
                xmode = 'outer';
                advance('>');
                break;
            case '(end)':
                return;
            default:
                if (next_token.id === '(end)') {
                    fail('missing_a', next_token,
                        '</' + stack[stack.length - 1].value + '>');
                } else {
                    advance();
                }
            }
            if (stack && stack.length === 0 && (option.adsafe ||
                    !option.fragment || next_token.id === '(end)')) {
                break;
            }
        }
        if (next_token.id !== '(end)') {
            fail('unexpected_a');
        }
    }


// The actual JSLINT function itself.

    var itself = function (the_source, the_option) {
        var i, keys, predef;
        JSLINT.comments = [];
        JSLINT.errors = [];
        JSLINT.tree = '';
        begin = older_token = prev_token = token = next_token =
            Object.create(syntax['(begin)']);
        predefined = Object.create(standard);
        if (the_option) {
            option = Object.create(the_option);
            predef = option.predef;
            if (predef) {
                if (Array.isArray(predef)) {
                    for (i = 0; i < predef.length; i += 1) {
                        predefined[predef[i]] = true;
                    }
                } else if (typeof predef === 'object') {
                    keys = Object.keys(predef);
                    for (i = 0; i < keys.length; i += 1) {
                        predefined[keys[i]] = !!predef[keys];
                    }
                }
            }
            if (option.adsafe) {
                option.safe = true;
            }
            if (option.safe) {
                option.browser     =
                    option['continue'] =
                    option.css     =
                    option.debug   =
                    option.devel   =
                    option.evil    =
                    option.forin   =
                    option.on      =
                    option.rhino   =
                    option.sub     =
                    option.widget  =
                    option.windows = false;

                option.nomen       =
                    option.strict  =
                    option.undef   = true;

                predefined.Date         =
                    predefined['eval']  =
                    predefined.Function =
                    predefined.Object   = null;

                predefined.ADSAFE  =
                    predefined.lib = false;
            }
        } else {
            option = {};
        }
        option.indent = +option.indent || 0;
        option.maxerr = option.maxerr || 50;
        adsafe_id = '';
        adsafe_may = adsafe_top = adsafe_went = false;
        approved = {};
        if (option.approved) {
            for (i = 0; i < option.approved.length; i += 1) {
                approved[option.approved[i]] = option.approved[i];
            }
        } else {
            approved.test = 'test';
        }
        tab = '';
        for (i = 0; i < option.indent; i += 1) {
            tab += ' ';
        }
        global = Object.create(predefined);
        scope = global;
        funct = {
            '(global)': true,
            '(name)': '(global)',
            '(scope)': scope,
            '(breakage)': 0,
            '(loopage)': 0
        };
        functions = [funct];

        comments_off = false;
        ids = {};
        implied = {};
        in_block = false;
        indent = false;
        json_mode = false;
        lookahead = [];
        member = {};
        properties = null;
        prereg = true;
        src = false;
        stack = null;
        strict_mode = false;
        urls = [];
        var_mode = false;
        warnings = 0;
        xmode = false;
        lex.init(the_source);

        assume();

        try {
            advance();
            if (next_token.arity === 'number') {
                fail('unexpected_a');
            } else if (next_token.value.charAt(0) === '<') {
                html();
                if (option.adsafe && !adsafe_went) {
                    warn('adsafe_go', this);
                }
            } else {
                switch (next_token.id) {
                case '{':
                case '[':
                    json_mode = true;
                    json_value();
                    break;
                case '@':
                case '*':
                case '#':
                case '.':
                case ':':
                    xmode = 'style';
                    advance();
                    if (token.id !== '@' || !next_token.identifier ||
                            next_token.value !== 'charset' || token.line !== 1 ||
                            token.from !== 1) {
                        fail('css');
                    }
                    advance();
                    if (next_token.arity !== 'string' &&
                            next_token.value !== 'UTF-8') {
                        fail('css');
                    }
                    advance();
                    semicolon();
                    styles();
                    break;

                default:
                    if (option.adsafe && option.fragment) {
                        fail('expected_a_b',
                            next_token, '<div>', next_token.value);
                    }

// If the first token is predef semicolon, ignore it. This is sometimes used when
// files are intended to be appended to files that may be sloppy. predef sloppy
// file may be depending on semicolon insertion on its last line.

                    step_in(1);
                    if (next_token.id === ';') {
                        semicolon();
                    }
                    if (next_token.value === 'use strict') {
                        warn('function_strict');
                        use_strict();
                    }
                    adsafe_top = true;
                    begin.first = statements();
                    JSLINT.tree = begin;
                    if (option.adsafe && (JSLINT.tree.length !== 1 ||
                            aint(JSLINT.tree[0], 'id', '(') ||
                            aint(JSLINT.tree[0].first, 'id', '.') ||
                            aint(JSLINT.tree[0].first.first, 'value', 'ADSAFE') ||
                            aint(JSLINT.tree[0].first.second, 'value', 'lib') ||
                            JSLINT.tree[0].second.length !== 2 ||
                            JSLINT.tree[0].second[0].arity !== 'string' ||
                            aint(JSLINT.tree[0].second[1], 'id', 'function'))) {
                        fail('adsafe_lib');
                    }
                    if (JSLINT.tree.disrupt) {
                        warn('weird_program', prev_token);
                    }
                }
            }
            indent = null;
            advance('(end)');
        } catch (e) {
            if (e) {        // `~
                JSLINT.errors.push({
                    reason    : e.message,
                    line      : e.line || next_token.line,
                    character : e.character || next_token.from
                }, null);
            }
        }
        return JSLINT.errors.length === 0;
    };


// Data summary.

    itself.data = function () {
        var data = {functions: []},
            function_data,
            globals,
            i,
            implieds = [],
            j,
            kind,
            members = [],
            name,
            the_function,
            unused = [];
        if (itself.errors.length) {
            data.errors = itself.errors;
        }

        if (json_mode) {
            data.json = true;
        }

        for (name in implied) {
            if (Object.prototype.hasOwnProperty.call(implied, name)) {
                implieds.push({
                    name: name,
                    line: implied[name]
                });
            }
        }
        if (implieds.length > 0) {
            data.implieds = implieds;
        }

        if (urls.length > 0) {
            data.urls = urls;
        }

        globals = Object.keys(functions[0]).filter(function (value) {
            return value.charAt(0) !== '(' ? value : undefined;
        });
        if (globals.length > 0) {
            data.globals = globals;
        }

        for (i = 1; i < functions.length; i += 1) {
            the_function = functions[i];
            function_data = {};
            for (j = 0; j < functionicity.length; j += 1) {
                function_data[functionicity[j]] = [];
            }
            for (name in the_function) {
                if (Object.prototype.hasOwnProperty.call(the_function, name)) {
                    if (name.charAt(0) !== '(') {
                        kind = the_function[name];
                        if (kind === 'unction') {
                            kind = 'unused';
                        } else if (typeof kind === 'boolean') {
                            kind = 'global';
                        }
                        if (Array.isArray(function_data[kind])) {
                            function_data[kind].push(name);
                            if (kind === 'unused') {
                                unused.push({
                                    name: name,
                                    line: the_function['(line)'],
                                    'function': the_function['(name)']
                                });
                            }
                        }
                    }
                }
            }
            for (j = 0; j < functionicity.length; j += 1) {
                if (function_data[functionicity[j]].length === 0) {
                    delete function_data[functionicity[j]];
                }
            }
            function_data.name = the_function['(name)'];
            function_data.param = the_function['(params)'];
            function_data.line = the_function['(line)'];
            data.functions.push(function_data);
        }

        if (unused.length > 0) {
            data.unused = unused;
        }

        members = [];
        for (name in member) {
            if (typeof member[name] === 'number') {
                data.member = member;
                break;
            }
        }

        return data;
    };


    itself.report = function (errors_only) {
        var data = itself.data();

        var err, evidence, i, j, key, keys, length, mem = '', name, names,
            output = [], snippets, the_function, warning;

        function detail(h, array) {
            var comma_needed, i, singularity;
            if (array) {
                output.push('<div><i>' + h + '</i> ');
                array = array.sort();
                for (i = 0; i < array.length; i += 1) {
                    if (array[i] !== singularity) {
                        singularity = array[i];
                        output.push((comma_needed ? ', ' : '') + singularity);
                        comma_needed = true;
                    }
                }
                output.push('</div>');
            }
        }

        if (data.errors || data.implieds || data.unused) {
            err = true;
            output.push('<div id=errors><i>Error:</i>');
            if (data.errors) {
                for (i = 0; i < data.errors.length; i += 1) {
                    warning = data.errors[i];
                    if (warning) {
                        evidence = warning.evidence || '';
                        output.push('<p>Problem' + (isFinite(warning.line) ? ' at line ' +
                            warning.line + ' character ' + warning.character : '') +
                            ': ' + warning.reason.entityify() +
                            '</p><p class=evidence>' +
                            (evidence && (evidence.length > 80 ? evidence.slice(0, 77) + '...' :
                            evidence).entityify()) + '</p>');
                    }
                }
            }

            if (data.implieds) {
                snippets = [];
                for (i = 0; i < data.implieds.length; i += 1) {
                    snippets[i] = '<code>' + data.implieds[i].name + '</code>&nbsp;<i>' +
                        data.implieds[i].line + '</i>';
                }
                output.push('<p><i>Implied global:</i> ' + snippets.join(', ') + '</p>');
            }

            if (data.unused) {
                snippets = [];
                for (i = 0; i < data.unused.length; i += 1) {
                    snippets[i] = '<code><u>' + data.unused[i].name + '</u></code>&nbsp;<i>' +
                        data.unused[i].line + ' </i> <small>' +
                        data.unused[i]['function'] + '</small>';
                }
                output.push('<p><i>Unused variable:</i> ' + snippets.join(', ') + '</p>');
            }
            if (data.json) {
                output.push('<p>JSON: bad.</p>');
            }
            output.push('</div>');
        }

        if (!errors_only) {

            output.push('<br><div id=functions>');

            if (data.urls) {
                detail("URLs<br>", data.urls, '<br>');
            }

            if (xmode === 'style') {
                output.push('<p>CSS.</p>');
            } else if (data.json && !err) {
                output.push('<p>JSON: good.</p>');
            } else if (data.globals) {
                output.push('<div><i>Global</i> ' +
                    data.globals.sort().join(', ') + '</div>');
            } else {
                output.push('<div><i>No new global variables introduced.</i></div>');
            }

            for (i = 0; i < data.functions.length; i += 1) {
                the_function = data.functions[i];
                names = [];
                if (the_function.param) {
                    for (j = 0; j < the_function.param.length; j += 1) {
                        names[j] = the_function.param[j].value;
                    }
                }
                output.push('<br><div class=function><i>' + the_function.line + '</i> ' +
                    (the_function.name || '') + '(' + names.join(', ') + ')</div>');
                detail('<big><b>Unused</b></big>', the_function.unused);
                detail('Closure', the_function.closure);
                detail('Variable', the_function['var']);
                detail('Exception', the_function.exception);
                detail('Outer', the_function.outer);
                detail('Global', the_function.global);
                detail('Label', the_function.label);
            }

            if (data.member) {
                keys = Object.keys(data.member);
                if (keys.length) {
                    keys = keys.sort();
                    mem = '<br><pre id=properties>/*properties ';
                    length = 13;
                    for (i = 0; i < keys.length; i += 1) {
                        key = keys[i];
                        name = key.name();
                        if (length + name.length > 72) {
                            output.push(mem + '<br>');
                            mem = '    ';
                            length = 1;
                        }
                        length += name.length + 2;
                        if (data.member[key] === 1) {
                            name = '<i>' + name + '</i>';
                        }
                        if (i < keys.length - 1) {
                            name += ', ';
                        }
                        mem += name;
                    }
                    output.push(mem + '<br>*/</pre>');
                }
                output.push('</div>');
            }
        }
        return output.join('');
    };
    itself.jslint = itself;

    itself.edition = '2011-03-29';

    return itself;

}());
// END JSLint (Replace all above code when changing JSLint versions)



// Command line integration via Rhino
(function (args) {
    var name = args[0],
        optstr = args[1], // arg1=val1,arg2=val2,...
        opts = { rhino: true },
        input;

    if (!name) {
        print('No files present in the fileset; Check your pattern match in build.xml');
        quit(1);
    }

    if (optstr) {
        optstr.split(',').forEach(function (arg) {
            var o = arg.split('=');
            opts[o[0]] = (function (ov) {
                switch (ov) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    return ov;
                }
            })(o[1]);
        });
    }

    input = readFile(name);

    if (!input) {
        print('JSLint: Couldn\'t open file ' + name);
        quit(1);
    }
    if (!JSLINT(input, opts)) {
        for (var i = 0, err; err = JSLINT.errors[i]; i++) {
            print(err.reason + ' (line: ' + err.line + ', character: ' + err.character + ')');
            print('> ' + (err.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            print('');
        }
        quit(1);
    }

    quit(0);
}(arguments));
