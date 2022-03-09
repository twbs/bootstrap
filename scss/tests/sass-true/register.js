/* eslint-env node */

require.extensions['.scss'] = function (module, filename) {
  return module._compile(`
var sassTrue = require('sass-true');
var fs = require('fs');
var path = require('path');
var filename = '${filename}';
var data = fs.readFileSync(filename, {encoding: 'utf-8'});
var TRUE_SETUP = "$true-terminal-output: false; @import 'true';";
try {
  sassTrue.runSass({
    data: TRUE_SETUP + data,
    includePaths: [path.dirname(filename)],
    sass: require('sass')}, {describe, it});
} catch (e) {
  console.error(e.formatted);
};
    `, filename)
}
