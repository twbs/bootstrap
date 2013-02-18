(function (tree) {

tree.mixin = {};
tree.mixin.Call = function (elements, args, index, filename, important) {
    this.selector = new(tree.Selector)(elements);
    this.arguments = args;
    this.index = index;
    this.filename = filename;
    this.important = important;
};
tree.mixin.Call.prototype = {
    eval: function (env) {
        var mixins, mixin, args, rules = [], match = false, i, m, f, isRecursive, isOneFound;

        args = this.arguments && this.arguments.map(function (a) {
            return { name: a.name, value: a.value.eval(env) };
        });

        for (i = 0; i < env.frames.length; i++) {
            if ((mixins = env.frames[i].find(this.selector)).length > 0) {
                isOneFound = true;
                for (m = 0; m < mixins.length; m++) {
                    mixin = mixins[m];
                    isRecursive = false;
                    for(f = 0; f < env.frames.length; f++) {
                        if ((!(mixin instanceof tree.mixin.Definition)) && mixin === (env.frames[f].originalRuleset || env.frames[f])) {
                            isRecursive = true;
                            break;
                        }
                    }
                    if (isRecursive) {
                        continue;
                    }
                    if (mixin.matchArgs(args, env)) {
                        if (!mixin.matchCondition || mixin.matchCondition(args, env)) {
                            try {
                                Array.prototype.push.apply(
                                      rules, mixin.eval(env, args, this.important).rules);
                            } catch (e) {
                                throw { message: e.message, index: this.index, filename: this.filename, stack: e.stack };
                            }
                        }
                        match = true;
                    }
                }
                if (match) {
                    return rules;
                }
            }
        }
        if (isOneFound) {
            throw { type:    'Runtime',
                    message: 'No matching definition was found for `' +
                              this.selector.toCSS().trim() + '('      +
                              (args ? args.map(function (a) {
                                  var argValue = "";
                                  if (a.name) {
                                      argValue += a.name + ":";
                                  }
                                  if (a.value.toCSS) {
                                      argValue += a.value.toCSS();
                                  } else {
                                      argValue += "???";
                                  }
                                  return argValue;
                              }).join(', ') : "") + ")`",
                    index:   this.index, filename: this.filename };
        } else {
            throw { type: 'Name',
                message: this.selector.toCSS().trim() + " is undefined",
                index: this.index, filename: this.filename };
        }
    }
};

tree.mixin.Definition = function (name, params, rules, condition, variadic) {
    this.name = name;
    this.selectors = [new(tree.Selector)([new(tree.Element)(null, name)])];
    this.params = params;
    this.condition = condition;
    this.variadic = variadic;
    this.arity = params.length;
    this.rules = rules;
    this._lookups = {};
    this.required = params.reduce(function (count, p) {
        if (!p.name || (p.name && !p.value)) { return count + 1 }
        else                                 { return count }
    }, 0);
    this.parent = tree.Ruleset.prototype;
    this.frames = [];
};
tree.mixin.Definition.prototype = {
    toCSS:     function ()     { return "" },
    variable:  function (name) { return this.parent.variable.call(this, name) },
    variables: function ()     { return this.parent.variables.call(this) },
    find:      function ()     { return this.parent.find.apply(this, arguments) },
    rulesets:  function ()     { return this.parent.rulesets.apply(this) },

    evalParams: function (env, mixinEnv, args, evaldArguments) {
        var frame = new(tree.Ruleset)(null, []), varargs, arg, params = this.params.slice(0), i, j, val, name, isNamedFound, argIndex;
        
        if (args) {
            args = args.slice(0);

            for(i = 0; i < args.length; i++) {
                arg = args[i];
                if (name = (arg && arg.name)) {
                    isNamedFound = false;
                    for(j = 0; j < params.length; j++) {
                        if (!evaldArguments[j] && name === params[j].name) {
                            evaldArguments[j] = arg.value.eval(env);
                            frame.rules.unshift(new(tree.Rule)(name, arg.value.eval(env)));
                            isNamedFound = true;
                            break;
                        }
                    }
                    if (isNamedFound) {
                        args.splice(i, 1);
                        i--;
                        continue;
                    } else {
                        throw { type: 'Runtime', message: "Named argument for " + this.name +
                            ' ' + args[i].name + ' not found' };
                    }
                }
            }
        }
        argIndex = 0;
        for (i = 0; i < params.length; i++) {
            if (evaldArguments[i]) continue;
            
            arg = args && args[argIndex];

            if (name = params[i].name) {
                if (params[i].variadic && args) {
                    varargs = [];
                    for (j = argIndex; j < args.length; j++) {
                        varargs.push(args[j].value.eval(env));
                    }
                    frame.rules.unshift(new(tree.Rule)(name, new(tree.Expression)(varargs).eval(env)));
                } else {
                    val = arg && arg.value;
                    if (val) {
                        val = val.eval(env);
                    } else if (params[i].value) {
                        val = params[i].value.eval(mixinEnv);
                    } else {
                        throw { type: 'Runtime', message: "wrong number of arguments for " + this.name +
                            ' (' + args.length + ' for ' + this.arity + ')' };
                    }
                    
                    frame.rules.unshift(new(tree.Rule)(name, val));
                    evaldArguments[i] = val;
                }
            }
            
            if (params[i].variadic && args) {
                for (j = argIndex; j < args.length; j++) {
                    evaldArguments[j] = args[j].value.eval(env);
                }
            }
            argIndex++;
        }

        return frame;
    },
    eval: function (env, args, important) {
        var _arguments = [],
            mixinFrames = this.frames.concat(env.frames),
            frame = this.evalParams(env, {frames: mixinFrames}, args, _arguments), 
            context, rules, start, ruleset;

        frame.rules.unshift(new(tree.Rule)('@arguments', new(tree.Expression)(_arguments).eval(env)));

        rules = important ?
            this.parent.makeImportant.apply(this).rules : this.rules.slice(0);

        ruleset = new(tree.Ruleset)(null, rules).eval({
            frames: [this, frame].concat(mixinFrames)
        });
        ruleset.originalRuleset = this;
        return ruleset;
    },
    matchCondition: function (args, env) {
        if (this.condition && !this.condition.eval({
            frames: [this.evalParams(env, {frames: this.frames.concat(env.frames)}, args, [])].concat(env.frames)
        }))                                                           { return false }
        return true;
    },
    matchArgs: function (args, env) {
        var argsLength = (args && args.length) || 0, len, frame;

        if (! this.variadic) {
            if (argsLength < this.required)                               { return false }
            if (argsLength > this.params.length)                          { return false }
            if ((this.required > 0) && (argsLength > this.params.length)) { return false }
        }

        len = Math.min(argsLength, this.arity);

        for (var i = 0; i < len; i++) {
            if (!this.params[i].name && !this.params[i].variadic) {
                if (args[i].value.eval(env).toCSS() != this.params[i].value.eval(env).toCSS()) {
                    return false;
                }
            }
        }
        return true;
    }
};

})(require('../tree'));
