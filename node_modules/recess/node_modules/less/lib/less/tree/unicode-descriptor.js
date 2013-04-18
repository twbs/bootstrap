(function (tree) {

tree.UnicodeDescriptor = function (value) {
    this.value = value;
};
tree.UnicodeDescriptor.prototype = {
    toCSS: function (env) {
        return this.value;
    },
    eval: function () { return this }
};

})(require('../tree'));
