(function (tree) {

tree.Ratio = function (value) {
    this.value = value;
};
tree.Ratio.prototype = {
    toCSS: function (env) {
        return this.value;
    },
    eval: function () { return this }
};

})(require('../tree'));
