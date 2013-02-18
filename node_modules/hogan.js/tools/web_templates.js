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

var Hogan = require(__dirname + '/../lib/hogan.js');
var fs = require('fs');
var path = require('path');

// Substitute variables in the homepage with values from package.json
var homeTemplatePath = __dirname + '/../build/gh-pages/index.html.mustache';
var contextPath = __dirname + '/../package.json';

var homepage = fs.readFileSync(homeTemplatePath).toString();
var context = JSON.parse(fs.readFileSync(contextPath).toString());

var template = Hogan.compile(homepage);

fs.writeFileSync(path.dirname(homeTemplatePath) + '/index.html',
                 template.render(context));

fs.unlinkSync(homeTemplatePath);