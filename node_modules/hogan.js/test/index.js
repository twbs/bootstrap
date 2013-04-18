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

var is = strictEqual;

test("Scan Text No Tags", function() {
  var text = "<h2>hi</h2>";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0]+'', text, "text is equal to first token");
});

test("Scan One Tag", function() {
  var text = "{{hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
});

test("Scan Multiple Tags", function() {
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
});

test("Scan Section Open", function() {
  var text = "{{#hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "#", "First token is a section.");
});

test("Scan Section Close", function() {
  var text = "{{/hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "/", "First token is a section.");
});

test("Scan Section", function() {
  var text = "{{#hmm}}{{/hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 2, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "#", "First token is a section.");
  is(tokens[1].n, "hmm", "Second token content is variable name.");
  is(tokens[1].tag, "/", "Second token is a section.");
});

test("Scan Section In Content", function() {
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
});

test("Scan Negative Section", function() {
  var text = "{{^hmm}}{{/hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 2, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "^", "First token is a negative section.");
  is(tokens[1].n, "hmm", "First token content is variable name.");
  is(tokens[1].tag, "/", "Second token is a section.");
});

test("Scan Partial", function() {
  var text = "{{>hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, ">", "First token is a partial.");
});

test("Scan Backward Partial", function() {
  var text = "{{<hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "<", "First token is a backward partial.");
});

test("Scan Ampersand No Escape Tag", function() {
  var text = "{{&hmm}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "&", "First token is an ampersand no-escape.");
});

test("Scan Triple Stache", function() {
  var text = "{{{hmm}}}";
  var tokens = Hogan.scan(text);
  is(tokens.length, 1, "One token");
  is(tokens[0].n, "hmm", "First token content is variable name.");
  is(tokens[0].tag, "{", "First token is a triple-stache.");
});

test("Scan Section With Triple Stache Inside", function() {
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
});

test("Scan Set Delimiter", function() {
  var text = "a{{=<% %>=}}b";
  var tokens = Hogan.scan(text);
  is(tokens.length, 2, "change delimiter doesn't appear as token.");
  is(tokens[0]+'', "a", "text before change delimiter is processed.");
  is(tokens[1]+'', "b", "text after change delimiter is processed.");
});

test("Scan Reset Delimiter", function() {
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
});

test("Single Char Delimiter", function() {
  var text = '({{foo}} {{=[ ]=}}[text])';
  var tokens = Hogan.scan(text);

  var t = Hogan.compile(text);
  s = t.render({foo: "bar", text: 'It worked!'});
  is(s, '(bar It worked!)', "Hogan substitution worked after custom delimiters.");
});

test("Set Delimiter With Whitespace", function() {
  var text = "{{= | | =}}|foo|";
  var t = Hogan.compile(text);
  s = t.render({foo: "bar"});
  is(s, 'bar', "custom delimiters with whitespace works.")
});

test("Parse Basic", function() {
  var text = "test";
  var tree = Hogan.parse(Hogan.scan(text));
  is(tree.length, 1, "one parse node");
  is(tree[0]+'', "test", "text is correct");
});

test("Parse Variables", function() {
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
});

test("Parse Section", function() {
  var text = "a{{#foo}}b{{/foo}}c";
  var tree = Hogan.parse(Hogan.scan(text));
  is(tree.length, 3, "three nodes at base");
  is(tree[0]+'', "a", "correct text in first node");
  is(tree[1].hasOwnProperty('nodes'), true, "second node is a section");
  is(tree[1].tag, '#', "second node is a section");
  is(tree[1].n, "foo", "correct name for section");
  is(tree[1].nodes[0]+'', "b", "correct text in section");
  is(tree[2]+'', "c", "correct text in last node");
});

test("Parse Indexes", function() {
  var text = "abc{{#foo}}asdf{{bar}}asdf{{/foo}}def";
  var tree = Hogan.parse(Hogan.scan(text));
  is(text.substring(tree[1].i, tree[1].end), "asdf{{bar}}asdf", "section text indexes are correct");
});

test("Parse Negative Section", function() {
  var text = "a{{^foo}}b{{/foo}}c";
  var tree = Hogan.parse(Hogan.scan(text));

  is(tree.length, 3, "three nodes at base");
  is(tree[0]+'', "a", "correct text in first node");
  is(tree[1].hasOwnProperty('nodes'), true, "second node is a section");
  is(tree[1].tag, '^', "second node is a negative section");
  is(tree[1].n, "foo", "correct name for section");
  is(tree[1].nodes[0]+'', "b", "correct text in section");
  is(tree[2]+'', "c", "correct text in last node");
});

