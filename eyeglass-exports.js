var path = require('path');

module.exports = function(eyeglass, sass) {
  return {
    sassDir: path.join(__dirname, 'scss')
  }
};
