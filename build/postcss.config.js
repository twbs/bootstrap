'use strict'

const cssnanoOpts = {
  preset: [
    'default', {
      mergeRules: false,
      svgo: false
    }
  ]
}

module.exports = ctx => ({
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
    cssnano: ctx.env === 'production' ? cssnanoOpts : false
  }
})
