#!/usr/bin/env node

/* All of the following commands are equivalent and write `foo\tbar foo` to out.txt
    $ ./echo.js -n -e --output=out.txt "foo\tbar" "foo"
    $ ./echo.js --newline --escape --output "out.txt" "foo\tbar" "foo"
    $ ./echo.js -ne --output=out.txt "foo\tbar" "foo"
    $ ./echo.js -en --output="out.txt" "foo\tbar" "foo"
*/

var cli = require('cli');

cli.parse({
    newline:   ['n', 'Do not output the trailing newline'],
    escape:    ['e', 'Enable interpretation of backslash escapes'],
    separator: ['s', 'Separate arguments using this value', 'string', ' '],
    output:    [false, 'Write to FILE rather than the console', 'file']
});

cli.main(function (args, options) {
    var output = '', i, j, l, output_stream;
    
    if (this.argc) {
        if (options.escape) {
            var replace = {'\\n':'\n','\\r':'\r','\\t':'\t','\\e':'\e','\\v':'\v','\\f':'\f','\\c':'\c','\\b':'\b','\\a':'\a','\\\\':'\\'};
            var escape = function (str) {
                string += '';
                for (j in replace) {
                    string = string.replace(i, replace[i]);
                }
                return string;
            }
            for (i = 0, l = this.argc; i < l; i++) {
                args[i] = escape(args[i]);
            }
            options.separator = escape(options.separator);
        }
        output += args.join(options.separator);
    }
    
    if (!options.newline) {
        output += '\n';
    }
    
    try {
        if (options.output) {
            output_stream = this.native.fs.createWriteStream(options.output)
        } else {
            output_stream = process.stdout;
        }
        output_stream.write(output);
    } catch (e) {
        this.fatal('Could not write to output stream');
    }
});