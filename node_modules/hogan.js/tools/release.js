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

var fs = require('fs');
var path = require('path');
var Hogan = require(__dirname + '/../lib/hogan');
var minlicense = '/**\n* @preserve Copyright 2012 Twitter, Inc.\n* @license http://www.apache.org/licenses/LICENSE-2.0.txt\n*/\n';

function read(path) {
  return fs.readFileSync(path).toString()
}

// Good enough for little js files
function copy(src, dst) {
  return fs.writeFileSync(dst, read(src));
}

function uglify(src, dst) {
  var jsp = require("uglify-js").parser;
  var pro = require("uglify-js").uglify;
  var orig_code = read(src);
  var ast = jsp.parse(orig_code); // parse code and get the initial AST
  ast = pro.ast_mangle(ast); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
  fs.writeFileSync(dst, minlicense + pro.gen_code(ast));
}

var packageJSON = JSON.parse(read('package.json'));
var version = packageJSON.version;

function removeFirstComment(text) {
  return text.substring(text.indexOf('*/') + 2);
}

var context = {
  template: removeFirstComment(read(__dirname + '/../lib/template.js')),
  compiler: removeFirstComment(read(__dirname + '/../lib/compiler.js'))
};

var wrapperPath = '/../wrappers/';
var wrappers = fs.readdirSync(__dirname + wrapperPath).map(function(f) {
  return __dirname + wrapperPath + f;
});

var distPath = __dirname + '/../dist/';
wrappers.forEach(function(wrapper) {
  var tail = path.basename(wrapper, '.mustache');
  var target = distPath + 'hogan-' + version + '.' + tail;
  var uglified =  distPath + 'hogan-' + version + '.min.' + tail;
  fs.writeFileSync(target, Hogan.compile(read(wrapper)).render(context));
  uglify(target, uglified);
});

// Also release Hogan.Template on its own.
var templateTarget = distPath + 'template-' + version + '.js';
fs.writeFileSync(templateTarget, read(__dirname + '/../lib/template.js'));
uglify(templateTarget, distPath + 'template-' + version + '.min.js');
