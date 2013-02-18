/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.

  This version is suitable for Node.js.  With minimal changes (the
  exports stuff) it should work on any JS platform.

  This file implements some AST processors.  They work on data built
  by parse-js.

  Exported functions:

    - ast_mangle(ast, options) -- mangles the variable/function names
      in the AST.  Returns an AST.

    - ast_squeeze(ast) -- employs various optimizations to make the
      final generated code even smaller.  Returns an AST.

    - gen_code(ast, options) -- generates JS code from the AST.  Pass
      true (or an object, see the code for some options) as second
      argument to get "pretty" (indented) code.

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2010 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

var jsp = require("./parse-js"),
    curry = jsp.curry,
    slice = jsp.slice,
    member = jsp.member,
    is_identifier_char = jsp.is_identifier_char,
    PRECEDENCE = jsp.PRECEDENCE,
    OPERATORS = jsp.OPERATORS;

/* -----[ helper for AST traversal ]----- */

function ast_walker() {
    function _vardefs(defs) {
        return [ this[0], MAP(defs, function(def){
            var a = [ def[0] ];
            if (def.length > 1)
                a[1] = walk(def[1]);
            return a;
        }) ];
    };
    function _block(statements) {
        var out = [ this[0] ];
        if (statements != null)
            out.push(MAP(statements, walk));
        return out;
    };
    var walkers = {
        "string": function(str) {
            return [ this[0], str ];
        },
        "num": function(num) {
            return [ this[0], num ];
        },
        "name": function(name) {
            return [ this[0], name ];
        },
        "toplevel": function(statements) {
            return [ this[0], MAP(statements, walk) ];
        },
        "block": _block,
        "splice": _block,
        "var": _vardefs,
        "const": _vardefs,
        "try": function(t, c, f) {
            return [
                this[0],
                MAP(t, walk),
                c != null ? [ c[0], MAP(c[1], walk) ] : null,
                f != null ? MAP(f, walk) : null
            ];
        },
        "throw": function(expr) {
            return [ this[0], walk(expr) ];
        },
        "new": function(ctor, args) {
            return [ this[0], walk(ctor), MAP(args, walk) ];
        },
        "switch": function(expr, body) {
            return [ this[0], walk(expr), MAP(body, function(branch){
                return [ branch[0] ? walk(branch[0]) : null,
                         MAP(branch[1], walk) ];
            }) ];
        },
        "break": function(label) {
            return [ this[0], label ];
        },
        "continue": function(label) {
            return [ this[0], label ];
        },
        "conditional": function(cond, t, e) {
            return [ this[0], walk(cond), walk(t), walk(e) ];
        },
        "assign": function(op, lvalue, rvalue) {
            return [ this[0], op, walk(lvalue), walk(rvalue) ];
        },
        "dot": function(expr) {
            return [ this[0], walk(expr) ].concat(slice(arguments, 1));
        },
        "call": function(expr, args) {
            return [ this[0], walk(expr), MAP(args, walk) ];
        },
        "function": function(name, args, body) {
            return [ this[0], name, args.slice(), MAP(body, walk) ];
        },
        "debugger": function() {
            return [ this[0] ];
        },
        "defun": function(name, args, body) {
            return [ this[0], name, args.slice(), MAP(body, walk) ];
        },
        "if": function(conditional, t, e) {
            return [ this[0], walk(conditional), walk(t), walk(e) ];
        },
        "for": function(init, cond, step, block) {
            return [ this[0], walk(init), walk(cond), walk(step), walk(block) ];
        },
        "for-in": function(vvar, key, hash, block) {
            return [ this[0], walk(vvar), walk(key), walk(hash), walk(block) ];
        },
        "while": function(cond, block) {
            return [ this[0], walk(cond), walk(block) ];
        },
        "do": function(cond, block) {
            return [ this[0], walk(cond), walk(block) ];
        },
        "return": function(expr) {
            return [ this[0], walk(expr) ];
        },
        "binary": function(op, left, right) {
            return [ this[0], op, walk(left), walk(right) ];
        },
        "unary-prefix": function(op, expr) {
            return [ this[0], op, walk(expr) ];
        },
        "unary-postfix": function(op, expr) {
            return [ this[0], op, walk(expr) ];
        },
        "sub": function(expr, subscript) {
            return [ this[0], walk(expr), walk(subscript) ];
        },
        "object": function(props) {
            return [ this[0], MAP(props, function(p){
                return p.length == 2
                    ? [ p[0], walk(p[1]) ]
                    : [ p[0], walk(p[1]), p[2] ]; // get/set-ter
            }) ];
        },
        "regexp": function(rx, mods) {
            return [ this[0], rx, mods ];
        },
        "array": function(elements) {
            return [ this[0], MAP(elements, walk) ];
        },
        "stat": function(stat) {
            return [ this[0], walk(stat) ];
        },
        "seq": function() {
            return [ this[0] ].concat(MAP(slice(arguments), walk));
        },
        "label": function(name, block) {
            return [ this[0], name, walk(block) ];
        },
        "with": function(expr, block) {
            return [ this[0], walk(expr), walk(block) ];
        },
        "atom": function(name) {
            return [ this[0], name ];
        },
        "directive": function(dir) {
            return [ this[0], dir ];
        }
    };

    var user = {};
    var stack = [];
    function walk(ast) {
        if (ast == null)
            return null;
        try {
            stack.push(ast);
            var type = ast[0];
            var gen = user[type];
            if (gen) {
                var ret = gen.apply(ast, ast.slice(1));
                if (ret != null)
                    return ret;
            }
            gen = walkers[type];
            return gen.apply(ast, ast.slice(1));
        } finally {
            stack.pop();
        }
    };

    function dive(ast) {
        if (ast == null)
            return null;
        try {
            stack.push(ast);
            return walkers[ast[0]].apply(ast, ast.slice(1));
        } finally {
            stack.pop();
        }
    };

    function with_walkers(walkers, cont){
        var save = {}, i;
        for (i in walkers) if (HOP(walkers, i)) {
            save[i] = user[i];
            user[i] = walkers[i];
        }
        var ret = cont();
        for (i in save) if (HOP(save, i)) {
            if (!save[i]) delete user[i];
            else user[i] = save[i];
        }
        return ret;
    };

    return {
        walk: walk,
        dive: dive,
        with_walkers: with_walkers,
        parent: function() {
            return stack[stack.length - 2]; // last one is current node
        },
        stack: function() {
            return stack;
        }
    };
};

/* -----[ Scope and mangling ]----- */

function Scope(parent) {
    this.names = {};        // names defined in this scope
    this.mangled = {};      // mangled names (orig.name => mangled)
    this.rev_mangled = {};  // reverse lookup (mangled => orig.name)
    this.cname = -1;        // current mangled name
    this.refs = {};         // names referenced from this scope
    this.uses_with = false; // will become TRUE if with() is detected in this or any subscopes
    this.uses_eval = false; // will become TRUE if eval() is detected in this or any subscopes
    this.directives = [];   // directives activated from this scope
    this.parent = parent;   // parent scope
    this.children = [];     // sub-scopes
    if (parent) {
        this.level = parent.level + 1;
        parent.children.push(this);
    } else {
        this.level = 0;
    }
};

function base54_digits() {
    if (typeof DIGITS_OVERRIDE_FOR_TESTING != "undefined")
        return DIGITS_OVERRIDE_FOR_TESTING;
    else
        return "etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXV$JKQGYZ0516372984";
}

var base54 = (function(){
    var DIGITS = base54_digits();
    return function(num) {
        var ret = "", base = 54;
        do {
            ret += DIGITS.charAt(num % base);
            num = Math.floor(num / base);
            base = 64;
        } while (num > 0);
        return ret;
    };
})();

