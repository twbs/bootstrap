var common = require('../common');
var CHUNK_LENGTH = 10,
    multipartParser = require(common.lib + '/multipart_parser'),
    MultipartParser = multipartParser.MultipartParser,
    parser = new MultipartParser(),
    fixtures = require(TEST_FIXTURES + '/multipart'),
    Buffer = require('buffer').Buffer;

Object.keys(fixtures).forEach(function(name) {
  var fixture = fixtures[name],
      buffer = new Buffer(Buffer.byteLength(fixture.raw, 'binary')),
      offset = 0,
      chunk,
      nparsed,

      parts = [],
      part = null,
      headerField,
      headerValue,
      endCalled = '';

  parser.initWithBoundary(fixture.boundary);
  parser.onPartBegin = function() {
    part = {headers: {}, data: ''};
    parts.push(part);
    headerField = '';
    headerValue = '';
  };

  parser.onHeaderField = function(b, start, end) {
    headerField += b.toString('ascii', start, end);
  };

  parser.onHeaderValue = function(b, start, end) {
    headerValue += b.toString('ascii', start, end);
  }

  parser.onHeaderEnd = function() {
    part.headers[headerField] = headerValue;
    headerField = '';
    headerValue = '';
  };

  parser.onPartData = function(b, start, end) {
    var str = b.toString('ascii', start, end);
    part.data += b.slice(start, end);
  }

  parser.onEnd = function() {
    endCalled = true;
  }

  buffer.write(fixture.raw, 'binary', 0);

  while (offset < buffer.length) {
    if (offset + CHUNK_LENGTH < buffer.length) {
      chunk = buffer.slice(offset, offset+CHUNK_LENGTH);
    } else {
      chunk = buffer.slice(offset, buffer.length);
    }
    offset = offset + CHUNK_LENGTH;

    nparsed = parser.write(chunk);
    if (nparsed != chunk.length) {
      if (fixture.expectError) {
        return;
      }
      puts('-- ERROR --');
      p(chunk.toString('ascii'));
      throw new Error(chunk.length+' bytes written, but only '+nparsed+' bytes parsed!');
    }
  }

  if (fixture.expectError) {
    throw new Error('expected parse error did not happen');
  }

  assert.ok(endCalled);
  assert.deepEqual(parts, fixture.parts);
});
