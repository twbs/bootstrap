(function (tree) {

tree.Value = function (value) {
    this.value = value;
    this.is = 'value';
};
tree.Value.prototype = {
    eval: function (env) {
        if (this.value.length === 1) {
            return this.value[0].eval(env);
        } else {
            return new(tree.Value)(this.value.map(function (v) {
                return v.eval(env);
            }));
        }
    },
    toCSS: function (env) {
        return this.value.map(function (e) {
            return e.toCSS(env);
        }).join(env.compress ? ',' : ', ');
    }
};

})(require('../tree'));
