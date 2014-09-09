'use strict';
var fs = require('fs');
var path = require('path');

var COMMONJS_BANNER = '// This file is generated. You can require() it in a CommonJS environment.\n';

module.exports = function generateCommonJSModule(grunt, srcFiles, destFilepath) {
  var destDir = path.dirname(destFilepath);

  function srcPathToDestRequire(srcFilepath) {
    var requirePath = path.relative(destDir, srcFilepath);
    return 'require(\'' + requirePath + '\')';
  }

  var moduleOutputJs = COMMONJS_BANNER + srcFiles.map(srcPathToDestRequire).join('\n');
  try {
    fs.writeFileSync(destFilepath, moduleOutputJs);
  }
  catch (err) {
    grunt.fail.warn(err);
  }
  grunt.log.writeln('File ' + destFilepath.cyan + ' created.');
};
