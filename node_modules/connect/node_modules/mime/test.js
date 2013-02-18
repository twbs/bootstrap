/**
 * Requires the async_testing module
 *
 * Usage: node test.js
 */
var mime = require('./mime');
exports["test mime lookup"] = function(test) {
  // easy
  test.equal('text/plain', mime.lookup('text.txt'));

  // hidden file or multiple periods
  test.equal('text/plain', mime.lookup('.text.txt'));

  // just an extension
  test.equal('text/plain', mime.lookup('.txt'));

  // just an extension without a dot
  test.equal('text/plain', mime.lookup('txt'));

  // default
  test.equal('application/octet-stream', mime.lookup('text.nope'));

  // fallback
  test.equal('fallback', mime.lookup('text.fallback', 'fallback'));

  test.finish();
};

exports["test extension lookup"] = function(test) {
  // easy
  test.equal('txt', mime.extension(mime.types.text));
  test.equal('html', mime.extension(mime.types.htm));
  test.equal('bin', mime.extension('application/octet-stream'));

  test.finish();
};

exports["test mime lookup uppercase"] = function(test) {
  // easy
  test.equal('text/plain', mime.lookup('TEXT.TXT'));

  // just an extension
  test.equal('text/plain', mime.lookup('.TXT'));

  // just an extension without a dot
  test.equal('text/plain', mime.lookup('TXT'));

  // default
  test.equal('application/octet-stream', mime.lookup('TEXT.NOPE'));

  // fallback
  test.equal('fallback', mime.lookup('TEXT.FALLBACK', 'fallback'));

  test.finish();
};

exports["test custom types"] = function(test) {
  test.equal('application/octet-stream', mime.lookup('file.buffer'));
  test.equal('audio/mp4', mime.lookup('file.m4a'));

  test.finish();
};

exports["test charset lookup"] = function(test) {
  // easy
  test.equal('UTF-8', mime.charsets.lookup('text/plain'));

  // none
  test.ok(typeof mime.charsets.lookup(mime.types.js) == 'undefined');

  // fallback
  test.equal('fallback', mime.charsets.lookup('application/octet-stream', 'fallback'));

  test.finish();
};

if (module == require.main) {
  require('async_testing').run(__filename, process.ARGV);
}
