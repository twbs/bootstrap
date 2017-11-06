'use strict'

module.exports = (ctx) => {
  const cssnanoOptions = {
    preset: ['default']
  }

  return {
    map: ctx.file.dirname.includes('examples') ? false : {
      inline: false,
      annotation: true,
      sourcesContent: true
    },
    plugins: {
      autoprefixer: { cascade: false },
      cssnano: ctx.env === 'production' ? cssnanoOptions : false
    }
  }
}
