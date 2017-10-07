'use strict'

module.exports = (ctx) => ({
  map: ctx.file.dirname.startsWith('docs') || ctx.file.dirname.includes('examples') ? false : {
    inline: false,
    annotation: true,
    sourcesContent: true
  },
  plugins: {
    autoprefixer: {}
  }
})
