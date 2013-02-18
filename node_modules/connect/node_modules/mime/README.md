# mime

Support for mapping between file extensions and MIME types.  This module uses the latest version of the Apache "mime.types" file (maps over 620 types to 800+ extensions).  It is also trivially easy to add your own types and extensions, should you need to do that.

## Install

Install with [npm](http://github.com/isaacs/npm):

    npm install mime

## API - Queries

### mime.lookup(path)
Get the mime type associated with a file. This is method is case-insensitive. Everything in path up to and including the last '/' or '.' is ignored, so you can pass it paths, filenames, or extensions, like so:

    var mime = require('mime');

    mime.lookup('/path/to/file.txt');         // => 'text/plain'
    mime.lookup('file.txt');                  // => 'text/plain'
    mime.lookup('.txt');                      // => 'text/plain'
    mime.lookup('htm');                       // => 'text/html'

### mime.extension(type) - lookup the default extension for type

    mime.extension('text/html');                 // => 'html'
    mime.extension('application/octet-stream');  // => 'bin'

### mime.charsets.lookup() - map mime-type to charset

    mime.charsets.lookup('text/plain');        // => 'UTF-8'

(The logic for charset lookups is pretty rudimentary.  Feel free to suggest improvements.)

## API - Customizing

The following APIs allow you to add your own type mappings within your project.  If you feel a type should be included as part of node-mime, see [requesting new types](https://github.com/bentomas/node-mime/wiki/Requesting-New-Types).
### mime.define() - Add custom mime/extension mappings

    mime.define({
        'text/x-some-format': ['x-sf', 'x-sft', 'x-sfml'],
        'application/x-my-type': ['x-mt', 'x-mtt'],
        // etc ...
    });

    mime.lookup('x-sft');                 // => 'text/x-some-format'
    mime.extension('text/x-some-format'); // => 'x-sf'

### mime.load(filepath) - Load mappings from an Apache ".types" format file

    mime.load('./my_project.types');