test("Parse Nested Sections", function() {
  var text = "{{#bar}}{{#foo}}c{{/foo}}{{/bar}}"
  var tree = Hogan.parse(Hogan.scan(text));

  is(tree.length, 1, "one node at base");
  is(tree[0].tag, "#", "open section is first node");
  is(tree[0].n, "bar", "first section name is 'bar'");
  is(tree[0].nodes.length, 1, "first section contains one node.");
  is(tree[0].nodes[0].n, "foo", "correct name for nested section");
  is(tree[0].nodes[0].nodes[0]+'', "c", "correct text in nested section");
});

test("Missing Closing Tag", function() {
  var text = "a{{#foo}}bc";
  raises(function() {
    var tree = Hogan.parse(Hogan.scan(text));
  }, "missing closing tag: foo", "Error is generated");
});

test("Bad Nesting", function() {
  var text = "a{{#foo}}{{#bar}}b{{/foo}}{{/bar}}c";
  raises(function() {
    var tree = Hogan.parse(Hogan.scan(text));
  }, "Nesting error: bar vs. foo", "Error is generated");
});

test("Basic Output", function() {
  var text = "test";
  var t = Hogan.compile(text);
  is(t.render(), text, "template renders one text node");
});

test("Basic Output As String", function() {
  return;
  var text = "test";
  var textFunc = Hogan.compile(text, true);
  is(textFunc, "function(context, partials){this.buffer.push('test');};", "template renders correct text function.");
});

test("One Variable", function() {
  var text = "test {{foo}} test";
  var t = Hogan.compile(text);
  var s = t.render({foo:'bar'});
  is(s, "test bar test", "basic variable substitution works.");
});

test("One Variable As String", function() {
  return;
  var text = "test {{foo}} test";
  var funcText = Hogan.compile(text, true);
  is(funcText, "function(context, partials){this.buffer.push('test ');\nthis.buffer.push(this.find('foo', context));\nthis.buffer.push(' test');};",
     "Function text is correct with variable substitution.");
});

test("Render With Whitespace", function() {
  var text = "{{ string }}";
  var t = Hogan.compile(text);
  is(t.render({string: "---" }), "---", "tags with whitespace render correctly.");
});

test("Render With Whitespace Around Triple Stache", function() {
  var text = "  {{{string}}}\n";
  var t = Hogan.compile(text);
  is(t.render({string: "---" }), "  ---\n", "triple stache surrounded by whitespace render correctly.");
});

test("Render With Whitespace Around Ampersand", function() {
  var text = "  {{& string }}\n";
  var t = Hogan.compile(text);
  is(t.render({string: "---" }), "  ---\n", "ampersand surrounded by whitespace render correctly.");
});

test("Multiple Variables", function() {
  var text = "test {{foo}} test {{bar}} test {{baz}} test {{foo}} test";
  var t = Hogan.compile(text);
  var s = t.render({foo:'42', bar: '43', baz: '44'});
  is(s, "test 42 test 43 test 44 test 42 test", "all variables render correctly.");
});

test("Number Values", function() {
  var text = "integer: {{foo}} float: {{bar}} negative: {{baz}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: 42, bar: 42.42, baz: -42});
  is(s, "integer: 42 float: 42.42 negative: -42", "numbers render correctly");
});

test("Object Render", function() {
  var text = "object: {{foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: {}});
  is(s, "object: [object Object]", "objects render default toString.");
});

test("Object To String Render", function() {
  var text = "object: {{foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: {toString: function(){ return "yo!"}}});
  is(s, "object: yo!", "objects render supplied toString.");
});

test("Array Render", function() {
  var text = "array: {{foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: ["a","b","c"]});
  is(s, "array: a,b,c", "arrays render default toString.");
});

test("Escaping", function() {
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
});

test("Mustache Injection", function() {
  var text = "{{foo}}";
  var t = Hogan.compile(text);
  s = t.render({foo:"{{{<42}}}"})
  is(s, "{{{&lt;42}}}", "Can't inject mustache");
});

test("Triple Stache", function() {
  var text = "{{{foo}}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: "< > <div> \' \" &"});
  is(s, "< > <div> \' \" &", "input correctly not-escaped.");
});

test("Amp No Escaping", function() {
  var text = "{{&foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: "< > <div> \' \" &"});
  is(s, "< > <div> \' \" &", "input correctly not-escaped.");
});

test("Partial", function() {
  var partialText = "this is text from the partial--the magic number {{foo}} is from a variable";
  var p = Hogan.compile(partialText);

  var text = "This template contains a partial ({{>testPartial}})."
  var t = Hogan.compile(text);

  var s = t.render({foo: 42}, {testPartial: p});
  is(s, "This template contains a partial (this is text from the partial--the magic number 42 is from a variable).", "partials work");
});

