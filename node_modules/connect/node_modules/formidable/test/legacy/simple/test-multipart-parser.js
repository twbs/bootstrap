var common = require('../common');
var multipartParser = require(common.lib + '/multipart_parser'),
    MultipartParser = multipartParser.MultipartParser,
    events = require('events'),
    Buffer = require('buffer').Buffer,
    parser;

function test(test) {
  parser = new MultipartParser();
  test();
}

test(function constructor() {
  assert.equal(parser.boundary, null);
  assert.equal(parser.state, 0);
  assert.equal(parser.flags, 0);
  assert.equal(parser.boundaryChars, null);
  assert.equal(parser.index, null);
  assert.equal(parser.lookbehind, null);
  assert.equal(parser.constructor.name, 'MultipartParser');
});

test(function initWithBoundary() {
  var boundary = 'abc';
  parser.initWithBoundary(boundary);
  assert.deepEqual(Array.prototype.slice.call(parser.boundary), [13, 10, 45, 45, 97, 98, 99]);
  assert.equal(parser.state, multipartParser.START);

  assert.deepEqual(parser.boundaryChars, {10: true, 13: true, 45: true, 97: true, 98: true, 99: true});
});

test(function parserError() {
  var boundary = 'abc',
      buffer = new Buffer(5);

  parser.initWithBoundary(boundary);
  buffer.write('--ad', 'ascii', 0);
  assert.equal(parser.write(buffer), 3);
});

test(function end() {
  (function testError() {
    assert.equal(parser.end().message, 'MultipartParser.end(): stream ended unexpectedly: ' + parser.explain());
  })();

  (function testRegular() {
    parser.state = multipartParser.END;
    assert.strictEqual(parser.end(), undefined);
  })();
});
