(function (tree) {

tree.Variable = function (name, index, file) { this.name = name, this.index = index, this.file = file };
tree.Variable.prototype = {
    eval: function (env) {
        var variable, v, name = this.name;

        if (name.indexOf('@@') == 0) {
            name = '@' + new(tree.Variable)(name.slice(1)).eval(env).value;
        }
        
        if (this.evaluating) {
            throw { type: 'Name',
                    message: "Recursive variable definition for " + name,
                    filename: this.file,
                    index: this.index };
        }
        
        this.evaluating = true;

        if (variable = tree.find(env.frames, function (frame) {
            if (v = frame.variable(name)) {
                return v.value.eval(env);
            }
        })) { 
            this.evaluating = false;
            return variable;
        }
        else {
            throw { type: 'Name',
                    message: "variable " + name + " is undefined",
                    filename: this.file,
                    index: this.index };
        }
    }
};

})(require('../tree'));