test("Nested Partials", function() {
  var partialText = "this is text from the partial--the magic number {{foo}} is from a variable";
  var p = Hogan.compile(partialText);

  var partialText2 = "This template contains a partial ({{>testPartial}})."
  var p2 = Hogan.compile(partialText2);

  var text = "This template contains a partial that contains a partial [{{>testPartial2}}]."
  var t = Hogan.compile(text);

  var s = t.render({foo: 42}, {testPartial: p, testPartial2: p2});
  is(s, "This template contains a partial that contains a partial [This template contains a partial (this is text from the partial--the magic number 42 is from a variable).].", "nested partials work");
});

test("Negative Section", function() {
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
});

test("Section Elision", function() {
  var text = "This template {{#foo}}BOO {{/foo}}contains a section."
  var t = Hogan.compile(text);
  var s = t.render();
  is(s, "This template contains a section.", "sections with no context work");

  s = t.render({foo:[]});
  is(s, "This template contains a section.", "sections with empty list context work");

  s = t.render({foo:false});
  is(s, "This template contains a section.", "sections with false context work");
});

test("Section Object Context", function() {
  var text = "This template {{#foo}}{{bar}} {{/foo}}contains a section."
  var t = Hogan.compile(text);
  var s = t.render({foo:{bar:42}});
  is(s, "This template 42 contains a section.", "sections with object context work");
});

test("Section Array Context", function() {
  var text = "This template {{#foo}}{{bar}} {{/foo}}contains a section."
  var t = Hogan.compile(text);
  var s = t.render({foo:[{bar:42}, {bar:43}, {bar:44}]});
  is(s, "This template 42 43 44 contains a section.", "sections with object ctx and array values work");
});

test("Falsy Variable No Render", function() {
  var text = "I ({{cannot}}) be seen!";
  var t = Hogan.compile(text);
  var s = t.render();
  is(s, "I () be seen!", "missing value doesn't render.");
});

test("Undefined Return Value From Lambda", function() {
  var text = "abc{{foo}}def";
  var t = Hogan.compile(text);
  var context = {
    foo: function(s) {
      return undefined;
    }
  }
  var s = t.render(context);
  is(s, "abcdef", "deal with undefined return values from lambdas.")
});

test("Section Extensions", function() {
  var text = "Test {{_//|__foo}}bar{{/foo}}";
  var options = {sectionTags:[{o:'_//|__foo', c:'foo'}]};
  var tree = Hogan.parse(Hogan.scan(text), text, options);
  is(tree[1].tag, "#", "_//|__foo node transformed to section");
  is(tree[1].n, "_//|__foo", "_//|__foo node transformed to section");

  var t = Hogan.compile(text, options );
  var s = t.render({'_//|__foo':true});
  is(s, "Test bar", "Custom sections work");
});

test("Misnested Section Extensions", function() {
  var text = "Test {{__foo}}bar{{/bar}}";
  var options = {sectionTags:[{o:'__foo', c:'foo'}, {o:'__bar', c:'bar'}]};
  raises(function() {
    var tree = Hogan.parse(Hogan.scan(text), text, options);
  }, "Nesting error: __foo vs. bar", "Error is generated");
});

test("Section Extensions In Higher Order Sections", function() {
  var text = "Test{{_foo}}bar{{/foo}}";
  var options = {sectionTags:[{o:'_foo', c:'foo'}, {o:'_baz', c:'baz'}]};
  var t = Hogan.compile(text, options);
  var context = {
    "_foo": function (s) {
      return "{{_baz}}" + s + "{{/baz}}";
    }
  }
  var s = t.render(context);
  is(s, "Test", "unprocessed test");
});

test("Section Extensions In Lambda Replace Variable", function() {
  var text = "Test{{foo}}";
  var options = {sectionTags:[{o:'_baz', c:'baz'}]};
  var t = Hogan.compile(text, options);
  var context = {
    "foo": function () {
      return function() { "{{_baz}}" + s + "{{/baz}}"; };
    }
  }
  var s = t.render(context);
  is(s, "Test", "unprocessed test");
});

test("Mustache not reprocessed for method calls in interpolations", function() {
  var text = "text with {{foo}} inside";
  var t = Hogan.compile(text);
  var context = {
    foo: function() {
      return "no processing of {{tags}}";
    }
  }
  var s = t.render(context);
  is(s, "text with no processing of {{tags}} inside", "method calls should not be processed as mustache.");

  var text = "text with {{{foo}}} inside";
  var t = Hogan.compile(text);
  var s = t.render(context);
  is(s, "text with no processing of {{tags}} inside", "method calls should not be processed as mustache in triple staches.");
});

