var assert = require('assert'),
    colors = require('./colors');

// 
// This is a pretty nice example on how tests shouldn't be written. However,
// it's more about API stability than about really testing it (although it's
// a pretty complete test suite).
//

var s = 'string';

function a(s, code) {
  return '\033[' + code.toString() + 'm' + s + '\033[39m';
}

function aE(s, color, code) {
  assert.equal(s[color], a(s, code));
  assert.equal(colors[color](s), a(s, code));
  assert.equal(s[color], colors[color](s));
  assert.equal(s[color].stripColors, s);
  assert.equal(s[color].stripColors, colors.stripColors(s));
}

function h(s, color) {
  return '<span style="color:' + color + ';">' + s + '</span>';
  // that's pretty dumb approach to testing it
}

var stylesColors = ['white', 'grey', 'black', 'blue', 'cyan', 'green', 'magenta', 'red', 'yellow'];
var stylesAll = stylesColors.concat(['bold', 'italic', 'underline', 'inverse', 'rainbow']);

colors.mode = 'console';
assert.equal(s.bold, '\033[1m' + s + '\033[22m');
assert.equal(s.italic, '\033[3m' + s + '\033[23m');
assert.equal(s.underline, '\033[4m' + s + '\033[24m');
assert.equal(s.inverse, '\033[7m' + s + '\033[27m');
assert.ok(s.rainbow);
aE(s, 'white', 37);
aE(s, 'grey', 90);
aE(s, 'black', 30);
aE(s, 'blue', 34);
aE(s, 'cyan', 36);
aE(s, 'green', 32);
aE(s, 'magenta', 35);
aE(s, 'red', 31);
aE(s, 'yellow', 33);
assert.equal(s, 'string');

colors.mode = 'browser';
assert.equal(s.bold, '<b>' + s + '</b>');
assert.equal(s.italic, '<i>' + s + '</i>');
assert.equal(s.underline, '<u>' + s + '</u>');
assert.equal(s.inverse, '<span style="background-color:black;color:white;">' + s + '</span>');
assert.ok(s.rainbow);
stylesColors.forEach(function (color) {
  assert.equal(s[color], h(s, color));
  assert.equal(colors[color](s), h(s, color));
});

colors.mode = 'none';
stylesAll.forEach(function (style) {
  assert.equal(s[style], s);
  assert.equal(colors[style](s), s);
});

