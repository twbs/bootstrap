'use strict'

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
      rtlcss: context.env === 'RTL'
    }
  }
}
