import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties'
import autoprefixer from 'autoprefixer'

const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

export default context => {
  return {
    map: context.file.dirname.includes('examples') ? false : mapConfig,
    plugins: [
      postcssPrefixCustomProperties({
        prefix: 'bs-',
        ignore: [/^--bs-/, /^--bd-/]
      }),
      autoprefixer({ cascade: false })
    ]
  }
}
