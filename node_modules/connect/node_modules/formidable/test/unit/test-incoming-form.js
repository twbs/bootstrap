var common       = require('../common');
var test         = require('utest');
var assert       = common.assert;
var IncomingForm = common.require('incoming_form').IncomingForm;
var path         = require('path');

var from;
test('IncomingForm', {
  before: function() {
    form = new IncomingForm();
  },

  '#_fileName with regular characters': function() {
    var filename = 'foo.txt';
    assert.equal(form._fileName(makeHeader(filename)), 'foo.txt');
  },

  '#_fileName with unescaped quote': function() {
    var filename = 'my".txt';
    assert.equal(form._fileName(makeHeader(filename)), 'my".txt');
  },

  '#_fileName with escaped quote': function() {
    var filename = 'my%22.txt';
    assert.equal(form._fileName(makeHeader(filename)), 'my".txt');
  },

  '#_fileName with bad quote and additional sub-header': function() {
    var filename = 'my".txt';
    var header = makeHeader(filename) + '; foo="bar"';
    assert.equal(form._fileName(header), filename);
  },

  '#_fileName with semicolon': function() {
    var filename = 'my;.txt';
    assert.equal(form._fileName(makeHeader(filename)), 'my;.txt');
  },

  '#_fileName with utf8 character': function() {
    var filename = 'my&#9731;.txt';
    assert.equal(form._fileName(makeHeader(filename)), 'my☃.txt');
  },

  '#_uploadPath strips harmful characters from extension when keepExtensions': function() {
    form.keepExtensions = true;

    var ext = path.extname(form._uploadPath('fine.jpg?foo=bar'));
    assert.equal(ext, '.jpg');

    var ext = path.extname(form._uploadPath('fine?foo=bar'));
    assert.equal(ext, '');

    var ext = path.extname(form._uploadPath('super.cr2+dsad'));
    assert.equal(ext, '.cr2');

    var ext = path.extname(form._uploadPath('super.bar'));
    assert.equal(ext, '.bar');
  },
});

function makeHeader(filename) {
  return 'Content-Disposition: form-data; name="upload"; filename="' + filename + '"';
}
