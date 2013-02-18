// Backwards compatibility ...
try {
  module.exports = require('util');
} catch (e) {
  module.exports = require('sys');
}
