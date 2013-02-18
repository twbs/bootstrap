#!/usr/bin/env node
// -*- js -*-

global.sys = require(/^v0\.[012]/.test(process.version) ? "sys" : "util");
var fs = require("fs"), path = require("path");
var uglify = require("../uglify-js"), // symlink ~/.node_libraries/uglify-js.js to ../uglify-js.js
    consolidator = uglify.consolidator,
    jsp = uglify.parser,
    pro = uglify.uglify;

var options = {
    ast: false,
    consolidate: false,
    mangle: true,
    mangle_toplevel: false,
    no_mangle_functions: false,
    squeeze: true,
    make_seqs: true,
    dead_code: true,
    verbose: false,
    show_copyright: true,
    out_same_file: false,
    max_line_length: 32 * 1024,
    unsafe: false,
    reserved_names: null,
    defines: { },
    lift_vars: false,
    codegen_options: {
        ascii_only: false,
        beautify: false,
        indent_level: 4,
        indent_start: 0,
        quote_keys: false,
        space_colon: false,
        inline_script: false
    },
    make: false,
    output: true            // stdout
};

var args = jsp.slice(process.argv, 2);
var filename;

out: while (args.length > 0) {
    var v = args.shift();
    switch (v) {
      case "-b":
      case "--beautify":
        options.codegen_options.beautify = true;
        break;
      case "-c":
      case "--consolidate-primitive-values":
        options.consolidate = true;
        break;
      case "-i":
      case "--indent":
        options.codegen_options.indent_level = args.shift();
        break;
      case "-q":
      case "--quote-keys":
        options.codegen_options.quote_keys = true;
        break;
      case "-mt":
      case "--mangle-toplevel":
        options.mangle_toplevel = true;
        break;
      case "-nmf":
      case "--no-mangle-functions":
        options.no_mangle_functions = true;
        break;
      case "--no-mangle":
      case "-nm":
        options.mangle = false;
        break;
      case "--no-squeeze":
      case "-ns":
        options.squeeze = false;
        break;
      case "--no-seqs":
        options.make_seqs = false;
        break;
      case "--no-dead-code":
        options.dead_code = false;
        break;
      case "--no-copyright":
      case "-nc":
        options.show_copyright = false;
        break;
      case "-o":
      case "--output":
        options.output = args.shift();
        break;
      case "--overwrite":
        options.out_same_file = true;
        break;
      case "-v":
      case "--verbose":
        options.verbose = true;
        break;
      case "--ast":
        options.ast = true;
        break;
      case "--unsafe":
        options.unsafe = true;
        break;
      case "--max-line-len":
        options.max_line_length = parseInt(args.shift(), 10);
        break;
      case "--reserved-names":
        options.reserved_names = args.shift().split(",");
        break;
      case "--lift-vars":
        options.lift_vars = true;
        break;
      case "-d":
      case "--define":
        var defarg = args.shift();
        try {
            var defsym = function(sym) {
                // KEYWORDS_ATOM doesn't include NaN or Infinity - should we check
                // for them too ?? We don't check reserved words and the like as the
                // define values are only substituted AFTER parsing
                if (jsp.KEYWORDS_ATOM.hasOwnProperty(sym)) {
                    throw "Don't define values for inbuilt constant '"+sym+"'";
                }
                return sym;
            },
            defval = function(v) {
                if (v.match(/^"(.*)"$/) || v.match(/^'(.*)'$/)) {
                    return [ "string", RegExp.$1 ];
                }
                else if (!isNaN(parseFloat(v))) {
                    return [ "num", parseFloat(v) ];
                }
                else if (v.match(/^[a-z\$_][a-z\$_0-9]*$/i)) {
                    return [ "name", v ];
                }
                else if (!v.match(/"/)) {
                    return [ "string", v ];
                }
                else if (!v.match(/'/)) {
                    return [ "string", v ];
                }
                throw "Can't understand the specified value: "+v;
            };
            if (defarg.match(/^([a-z_\$][a-z_\$0-9]*)(=(.*))?$/i)) {
                var sym = defsym(RegExp.$1),
                val = RegExp.$2 ? defval(RegExp.$2.substr(1)) : [ 'name', 'true' ];
                options.defines[sym] = val;
            }
            else {
                throw "The --define option expects SYMBOL[=value]";
            }
        } catch(ex) {
            sys.print("ERROR: In option --define "+defarg+"\n"+ex+"\n");
            process.exit(1);
        }
        break;
      case "--define-from-module":
        var defmodarg = args.shift();
        var defmodule = require(defmodarg);
        var sym, val;
        for (sym in defmodule) {
            if (defmodule.hasOwnProperty(sym)) {
                options.defines[sym] = function(val) {
                    if (typeof val == "string")
                        return [ "string", val ];
                    if (typeof val == "number")
                        return [ "num", val ];
                    if (val === true)
                        return [ 'name', 'true' ];
                    if (val === false)
                        return [ 'name', 'false' ];
                    if (val === null)
                        return [ 'name', 'null' ];
                    if (val === undefined)
                        return [ 'name', 'undefined' ];
                    sys.print("ERROR: In option --define-from-module "+defmodarg+"\n");
                    sys.print("ERROR: Unknown object type for: "+sym+"="+val+"\n");
                    process.exit(1);
                    return null;
                }(defmodule[sym]);
            }
        }
        break;
      case "--ascii":
        options.codegen_options.ascii_only = true;
        break;
      case "--make":
        options.make = true;
        break;
      case "--inline-script":
        options.codegen_options.inline_script = true;
        break;
      default:
        filename = v;
        break out;
    }
}

if (options.verbose) {
    pro.set_logger(function(msg){
        sys.debug(msg);
    });
}

jsp.set_logger(function(msg){
    sys.debug(msg);
});

if (options.make) {
    options.out_same_file = false; // doesn't make sense in this case
    var makefile = global.eval("(" + fs.readFileSync(filename || "Makefile.uglify.js").toString() + ")");
    var dir = path.dirname(filename);
    output(makefile.files.map(function(file){
        var code = fs.readFileSync(path.join(dir, file.name)).toString();
        if (file.module) {
            code = "!function(exports, global){global = this;\n" + code + "\n;this." + file.module + " = exports;}({})";
        }
        else if (file.hide) {
            code = "(function(){" + code + "}());";
        }
        return squeeze_it(code);
    }).join("\n"));
}
else if (filename) {
    fs.readFile(filename, "utf8", function(err, text){
        if (err) throw err;
        output(squeeze_it(text));
    });
}
else {
    var stdin = process.openStdin();
    stdin.setEncoding("utf8");
    var text = "";
    stdin.on("data", function(chunk){
        text += chunk;
    });
    stdin.on("end", function() {
        output(squeeze_it(text));
    });
}

function output(text) {
    var out;
    if (options.out_same_file && filename)
        options.output = filename;
    if (options.output === true) {
        out = process.stdout;
    } else {
        out = fs.createWriteStream(options.output, {
            flags: "w",
            encoding: "utf8",
            mode: 0644
        });
    }
    out.write(text.replace(/;*$/, ";"));
    if (options.output !== true) {
        out.end();
    }
};

// --------- main ends here.

function show_copyright(comments) {
    var ret = "";
    for (var i = 0; i < comments.length; ++i) {
        var c = comments[i];
        if (c.type == "comment1") {
            ret += "//" + c.value + "\n";
        } else {
            ret += "/*" + c.value + "*/";
        }
    }
    return ret;
};

function squeeze_it(code) {
    var result = "";
    if (options.show_copyright) {
        var tok = jsp.tokenizer(code), c;
        c = tok();
        result += show_copyright(c.comments_before);
    }
    try {
        var ast = time_it("parse", function(){ return jsp.parse(code); });
        if (options.consolidate) ast = time_it("consolidate", function(){
            return consolidator.ast_consolidate(ast);
        });
        if (options.lift_vars) {
            ast = time_it("lift", function(){ return pro.ast_lift_variables(ast); });
        }
        ast = time_it("mangle", function(){
            return pro.ast_mangle(ast, {
                mangle       : options.mangle,
                toplevel     : options.mangle_toplevel,
                defines      : options.defines,
                except       : options.reserved_names,
                no_functions : options.no_mangle_functions
            });
        });
        if (options.squeeze) ast = time_it("squeeze", function(){
            ast = pro.ast_squeeze(ast, {
                make_seqs  : options.make_seqs,
                dead_code  : options.dead_code,
                keep_comps : !options.unsafe,
                unsafe     : options.unsafe
            });
            if (options.unsafe)
                ast = pro.ast_squeeze_more(ast);
            return ast;
        });
        if (options.ast)
            return sys.inspect(ast, null, null);
        result += time_it("generate", function(){ return pro.gen_code(ast, options.codegen_options) });
        if (!options.codegen_options.beautify && options.max_line_length) {
            result = time_it("split", function(){ return pro.split_lines(result, options.max_line_length) });
        }
        return result;
    } catch(ex) {
        sys.debug(ex.stack);
        sys.debug(sys.inspect(ex));
        sys.debug(JSON.stringify(ex));
        process.exit(1);
    }
};

function time_it(name, cont) {
    if (!options.verbose)
        return cont();
    var t1 = new Date().getTime();
    try { return cont(); }
    finally { sys.debug("// " + name + ": " + ((new Date().getTime() - t1) / 1000).toFixed(3) + " sec."); }
};
