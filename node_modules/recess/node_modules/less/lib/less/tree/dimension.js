(function (tree) {

//
// A number with a unit
//
tree.Dimension = function (value, unit) {
    this.value = parseFloat(value);
    this.unit = unit || null;
};

tree.Dimension.prototype = {
    eval: function () { return this },
    toColor: function () {
        return new(tree.Color)([this.value, this.value, this.value]);
    },
    toCSS: function () {
        var css = this.value + this.unit;
        return css;
    },

    // In an operation between two Dimensions,
    // we default to the first Dimension's unit,
    // so `1px + 2em` will yield `3px`.
    // In the future, we could implement some unit
    // conversions such that `100cm + 10mm` would yield
    // `101cm`.
    operate: function (op, other) {
        return new(tree.Dimension)
                  (tree.operate(op, this.value, other.value),
                  this.unit || other.unit);
    },

    compare: function (other) {
        if (other instanceof tree.Dimension) {
            if (other.value > this.value) {
                return -1;
            } else if (other.value < this.value) {
                return 1;
            } else {
                if (other.unit && this.unit !== other.unit) {
                    return -1;
                }
                return 0;
            }
        } else {
            return -1;
        }
    }
};

})(require('../tree'));