test("Mustache is reprocessed for lambdas in interpolations", function() {
  var text = "text with {{foo}} inside";
  var t = Hogan.compile(text);
  var context = {
    bar: "42",
    foo: function() {
      return function() {
        return "processing of {{bar}}";
      };
    }
  };
  var s = t.render(context);
  is(s, "text with processing of 42 inside", "the return value of lambdas should be processed mustache.");
});

test("Nested Section", function() {
  var text = "{{#foo}}{{#bar}}{{baz}}{{/bar}}{{/foo}}";
  var t = Hogan.compile(text);
  var s = t.render({foo: 42, bar: 42, baz:42});
  is(s, "42", "can reach up context stack");
});

test("Dotted Names", function() {
  var text = '"{{person.name}}" == "{{#person}}{{name}}{{/person}}"';
  var t = Hogan.compile(text);
  var s = t.render({person:{name:'Joe'}});
  is(s, '"Joe" == "Joe"', "dotted names work");
});

test("Implicit Iterator", function() {
  var text = '{{#stuff}} {{.}} {{/stuff}}';
  var t = Hogan.compile(text);
  var s = t.render({stuff:[42,43,44]});
  is(s, " 42  43  44 ", "implicit iterators work");
});

test("Partials And Delimiters", function() {
  var text = '{{>include}}*\n{{= | | =}}\n*|>include|';
  var partialText = ' .{{value}}. ';
  var partial = Hogan.compile(partialText);
  var t = Hogan.compile(text);
  var s = t.render({value:"yes"}, {'include':partial});
  is(s, " .yes. *\n* .yes. ", "partials work around delimiters");
});

test("String Partials", function() {
  var text = "foo{{>mypartial}}baz";
  var partialText = " bar ";
  var t = Hogan.compile(text);
  var s = t.render({}, {'mypartial': partialText});
  is(s, "foo bar baz", "string partial works.");
});

test("Missing Partials", function() {
  var text = "foo{{>mypartial}} bar";
  var t = Hogan.compile(text);
  var s = t.render({});
  is(s, "foo bar", "missing partial works.");
});

test("Indented Standalone Comment", function() {
  var text = 'Begin.\n {{! Indented Comment Block! }}\nEnd.';
  var t = Hogan.compile(text);
  var s = t.render();
  is(s, 'Begin.\nEnd.', "Standalone comment blocks are removed.");
});

test("New Line Between Delimiter Changes", function() {
  var data = { section: true, data: 'I got interpolated.' };
  var text = '\n{{#section}}\n {{data}}\n |data|\n{{/section}}x\n\n{{= | | =}}\n|#section|\n {{data}}\n |data|\n|/section|';
  var t = Hogan.compile(text);
  var s = t.render(data);
  is(s, '\n I got interpolated.\n |data|\nx\n\n {{data}}\n I got interpolated.\n', 'render correct')
});

test("Mustache JS Apostrophe", function() {
  var text = '{{apos}}{{control}}';
  var t = Hogan.compile(text);
  var s = t.render({'apos':"'", 'control':"X"});
  is(s, '&#39;X', 'Apostrophe is escaped.');
});

test("Mustache JS Array Of Implicit Partials", function() {
  var text = 'Here is some stuff!\n{{#numbers}}\n{{>partial}}\n{{/numbers}}\n';
  var partialText = '{{.}}\n';
  var t = Hogan.compile(text);
  var s = t.render({numbers:[1,2,3,4]}, {partial: partialText});
  is(s, 'Here is some stuff!\n1\n2\n3\n4\n', 'Partials with implicit iterators work.');
});

test("Mustache JS Array Of Partials", function() {
  var text = 'Here is some stuff!\n{{#numbers}}\n{{>partial}}\n{{/numbers}}\n';
  var partialText = '{{i}}\n';
  var t = Hogan.compile(text);
  var s = t.render({numbers:[{i:1},{i:2},{i:3},{i:4}]}, {partial: partialText});
  is(s, 'Here is some stuff!\n1\n2\n3\n4\n', 'Partials with arrays work.');
});

test("Mustache JS Array Of Strings", function() {
  var text = '{{#strings}}{{.}} {{/strings}}';
  var t = Hogan.compile(text);
  var s = t.render({strings:['foo', 'bar', 'baz']});
  is(s, 'foo bar baz ', 'array of strings works with implicit iterators.');
});

