#! /usr/bin/env node
global.DIGITS_OVERRIDE_FOR_TESTING = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

var parseJS = require("../lib/parse-js");
var sys = require("util");

// write debug in a very straightforward manner
var debug = function(){
        sys.log(Array.prototype.slice.call(arguments).join(', '));
};

var testsPassed = true;

ParserTestSuite(function(i, input, desc){
	try {
		parseJS.parse(input);
		debug("ok " + i + ": " + desc);
	} catch(e){
		debug("FAIL " + i + " " + desc + " (" + e + ")");
    testsPassed = false;
	}
});

process.exit(testsPassed ? 0 : 1);

function ParserTestSuite(callback){
	var inps = [
		["var abc;", "Regular variable statement w/o assignment"],
		["var abc = 5;", "Regular variable statement with assignment"],
		["/* */;", "Multiline comment"],
		['/** **/;', 'Double star multiline comment'],
		["var f = function(){;};", "Function expression in var assignment"],
		['hi; // moo\n;', 'single line comment'],
		['var varwithfunction;', 'Dont match keywords as substrings'], // difference between `var withsomevar` and `"str"` (local search and lits)
		['a + b;', 'addition'],
		["'a';", 'single string literal'],
		["'a\\n';", 'single string literal with escaped return'],
		['"a";', 'double string literal'],
		['"a\\n";', 'double string literal with escaped return'],
		['"var";', 'string is a keyword'],
		['"variable";', 'string starts with a keyword'],
		['"somevariable";', 'string contains a keyword'],
		['"somevar";', 'string ends with a keyword'],
		['500;', 'int literal'],
		['500.;', 'float literal w/o decimals'],
		['500.432;', 'float literal with decimals'],
		['.432432;', 'float literal w/o int'],
		['(a,b,c);', 'parens and comma'],
		['[1,2,abc];', 'array literal'],
		['var o = {a:1};', 'object literal unquoted key'],
		['var o = {"b":2};', 'object literal quoted key'], // opening curly may not be at the start of a statement...
		['var o = {c:c};', 'object literal keyname is identifier'],
		['var o = {a:1,"b":2,c:c};', 'object literal combinations'],
		['var x;\nvar y;', 'two lines'],
		['var x;\nfunction n(){; }', 'function def'],
		['var x;\nfunction n(abc){; }', 'function def with arg'],
		['var x;\nfunction n(abc, def){ ;}', 'function def with args'],
		['function n(){ "hello"; }', 'function def with body'],
		['/a/;', 'regex literal'],
		['/a/b;', 'regex literal with flag'],
		['/a/ / /b/;', 'regex div regex'],
		['a/b/c;', 'triple division looks like regex'],
		['+function(){/regex/;};', 'regex at start of function body'],
		// http://code.google.com/p/es-lab/source/browse/trunk/tests/parser/parsertests.js?r=86
		// http://code.google.com/p/es-lab/source/browse/trunk/tests/parser/parsertests.js?r=430

		// first tests for the lexer, should also parse as program (when you append a semi)

		// comments
		['//foo!@#^&$1234\nbar;', 'single line comment'],
		['/* abcd!@#@$* { } && null*/;', 'single line multi line comment'],
		['/*foo\nbar*/;','multi line comment'],
		['/*x*x*/;','multi line comment with *'],
		['/**/;','empty comment'],
		// identifiers
		["x;",'1 identifier'],
		["_x;",'2 identifier'],
		["xyz;",'3 identifier'],
		["$x;",'4 identifier'],
		["x$;",'5 identifier'],
		["_;",'6 identifier'],
		["x5;",'7 identifier'],
		["x_y;",'8 identifier'],
		["x+5;",'9 identifier'],
		["xyz123;",'10 identifier'],
		["x1y1z1;",'11 identifier'],
		["foo\\u00D8bar;",'12 identifier unicode escape'],
		//["foo�bar;",'13 identifier unicode embedded (might fail)'],
		// numbers
		["5;", '1 number'],
		["5.5;", '2 number'],
		["0;", '3 number'],
		["0.0;", '4 number'],
		["0.001;", '5 number'],
		["1.e2;", '6 number'],
		["1.e-2;", '7 number'],
		["1.E2;", '8 number'],
		["1.E-2;", '9 number'],
		[".5;", '10 number'],
		[".5e3;", '11 number'],
		[".5e-3;", '12 number'],
		["0.5e3;", '13 number'],
		["55;", '14 number'],
		["123;", '15 number'],
		["55.55;", '16 number'],
		["55.55e10;", '17 number'],
		["123.456;", '18 number'],
		["1+e;", '20 number'],
		["0x01;", '22 number'],
		["0XCAFE;", '23 number'],
		["0x12345678;", '24 number'],
		["0x1234ABCD;", '25 number'],
		["0x0001;", '26 number'],
		// strings
		["\"foo\";", '1 string'],
		["\'foo\';", '2 string'],
		["\"x\";", '3 string'],
		["\'\';", '4 string'],
		["\"foo\\tbar\";", '5 string'],
		["\"!@#$%^&*()_+{}[]\";", '6 string'],
		["\"/*test*/\";", '7 string'],
		["\"//test\";", '8 string'],
		["\"\\\\\";", '9 string'],
		["\"\\u0001\";", '10 string'],
		["\"\\uFEFF\";", '11 string'],
		["\"\\u10002\";", '12 string'],
		["\"\\x55\";", '13 string'],
		["\"\\x55a\";", '14 string'],
		["\"a\\\\nb\";", '15 string'],
		['";"', '16 string: semi in a string'],
		['"a\\\nb";', '17 string: line terminator escape'],
		// literals
		["null;", "null"],
		["true;", "true"],
		["false;", "false"],
		// regex
		["/a/;", "1 regex"],
		["/abc/;", "2 regex"],
		["/abc[a-z]*def/g;", "3 regex"],
		["/\\b/;", "4 regex"],
		["/[a-zA-Z]/;", "5 regex"],

		// program tests (for as far as they havent been covered above)

		// regexp
		["/foo(.*)/g;", "another regexp"],
		// arrays
		["[];", "1 array"],
		["[   ];", "2 array"],
		["[1];", "3 array"],
		["[1,2];", "4 array"],
		["[1,2,,];", "5 array"],
		["[1,2,3];", "6 array"],
		["[1,2,3,,,];", "7 array"],
		// objects
		["{};", "1 object"],
		["({x:5});", "2 object"],
		["({x:5,y:6});", "3 object"],
		["({x:5,});", "4 object"],
		["({if:5});", "5 object"],
		["({ get x() {42;} });", "6 object"],
		["({ set y(a) {1;} });", "7 object"],
		// member expression
		["o.m;", "1 member expression"],
		["o['m'];", "2 member expression"],
		["o['n']['m'];", "3 member expression"],
		["o.n.m;", "4 member expression"],
		["o.if;", "5 member expression"],
		// call and invoke expressions
		["f();", "1 call/invoke expression"],
		["f(x);", "2 call/invoke expression"],
		["f(x,y);", "3 call/invoke expression"],
		["o.m();", "4 call/invoke expression"],
		["o['m'];", "5 call/invoke expression"],
		["o.m(x);", "6 call/invoke expression"],
		["o['m'](x);", "7 call/invoke expression"],
		["o.m(x,y);", "8 call/invoke expression"],
		["o['m'](x,y);", "9 call/invoke expression"],
		["f(x)(y);", "10 call/invoke expression"],
		["f().x;", "11 call/invoke expression"],

		// eval
		["eval('x');", "1 eval"],
		["(eval)('x');", "2 eval"],
		["(1,eval)('x');", "3 eval"],
		["eval(x,y);", "4 eval"],
		// new expression
		["new f();", "1 new expression"],
		["new o;", "2 new expression"],
		["new o.m;", "3 new expression"],
		["new o.m(x);", "4 new expression"],
		["new o.m(x,y);", "5 new expression"],
		// prefix/postfix
		["++x;", "1 pre/postfix"],
		["x++;", "2 pre/postfix"],
		["--x;", "3 pre/postfix"],
		["x--;", "4 pre/postfix"],
		["x ++;", "5 pre/postfix"],
		["x /* comment */ ++;", "6 pre/postfix"],
		["++ /* comment */ x;", "7 pre/postfix"],
		// unary operators
		["delete x;", "1 unary operator"],
		["void x;", "2 unary operator"],
		["+ x;", "3 unary operator"],
		["-x;", "4 unary operator"],
		["~x;", "5 unary operator"],
		["!x;", "6 unary operator"],
		// meh
		["new Date++;", "new date ++"],
		["+x++;", " + x ++"],
		// expression expressions
		["1 * 2;", "1 expression expressions"],
		["1 / 2;", "2 expression expressions"],
		["1 % 2;", "3 expression expressions"],
		["1 + 2;", "4 expression expressions"],
		["1 - 2;", "5 expression expressions"],
		["1 << 2;", "6 expression expressions"],
		["1 >>> 2;", "7 expression expressions"],
		["1 >> 2;", "8 expression expressions"],
		["1 * 2 + 3;", "9 expression expressions"],
		["(1+2)*3;", "10 expression expressions"],
		["1*(2+3);", "11 expression expressions"],
		["x<y;", "12 expression expressions"],
		["x>y;", "13 expression expressions"],
		["x<=y;", "14 expression expressions"],
		["x>=y;", "15 expression expressions"],
		["x instanceof y;", "16 expression expressions"],
		["x in y;", "17 expression expressions"],
		["x&y;", "18 expression expressions"],
		["x^y;", "19 expression expressions"],
		["x|y;", "20 expression expressions"],
		["x+y<z;", "21 expression expressions"],
		["x<y+z;", "22 expression expressions"],
		["x+y+z;", "23 expression expressions"],
		["x+y<z;", "24 expression expressions"],
		["x<y+z;", "25 expression expressions"],
		["x&y|z;", "26 expression expressions"],
		["x&&y;", "27 expression expressions"],
		["x||y;", "28 expression expressions"],
		["x&&y||z;", "29 expression expressions"],
		["x||y&&z;", "30 expression expressions"],
		["x<y?z:w;", "31 expression expressions"],
		// assignment
		["x >>>= y;", "1 assignment"],
		["x <<= y;", "2 assignment"],
		["x = y;", "3 assignment"],
		["x += y;", "4 assignment"],
		["x /= y;", "5 assignment"],
		// comma
		["x, y;", "comma"],
		// block
		["{};", "1 block"],
		["{x;};", "2 block"],
		["{x;y;};", "3 block"],
		// vars
		["var x;", "1 var"],
		["var x,y;", "2 var"],
		["var x=1,y=2;", "3 var"],
		["var x,y=2;", "4 var"],
		// empty
		[";", "1 empty"],
		["\n;", "2 empty"],
		// expression statement
		["x;", "1 expression statement"],
		["5;", "2 expression statement"],
		["1+2;", "3 expression statement"],
		// if
		["if (c) x; else y;", "1 if statement"],
		["if (c) x;", "2 if statement"],
		["if (c) {} else {};", "3 if statement"],
		["if (c1) if (c2) s1; else s2;", "4 if statement"],
		// while
		["do s; while (e);", "1 while statement"],
		["do { s; } while (e);", "2 while statement"],
		["while (e) s;", "3 while statement"],
		["while (e) { s; };", "4 while statement"],
		// for
		["for (;;) ;", "1 for statement"],
		["for (;c;x++) x;", "2 for statement"],
		["for (i;i<len;++i){};", "3 for statement"],
		["for (var i=0;i<len;++i) {};", "4 for statement"],
		["for (var i=0,j=0;;){};", "5 for statement"],
		//["for (x in b; c; u) {};", "6 for statement"],
		["for ((x in b); c; u) {};", "7 for statement"],
		["for (x in a);", "8 for statement"],
		["for (var x in a){};", "9 for statement"],
		["for (var x=5 in a) {};", "10 for statement"],
		["for (var x = a in b in c) {};", "11 for statement"],
		["for (var x=function(){a+b;}; a<b; ++i) some;", "11 for statement, testing for parsingForHeader reset with the function"],
		["for (var x=function(){for (x=0; x<15; ++x) alert(foo); }; a<b; ++i) some;", "11 for statement, testing for parsingForHeader reset with the function"],
		// flow statements
		["while(1){ continue; }", "1 flow statement"],
		["label: while(1){ continue label; }", "2 flow statement"],
		["while(1){ break; }", "3 flow statement"],
		["somewhere: while(1){ break somewhere; }", "4 flow statement"],
		["while(1){ continue /* comment */ ; }", "5 flow statement"],
		["while(1){ continue \n; }", "6 flow statement"],
		["(function(){ return; })()", "7 flow statement"],
		["(function(){ return 0; })()", "8 flow statement"],
		["(function(){ return 0 + \n 1; })()", "9 flow statement"],
		// with
		["with (e) s;", "with statement"],
		// switch
		["switch (e) { case x: s; };", "1 switch statement"],
		["switch (e) { case x: s1;s2; default: s3; case y: s4; };", "2 switch statement"],
		["switch (e) { default: s1; case x: s2; case y: s3; };", "3 switch statement"],
		["switch (e) { default: s; };", "4 switch statement"],
		["switch (e) { case x: s1; case y: s2; };", "5 switch statement"],
		// labels
		["foo : x;", " flow statement"],
		// throw
		["throw x;", "1 throw statement"],
		["throw x\n;", "2 throw statement"],
		// try catch finally
		["try { s1; } catch (e) { s2; };", "1 trycatchfinally statement"],
		["try { s1; } finally { s2; };", "2 trycatchfinally statement"],
		["try { s1; } catch (e) { s2; } finally { s3; };", "3 trycatchfinally statement"],
		// debugger
		["debugger;", "debugger statement"],
		// function decl
		["function f(x) { e; return x; };", "1 function declaration"],
		["function f() { x; y; };", "2 function declaration"],
		["function f(x,y) { var z; return x; };", "3 function declaration"],
		// function exp
		["(function f(x) { return x; });", "1 function expression"],
		["(function empty() {;});", "2 function expression"],
		["(function empty() {;});", "3 function expression"],
		["(function (x) {; });", "4 function expression"],
		// program
		["var x; function f(){;}; null;", "1 program"],
		[";;", "2 program"],
		["{ x; y; z; }", "3 program"],
		["function f(){ function g(){;}};", "4 program"],
		["x;\n/*foo*/\n	;", "5 program"],

		// asi
		["foo: while(1){ continue \n foo; }", "1 asi"],
		["foo: while(1){ break \n foo; }", "2 asi"],
		["(function(){ return\nfoo; })()", "3 asi"],
		["var x; { 1 \n 2 } 3", "4 asi"],
		["ab 	 /* hi */\ncd", "5 asi"],
		["ab/*\n*/cd", "6 asi (multi line multilinecomment counts as eol)"],
		["foo: while(1){ continue /* wtf \n busta */ foo; }", "7 asi illegal with multi line comment"],
		["function f() { s }", "8 asi"],
		["function f() { return }", "9 asi"],

		// use strict
                // XXX: some of these should actually fail?
                //      no support for "use strict" yet...
		['"use strict"; \'bla\'\n; foo;', "1 directive"],
		['(function() { "use strict"; \'bla\';\n foo; });', "2 directive"],
		['"use\\n strict";', "3 directive"],
		['foo; "use strict";', "4 directive"],

		// tests from http://es5conform.codeplex.com/

		['"use strict"; var o = { eval: 42};', "8.7.2-3-1-s: the use of eval as property name is allowed"],
		['({foo:0,foo:1});', 'Duplicate property name allowed in not strict mode'],
		['function foo(a,a){}', 'Duplicate parameter name allowed in not strict mode'],
		['(function foo(eval){})', 'Eval allowed as parameter name in non strict mode'],
		['(function foo(arguments){})', 'Arguments allowed as parameter name in non strict mode'],

		// empty programs

		['', '1 Empty program'],
		['// test', '2 Empty program'],
		['//test\n', '3 Empty program'],
		['\n// test', '4 Empty program'],
		['\n// test\n', '5 Empty program'],
		['/* */', '6 Empty program'],
		['/*\ns,fd\n*/', '7 Empty program'],
		['/*\ns,fd\n*/\n', '8 Empty program'],
		['  	', '9 Empty program'],
		['  /*\nsmeh*/	\n   ', '10 Empty program'],

		// trailing whitespace

		['a  ', '1 Trailing whitespace'],
		['a /* something */', '2 Trailing whitespace'],
		['a\n	// hah', '3 Trailing whitespace'],
		['/abc/de//f', '4 Trailing whitespace'],
		['/abc/de/*f*/\n	', '5 Trailing whitespace'],

		// things the parser tripped over at one point or the other (prevents regression bugs)
		['for (x;function(){ a\nb };z) x;', 'for header with function body forcing ASI'],
		['c=function(){return;return};', 'resetting noAsi after literal'],
		['d\nd()', 'asi exception causing token overflow'],
		['for(;;){x=function(){}}', 'function expression in a for header'],
		['for(var k;;){}', 'parser failing due to ASI accepting the incorrect "for" rule'],
		['({get foo(){ }})', 'getter with empty function body'],
		['\nreturnr', 'eol causes return statement to ignore local search requirement'],
		[' / /', '1 whitespace before regex causes regex to fail?'],
		['/ // / /', '2 whitespace before regex causes regex to fail?'],
		['/ / / / /', '3 whitespace before regex causes regex to fail?'],

		['\n\t// Used for trimming whitespace\n\ttrimLeft = /^\\s+/;\n\ttrimRight = /\\s+$/;\t\n','turned out this didnt crash (the test below did), but whatever.'],
		['/[\\/]/;', 'escaped forward slash inside class group (would choke on fwd slash)'],
		['/[/]/;', 'also broke but is valid in es5 (not es3)'],
		['({get:5});','get property name thats not a getter'],
		['({set:5});','set property name thats not a setter'],
		['l !== "px" && (d.style(h, c, (k || 1) + l), j = (k || 1) / f.cur() * j, d.style(h, c, j + l)), i[1] && (k = (i[1] === "-=" ? -1 : 1) * k + j), f.custom(j, k, l)', 'this choked regex/div at some point'],
		['(/\'/g, \'\\\\\\\'\') + "\'";', 'the sequence of escaped characters confused the tokenizer'],
                ['if (true) /=a/.test("a");', 'regexp starting with "=" in not obvious context (not implied by preceding token)']
	];

	for (var i=0; i<inps.length; ++i) {
		callback(i, inps[i][0], inps[i][1]);
	};
};
