'use strict';
var fs = require('fs');
var path = require('path');

var destDir = 'dist/js';
var destFilename = 'npm.js';
var destFilepath = path.join(destDir, destFilename);

function srcPathToDestRequire(srcFilepath) {
  var requirePath = path.relative(destDir, srcFilepath);
  return "require('"+requirePath+"')";
}

module.exports = function generateCommonJSModule(grunt, files) {
  var moduleOutputJs = files.map(srcPathToDestRequire).join('\n');
  try {
    fs.writeFileSync(destFilepath, moduleOutputJs);
  }
  catch (err) {
    grunt.fail.warn(err);
  }
  grunt.log.writeln('File ' + destFilepath.cyan + ' created.');
};