Scope.prototype = {
    has: function(name) {
        for (var s = this; s; s = s.parent)
            if (HOP(s.names, name))
                return s;
    },
    has_mangled: function(mname) {
        for (var s = this; s; s = s.parent)
            if (HOP(s.rev_mangled, mname))
                return s;
    },
    toJSON: function() {
        return {
            names: this.names,
            uses_eval: this.uses_eval,
            uses_with: this.uses_with
        };
    },

    next_mangled: function() {
        // we must be careful that the new mangled name:
        //
        // 1. doesn't shadow a mangled name from a parent
        //    scope, unless we don't reference the original
        //    name from this scope OR from any sub-scopes!
        //    This will get slow.
        //
        // 2. doesn't shadow an original name from a parent
        //    scope, in the event that the name is not mangled
        //    in the parent scope and we reference that name
        //    here OR IN ANY SUBSCOPES!
        //
        // 3. doesn't shadow a name that is referenced but not
        //    defined (possibly global defined elsewhere).
        for (;;) {
            var m = base54(++this.cname), prior;

            // case 1.
            prior = this.has_mangled(m);
            if (prior && this.refs[prior.rev_mangled[m]] === prior)
                continue;

            // case 2.
            prior = this.has(m);
            if (prior && prior !== this && this.refs[m] === prior && !prior.has_mangled(m))
                continue;

            // case 3.
            if (HOP(this.refs, m) && this.refs[m] == null)
                continue;

            // I got "do" once. :-/
            if (!is_identifier(m))
                continue;

            return m;
        }
    },
    set_mangle: function(name, m) {
        this.rev_mangled[m] = name;
        return this.mangled[name] = m;
    },
    get_mangled: function(name, newMangle) {
        if (this.uses_eval || this.uses_with) return name; // no mangle if eval or with is in use
        var s = this.has(name);
        if (!s) return name; // not in visible scope, no mangle
        if (HOP(s.mangled, name)) return s.mangled[name]; // already mangled in this scope
        if (!newMangle) return name;                      // not found and no mangling requested
        return s.set_mangle(name, s.next_mangled());
    },
    references: function(name) {
        return name && !this.parent || this.uses_with || this.uses_eval || this.refs[name];
    },
    define: function(name, type) {
        if (name != null) {
            if (type == "var" || !HOP(this.names, name))
                this.names[name] = type || "var";
            return name;
        }
    },
    active_directive: function(dir) {
        return member(dir, this.directives) || this.parent && this.parent.active_directive(dir);
    }
};

function ast_add_scope(ast) {

    var current_scope = null;
    var w = ast_walker(), walk = w.walk;
    var having_eval = [];

    function with_new_scope(cont) {
        current_scope = new Scope(current_scope);
        current_scope.labels = new Scope();
        var ret = current_scope.body = cont();
        ret.scope = current_scope;
        current_scope = current_scope.parent;
        return ret;
    };

    function define(name, type) {
        return current_scope.define(name, type);
    };

    function reference(name) {
        current_scope.refs[name] = true;
    };

    function _lambda(name, args, body) {
        var is_defun = this[0] == "defun";
        return [ this[0], is_defun ? define(name, "defun") : name, args, with_new_scope(function(){
            if (!is_defun) define(name, "lambda");
            MAP(args, function(name){ define(name, "arg") });
            return MAP(body, walk);
        })];
    };

    function _vardefs(type) {
        return function(defs) {
            MAP(defs, function(d){
                define(d[0], type);
                if (d[1]) reference(d[0]);
            });
        };
    };

    function _breacont(label) {
        if (label)
            current_scope.labels.refs[label] = true;
    };

    return with_new_scope(function(){
        // process AST
        var ret = w.with_walkers({
            "function": _lambda,
            "defun": _lambda,
            "label": function(name, stat) { current_scope.labels.define(name) },
            "break": _breacont,
            "continue": _breacont,
            "with": function(expr, block) {
                for (var s = current_scope; s; s = s.parent)
                    s.uses_with = true;
            },
            "var": _vardefs("var"),
            "const": _vardefs("const"),
            "try": function(t, c, f) {
                if (c != null) return [
                    this[0],
                    MAP(t, walk),
                    [ define(c[0], "catch"), MAP(c[1], walk) ],
                    f != null ? MAP(f, walk) : null
                ];
            },
            "name": function(name) {
                if (name == "eval")
                    having_eval.push(current_scope);
                reference(name);
            }
        }, function(){
            return walk(ast);
        });

        // the reason why we need an additional pass here is
        // that names can be used prior to their definition.

        // scopes where eval was detected and their parents
        // are marked with uses_eval, unless they define the
        // "eval" name.
        MAP(having_eval, function(scope){
            if (!scope.has("eval")) while (scope) {
                scope.uses_eval = true;
                scope = scope.parent;
            }
        });

        // for referenced names it might be useful to know
        // their origin scope.  current_scope here is the
        // toplevel one.
        function fixrefs(scope, i) {
            // do children first; order shouldn't matter
            for (i = scope.children.length; --i >= 0;)
                fixrefs(scope.children[i]);
            for (i in scope.refs) if (HOP(scope.refs, i)) {
                // find origin scope and propagate the reference to origin
                for (var origin = scope.has(i), s = scope; s; s = s.parent) {
                    s.refs[i] = origin;
                    if (s === origin) break;
                }
            }
        };
        fixrefs(current_scope);

        return ret;
    });

};

/* -----[ mangle names ]----- */

function ast_mangle(ast, options) {
    var w = ast_walker(), walk = w.walk, scope;
    options = defaults(options, {
        mangle       : true,
        toplevel     : false,
        defines      : null,
        except       : null,
        no_functions : false
    });

    function get_mangled(name, newMangle) {
        if (!options.mangle) return name;
        if (!options.toplevel && !scope.parent) return name; // don't mangle toplevel
        if (options.except && member(name, options.except))
            return name;
        if (options.no_functions && HOP(scope.names, name) &&
            (scope.names[name] == 'defun' || scope.names[name] == 'lambda'))
            return name;
        return scope.get_mangled(name, newMangle);
    };

    function get_define(name) {
        if (options.defines) {
            // we always lookup a defined symbol for the current scope FIRST, so declared
            // vars trump a DEFINE symbol, but if no such var is found, then match a DEFINE value
            if (!scope.has(name)) {
                if (HOP(options.defines, name)) {
                    return options.defines[name];
                }
            }
            return null;
        }
    };

    function _lambda(name, args, body) {
        if (!options.no_functions && options.mangle) {
            var is_defun = this[0] == "defun", extra;
            if (name) {
                if (is_defun) name = get_mangled(name);
                else if (body.scope.references(name)) {
                    extra = {};
                    if (!(scope.uses_eval || scope.uses_with))
                        name = extra[name] = scope.next_mangled();
                    else
                        extra[name] = name;
                }
                else name = null;
            }
        }
        body = with_scope(body.scope, function(){
            args = MAP(args, function(name){ return get_mangled(name) });
            return MAP(body, walk);
        }, extra);
        return [ this[0], name, args, body ];
    };

    function with_scope(s, cont, extra) {
        var _scope = scope;
        scope = s;
        if (extra) for (var i in extra) if (HOP(extra, i)) {
            s.set_mangle(i, extra[i]);
        }
        for (var i in s.names) if (HOP(s.names, i)) {
            get_mangled(i, true);
        }
        var ret = cont();
        ret.scope = s;
        scope = _scope;
        return ret;
    };

    function _vardefs(defs) {
        return [ this[0], MAP(defs, function(d){
            return [ get_mangled(d[0]), walk(d[1]) ];
        }) ];
    };

    function _breacont(label) {
        if (label) return [ this[0], scope.labels.get_mangled(label) ];
    };

    return w.with_walkers({
        "function": _lambda,
        "defun": function() {
            // move function declarations to the top when
            // they are not in some block.
            var ast = _lambda.apply(this, arguments);
            switch (w.parent()[0]) {
              case "toplevel":
              case "function":
              case "defun":
                return MAP.at_top(ast);
            }
            return ast;
        },
        "label": function(label, stat) {
            if (scope.labels.refs[label]) return [
                this[0],
                scope.labels.get_mangled(label, true),
                walk(stat)
            ];
            return walk(stat);
        },
        "break": _breacont,
        "continue": _breacont,
        "var": _vardefs,
        "const": _vardefs,
        "name": function(name) {
            return get_define(name) || [ this[0], get_mangled(name) ];
        },
        "try": function(t, c, f) {
            return [ this[0],
                     MAP(t, walk),
                     c != null ? [ get_mangled(c[0]), MAP(c[1], walk) ] : null,
                     f != null ? MAP(f, walk) : null ];
        },
        "toplevel": function(body) {
            var self = this;
            return with_scope(self.scope, function(){
                return [ self[0], MAP(body, walk) ];
            });
        },
        "directive": function() {
            return MAP.at_top(this);
        }
    }, function() {
        return walk(ast_add_scope(ast));
    });
};

