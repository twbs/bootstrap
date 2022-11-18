'use strict'

const pkg = require('../package.json')
const year = new Date().getFullYear()

const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

module.exports = context => {
  return {
    map: context.file.dirname.includes('examples') ? false : mapConfig,
    plugins: {
      autoprefixer: {
        cascade: false
      },
      rtlcss: context.env === 'RTL',
      'postcss-banner': {
        important: true,
        banner: context.file.basename.includes('bootstrap') ?
          `${pkg.name} ${context.file.basename.split('-').length > 1 ? `${context.file.basename.split('-')[1].split('.')[0]} ` : ''}v${pkg.version} (${pkg.homepage})
Copyright 2011-${year} ${pkg.author}
Copyright 2011-${year} ${pkg.contributors[0]}
Licensed under ${pkg.license} (https://github.com/twbs/bootstrap/blob/main/LICENSE)` :
          ''
      }
    }
  }
}
