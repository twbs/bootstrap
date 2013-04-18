// lessc_helper.js
//
//      helper functions for lessc
sys = require('util');

var lessc_helper = {

    //Stylize a string
    stylize : function(str, style) {
        var styles = {
            'reset'     : [0,   0],
            'bold'      : [1,  22],
            'inverse'   : [7,  27],
            'underline' : [4,  24],
            'yellow'    : [33, 39],
            'green'     : [32, 39],
            'red'       : [31, 39],
            'grey'      : [90, 39]
        };
        return '\033[' + styles[style][0] + 'm' + str +
               '\033[' + styles[style][1] + 'm';
    },

    //Print command line options
    printUsage: function() {
        sys.puts("usage: lessc [option option=parameter ...] <source> [destination]");
        sys.puts("");
        sys.puts("If source is set to `-' (dash or hyphen-minus), input is read from stdin.");
        sys.puts("");
        sys.puts("options:");
        sys.puts("  -h, --help              Print help (this message) and exit.");
        sys.puts("  --include-path          Set include paths. Separated by `:'. Use `;' on Windows.");
        sys.puts("  --no-color              Disable colorized output.");
        sys.puts("  -s, --silent            Suppress output of error messages.");
        sys.puts("  --strict-imports        Force evaluation of imports.");
        sys.puts("  --verbose               Be verbose.");
        sys.puts("  -v, --version           Print version number and exit.");
        sys.puts("  -x, --compress          Compress output by removing some whitespaces.");
        sys.puts("  --yui-compress          Compress output using ycssmin");
        sys.puts("  -O0, -O1, -O2           Set the parser's optimization level. The lower");
        sys.puts("                          the number, the less nodes it will create in the");
        sys.puts("                          tree. This could matter for debugging, or if you");
        sys.puts("                          want to access the individual nodes in the tree.");
        sys.puts("  --line-numbers=TYPE     Outputs filename and line numbers.");
        sys.puts("                          TYPE can be either 'comments', which will output");
        sys.puts("                          the debug info within comments, 'mediaquery'");
        sys.puts("                          that will output the information within a fake");
        sys.puts("                          media query which is compatible with the SASS");
        sys.puts("                          format, and 'all' which will do both.");
        sys.puts("  -rp, --rootpath         Set rootpath for url rewriting in relative imports and urls.");
        sys.puts("                          Works with or withour the relative-urls option.");
        sys.puts("  -ru, --relative-urls    re-write relative urls to the base less file.");
        sys.puts("");
        sys.puts("Report bugs to: http://github.com/cloudhead/less.js/issues");
        sys.puts("Home page: <http://lesscss.org/>");
    }


}

// Exports helper functions
for (var h in lessc_helper) { exports[h] = lessc_helper[h] }
