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

var Hogan = Hogan || require('../lib/hogan')
  , doc = this["document"]

function testScanTextNoTags() {
  var text = "<h2>hi</h2>";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0]+'', text, "text is equal to first token");
}

function testScanOneTag() {
  var text = "{{hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
}

function testScanMultipleTags() {
  var text = "asdf{{hmm}}asdf2{{hmm2}}asdf3";
  var tokens = Hogan.scan(text);
  is(tokens.length, 5, "3 text tokens, 2 tag tokens.");
  is(tokens[0]+'', "asdf", "first token is text");
  is(tokens[1].n, "hmm", "second token is tag");
  is(tokens[1].tag, "_v", "second token is a variable");
  is(tokens[2]+'', "asdf2", "third token is text");
  is(tokens[3].n, "hmm2", "fourth token is tag");
  is(tokens[3].tag, "_v", "fourth token is a variable");
  is(tokens[4]+'', "asdf3", "Fifth token is text");
}

function testScanSectionOpen() {
  var text = "{{#hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "#", "First token is a section.");
}

function testScanSectionClose() {
  var text = "{{/hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "/", "First token is a section.");
}

function testScanSection() {
  var text = "{{#hmm}}{{/hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 2, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "#", "First token is a section.");
  is(tokens[1].n, "hmm", "Second token content is variable name.");
  is(tokens[1].tag, "/", "Second token is a section.");
}

function testScanSectionInContent() {
  var text = "abc{{#hmm}}def{{/hmm}}ghi";
  var tokens = Hogan.scan(text);
  is(tokens.length, 5, "3 text tokens, 2 tag tokens.");
  is(tokens[0]+'', "abc", "first token is text");
  is(tokens[1].n, "hmm", "second token is tag");
  is(tokens[1].tag, "#", "second token is a variable");
  is(tokens[2]+'', "def", "third token is text");
  is(tokens[3].n, "hmm", "fourth token is tag");
  is(tokens[3].tag, "/", "fourth token is a variable");
  is(tokens[4]+'', "ghi", "Fifth token is text");
}

function testScanNegativeSection() {
  var text = "{{^hmm}}{{/hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 2, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "^", "First token is a negative section.");
  is(tokens[1].n, "hmm", "First token content is variable name.");
  is(tokens[1].tag, "/", "Second token is a section.");
}

function testScanPartial() {
  var text = "{{>hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, ">", "First token is a partial.");
}


function testScanBackwardPartial() {
  var text = "{{<hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "<", "First token is a backward partial.");
}

function testScanAmpersandNoEscapeTag() {
  var text = "{{&hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "&", "First token is an ampersand no-escape.");
}

