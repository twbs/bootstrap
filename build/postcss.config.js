'use strict'

module.exports = ctx => {
  return {
    map: ctx.file.dirname.includes('examples') ?
      false :
      {
        inline: false,
        annotation: true,
        sourcesContent: true
      },
    plugins: {
      autoprefixer: {
        cascade: false
      },
      rtlcss: ctx.env === 'RTL' ? {} : false
    }
  }
}
