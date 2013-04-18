
var debug = {
  foo: require('../')('test:foo'),
  bar: require('../')('test:bar'),
  baz: require('../')('test:baz')
};

debug.foo('foo')
debug.bar('bar')
debug.baz('baz')