/*!
 * Manta Bootstrap Grunt task for icomanta (glyphs) data generation
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
'use strict';
var fs = require('fs');

module.exports = function generateGlyphiconsData() {
  // Pass encoding, utf8, so `readFileSync` will return a string instead of a
  // buffer
  var glyphiconsFile = fs.readFileSync('less/manta-glyphicons.less', 'utf8');
  var glpyhiconsLines = glyphiconsFile.split('\n');

  // Use any line that starts with ".glyphicon-" and capture the class name
  var iconClassName = /^\.(icon-[^\s:]+)/;
  var glyphiconsData = '# This file is generated via Grunt task. **Do not edit directly.**\n' +
                       '# See the \'build-icomanta-data\' task in Gruntfile.js.\n\n';
  for (var i = 0, len = glpyhiconsLines.length; i < len; i++) {
    var match = glpyhiconsLines[i].match(iconClassName);

    if (match !== null) {
      glyphiconsData += '- ' + match[1] + '\n';
    }
  }

  // Create the `_data` directory if it doesn't already exist
  if (!fs.existsSync('docs/_data')) {
    fs.mkdirSync('docs/_data');
  }

  fs.writeFileSync('docs/_data/icomanta.yml', glyphiconsData);
};
