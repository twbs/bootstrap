const path  = require('path')
const pkg   = require(path.resolve(__dirname, '../package.json'))
const year  = new Date().getFullYear()

module.exports = function () {
  return `/*!
  * Bootstrap v${pkg.version} (${pkg.homepage})
  * Copyright 2011-${year} ${pkg.author}
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */`
}
