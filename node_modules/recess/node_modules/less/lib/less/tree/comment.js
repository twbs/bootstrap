(function (tree) {

tree.Comment = function (value, silent) {
    this.value = value;
    this.silent = !!silent;
};
tree.Comment.prototype = {
    toCSS: function (env) {
        return env.compress ? '' : this.value;
    },
    eval: function () { return this }
};

})(require('../tree'));