test("Mustache JS Undefined String", function() {
  var text = 'foo{{bar}}baz';
  var t = Hogan.compile(text);
  var s = t.render({bar:undefined});
  is(s, 'foobaz', 'undefined value does not render.');
});

test("Mustache JS Undefined Triple Stache", function() {
  var text = 'foo{{{bar}}}baz';
  var t = Hogan.compile(text);
  var s = t.render({bar:undefined});
  is(s, 'foobaz', 'undefined value does not render in triple stache.');
});

test("Mustache JS Null String", function() {
  var text = 'foo{{bar}}baz';
  var t = Hogan.compile(text);
  var s = t.render({bar:null});
  is(s, 'foobaz', 'undefined value does not render.');
});

test("Mustache JS Null Triple Stache", function() {
  var text = 'foo{{{bar}}}baz';
  var t = Hogan.compile(text);
  var s = t.render({bar:null});
  is(s, 'foobaz', 'undefined value does not render in triple stache.');
});

test("Mustache JS Triple Stache Alt Delimiter", function() {
  var text = '{{=<% %>=}}<% foo %> {{foo}} <%{bar}%> {{{bar}}}';
  var t = Hogan.compile(text);
  var s = t.render({foo:'yeah', bar:'hmm'});
  is(s, 'yeah {{foo}} hmm {{{bar}}}', 'triple stache inside alternate delimiter works.');
});

/* Safety tests */

test("Updates object state", function() {
  var text = '{{foo}} {{bar}} {{foo}}';
  var t = Hogan.compile(text);
  var s = t.render({foo: 1, bar: function() { this.foo++; return 42; } });
  is(s, '1 42 2');
});

/* shootout benchmark tests */

test("Shoot Out String", function() {
  var text = "Hello World!";
  var expected = "Hello World!"
  var t = Hogan.compile(text)
  var s = t.render({})
  is(s, expected, "Shootout String compiled correctly");
});

test("Shoot Out Replace", function() {
  var text = "Hello {{name}}! You have {{count}} new messages.";
  var expected = "Hello Mick! You have 30 new messages.";
  var t = Hogan.compile(text)
  var s = t.render({ name: "Mick", count: 30 })
  is(s, expected, "Shootout Replace compiled correctly");
});

test("Shoot Out Array", function() {
  var text = "{{#names}}{{name}}{{/names}}";
  var expected = "MoeLarryCurlyShemp";
  var t = Hogan.compile(text);
  var s = t.render({ names: [{name: "Moe"}, {name: "Larry"}, {name: "Curly"}, {name: "Shemp"}] })
  is(s, expected, "Shootout Array compiled correctly");
});

test("Shoot Out Object", function() {
  var text = "{{#person}}{{name}}{{age}}{{/person}}";
  var expected = "Larry45";
  var t = Hogan.compile(text)
  var s = t.render({ person: { name: "Larry", age: 45 } })
  is(s, expected, "Shootout Object compiled correctly");
});

test("Shoot Out Partial", function() {
  var text = "{{#peeps}}{{>replace}}{{/peeps}}";
  var t = Hogan.compile(text);
  var partial = Hogan.compile(" Hello {{name}}! You have {{count}} new messages.");
  var s = t.render({ peeps: [{name: "Moe", count: 15}, {name: "Larry", count: 5}, {name: "Curly", count: 2}] }, { replace: partial });
  var expected = " Hello Moe! You have 15 new messages. Hello Larry! You have 5 new messages. Hello Curly! You have 2 new messages.";
  is(s, expected, "Shootout Partial compiled correctly");
});

test("Shoot Out Recurse", function() {
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
});

test("Shoot Out Filter", function() {
  var text = "{{#filter}}foo {{bar}}{{/filter}}";
  var t = Hogan.compile(text);
  var s = t.render({
    filter: function() {
      return function(text) {
        return text.toUpperCase() + "{{bar}}";
      }
    },
    bar: "bar"
  });
  var expected = "FOO bar"
  is(s, expected, "Shootout Filter compiled correctly");
});

test("Shoot Out Complex", function() {
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
});

$.each(['list'], function(i, name) {
  return;
  asyncTest("Render Output: " + name, function() {
    $.when(
      $.get('./templates/' + name + '.mustache'),
      $.get('./html/' + name + '.html')
    ).done(function(tmpl, html) {
      var r = Hogan.compile(tmpl[0]).render({});
      is(r, html[0], name + ': should correctly render html');
    })
    .fail(function() { ok(false, 'file missing'); })
    .always(function() { start(); });
  });
});

test("Default Render Impl", function() {
  var ht = new Hogan.Template();
  is(ht.render() === '', true, 'default renderImpl returns an array.');
});
