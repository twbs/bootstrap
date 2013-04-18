#! /usr/bin/env node

global.sys = require("sys");
var fs = require("fs");

var jsp = require("../lib/parse-js");
var pro = require("../lib/process");

var filename = process.argv[2];
fs.readFile(filename, "utf8", function(err, text){
        try {
                var ast = time_it("parse", function(){ return jsp.parse(text); });
                ast = time_it("mangle", function(){ return pro.ast_mangle(ast); });
                ast = time_it("squeeze", function(){ return pro.ast_squeeze(ast); });
                var gen = time_it("generate", function(){ return pro.gen_code(ast, false); });
                sys.puts(gen);
        } catch(ex) {
                sys.debug(ex.stack);
                sys.debug(sys.inspect(ex));
                sys.debug(JSON.stringify(ex));
        }
});

function time_it(name, cont) {
        var t1 = new Date().getTime();
        try { return cont(); }
        finally { sys.debug("// " + name + ": " + ((new Date().getTime() - t1) / 1000).toFixed(3) + " sec."); }
};
