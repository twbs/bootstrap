'use strict'

const banner = require('./banner.js')

const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

const sanitizeFileName = fileName => {
  const cleanName = fileName.replace('bootstrap', '').replace('-', '').replace('.css', '')
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
}

module.exports = context => {
  return {
    map: context.file.dirname.includes('examples') ? false : mapConfig,
    plugins: {
      'postcss-header': {
        header: context.file.basename.includes('bootstrap') && !context.file.basename.includes('rtl') ? banner(sanitizeFileName(context.file.basename)) : ''
      },
      autoprefixer: {
        cascade: false
      },
      rtlcss: context.env === 'RTL'
    }
  }
}
