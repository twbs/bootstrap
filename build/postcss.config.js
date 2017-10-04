'use strict'

module.exports = (ctx) => ({
  map: ctx.file.dirname.startsWith('docs') ? false : {
    inline: false,
    annotation: true,
    sourcesContent: true
  },
  plugins: {
    autoprefixer: {}
  }
})