function testScanTripleStache() {
  var text = "{{{hmm}}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "{", "First token is a triple-stache.");
}

function testScanSectionWithTripleStacheInside() {
  var text = "a{{#yo}}b{{{hmm}}}c{{/yo}}d";
  var tokens = Hogan.scan(text);
  is(tokens.length, 7, "One token");
  is(tokens[0]+'', "a", "First token content is correct text.");
  is(tokens[1].n, "yo", "Second token content is correct text.");
  is(tokens[1].tag, "#", "Second token is a section.");
  is(tokens[2]+'', "b", "Third token content is correct text.");
  is(tokens[3].n, "hmm", "Fourth token content is correct text.");
  is(tokens[3].tag, "{", "Fourth token is a triple stache.");
  is(tokens[4]+'', "c", "Fifth token content is correct text.");
  is(tokens[5].n, "yo", "Sixth token content is correct text.");
  is(tokens[5].tag, "/", "Sixth token is a close.");
  is(tokens[6]+'', "d", "Seventh token content is correct text.");
}

function testScanSetDelimiter() {
  var text = "a{{=<% %>=}}b";
  var tokens = Hogan.scan(text);
  is(tokens.length, 2, "change delimiter doesn't appear as token.");
  is(tokens[0]+'', "a", "text before change delimiter is processed.");
  is(tokens[1]+'', "b", "text after change delimiter is processed.");
}

function testScanResetDelimiter() {
  var text = "a{{=<% %>=}}b<%hmm%>c<%={{ }}=%>d{{hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 6, "8 tokens, delimiter changes don't count.");
  is(tokens[0]+'', "a", "first token is correct.");
  is(tokens[1]+'', "b", "third token is correct.");
  is(tokens[2].tag, "_v", "third token is correct tag.");
  is(tokens[2].n, "hmm", "third token is correct name.");
  is(tokens[3]+'', "c", "fifth token is correct.");
  is(tokens[4]+'', "d", "seventh token is correct.");
  is(tokens[5].tag, "_v", "eighth token is correct tag.");
  is(tokens[5].n, "hmm", "eighth token is correct name.");
}

function testSingleCharDelimiter() {
  var text = '({{foo}} {{=[ ]=}}[text])';
  var tokens = Hogan.scan(text);

  var t = Hogan.compile(text);
  s = t.render({foo: "bar", text: 'It worked!'});
  is(s, '(bar It worked!)', "Hogan substitution worked after custom delimiters.");
}

function testSetDelimiterWithWhitespace() {
  var text = "{{= | | =}}|foo|";
  var t = Hogan.compile(text);
  s = t.render({foo: "bar"});
  is(s, 'bar', "custom delimiters with whitespace works.")
}

function testParseBasic() {
  var text = "test";
  var tree = Hogan.parse(Hogan.scan(text));
  is(tree.length, 1, "one parse node");
  is(tree[0]+'', "test", "text is correct");
}

function testParseVariables() {
  var text = "test{{foo}}test!{{bar}}test!!{{baz}}test!!!";
  var tree = Hogan.parse(Hogan.scan(text));
  is(tree.length, 7, "one parse node");
  is(tree[0]+'', "test", "first text is correct");
  is(tree[2]+'', "test!", "second text is correct")
  is(tree[4]+'', "test!!", "third text is correct")
  is(tree[6]+'', "test!!!", "last text is correct")
  is(tree[1].n, "foo", "first var is correct");
  is(tree[3].n, "bar", "second var is correct");
  is(tree[5].n, "baz", "third var is correct");
}

function testParseSection() {
  var text = "a{{#foo}}b{{/foo}}c";
  var tree = Hogan.parse(Hogan.scan(text));
  is(tree.length, 3, "three nodes at base");
  is(tree[0]+'', "a", "correct text in first node");
  is(tree[1].hasOwnProperty('nodes'), true, "second node is a section");
  is(tree[1].tag, '#', "second node is a section");
  is(tree[1].n, "foo", "correct name for section");
  is(tree[1].nodes[0]+'', "b", "correct text in section");
  is(tree[2]+'', "c", "correct text in last node");
}

function testParseIndexes() {
  var text = "abc{{#foo}}asdf{{bar}}asdf{{/foo}}def";
  var tree = Hogan.parse(Hogan.scan(text));
  is(text.substring(tree[1].i, tree[1].end), "asdf{{bar}}asdf", "section text indexes are correct");
}

function testParseNegativeSection() {
  var text = "a{{^foo}}b{{/foo}}c";
  var tree = Hogan.parse(Hogan.scan(text));

  is(tree.length, 3, "three nodes at base");
  is(tree[0]+'', "a", "correct text in first node");
  is(tree[1].hasOwnProperty('nodes'), true, "second node is a section");
  is(tree[1].tag, '^', "second node is a negative section");
  is(tree[1].n, "foo", "correct name for section");
  is(tree[1].nodes[0]+'', "b", "correct text in section");
  is(tree[2]+'', "c", "correct text in last node");
}

function testParseNestedSections() {
  var text = "{{#bar}}{{#foo}}c{{/foo}}{{/bar}}"
  var tree = Hogan.parse(Hogan.scan(text));

  is(tree.length, 1, "one node at base");
  is(tree[0].tag, "#", "open section is first node");
  is(tree[0].n, "bar", "first section name is 'bar'");
  is(tree[0].nodes.length, 1, "first section contains one node.");
  is(tree[0].nodes[0].n, "foo", "correct name for nested section");
  is(tree[0].nodes[0].nodes[0]+'', "c", "correct text in nested section");
}

function testMissingClosingTag() {
  var text = "a{{#foo}}bc";
  var msg = '';
  try {
    var tree = Hogan.parse(Hogan.scan(text));
  } catch (e) {
    msg = e.message;
  }
  is(msg, "missing closing tag: foo", "Error is generated");
}

function testBadNesting() {
  var text = "a{{#foo}}{{#bar}}b{{/foo}}{{/bar}}c";
  var msg = '';
  try {
    var tree = Hogan.parse(Hogan.scan(text));
  } catch (e) {
    msg = e.message;
  }
  is(msg, "Nesting error: bar vs. foo", "Error is generated");
}

function testBasicOutput() {
  var text = "test";
  var t = Hogan.compile(text);
  is(t.render(), text, "template renders one text node");
}

function testBasicOutputAsString() {
  var text = "test";
  var textFunc = Hogan.compile(text, true);
  is(textFunc, "function(context, partials){this.buffer.push('test');};", "template renders correct text function.");
}

function testOneVariable() {
  var text = "test {{foo}} test";
  var t = Hogan.compile(text);
  var s = t.render({foo:'bar'});
  is(s, "test bar test", "basic variable substitution works.");
}

function testOneVariableAsString() {
  var text = "test {{foo}} test";
  var funcText = Hogan.compile(text, true);
  is(funcText, "function(context, partials){this.buffer.push('test ');\nthis.buffer.push(this.find('foo', context));\nthis.buffer.push(' test');};",
     "Function text is correct with variable substitution.");
}

function testRenderWithWhitespace() {
  var text = "{{ string }}";
  var t = Hogan.compile(text);
  is(t.render({string: "---" }), "---", "tags with whitespace render correctly.");
}

function testRenderWithWhitespaceAroundTripleStache() {
  var text = "  {{{string}}}\n";
  var t = Hogan.compile(text);
  is(t.render({string: "---" }), "  ---\n", "triple stache surrounded by whitespace render correctly.");
}

function testRenderWithWhitespaceAroundAmpersand() {
  var text = "  {{& string }}\n";
  var t = Hogan.compile(text);
  is(t.render({string: "---" }), "  ---\n", "ampersand surrounded by whitespace render correctly.");
}

function testMultipleVariables() {
  var text = "test {{foo}} test {{bar}} test {{baz}} test {{foo}} test";
  var t = Hogan.compile(text);
  var s = t.render({foo:'42', bar: '43', baz: '44'});
  is(s, "test 42 test 43 test 44 test 42 test", "all variables render correctly.");
}

function testNumberValues() {
  var text = "integer: {{foo}} float: {{bar}} negative: {{baz}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: 42, bar: 42.42, baz: -42});
  is(s, "integer: 42 float: 42.42 negative: -42", "numbers render correctly");
}

function testObjectRender() {
  var text = "object: {{foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: {}});
  is(s, "object: [object Object]", "objects render default toString.");
}

function testObjectToStringRender() {
  var text = "object: {{foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: {toString: function(){ return "yo!"}}});
  is(s, "object: yo!", "objects render supplied toString.");
}

function testArrayRender() {
  var text = "array: {{foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: ["a","b","c"]});
  is(s, "array: a,b,c", "arrays render default toString.");
}

function testEscaping() {
  var text = "{{foo}}";
  var t = Hogan.compile(text);
  var s = t.render();
  var s = t.render({foo: "< > <div> \' \" &"});
  is(s, "&lt; &gt; &lt;div&gt; &#39; &quot; &amp;", "input correctly escaped.");

  var ec ={ "'": "&#39;", '"': "&quot;", "<": "&lt;", ">": "&gt;", "&": "&amp;"}
  for (var char in ec) {
    var s = t.render({foo: char + " just me"});
    is(s, ec[char] + " just me", "input correctly escaped.");
  }

}

function testMustacheInjection() {
  var text = "{{foo}}";
  var t = Hogan.compile(text);
  s = t.render({foo:"{{{<42}}}"})
  is(s, "{{{&lt;42}}}", "Can't inject mustache");
}

function testTripleStache() {
  var text = "{{{foo}}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: "< > <div> \' \" &"});
  is(s, "< > <div> \' \" &", "input correctly not-escaped.");
}

function testAmpNoEscaping() {
  var text = "{{&foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: "< > <div> \' \" &"});
  is(s, "< > <div> \' \" &", "input correctly not-escaped.");
}

function testPartial() {
  var partialText = "this is text from the partial--the magic number {{foo}} is from a variable";
  var p = Hogan.compile(partialText);

  var text = "This template contains a partial ({{>testPartial}})."
  var t = Hogan.compile(text);

  var s = t.render({foo: 42}, {testPartial: p});
  is(s, "This template contains a partial (this is text from the partial--the magic number 42 is from a variable).", "partials work");
}

function testNestedPartials() {
  var partialText = "this is text from the partial--the magic number {{foo}} is from a variable";
  var p = Hogan.compile(partialText);

  var partialText2 = "This template contains a partial ({{>testPartial}})."
  var p2 = Hogan.compile(partialText2);

  var text = "This template contains a partial that contains a partial [{{>testPartial2}}]."
  var t = Hogan.compile(text);

  var s = t.render({foo: 42}, {testPartial: p, testPartial2: p2});
  is(s, "This template contains a partial that contains a partial [This template contains a partial (this is text from the partial--the magic number 42 is from a variable).].", "nested partials work");
}

function testNegativeSection() {
  var text = "This template {{^foo}}BOO {{/foo}}contains an inverted section."
  var t = Hogan.compile(text);
  var s = t.render();
  is(s, "This template BOO contains an inverted section.", "inverted sections with no context work");

  s = t.render({foo:[]});
  is(s, "This template BOO contains an inverted section.", "inverted sections with empty list context work");

  s = t.render({ foo:false });
  is(s, "This template BOO contains an inverted section.", "inverted sections with false context work");

  s = t.render({foo:''});
  is(s, "This template contains an inverted section.", "inverted sections with empty string context work");

  s = t.render({foo:true});
  is(s, "This template contains an inverted section.", "inverted sections with true context work");

  s = t.render({foo: function() { return false; }});
  is(s, "This template BOO contains an inverted section.", "inverted sections with false returning method in context work");
}

function testSectionElision() {
  var text = "This template {{#foo}}BOO {{/foo}}contains a section."
  var t = Hogan.compile(text);
  var s = t.render();
  is(s, "This template contains a section.", "sections with no context work");

  s = t.render({foo:[]});
  is(s, "This template contains a section.", "sections with empty list context work");

  s = t.render({foo:false});
  is(s, "This template contains a section.", "sections with false context work");
}

function testSectionObjectContext() {
  var text = "This template {{#foo}}{{bar}} {{/foo}}contains a section."
  var t = Hogan.compile(text);
  var s = t.render({foo:{bar:42}});
  is(s, "This template 42 contains a section.", "sections with object context work");
}

function testSectionArrayContext() {
  var text = "This template {{#foo}}{{bar}} {{/foo}}contains a section."
  var t = Hogan.compile(text);
  var s = t.render({foo:[{bar:42}, {bar:43}, {bar:44}]});
  is(s, "This template 42 43 44 contains a section.", "sections with object ctx and array values work");
}

function testFalsyVariableNoRender() {
  var text = "I ({{cannot}}) be seen!";
  var t = Hogan.compile(text);
  var s = t.render();
  is(s, "I () be seen!", "missing value doesn't render.");
}

function testSectionExtensions() {
  var text = "Test {{_//|__foo}}bar{{/foo}}";
  var options = {sectionTags:[{o:'_//|__foo', c:'foo'}]};
  var tree = Hogan.parse(Hogan.scan(text), options);
  is(tree[1].tag, "#", "_//|__foo node transformed to section");
  is(tree[1].n, "_//|__foo", "_//|__foo node transformed to section");

  var t = Hogan.compile(text, options );
  var s = t.render({'_//|__foo':true});
  is(s, "Test bar", "Custom sections work");
}

function testMisnestedSectionExtensions() {
  var text = "Test {{__foo}}bar{{/bar}}";
  var options = {sectionTags:[{o:'__foo', c:'foo'}, {o:'__bar', c:'bar'}]};
  var msg = '';
  try {
    var tree = Hogan.parse(Hogan.scan(text), options);
  } catch (e) {
    msg = e.message;
  }
  is(msg, "Nesting error: __foo vs. bar", "Error is generated");
}

function testNestedSection() {
  var text = "{{#foo}}{{#bar}}{{baz}}{{/bar}}{{/foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: 42, bar: 42, baz:42});
  is(s, "42", "can reach up context stack");
}

function testDottedNames() {
  var text = '"{{person.name}}" == "{{#person}}{{name}}{{/person}}"';
  var t = Hogan.compile(text);
  var s = t.render({person:{name:'Joe'}});
  is(s, '"Joe" == "Joe"', "dotted names work");
}

function testImplicitIterator() {
  var text = '{{#stuff}} {{.}} {{/stuff}}';
  var t = Hogan.compile(text);
  var s = t.render({stuff:[42,43,44]});
  is(s, " 42  43  44 ", "implicit iterators work");
}

function testPartialsAndDelimiters() {
  var text = '{{>include}}*\n{{= | | =}}\n*|>include|';
  var partialText = ' .{{value}}. ';
  var partial = Hogan.compile(partialText);
  var t = Hogan.compile(text);
  var s = t.render({value:"yes"}, {'include':partial});
  is(s, " .yes. *\n* .yes. ", "partials work around delimiters");
}

function testStringPartials() {
  var text = "foo{{>mypartial}}baz";
  var partialText = " bar ";
  var t = Hogan.compile(text);
  var s = t.render({}, {'mypartial': partialText});
  is(s, "foo bar baz", "string partial works.");
}

function testMissingPartials() {
  var text = "foo{{>mypartial}} bar";
  var t = Hogan.compile(text);
  var s = t.render({});
  is(s, "foo bar", "missing partial works.");
}

function testIndentedStandaloneComment() {
  var text = 'Begin.\n {{! Indented Comment Block! }}\nEnd.';
  var t = Hogan.compile(text);
  var s = t.render();
  is(s, 'Begin.\nEnd.', "Standalone comment blocks are removed.");
}

function testNewLineBetweenDelimiterChanges() {
  var data = { section: true, data: 'I got interpolated.' };
  var text = '\n{{#section}}\n {{data}}\n |data|\n{{/section}}x\n\n{{= | | =}}\n|#section|\n {{data}}\n |data|\n|/section|';
  var t = Hogan.compile(text);
  var s = t.render(data);
  is(s, '\n I got interpolated.\n |data|\nx\n\n {{data}}\n I got interpolated.\n', 'render correct')
}

function testMustacheJSApostrophe() {
  var text = '{{apos}}{{control}}';
  var t = Hogan.compile(text);
  var s = t.render({'apos':"'", 'control':"X"});
  is(s, '&#39;X', 'Apostrophe is escaped.');
}

function testMustacheJSArrayOfImplicitPartials() {
  var text = 'Here is some stuff!\n{{#numbers}}\n{{>partial}}\n{{/numbers}}\n';
  var partialText = '{{.}}\n';
  var t = Hogan.compile(text);
  var s = t.render({numbers:[1,2,3,4]}, {partial: partialText});
  is(s, 'Here is some stuff!\n1\n2\n3\n4\n', 'Partials with implicit iterators work.');
}

function testMustacheJSArrayOfPartials() {
  var text = 'Here is some stuff!\n{{#numbers}}\n{{>partial}}\n{{/numbers}}\n';
  var partialText = '{{i}}\n';
  var t = Hogan.compile(text);
  var s = t.render({numbers:[{i:1},{i:2},{i:3},{i:4}]}, {partial: partialText});
  is(s, 'Here is some stuff!\n1\n2\n3\n4\n', 'Partials with arrays work.');
}

function testMustacheJSArrayOfStrings() {
  var text = '{{#strings}}{{.}} {{/strings}}';
  var t = Hogan.compile(text);
  var s = t.render({strings:['foo', 'bar', 'baz']});
  is(s, 'foo bar baz ', 'array of strings works with implicit iterators.');
}

function testMustacheJSUndefinedString() {
  var text = 'foo{{bar}}baz';
  var t = Hogan.compile(text);
  var s = t.render({bar:undefined});
  is(s, 'foobaz', 'undefined value does not render.');
}

function testMustacheJSTripleStacheAltDelimiter() {
  var text = '{{=<% %>=}}<% foo %> {{foo}} <%{bar}%> {{{bar}}}';
  var t = Hogan.compile(text);
  var s = t.render({foo:'yeah', bar:'hmm'});
  is(s, 'yeah {{foo}} hmm {{{bar}}}', 'triple stache inside alternate delimiter works.');
}

/* shootout benchmark tests */

function testShootOutString() {
  var text = "Hello World!";
  var expected = "Hello World!"
  var t = Hogan.compile(text)
  var s = t.render({})
  is(s, expected, "Shootout String compiled correctly");
}

function testShootOutReplace() {
  var text = "Hello {{name}}! You have {{count}} new messages.";
  var expected = "Hello Mick! You have 30 new messages.";
  var t = Hogan.compile(text)
  var s = t.render({ name: "Mick", count: 30 })
  is(s, expected, "Shootout Replace compiled correctly");
}

function testShootOutArray() {
  var text = "{{#names}}{{name}}{{/names}}";
  var expected = "MoeLarryCurlyShemp";
  var t = Hogan.compile(text);
  var s = t.render({ names: [{name: "Moe"}, {name: "Larry"}, {name: "Curly"}, {name: "Shemp"}] })
  is(s, expected, "Shootout Array compiled correctly");
}

function testShootOutObject() {
  var text = "{{#person}}{{name}}{{age}}{{/person}}";
  var expected = "Larry45";
  var t = Hogan.compile(text)
  var s = t.render({ person: { name: "Larry", age: 45 } })
  is(s, expected, "Shootout Object compiled correctly");
}

function testShootOutPartial() {
  var text = "{{#peeps}}{{>replace}}{{/peeps}}";
  var t = Hogan.compile(text);
  var partial = Hogan.compile(" Hello {{name}}! You have {{count}} new messages.");
  var s = t.render({ peeps: [{name: "Moe", count: 15}, {name: "Larry", count: 5}, {name: "Curly", count: 2}] }, { replace: partial });
  var expected = " Hello Moe! You have 15 new messages. Hello Larry! You have 5 new messages. Hello Curly! You have 2 new messages.";
  is(s, expected, "Shootout Partial compiled correctly");
}

function testShootOutRecurse() {
  var text = "{{name}}{{#kids}}{{>recursion}}{{/kids}}";
  var t = Hogan.compile(text);
  var partial = Hogan.compile("{{name}}{{#kids}}{{>recursion}}{{/kids}}");
  var s = t.render({
                name: '1',
                kids: [
                  {
                    name: '1.1',
                    kids: [
                      { name: '1.1.1', kids: [] }
                    ]
                  }
                ]
              }, { recursion: partial });
  var expected = "11.11.1.1";
  is(s, expected, "Shootout Recurse compiled correctly");
}

function testShootOutFilter() {
  var text = "{{#filter}}foo {{bar}}{{/filter}}";
  var t = Hogan.compile(text);
  var s = t.render({
    filter: function() {
      return function(text, render) {
        return render(text).toUpperCase();
      }
    },
    bar: "bar"
  });
  var expected = "FOO BAR"
  is(s, expected, "Shootout Filter compiled correctly");
}

function testShootOutComplex() {
  var text =
    "<h1>{{header}}</h1>" +
    "{{#hasItems}}" +
    "<ul>" +
      "{{#items}}" +
        "{{#current}}" +
          "<li><strong>{{name}}</strong></li>" +
        "{{/current}}" +
        "{{^current}}" +
          "<li><a href=\"{{url}}\">{{name}}</a></li>" +
        "{{/current}}" +
      "{{/items}}" +
    "</ul>" +
    "{{/hasItems}}" +
    "{{^hasItems}}" +
      "<p>The list is empty.</p>" +
    "{{/hasItems}}";

  var expected = "<h1>Colors</h1><ul><li><strong>red</strong></li><li><a href=\"#Green\">green</a></li><li><a href=\"#Blue\">blue</a></li></ul>";
  var t = Hogan.compile(text)
  var s = t.render({
     header: function() {
       return "Colors";
     },
     items: [
       {name: "red", current: true, url: "#Red"},
       {name: "green", current: false, url: "#Green"},
       {name: "blue", current: false, url: "#Blue"}
     ],
     hasItems: function() {
       return this.items.length !== 0;
     },
     empty: function() {
       return this.items.length === 0;
     }
  })

  is(s, expected, "Shootout Complex compiled correctly");
}

function testRenderOutput() {
  if (doc) return
  var fs = require('fs');
  var inPath = 'test/templates';
  var outPath = 'test/html';

  fs.readdirSync(inPath).forEach(function (file) {
    var i = fs.readFileSync([inPath, file].join('/'), 'utf-8');
    var t = Hogan.compile(i);
    var r = t.render({});
    var o = fs.readFileSync([outPath, file].join('/').replace(/mustache$/, 'html')).toString();
    is(r === o, true, file + ' should correctly render html')
  })
}

function testDefaultRenderImpl() {
  var ht = new Hogan.Template();
  is(ht.render() === '', true, 'default renderImpl returns an array.');
}


function appendText(el, text) {
  var textNode = document.createTextNode(text);
  el.appendChild(textNode);
  el.appendChild(document.createElement('br'));
}

if (!this["output"]) {
  var output = function (s) {
    return doc ? appendText(doc.getElementById('console'), s) : console.log(s);
  };
}
var passed = 0;
var failed = 0;

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

function runTests() {
  output("Tests Starting");
  output("--------------");
  testScanTextNoTags();
  testScanOneTag();
  testScanMultipleTags();
  testScanSectionOpen();
  testScanSectionClose();
  testScanSection();
  testScanSectionInContent();
  testScanNegativeSection();
  testScanPartial();
  testScanBackwardPartial();
  testScanAmpersandNoEscapeTag();
  testScanTripleStache();
  testScanSectionWithTripleStacheInside();
  testScanSetDelimiter();
  testScanResetDelimiter();
  testSetDelimiterWithWhitespace();
  testSingleCharDelimiter();
  testParseBasic();
  testParseVariables();
  testParseSection();
  testParseIndexes();
  testParseNegativeSection();
  testParseNestedSections();
  testMissingClosingTag();
  testBadNesting();
  testBasicOutput();
 //testBasicOutputAsString();
  testOneVariable();
 //testOneVariableAsString();
  testMultipleVariables();
  testNumberValues();
  testObjectRender();
  testObjectToStringRender();
  testArrayRender();
  testEscaping();
  testMustacheInjection();
  testTripleStache();
  testAmpNoEscaping();
  testPartial();
  testNestedPartials();
  testNegativeSection();
  testSectionElision();
  testSectionObjectContext();
  testSectionArrayContext();
  testRenderWithWhitespace();
  testRenderWithWhitespaceAroundTripleStache();
  testRenderWithWhitespaceAroundAmpersand();
  testFalsyVariableNoRender();
  testRenderOutput();
  testDefaultRenderImpl();
  testSectionExtensions();
  testMisnestedSectionExtensions();
  testNestedSection();
  testShootOutString();
  testShootOutReplace();
  testShootOutArray();
  testShootOutObject();
  testShootOutPartial();
  testShootOutRecurse();
  testShootOutFilter();
  testShootOutComplex();
  testDottedNames();
  testImplicitIterator();
  testPartialsAndDelimiters();
  testStringPartials();
  testMissingPartials();
  testIndentedStandaloneComment();
  testNewLineBetweenDelimiterChanges();
  testMustacheJSApostrophe();
  testMustacheJSArrayOfImplicitPartials();
  testMustacheJSArrayOfPartials();
  testMustacheJSArrayOfStrings();
  testMustacheJSUndefinedString();
  testMustacheJSTripleStacheAltDelimiter();
  complete();
}

if (doc) {
  window.onload = runTests;
} else {
  runTests();
}