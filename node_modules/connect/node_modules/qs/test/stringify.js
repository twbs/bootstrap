
/**
 * Module dependencies.
 */

var qs = require('../')
  , should = require('should')
  , str_identities = {
    'basics': [
      { str: 'foo=bar', obj: {'foo' : 'bar'}},
      { str: 'foo=%22bar%22', obj: {'foo' : '\"bar\"'}},
      { str: 'foo=', obj: {'foo': ''}},
      { str: 'foo=1&bar=2', obj: {'foo' : '1', 'bar' : '2'}},
      { str: 'my%20weird%20field=q1!2%22\'w%245%267%2Fz8)%3F', obj: {'my weird field': "q1!2\"'w$5&7/z8)?"}},
      { str: 'foo%3Dbaz=bar', obj: {'foo=baz': 'bar'}},
      { str: 'foo=bar&bar=baz', obj: {foo: 'bar', bar: 'baz'}}
    ],
    'escaping': [
      { str: 'foo=foo%20bar', obj: {foo: 'foo bar'}},
      { str: 'cht=p3&chd=t%3A60%2C40&chs=250x100&chl=Hello%7CWorld', obj: {
          cht: 'p3'
        , chd: 't:60,40'
        , chs: '250x100'
        , chl: 'Hello|World'
      }}
    ],
    'nested': [
      { str: 'foo[]=bar&foo[]=quux', obj: {'foo' : ['bar', 'quux']}},
      { str: 'foo[]=bar', obj: {foo: ['bar']}},
      { str: 'foo[]=1&foo[]=2', obj: {'foo' : ['1', '2']}},
      { str: 'foo=bar&baz[]=1&baz[]=2&baz[]=3', obj: {'foo' : 'bar', 'baz' : ['1', '2', '3']}},
      { str: 'foo[]=bar&baz[]=1&baz[]=2&baz[]=3', obj: {'foo' : ['bar'], 'baz' : ['1', '2', '3']}},
      { str: 'x[y][z]=1', obj: {'x' : {'y' : {'z' : '1'}}}},
      { str: 'x[y][z][]=1', obj: {'x' : {'y' : {'z' : ['1']}}}},
      { str: 'x[y][z]=2', obj: {'x' : {'y' : {'z' : '2'}}}},
      { str: 'x[y][z][]=1&x[y][z][]=2', obj: {'x' : {'y' : {'z' : ['1', '2']}}}},
      { str: 'x[y][][z]=1', obj: {'x' : {'y' : [{'z' : '1'}]}}},
      { str: 'x[y][][z][]=1', obj: {'x' : {'y' : [{'z' : ['1']}]}}},
      { str: 'x[y][][z]=1&x[y][][w]=2', obj: {'x' : {'y' : [{'z' : '1', 'w' : '2'}]}}},
      { str: 'x[y][][v][w]=1', obj: {'x' : {'y' : [{'v' : {'w' : '1'}}]}}},
      { str: 'x[y][][z]=1&x[y][][v][w]=2', obj: {'x' : {'y' : [{'z' : '1', 'v' : {'w' : '2'}}]}}},
      { str: 'x[y][][z]=1&x[y][][z]=2', obj: {'x' : {'y' : [{'z' : '1'}, {'z' : '2'}]}}},
      { str: 'x[y][][z]=1&x[y][][w]=a&x[y][][z]=2&x[y][][w]=3', obj: {'x' : {'y' : [{'z' : '1', 'w' : 'a'}, {'z' : '2', 'w' : '3'}]}}},
      { str: 'user[name][first]=tj&user[name][last]=holowaychuk', obj: { user: { name: { first: 'tj', last: 'holowaychuk' }}}}
    ],
    'errors': [
      { obj: 'foo=bar',     message: 'stringify expects an object' },
      { obj: ['foo', 'bar'], message: 'stringify expects an object' }
    ],
    'numbers': [
      { str: 'limit[]=1&limit[]=2&limit[]=3', obj: { limit: [1, 2, '3'] }},
      { str: 'limit=1', obj: { limit: 1 }}
    ]
  };
  

// Assert error
function err(fn, msg){
  var err;
  try {
    fn();
  } catch (e) {
    should.equal(e.message, msg);
    return;
  }
  throw new Error('no exception thrown, expected "' + msg + '"');
}

function test(type) {
  var str, obj;
  for (var i = 0; i < str_identities[type].length; i++) {
    str = str_identities[type][i].str;
    obj = str_identities[type][i].obj;
    qs.stringify(obj).should.eql(str);
  }
}

module.exports = {
  'test basics': function() {
    test('basics');
  },

  'test escaping': function() {
    test('escaping');
  },

  'test nested': function() {
    test('nested');
  },
  
  'test numbers': function(){
    test('numbers');
  },

  'test errors': function() {
    var obj, message;
    for (var i = 0; i < str_identities['errors'].length; i++) {
      message = str_identities['errors'][i].message;
      obj = str_identities['errors'][i].obj;
      err(function(){ qs.stringify(obj) }, message);
    }
  }
};