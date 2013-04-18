// sample on how to use the parser and walker API to instrument some code

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

function instrument(code) {
        var ast = jsp.parse(code, false, true); // true for the third arg specifies that we want
                                                // to have start/end tokens embedded in the
                                                // statements
        var w = pro.ast_walker();

        // we're gonna need this to push elements that we're currently looking at, to avoid
        // endless recursion.
        var analyzing = [];
        function do_stat() {
                var ret;
                if (this[0].start && analyzing.indexOf(this) < 0) {
                        // without the `analyzing' hack, w.walk(this) would re-enter here leading
                        // to infinite recursion
                        analyzing.push(this);
                        ret = [ "splice", // XXX: "block" is safer
                                [ [ "stat",
                                    [ "call", [ "name", "trace" ],
                                      [ [ "string", this[0].toString() ],
                                        [ "num", this[0].start.line ],
                                        [ "num", this[0].start.col ],
                                        [ "num", this[0].end.line ],
                                        [ "num", this[0].end.col ]]]],
                                  w.walk(this) ]];
                        analyzing.pop(this);
                }
                return ret;
        };
        var new_ast = w.with_walkers({
                "stat"     : do_stat,
                "label"    : do_stat,
                "break"    : do_stat,
                "continue" : do_stat,
                "debugger" : do_stat,
                "var"      : do_stat,
                "const"    : do_stat,
                "return"   : do_stat,
                "throw"    : do_stat,
                "try"      : do_stat,
                "defun"    : do_stat,
                "if"       : do_stat,
                "while"    : do_stat,
                "do"       : do_stat,
                "for"      : do_stat,
                "for-in"   : do_stat,
                "switch"   : do_stat,
                "with"     : do_stat
        }, function(){
                return w.walk(ast);
        });
        return pro.gen_code(new_ast, { beautify: true });
}




////// test code follows.

var code = instrument(test.toString());
console.log(code);

function test() {
        // simple stats
        a = 5;
        c += a + b;
        "foo";

        // var
        var foo = 5;
        const bar = 6, baz = 7;

        // switch block.  note we can't track case lines the same way.
        switch ("foo") {
            case "foo":
                return 1;
            case "bar":
                return 2;
        }

        // for/for in
        for (var i = 0; i < 5; ++i) {
                console.log("Hello " + i);
        }
        for (var i in [ 1, 2, 3]) {
                console.log(i);
        }

        // note however that the following is broken.  I guess we
        // should add the block brackets in this case...
        for (var i = 0; i < 5; ++i)
                console.log("foo");
}
