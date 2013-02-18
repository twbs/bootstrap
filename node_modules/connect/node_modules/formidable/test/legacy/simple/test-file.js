var common = require('../common');
var WriteStreamStub = GENTLY.stub('fs', 'WriteStream');

var File = require(common.lib + '/file'),
    EventEmitter = require('events').EventEmitter,
    file,
    gently;

function test(test) {
  gently = new Gently();
  file = new File();
  test();
  gently.verify(test.name);
}

test(function constructor() {
  assert.ok(file instanceof EventEmitter);
  assert.strictEqual(file.size, 0);
  assert.strictEqual(file.path, null);
  assert.strictEqual(file.name, null);
  assert.strictEqual(file.type, null);
  assert.strictEqual(file.lastModifiedDate, null);

  assert.strictEqual(file._writeStream, null);

  (function testSetProperties() {
    var file2 = new File({foo: 'bar'});
    assert.equal(file2.foo, 'bar');
  })();
});

test(function open() {
  var WRITE_STREAM;
  file.path = '/foo';

  gently.expect(WriteStreamStub, 'new', function (path) {
    WRITE_STREAM = this;
    assert.strictEqual(path, file.path);
  });

  file.open();
  assert.strictEqual(file._writeStream, WRITE_STREAM);
});

test(function write() {
  var BUFFER = {length: 10},
      CB_STUB,
      CB = function() {
        CB_STUB.apply(this, arguments);
      };

  file._writeStream = {};

  gently.expect(file._writeStream, 'write', function (buffer, cb) {
    assert.strictEqual(buffer, BUFFER);

    gently.expect(file, 'emit', function (event, bytesWritten) {
      assert.ok(file.lastModifiedDate instanceof Date);
      assert.equal(event, 'progress');
      assert.equal(bytesWritten, file.size);
    });

    CB_STUB = gently.expect(function writeCb() {
      assert.equal(file.size, 10);
    });

    cb();

    gently.expect(file, 'emit', function (event, bytesWritten) {
      assert.equal(event, 'progress');
      assert.equal(bytesWritten, file.size);
    });

    CB_STUB = gently.expect(function writeCb() {
      assert.equal(file.size, 20);
    });

    cb();
  });

  file.write(BUFFER, CB);
});

test(function end() {
  var CB_STUB,
      CB = function() {
        CB_STUB.apply(this, arguments);
      };

  file._writeStream = {};

  gently.expect(file._writeStream, 'end', function (cb) {
    gently.expect(file, 'emit', function (event) {
      assert.equal(event, 'end');
    });

    CB_STUB = gently.expect(function endCb() {
    });

    cb();
  });

  file.end(CB);
});
