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

var Hogan = Hogan || require('../lib/hogan');
var doc = this["document"];
var fs = require('fs');

var passed = 0;
var failed = 0;

if (!this["output"]) {
  var output = function (string) {
    return doc ? doc.write(string + '<br/>') : console.log(string);
  };
}

function runTest(tests) {
  tests.forEach(function(test) {
    var partials = {};
    for (var i in test.partials) {
      partials[i] = Hogan.compile(test.partials[i]);
    }
    var t = Hogan.compile(test.template);

    if (test.data.lambda) {
      var func = (new Function ('return ' + test.data.lambda.js)());
      test.data.lambda = function() { return func; };
    }

    var s = t.render(test.data, partials);
    is(s, test.expected, test.name + ': ' + test.desc);
  });
}

var testDir = './test/spec/specs';
var files = fs.readdirSync(testDir)
              .filter(function(f) { return f.indexOf('.json') > 0; })
              .map(function(f) { return testDir + '/' + f});

for (var i = 0; i < files.length; i++) {
  var test = JSON.parse(fs.readFileSync(files[i]).toString());
  runTest(test.tests);
}

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
