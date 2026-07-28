import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties'
import autoprefixer from 'autoprefixer'

const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

// Autoprefixer prefixes `transition` inside `::-webkit-slider-thumb` and
// `::-moz-range-thumb` rules because the selector itself is prefixed, not because
// any target needs it. Transitions have been unprefixed everywhere for years, and
// the unprefixed declaration is always emitted alongside, so drop the prefixed one.
const removeRedundantPrefixes = {
  postcssPlugin: 'remove-redundant-prefixes',
  OnceExit(root) {
    root.walkDecls(decl => {
      if (decl.prop === '-webkit-transition' || decl.prop === '-moz-transition') {
        decl.remove()
      }
    })
  }
}

export default context => {
  return {
    map: context.file.dirname.includes('examples') ? false : mapConfig,
    plugins: [
      postcssPrefixCustomProperties({
        prefix: 'bs-',
        ignore: [/^--bs-/, /^--bd-/]
      }),
      autoprefixer({ cascade: false }),
      removeRedundantPrefixes
    ]
  }
}
