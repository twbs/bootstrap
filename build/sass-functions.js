'use strict'

// Export math.pow function for node-sass

const types = require('node-sass').types

module.exports = {
  pow : function (val, exp) {
    return types.Number(Math.pow(val.getValue(), exp.getValue()), val.getUnit())
  }
}