/* -----[
   - compress foo["bar"] into foo.bar,
   - remove block brackets {} where possible
   - join consecutive var declarations
   - various optimizations for IFs:
   - if (cond) foo(); else bar();  ==>  cond?foo():bar();
   - if (cond) foo();  ==>  cond&&foo();
   - if (foo) return bar(); else return baz();  ==> return foo?bar():baz(); // also for throw
   - if (foo) return bar(); else something();  ==> {if(foo)return bar();something()}
   ]----- */

var warn = function(){};

function best_of(ast1, ast2) {
    return gen_code(ast1).length > gen_code(ast2[0] == "stat" ? ast2[1] : ast2).length ? ast2 : ast1;
};

function last_stat(b) {
    if (b[0] == "block" && b[1] && b[1].length > 0)
        return b[1][b[1].length - 1];
    return b;
}

function aborts(t) {
    if (t) switch (last_stat(t)[0]) {
      case "return":
      case "break":
      case "continue":
      case "throw":
        return true;
    }
};

function boolean_expr(expr) {
    return ( (expr[0] == "unary-prefix"
              && member(expr[1], [ "!", "delete" ])) ||

             (expr[0] == "binary"
              && member(expr[1], [ "in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">" ])) ||

             (expr[0] == "binary"
              && member(expr[1], [ "&&", "||" ])
              && boolean_expr(expr[2])
              && boolean_expr(expr[3])) ||

             (expr[0] == "conditional"
              && boolean_expr(expr[2])
              && boolean_expr(expr[3])) ||

             (expr[0] == "assign"
              && expr[1] === true
              && boolean_expr(expr[3])) ||

             (expr[0] == "seq"
              && boolean_expr(expr[expr.length - 1]))
           );
};

function empty(b) {
    return !b || (b[0] == "block" && (!b[1] || b[1].length == 0));
};

function is_string(node) {
    return (node[0] == "string" ||
            node[0] == "unary-prefix" && node[1] == "typeof" ||
            node[0] == "binary" && node[1] == "+" &&
            (is_string(node[2]) || is_string(node[3])));
};

var when_constant = (function(){

    var $NOT_CONSTANT = {};

    // this can only evaluate constant expressions.  If it finds anything
    // not constant, it throws $NOT_CONSTANT.
    function evaluate(expr) {
        switch (expr[0]) {
          case "string":
          case "num":
            return expr[1];
          case "name":
          case "atom":
            switch (expr[1]) {
              case "true": return true;
              case "false": return false;
              case "null": return null;
            }
            break;
          case "unary-prefix":
            switch (expr[1]) {
              case "!": return !evaluate(expr[2]);
              case "typeof": return typeof evaluate(expr[2]);
              case "~": return ~evaluate(expr[2]);
              case "-": return -evaluate(expr[2]);
              case "+": return +evaluate(expr[2]);
            }
            break;
          case "binary":
            var left = expr[2], right = expr[3];
            switch (expr[1]) {
              case "&&"         : return evaluate(left) &&         evaluate(right);
              case "||"         : return evaluate(left) ||         evaluate(right);
              case "|"          : return evaluate(left) |          evaluate(right);
              case "&"          : return evaluate(left) &          evaluate(right);
              case "^"          : return evaluate(left) ^          evaluate(right);
              case "+"          : return evaluate(left) +          evaluate(right);
              case "*"          : return evaluate(left) *          evaluate(right);
              case "/"          : return evaluate(left) /          evaluate(right);
              case "%"          : return evaluate(left) %          evaluate(right);
              case "-"          : return evaluate(left) -          evaluate(right);
              case "<<"         : return evaluate(left) <<         evaluate(right);
              case ">>"         : return evaluate(left) >>         evaluate(right);
              case ">>>"        : return evaluate(left) >>>        evaluate(right);
              case "=="         : return evaluate(left) ==         evaluate(right);
              case "==="        : return evaluate(left) ===        evaluate(right);
              case "!="         : return evaluate(left) !=         evaluate(right);
              case "!=="        : return evaluate(left) !==        evaluate(right);
              case "<"          : return evaluate(left) <          evaluate(right);
              case "<="         : return evaluate(left) <=         evaluate(right);
              case ">"          : return evaluate(left) >          evaluate(right);
              case ">="         : return evaluate(left) >=         evaluate(right);
              case "in"         : return evaluate(left) in         evaluate(right);
              case "instanceof" : return evaluate(left) instanceof evaluate(right);
            }
        }
        throw $NOT_CONSTANT;
    };

    return function(expr, yes, no) {
        try {
            var val = evaluate(expr), ast;
            switch (typeof val) {
              case "string": ast =  [ "string", val ]; break;
              case "number": ast =  [ "num", val ]; break;
              case "boolean": ast =  [ "name", String(val) ]; break;
              default:
                if (val === null) { ast = [ "atom", "null" ]; break; }
                throw new Error("Can't handle constant of type: " + (typeof val));
            }
            return yes.call(expr, ast, val);
        } catch(ex) {
            if (ex === $NOT_CONSTANT) {
                if (expr[0] == "binary"
                    && (expr[1] == "===" || expr[1] == "!==")
                    && ((is_string(expr[2]) && is_string(expr[3]))
                        || (boolean_expr(expr[2]) && boolean_expr(expr[3])))) {
                    expr[1] = expr[1].substr(0, 2);
                }
                else if (no && expr[0] == "binary"
                         && (expr[1] == "||" || expr[1] == "&&")) {
                    // the whole expression is not constant but the lval may be...
                    try {
                        var lval = evaluate(expr[2]);
                        expr = ((expr[1] == "&&" && (lval ? expr[3] : lval))    ||
                                (expr[1] == "||" && (lval ? lval    : expr[3])) ||
                                expr);
                    } catch(ex2) {
                        // IGNORE... lval is not constant
                    }
                }
                return no ? no.call(expr, expr) : null;
            }
            else throw ex;
        }
    };

})();

function warn_unreachable(ast) {
    if (!empty(ast))
        warn("Dropping unreachable code: " + gen_code(ast, true));
};

function prepare_ifs(ast) {
    var w = ast_walker(), walk = w.walk;
    // In this first pass, we rewrite ifs which abort with no else with an
    // if-else.  For example:
    //
    // if (x) {
    //     blah();
    //     return y;
    // }
    // foobar();
    //
    // is rewritten into:
    //
    // if (x) {
    //     blah();
    //     return y;
    // } else {
    //     foobar();
    // }
    function redo_if(statements) {
        statements = MAP(statements, walk);

        for (var i = 0; i < statements.length; ++i) {
            var fi = statements[i];
            if (fi[0] != "if") continue;

            if (fi[3]) continue;

            var t = fi[2];
            if (!aborts(t)) continue;

            var conditional = walk(fi[1]);

            var e_body = redo_if(statements.slice(i + 1));
            var e = e_body.length == 1 ? e_body[0] : [ "block", e_body ];

            return statements.slice(0, i).concat([ [
                fi[0],          // "if"
                conditional,    // conditional
                t,              // then
                e               // else
            ] ]);
        }

        return statements;
    };

    function redo_if_lambda(name, args, body) {
        body = redo_if(body);
        return [ this[0], name, args, body ];
    };

    function redo_if_block(statements) {
        return [ this[0], statements != null ? redo_if(statements) : null ];
    };

    return w.with_walkers({
        "defun": redo_if_lambda,
        "function": redo_if_lambda,
        "block": redo_if_block,
        "splice": redo_if_block,
        "toplevel": function(statements) {
            return [ this[0], redo_if(statements) ];
        },
        "try": function(t, c, f) {
            return [
                this[0],
                redo_if(t),
                c != null ? [ c[0], redo_if(c[1]) ] : null,
                f != null ? redo_if(f) : null
            ];
        }
    }, function() {
        return walk(ast);
    });
};

function for_side_effects(ast, handler) {
    var w = ast_walker(), walk = w.walk;
    var $stop = {}, $restart = {};
    function stop() { throw $stop };
    function restart() { throw $restart };
    function found(){ return handler.call(this, this, w, stop, restart) };
    function unary(op) {
        if (op == "++" || op == "--")
            return found.apply(this, arguments);
    };
    function binary(op) {
        if (op == "&&" || op == "||")
            return found.apply(this, arguments);
    };
    return w.with_walkers({
        "try": found,
        "throw": found,
        "return": found,
        "new": found,
        "switch": found,
        "break": found,
        "continue": found,
        "assign": found,
        "call": found,
        "if": found,
        "for": found,
        "for-in": found,
        "while": found,
        "do": found,
        "return": found,
        "unary-prefix": unary,
        "unary-postfix": unary,
        "conditional": found,
        "binary": binary,
        "defun": found
    }, function(){
        while (true) try {
            walk(ast);
            break;
        } catch(ex) {
            if (ex === $stop) break;
            if (ex === $restart) continue;
            throw ex;
        }
    });
};

function ast_lift_variables(ast) {
    var w = ast_walker(), walk = w.walk, scope;
    function do_body(body, env) {
        var _scope = scope;
        scope = env;
        body = MAP(body, walk);
        var hash = {}, names = MAP(env.names, function(type, name){
            if (type != "var") return MAP.skip;
            if (!env.references(name)) return MAP.skip;
            hash[name] = true;
            return [ name ];
        });
        if (names.length > 0) {
            // looking for assignments to any of these variables.
            // we can save considerable space by moving the definitions
            // in the var declaration.
            for_side_effects([ "block", body ], function(ast, walker, stop, restart) {
                if (ast[0] == "assign"
                    && ast[1] === true
                    && ast[2][0] == "name"
                    && HOP(hash, ast[2][1])) {
                    // insert the definition into the var declaration
                    for (var i = names.length; --i >= 0;) {
                        if (names[i][0] == ast[2][1]) {
                            if (names[i][1]) // this name already defined, we must stop
                                stop();
                            names[i][1] = ast[3]; // definition
                            names.push(names.splice(i, 1)[0]);
                            break;
                        }
                    }
                    // remove this assignment from the AST.
                    var p = walker.parent();
                    if (p[0] == "seq") {
                        var a = p[2];
                        a.unshift(0, p.length);
                        p.splice.apply(p, a);
                    }
                    else if (p[0] == "stat") {
                        p.splice(0, p.length, "block"); // empty statement
                    }
                    else {
                        stop();
                    }
                    restart();
                }
                stop();
            });
            body.unshift([ "var", names ]);
        }
        scope = _scope;
        return body;
    };
    function _vardefs(defs) {
        var ret = null;
        for (var i = defs.length; --i >= 0;) {
            var d = defs[i];
            if (!d[1]) continue;
            d = [ "assign", true, [ "name", d[0] ], d[1] ];
            if (ret == null) ret = d;
            else ret = [ "seq", d, ret ];
        }
        if (ret == null && w.parent()[0] != "for") {
            if (w.parent()[0] == "for-in")
                return [ "name", defs[0][0] ];
            return MAP.skip;
        }
        return [ "stat", ret ];
    };
    function _toplevel(body) {
        return [ this[0], do_body(body, this.scope) ];
    };
    return w.with_walkers({
        "function": function(name, args, body){
            for (var i = args.length; --i >= 0 && !body.scope.references(args[i]);)
                args.pop();
            if (!body.scope.references(name)) name = null;
            return [ this[0], name, args, do_body(body, body.scope) ];
        },
        "defun": function(name, args, body){
            if (!scope.references(name)) return MAP.skip;
            for (var i = args.length; --i >= 0 && !body.scope.references(args[i]);)
                args.pop();
            return [ this[0], name, args, do_body(body, body.scope) ];
        },
        "var": _vardefs,
        "toplevel": _toplevel
    }, function(){
        return walk(ast_add_scope(ast));
    });
};

function ast_squeeze(ast, options) {
    ast = squeeze_1(ast, options);
    ast = squeeze_2(ast, options);
    return ast;
};

function squeeze_1(ast, options) {
    options = defaults(options, {
        make_seqs   : true,
        dead_code   : true,
        no_warnings : false,
        keep_comps  : true,
        unsafe      : false
    });

    var w = ast_walker(), walk = w.walk, scope;

    function negate(c) {
        var not_c = [ "unary-prefix", "!", c ];
        switch (c[0]) {
          case "unary-prefix":
            return c[1] == "!" && boolean_expr(c[2]) ? c[2] : not_c;
          case "seq":
            c = slice(c);
            c[c.length - 1] = negate(c[c.length - 1]);
            return c;
          case "conditional":
            return best_of(not_c, [ "conditional", c[1], negate(c[2]), negate(c[3]) ]);
          case "binary":
            var op = c[1], left = c[2], right = c[3];
            if (!options.keep_comps) switch (op) {
              case "<="  : return [ "binary", ">", left, right ];
              case "<"   : return [ "binary", ">=", left, right ];
              case ">="  : return [ "binary", "<", left, right ];
              case ">"   : return [ "binary", "<=", left, right ];
            }
            switch (op) {
              case "=="  : return [ "binary", "!=", left, right ];
              case "!="  : return [ "binary", "==", left, right ];
              case "===" : return [ "binary", "!==", left, right ];
              case "!==" : return [ "binary", "===", left, right ];
              case "&&"  : return best_of(not_c, [ "binary", "||", negate(left), negate(right) ]);
              case "||"  : return best_of(not_c, [ "binary", "&&", negate(left), negate(right) ]);
            }
            break;
        }
        return not_c;
    };

    function make_conditional(c, t, e) {
        var make_real_conditional = function() {
            if (c[0] == "unary-prefix" && c[1] == "!") {
                return e ? [ "conditional", c[2], e, t ] : [ "binary", "||", c[2], t ];
            } else {
                return e ? best_of(
                    [ "conditional", c, t, e ],
                    [ "conditional", negate(c), e, t ]
                ) : [ "binary", "&&", c, t ];
            }
        };
        // shortcut the conditional if the expression has a constant value
        return when_constant(c, function(ast, val){
            warn_unreachable(val ? e : t);
            return          (val ? t : e);
        }, make_real_conditional);
    };

    function rmblock(block) {
        if (block != null && block[0] == "block" && block[1]) {
            if (block[1].length == 1)
                block = block[1][0];
            else if (block[1].length == 0)
                block = [ "block" ];
        }
        return block;
    };

    function _lambda(name, args, body) {
        return [ this[0], name, args, tighten(body, "lambda") ];
    };

    // this function does a few things:
    // 1. discard useless blocks
    // 2. join consecutive var declarations
    // 3. remove obviously dead code
    // 4. transform consecutive statements using the comma operator
    // 5. if block_type == "lambda" and it detects constructs like if(foo) return ... - rewrite like if (!foo) { ... }
    function tighten(statements, block_type) {
        statements = MAP(statements, walk);

        statements = statements.reduce(function(a, stat){
            if (stat[0] == "block") {
                if (stat[1]) {
                    a.push.apply(a, stat[1]);
                }
            } else {
                a.push(stat);
            }
            return a;
        }, []);

        statements = (function(a, prev){
            statements.forEach(function(cur){
                if (prev && ((cur[0] == "var" && prev[0] == "var") ||
                             (cur[0] == "const" && prev[0] == "const"))) {
                    prev[1] = prev[1].concat(cur[1]);
                } else {
                    a.push(cur);
                    prev = cur;
                }
            });
            return a;
        })([]);

        if (options.dead_code) statements = (function(a, has_quit){
            statements.forEach(function(st){
                if (has_quit) {
                    if (st[0] == "function" || st[0] == "defun") {
                        a.push(st);
                    }
                    else if (st[0] == "var" || st[0] == "const") {
                        if (!options.no_warnings)
                            warn("Variables declared in unreachable code");
                        st[1] = MAP(st[1], function(def){
                            if (def[1] && !options.no_warnings)
                                warn_unreachable([ "assign", true, [ "name", def[0] ], def[1] ]);
                            return [ def[0] ];
                        });
                        a.push(st);
                    }
                    else if (!options.no_warnings)
                        warn_unreachable(st);
                }
                else {
                    a.push(st);
                    if (member(st[0], [ "return", "throw", "break", "continue" ]))
                        has_quit = true;
                }
            });
            return a;
        })([]);

        if (options.make_seqs) statements = (function(a, prev) {
            statements.forEach(function(cur){
                if (prev && prev[0] == "stat" && cur[0] == "stat") {
                    prev[1] = [ "seq", prev[1], cur[1] ];
                } else {
                    a.push(cur);
                    prev = cur;
                }
            });
            if (a.length >= 2
                && a[a.length-2][0] == "stat"
                && (a[a.length-1][0] == "return" || a[a.length-1][0] == "throw")
                && a[a.length-1][1])
            {
                a.splice(a.length - 2, 2,
                         [ a[a.length-1][0],
                           [ "seq", a[a.length-2][1], a[a.length-1][1] ]]);
            }
            return a;
        })([]);

        // this increases jQuery by 1K.  Probably not such a good idea after all..
        // part of this is done in prepare_ifs anyway.
        // if (block_type == "lambda") statements = (function(i, a, stat){
        //         while (i < statements.length) {
        //                 stat = statements[i++];
        //                 if (stat[0] == "if" && !stat[3]) {
        //                         if (stat[2][0] == "return" && stat[2][1] == null) {
        //                                 a.push(make_if(negate(stat[1]), [ "block", statements.slice(i) ]));
        //                                 break;
        //                         }
        //                         var last = last_stat(stat[2]);
        //                         if (last[0] == "return" && last[1] == null) {
        //                                 a.push(make_if(stat[1], [ "block", stat[2][1].slice(0, -1) ], [ "block", statements.slice(i) ]));
        //                                 break;
        //                         }
        //                 }
        //                 a.push(stat);
        //         }
        //         return a;
        // })(0, []);

        return statements;
    };

    function make_if(c, t, e) {
        return when_constant(c, function(ast, val){
            if (val) {
                t = walk(t);
                warn_unreachable(e);
                return t || [ "block" ];
            } else {
                e = walk(e);
                warn_unreachable(t);
                return e || [ "block" ];
            }
        }, function() {
            return make_real_if(c, t, e);
        });
    };

    function abort_else(c, t, e) {
        var ret = [ [ "if", negate(c), e ] ];
        if (t[0] == "block") {
            if (t[1]) ret = ret.concat(t[1]);
        } else {
            ret.push(t);
        }
        return walk([ "block", ret ]);
    };

    function make_real_if(c, t, e) {
        c = walk(c);
        t = walk(t);
        e = walk(e);

        if (empty(e) && empty(t))
            return [ "stat", c ];

        if (empty(t)) {
            c = negate(c);
            t = e;
            e = null;
        } else if (empty(e)) {
            e = null;
        } else {
            // if we have both else and then, maybe it makes sense to switch them?
            (function(){
                var a = gen_code(c);
                var n = negate(c);
                var b = gen_code(n);
                if (b.length < a.length) {
                    var tmp = t;
                    t = e;
                    e = tmp;
                    c = n;
                }
            })();
        }
        var ret = [ "if", c, t, e ];
        if (t[0] == "if" && empty(t[3]) && empty(e)) {
            ret = best_of(ret, walk([ "if", [ "binary", "&&", c, t[1] ], t[2] ]));
        }
        else if (t[0] == "stat") {
            if (e) {
                if (e[0] == "stat")
                    ret = best_of(ret, [ "stat", make_conditional(c, t[1], e[1]) ]);
                else if (aborts(e))
                    ret = abort_else(c, t, e);
            }
            else {
                ret = best_of(ret, [ "stat", make_conditional(c, t[1]) ]);
            }
        }
        else if (e && t[0] == e[0] && (t[0] == "return" || t[0] == "throw") && t[1] && e[1]) {
            ret = best_of(ret, [ t[0], make_conditional(c, t[1], e[1] ) ]);
        }
        else if (e && aborts(t)) {
            ret = [ [ "if", c, t ] ];
            if (e[0] == "block") {
                if (e[1]) ret = ret.concat(e[1]);
            }
            else {
                ret.push(e);
            }
            ret = walk([ "block", ret ]);
        }
        else if (t && aborts(e)) {
            ret = abort_else(c, t, e);
        }
        return ret;
    };

    function _do_while(cond, body) {
        return when_constant(cond, function(cond, val){
            if (!val) {
                warn_unreachable(body);
                return [ "block" ];
            } else {
                return [ "for", null, null, null, walk(body) ];
            }
        });
    };

    return w.with_walkers({
        "sub": function(expr, subscript) {
            if (subscript[0] == "string") {
                var name = subscript[1];
                if (is_identifier(name))
                    return [ "dot", walk(expr), name ];
                else if (/^[1-9][0-9]*$/.test(name) || name === "0")
                    return [ "sub", walk(expr), [ "num", parseInt(name, 10) ] ];
            }
        },
        "if": make_if,
        "toplevel": function(body) {
            return [ "toplevel", tighten(body) ];
        },
        "switch": function(expr, body) {
            var last = body.length - 1;
            return [ "switch", walk(expr), MAP(body, function(branch, i){
                var block = tighten(branch[1]);
                if (i == last && block.length > 0) {
                    var node = block[block.length - 1];
                    if (node[0] == "break" && !node[1])
                        block.pop();
                }
                return [ branch[0] ? walk(branch[0]) : null, block ];
            }) ];
        },
        "function": _lambda,
        "defun": _lambda,
        "block": function(body) {
            if (body) return rmblock([ "block", tighten(body) ]);
        },
        "binary": function(op, left, right) {
            return when_constant([ "binary", op, walk(left), walk(right) ], function yes(c){
                return best_of(walk(c), this);
            }, function no() {
                return function(){
                    if(op != "==" && op != "!=") return;
                    var l = walk(left), r = walk(right);
                    if(l && l[0] == "unary-prefix" && l[1] == "!" && l[2][0] == "num")
                        left = ['num', +!l[2][1]];
                    else if (r && r[0] == "unary-prefix" && r[1] == "!" && r[2][0] == "num")
                        right = ['num', +!r[2][1]];
                    return ["binary", op, left, right];
                }() || this;
            });
        },
        "conditional": function(c, t, e) {
            return make_conditional(walk(c), walk(t), walk(e));
        },
        "try": function(t, c, f) {
            return [
                "try",
                tighten(t),
                c != null ? [ c[0], tighten(c[1]) ] : null,
                f != null ? tighten(f) : null
            ];
        },
        "unary-prefix": function(op, expr) {
            expr = walk(expr);
            var ret = [ "unary-prefix", op, expr ];
            if (op == "!")
                ret = best_of(ret, negate(expr));
            return when_constant(ret, function(ast, val){
                return walk(ast); // it's either true or false, so minifies to !0 or !1
            }, function() { return ret });
        },
        "name": function(name) {
            switch (name) {
              case "true": return [ "unary-prefix", "!", [ "num", 0 ]];
              case "false": return [ "unary-prefix", "!", [ "num", 1 ]];
            }
        },
        "while": _do_while,
        "assign": function(op, lvalue, rvalue) {
            lvalue = walk(lvalue);
            rvalue = walk(rvalue);
            var okOps = [ '+', '-', '/', '*', '%', '>>', '<<', '>>>', '|', '^', '&' ];
            if (op === true && lvalue[0] === "name" && rvalue[0] === "binary" &&
                ~okOps.indexOf(rvalue[1]) && rvalue[2][0] === "name" &&
                rvalue[2][1] === lvalue[1]) {
                return [ this[0], rvalue[1], lvalue, rvalue[3] ]
            }
            return [ this[0], op, lvalue, rvalue ];
        },
        "call": function(expr, args) {
            expr = walk(expr);
            if (options.unsafe && expr[0] == "dot" && expr[1][0] == "string" && expr[2] == "toString") {
                return expr[1];
            }
            return [ this[0], expr,  MAP(args, walk) ];
        },
        "num": function (num) {
            if (!isFinite(num))
                return [ "binary", "/", num === 1 / 0
                         ? [ "num", 1 ] : num === -1 / 0
                         ? [ "unary-prefix", "-", [ "num", 1 ] ]
                         : [ "num", 0 ], [ "num", 0 ] ];

            return [ this[0], num ];
        }
    }, function() {
        return walk(prepare_ifs(walk(prepare_ifs(ast))));
    });
};

function squeeze_2(ast, options) {
    var w = ast_walker(), walk = w.walk, scope;
    function with_scope(s, cont) {
        var save = scope, ret;
        scope = s;
        ret = cont();
        scope = save;
        return ret;
    };
    function lambda(name, args, body) {
        return [ this[0], name, args, with_scope(body.scope, curry(MAP, body, walk)) ];
    };
    return w.with_walkers({
        "directive": function(dir) {
            if (scope.active_directive(dir))
                return [ "block" ];
            scope.directives.push(dir);
        },
        "toplevel": function(body) {
            return [ this[0], with_scope(this.scope, curry(MAP, body, walk)) ];
        },
        "function": lambda,
        "defun": lambda
    }, function(){
        return walk(ast_add_scope(ast));
    });
};

/* -----[ re-generate code from the AST ]----- */

var DOT_CALL_NO_PARENS = jsp.array_to_hash([
    "name",
    "array",
    "object",
    "string",
    "dot",
    "sub",
    "call",
    "regexp",
    "defun"
]);

function make_string(str, ascii_only) {
    var dq = 0, sq = 0;
    str = str.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(s){
        switch (s) {
          case "\\": return "\\\\";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\u2028": return "\\u2028";
          case "\u2029": return "\\u2029";
          case '"': ++dq; return '"';
          case "'": ++sq; return "'";
          case "\0": return "\\0";
        }
        return s;
    });
    if (ascii_only) str = to_ascii(str);
    if (dq > sq) return "'" + str.replace(/\x27/g, "\\'") + "'";
    else return '"' + str.replace(/\x22/g, '\\"') + '"';
};

function to_ascii(str) {
    return str.replace(/[\u0080-\uffff]/g, function(ch) {
        var code = ch.charCodeAt(0).toString(16);
        while (code.length < 4) code = "0" + code;
        return "\\u" + code;
    });
};

var SPLICE_NEEDS_BRACKETS = jsp.array_to_hash([ "if", "while", "do", "for", "for-in", "with" ]);

function gen_code(ast, options) {
    options = defaults(options, {
        indent_start : 0,
        indent_level : 4,
        quote_keys   : false,
        space_colon  : false,
        beautify     : false,
        ascii_only   : false,
        inline_script: false
    });
    var beautify = !!options.beautify;
    var indentation = 0,
    newline = beautify ? "\n" : "",
    space = beautify ? " " : "";

    function encode_string(str) {
        var ret = make_string(str, options.ascii_only);
        if (options.inline_script)
            ret = ret.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
        return ret;
    };

    function make_name(name) {
        name = name.toString();
        if (options.ascii_only)
            name = to_ascii(name);
        return name;
    };

    function indent(line) {
        if (line == null)
            line = "";
        if (beautify)
            line = repeat_string(" ", options.indent_start + indentation * options.indent_level) + line;
        return line;
    };

    function with_indent(cont, incr) {
        if (incr == null) incr = 1;
        indentation += incr;
        try { return cont.apply(null, slice(arguments, 1)); }
        finally { indentation -= incr; }
    };

    function last_char(str) {
        str = str.toString();
        return str.charAt(str.length - 1);
    };

    function first_char(str) {
        return str.toString().charAt(0);
    };

    function add_spaces(a) {
        if (beautify)
            return a.join(" ");
        var b = [];
        for (var i = 0; i < a.length; ++i) {
            var next = a[i + 1];
            b.push(a[i]);
            if (next &&
                ((is_identifier_char(last_char(a[i])) && (is_identifier_char(first_char(next))
                                                          || first_char(next) == "\\")) ||
                 (/[\+\-]$/.test(a[i].toString()) && /^[\+\-]/.test(next.toString()) ||
                 last_char(a[i]) == "/" && first_char(next) == "/"))) {
                b.push(" ");
            }
        }
        return b.join("");
    };

    function add_commas(a) {
        return a.join("," + space);
    };

    function parenthesize(expr) {
        var gen = make(expr);
        for (var i = 1; i < arguments.length; ++i) {
            var el = arguments[i];
            if ((el instanceof Function && el(expr)) || expr[0] == el)
                return "(" + gen + ")";
        }
        return gen;
    };

    function best_of(a) {
        if (a.length == 1) {
            return a[0];
        }
        if (a.length == 2) {
            var b = a[1];
            a = a[0];
            return a.length <= b.length ? a : b;
        }
        return best_of([ a[0], best_of(a.slice(1)) ]);
    };

    function needs_parens(expr) {
        if (expr[0] == "function" || expr[0] == "object") {
            // dot/call on a literal function requires the
            // function literal itself to be parenthesized
            // only if it's the first "thing" in a
            // statement.  This means that the parent is
            // "stat", but it could also be a "seq" and
            // we're the first in this "seq" and the
            // parent is "stat", and so on.  Messy stuff,
            // but it worths the trouble.
            var a = slice(w.stack()), self = a.pop(), p = a.pop();
            while (p) {
                if (p[0] == "stat") return true;
                if (((p[0] == "seq" || p[0] == "call" || p[0] == "dot" || p[0] == "sub" || p[0] == "conditional") && p[1] === self) ||
                    ((p[0] == "binary" || p[0] == "assign" || p[0] == "unary-postfix") && p[2] === self)) {
                    self = p;
                    p = a.pop();
                } else {
                    return false;
                }
            }
        }
        return !HOP(DOT_CALL_NO_PARENS, expr[0]);
    };

    function make_num(num) {
        var str = num.toString(10), a = [ str.replace(/^0\./, ".").replace('e+', 'e') ], m;
        if (Math.floor(num) === num) {
            if (num >= 0) {
                a.push("0x" + num.toString(16).toLowerCase(), // probably pointless
                       "0" + num.toString(8)); // same.
            } else {
                a.push("-0x" + (-num).toString(16).toLowerCase(), // probably pointless
                       "-0" + (-num).toString(8)); // same.
            }
            if ((m = /^(.*?)(0+)$/.exec(num))) {
                a.push(m[1] + "e" + m[2].length);
            }
        } else if ((m = /^0?\.(0+)(.*)$/.exec(num))) {
            a.push(m[2] + "e-" + (m[1].length + m[2].length),
                   str.substr(str.indexOf(".")));
        }
        return best_of(a);
    };

    var w = ast_walker();
    var make = w.walk;
    return w.with_walkers({
        "string": encode_string,
        "num": make_num,
        "name": make_name,
        "debugger": function(){ return "debugger;" },
        "toplevel": function(statements) {
            return make_block_statements(statements)
                .join(newline + newline);
        },
        "splice": function(statements) {
            var parent = w.parent();
            if (HOP(SPLICE_NEEDS_BRACKETS, parent)) {
                // we need block brackets in this case
                return make_block.apply(this, arguments);
            } else {
                return MAP(make_block_statements(statements, true),
                           function(line, i) {
                               // the first line is already indented
                               return i > 0 ? indent(line) : line;
                           }).join(newline);
            }
        },
        "block": make_block,
        "var": function(defs) {
            return "var " + add_commas(MAP(defs, make_1vardef)) + ";";
        },
        "const": function(defs) {
            return "const " + add_commas(MAP(defs, make_1vardef)) + ";";
        },
        "try": function(tr, ca, fi) {
            var out = [ "try", make_block(tr) ];
            if (ca) out.push("catch", "(" + ca[0] + ")", make_block(ca[1]));
            if (fi) out.push("finally", make_block(fi));
            return add_spaces(out);
        },
        "throw": function(expr) {
            return add_spaces([ "throw", make(expr) ]) + ";";
        },
        "new": function(ctor, args) {
            args = args.length > 0 ? "(" + add_commas(MAP(args, function(expr){
                return parenthesize(expr, "seq");
            })) + ")" : "";
            return add_spaces([ "new", parenthesize(ctor, "seq", "binary", "conditional", "assign", function(expr){
                var w = ast_walker(), has_call = {};
                try {
                    w.with_walkers({
                        "call": function() { throw has_call },
                        "function": function() { return this }
                    }, function(){
                        w.walk(expr);
                    });
                } catch(ex) {
                    if (ex === has_call)
                        return true;
                    throw ex;
                }
            }) + args ]);
        },
        "switch": function(expr, body) {
            return add_spaces([ "switch", "(" + make(expr) + ")", make_switch_block(body) ]);
        },
        "break": function(label) {
            var out = "break";
            if (label != null)
                out += " " + make_name(label);
            return out + ";";
        },
        "continue": function(label) {
            var out = "continue";
            if (label != null)
                out += " " + make_name(label);
            return out + ";";
        },
        "conditional": function(co, th, el) {
            return add_spaces([ parenthesize(co, "assign", "seq", "conditional"), "?",
                                parenthesize(th, "seq"), ":",
                                parenthesize(el, "seq") ]);
        },
        "assign": function(op, lvalue, rvalue) {
            if (op && op !== true) op += "=";
            else op = "=";
            return add_spaces([ make(lvalue), op, parenthesize(rvalue, "seq") ]);
        },
        "dot": function(expr) {
            var out = make(expr), i = 1;
            if (expr[0] == "num") {
                if (!/[a-f.]/i.test(out))
                    out += ".";
            } else if (expr[0] != "function" && needs_parens(expr))
                out = "(" + out + ")";
            while (i < arguments.length)
                out += "." + make_name(arguments[i++]);
            return out;
        },
        "call": function(func, args) {
            var f = make(func);
            if (f.charAt(0) != "(" && needs_parens(func))
                f = "(" + f + ")";
            return f + "(" + add_commas(MAP(args, function(expr){
                return parenthesize(expr, "seq");
            })) + ")";
        },
        "function": make_function,
        "defun": make_function,
        "if": function(co, th, el) {
            var out = [ "if", "(" + make(co) + ")", el ? make_then(th) : make(th) ];
            if (el) {
                out.push("else", make(el));
            }
            return add_spaces(out);
        },
        "for": function(init, cond, step, block) {
            var out = [ "for" ];
            init = (init != null ? make(init) : "").replace(/;*\s*$/, ";" + space);
            cond = (cond != null ? make(cond) : "").replace(/;*\s*$/, ";" + space);
            step = (step != null ? make(step) : "").replace(/;*\s*$/, "");
            var args = init + cond + step;
            if (args == "; ; ") args = ";;";
            out.push("(" + args + ")", make(block));
            return add_spaces(out);
        },
        "for-in": function(vvar, key, hash, block) {
            return add_spaces([ "for", "(" +
                                (vvar ? make(vvar).replace(/;+$/, "") : make(key)),
                                "in",
                                make(hash) + ")", make(block) ]);
        },
        "while": function(condition, block) {
            return add_spaces([ "while", "(" + make(condition) + ")", make(block) ]);
        },
        "do": function(condition, block) {
            return add_spaces([ "do", make(block), "while", "(" + make(condition) + ")" ]) + ";";
        },
        "return": function(expr) {
            var out = [ "return" ];
            if (expr != null) out.push(make(expr));
            return add_spaces(out) + ";";
        },
        "binary": function(operator, lvalue, rvalue) {
            var left = make(lvalue), right = make(rvalue);
            // XXX: I'm pretty sure other cases will bite here.
            //      we need to be smarter.
            //      adding parens all the time is the safest bet.
            if (member(lvalue[0], [ "assign", "conditional", "seq" ]) ||
                lvalue[0] == "binary" && PRECEDENCE[operator] > PRECEDENCE[lvalue[1]] ||
                lvalue[0] == "function" && needs_parens(this)) {
                left = "(" + left + ")";
            }
            if (member(rvalue[0], [ "assign", "conditional", "seq" ]) ||
                rvalue[0] == "binary" && PRECEDENCE[operator] >= PRECEDENCE[rvalue[1]] &&
                !(rvalue[1] == operator && member(operator, [ "&&", "||", "*" ]))) {
                right = "(" + right + ")";
            }
            else if (!beautify && options.inline_script && (operator == "<" || operator == "<<")
                     && rvalue[0] == "regexp" && /^script/i.test(rvalue[1])) {
                right = " " + right;
            }
            return add_spaces([ left, operator, right ]);
        },
        "unary-prefix": function(operator, expr) {
            var val = make(expr);
            if (!(expr[0] == "num" || (expr[0] == "unary-prefix" && !HOP(OPERATORS, operator + expr[1])) || !needs_parens(expr)))
                val = "(" + val + ")";
            return operator + (jsp.is_alphanumeric_char(operator.charAt(0)) ? " " : "") + val;
        },
        "unary-postfix": function(operator, expr) {
            var val = make(expr);
            if (!(expr[0] == "num" || (expr[0] == "unary-postfix" && !HOP(OPERATORS, operator + expr[1])) || !needs_parens(expr)))
                val = "(" + val + ")";
            return val + operator;
        },
        "sub": function(expr, subscript) {
            var hash = make(expr);
            if (needs_parens(expr))
                hash = "(" + hash + ")";
            return hash + "[" + make(subscript) + "]";
        },
        "object": function(props) {
            var obj_needs_parens = needs_parens(this);
            if (props.length == 0)
                return obj_needs_parens ? "({})" : "{}";
            var out = "{" + newline + with_indent(function(){
                return MAP(props, function(p){
                    if (p.length == 3) {
                        // getter/setter.  The name is in p[0], the arg.list in p[1][2], the
                        // body in p[1][3] and type ("get" / "set") in p[2].
                        return indent(make_function(p[0], p[1][2], p[1][3], p[2], true));
                    }
                    var key = p[0], val = parenthesize(p[1], "seq");
                    if (options.quote_keys) {
                        key = encode_string(key);
                    } else if ((typeof key == "number" || !beautify && +key + "" == key)
                               && parseFloat(key) >= 0) {
                        key = make_num(+key);
                    } else if (!is_identifier(key)) {
                        key = encode_string(key);
                    }
                    return indent(add_spaces(beautify && options.space_colon
                                             ? [ key, ":", val ]
                                             : [ key + ":", val ]));
                }).join("," + newline);
            }) + newline + indent("}");
            return obj_needs_parens ? "(" + out + ")" : out;
        },
        "regexp": function(rx, mods) {
            if (options.ascii_only) rx = to_ascii(rx);
            return "/" + rx + "/" + mods;
        },
        "array": function(elements) {
            if (elements.length == 0) return "[]";
            return add_spaces([ "[", add_commas(MAP(elements, function(el, i){
                if (!beautify && el[0] == "atom" && el[1] == "undefined") return i === elements.length - 1 ? "," : "";
                return parenthesize(el, "seq");
            })), "]" ]);
        },
        "stat": function(stmt) {
            return stmt != null
                ? make(stmt).replace(/;*\s*$/, ";")
                : ";";
        },
        "seq": function() {
            return add_commas(MAP(slice(arguments), make));
        },
        "label": function(name, block) {
            return add_spaces([ make_name(name), ":", make(block) ]);
        },
        "with": function(expr, block) {
            return add_spaces([ "with", "(" + make(expr) + ")", make(block) ]);
        },
        "atom": function(name) {
            return make_name(name);
        },
        "directive": function(dir) {
            return make_string(dir) + ";";
        }
    }, function(){ return make(ast) });

    // The squeezer replaces "block"-s that contain only a single
    // statement with the statement itself; technically, the AST
    // is correct, but this can create problems when we output an
    // IF having an ELSE clause where the THEN clause ends in an
    // IF *without* an ELSE block (then the outer ELSE would refer
    // to the inner IF).  This function checks for this case and
    // adds the block brackets if needed.
    function make_then(th) {
        if (th == null) return ";";
        if (th[0] == "do") {
            // https://github.com/mishoo/UglifyJS/issues/#issue/57
            // IE croaks with "syntax error" on code like this:
            //     if (foo) do ... while(cond); else ...
            // we need block brackets around do/while
            return make_block([ th ]);
        }
        var b = th;
        while (true) {
            var type = b[0];
            if (type == "if") {
                if (!b[3])
                    // no else, we must add the block
                    return make([ "block", [ th ]]);
                b = b[3];
            }
            else if (type == "while" || type == "do") b = b[2];
            else if (type == "for" || type == "for-in") b = b[4];
            else break;
        }
        return make(th);
    };

    function make_function(name, args, body, keyword, no_parens) {
        var out = keyword || "function";
        if (name) {
            out += " " + make_name(name);
        }
        out += "(" + add_commas(MAP(args, make_name)) + ")";
        out = add_spaces([ out, make_block(body) ]);
        return (!no_parens && needs_parens(this)) ? "(" + out + ")" : out;
    };

    function must_has_semicolon(node) {
        switch (node[0]) {
          case "with":
          case "while":
            return empty(node[2]) || must_has_semicolon(node[2]);
          case "for":
          case "for-in":
            return empty(node[4]) || must_has_semicolon(node[4]);
          case "if":
            if (empty(node[2]) && !node[3]) return true; // `if' with empty `then' and no `else'
            if (node[3]) {
                if (empty(node[3])) return true; // `else' present but empty
                return must_has_semicolon(node[3]); // dive into the `else' branch
            }
            return must_has_semicolon(node[2]); // dive into the `then' branch
          case "directive":
            return true;
        }
    };

    function make_block_statements(statements, noindent) {
        for (var a = [], last = statements.length - 1, i = 0; i <= last; ++i) {
            var stat = statements[i];
            var code = make(stat);
            if (code != ";") {
                if (!beautify && i == last && !must_has_semicolon(stat)) {
                    code = code.replace(/;+\s*$/, "");
                }
                a.push(code);
            }
        }
        return noindent ? a : MAP(a, indent);
    };

    function make_switch_block(body) {
        var n = body.length;
        if (n == 0) return "{}";
        return "{" + newline + MAP(body, function(branch, i){
            var has_body = branch[1].length > 0, code = with_indent(function(){
                return indent(branch[0]
                              ? add_spaces([ "case", make(branch[0]) + ":" ])
                              : "default:");
            }, 0.5) + (has_body ? newline + with_indent(function(){
                return make_block_statements(branch[1]).join(newline);
            }) : "");
            if (!beautify && has_body && i < n - 1)
                code += ";";
            return code;
        }).join(newline) + newline + indent("}");
    };

    function make_block(statements) {
        if (!statements) return ";";
        if (statements.length == 0) return "{}";
        return "{" + newline + with_indent(function(){
            return make_block_statements(statements).join(newline);
        }) + newline + indent("}");
    };

    function make_1vardef(def) {
        var name = def[0], val = def[1];
        if (val != null)
            name = add_spaces([ make_name(name), "=", parenthesize(val, "seq") ]);
        return name;
    };

};

function split_lines(code, max_line_length) {
    var splits = [ 0 ];
    jsp.parse(function(){
        var next_token = jsp.tokenizer(code);
        var last_split = 0;
        var prev_token;
        function current_length(tok) {
            return tok.pos - last_split;
        };
        function split_here(tok) {
            last_split = tok.pos;
            splits.push(last_split);
        };
        function custom(){
            var tok = next_token.apply(this, arguments);
            out: {
                if (prev_token) {
                    if (prev_token.type == "keyword") break out;
                }
                if (current_length(tok) > max_line_length) {
                    switch (tok.type) {
                      case "keyword":
                      case "atom":
                      case "name":
                      case "punc":
                        split_here(tok);
                        break out;
                    }
                }
            }
            prev_token = tok;
            return tok;
        };
        custom.context = function() {
            return next_token.context.apply(this, arguments);
        };
        return custom;
    }());
    return splits.map(function(pos, i){
        return code.substring(pos, splits[i + 1] || code.length);
    }).join("\n");
};

/* -----[ Utilities ]----- */

function repeat_string(str, i) {
    if (i <= 0) return "";
    if (i == 1) return str;
    var d = repeat_string(str, i >> 1);
    d += d;
    if (i & 1) d += str;
    return d;
};

function defaults(args, defs) {
    var ret = {};
    if (args === true)
        args = {};
    for (var i in defs) if (HOP(defs, i)) {
        ret[i] = (args && HOP(args, i)) ? args[i] : defs[i];
    }
    return ret;
};

function is_identifier(name) {
    return /^[a-z_$][a-z0-9_$]*$/i.test(name)
        && name != "this"
        && !HOP(jsp.KEYWORDS_ATOM, name)
        && !HOP(jsp.RESERVED_WORDS, name)
        && !HOP(jsp.KEYWORDS, name);
};

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

// some utilities

var MAP;

(function(){
    MAP = function(a, f, o) {
        var ret = [], top = [], i;
        function doit() {
            var val = f.call(o, a[i], i);
            if (val instanceof AtTop) {
                val = val.v;
                if (val instanceof Splice) {
                    top.push.apply(top, val.v);
                } else {
                    top.push(val);
                }
            }
            else if (val != skip) {
                if (val instanceof Splice) {
                    ret.push.apply(ret, val.v);
                } else {
                    ret.push(val);
                }
            }
        };
        if (a instanceof Array) for (i = 0; i < a.length; ++i) doit();
        else for (i in a) if (HOP(a, i)) doit();
        return top.concat(ret);
    };
    MAP.at_top = function(val) { return new AtTop(val) };
    MAP.splice = function(val) { return new Splice(val) };
    var skip = MAP.skip = {};
    function AtTop(val) { this.v = val };
    function Splice(val) { this.v = val };
})();

/* -----[ Exports ]----- */

exports.ast_walker = ast_walker;
exports.ast_mangle = ast_mangle;
exports.ast_squeeze = ast_squeeze;
exports.ast_lift_variables = ast_lift_variables;
exports.gen_code = gen_code;
exports.ast_add_scope = ast_add_scope;
exports.set_logger = function(logger) { warn = logger };
exports.make_string = make_string;
exports.split_lines = split_lines;
exports.MAP = MAP;

// keep this last!
exports.ast_squeeze_more = require("./squeeze-more").ast_squeeze_more;

// Local variables:
// js-indent-level: 4
// End:
