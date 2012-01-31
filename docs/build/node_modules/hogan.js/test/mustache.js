/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var doc = this['document'];
var fs = require('fs');

var passed = 0;
var failed = 0;

if (!this['output']) {
  var output = function (string) {
    return doc ? doc.write(string + '<br/>') : console.log(string);
  };
}

var Hogan = require(__dirname + '/../lib/hogan');
var template = fs.readFileSync(__dirname + '/../lib/template.js').toString();
var compiler = fs.readFileSync(__dirname + '/../lib/compiler.js').toString();
var mustache_wrapper = fs.readFileSync(__dirname + '/../wrappers/mustache.js.mustache').toString();

// Create a Mustache.js emulator from the distribution template
var engines = (new Function(Hogan.compile(mustache_wrapper).render({template: template, compiler: compiler}) +
                                          '; return {Hogan: Hogan, Mustache: Mustache};'))();

var Mustache = engines.Mustache;
var Hogan2 = engines.Hogan;


// sanity check
is(Mustache.hasOwnProperty('to_html'), true, 'Mustache has to_html method.');

// Check for Mustache.js partial resolution behavior.
var context = {
  foo: 'bar',
  mypartial: {
  	baz: 'qux'
  }
}
var text = 'abc {{foo}} def {{>mypartial}} ghi';
var partialText = '{{baz}}';
var s = Mustache.to_html(text, context, {'mypartial': partialText});
is(s, 'abc bar def qux ghi', 'Correct emulation of Mustache.js partial-name-in-context resolution.');

// Now check to see that the Hogan resolution is unaffected.
var t = Hogan2.compile(text);
s = t.render(context, {'mypartial': partialText});
is(s, 'abc bar def  ghi', 'Hogan behavior not changed by Mustache.js emulation.');

// Check for sendFun behavior
var buf = "";
function send(s) {
  buf += "-FOO " + s + " FOO-";
}
var s = Mustache.to_html(text, context, {'mypartial': partialText}, send);
is(buf, '-FOO abc bar def qux ghi FOO-', 'Correct emulation of Mustache.js sendFun.');


function is(got, expected, msg) {
  if (got === expected) {
    output("OK:   " + msg);
    ++passed;
  } else {
    output("FAIL: " + msg);
    output("Expected |" + expected + "|");
    output("     Got |" + got + "|");
    ++failed;
  }
}

function complete() {
  output("\nTests Complete");
  output("--------------");
  output("Passed: " + passed);
  output("Failed: " + failed);
  output("\n");
}

complete();