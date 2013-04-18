var path = require('path'),
    fs = require('fs');

var mime = module.exports = {
  /** Map of extension to mime type */
  types: {},

  /** Map of mime type to extension */
  extensions :{},

  /**
   * Define mimetype -> extension mappings.  Each key is a mime-type that maps
   * to an array of extensions associated with the type.  The first extension is
   * used as the default extension for the type.
   *
   * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
   *
   * @param map (Object) type definitions
   */
  define: function(map) {
    for (var type in map) {
      var exts = map[type];

      for (var i = 0; i < exts.length; i++) {
        mime.types[exts[i]] = type;
      }

      // Default extension is the first one we encounter
      if (!mime.extensions[type]) {
        mime.extensions[type] = exts[0];
      }
    }
  },

  /**
   * Load an Apache2-style ".types" file
   *
   * This may be called multiple times (it's expected).  Where files declare
   * overlapping types/extensions, the last file wins.
   *
   * @param file (String) path of file to load.
   */
  load: function(file) {
    // Read file and split into lines
    var map = {},
        content = fs.readFileSync(file, 'ascii'),
        lines = content.split(/[\r\n]+/);

    lines.forEach(function(line, lineno) {
      // Clean up whitespace/comments, and split into fields
      var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
      map[fields.shift()] = fields;
    });

    mime.define(map);
  },

  /**
   * Lookup a mime type based on extension
   */
  lookup: function(path, fallback) {
    var ext = path.replace(/.*[\.\/]/, '').toLowerCase();
    return mime.types[ext] || fallback || mime.default_type;
  },

  /**
   * Return file extension associated with a mime type
   */
  extension: function(mimeType) {
    return mime.extensions[mimeType];
  },

  /**
   * Lookup a charset based on mime type.
   */
  charsets: {
    lookup: function (mimeType, fallback) {
      // Assume text types are utf8.  Modify mime logic as needed.
      return (/^text\//).test(mimeType) ? 'UTF-8' : fallback;
    }
  }
};

// Load our local copy of
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
mime.load(path.join(__dirname, 'types/mime.types'));

// Overlay enhancements submitted by the node.js community
mime.load(path.join(__dirname, 'types/node.types'));

// Set the default type
mime.default_type = mime.types.bin;
