
(function (tree) {

tree.Paren = function (node) {
    this.value = node;
};
tree.Paren.prototype = {
    toCSS: function (env) {
        return '(' + this.value.toCSS(env) + ')';
    },
    eval: function (env) {
        return new(tree.Paren)(this.value.eval(env));
    }
};

})(require('../tree'));
