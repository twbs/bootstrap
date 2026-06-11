import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties'
import autoprefixer from 'autoprefixer'

const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

// Strip vendor-prefixed declarations Autoprefixer emits that are dead weight for
// our `.browserslistrc` targets. Each is verified unprefixed-supported across every
// target, with the unprefixed declaration always emitted alongside; we drop them
// here because caniuse-lite still flags the feature so Autoprefixer can't be told
// to skip them via config.
//   - `-webkit-mask-*`: unprefixed since Safari 15.4 (keep `-webkit-mask-box-image`,
//     the `mask-border` translation, which genuinely still needs the prefix).
//   - `-moz-column-gap`: Firefox shipped unprefixed `column-gap` in Firefox 61.
//   - `-webkit-/-moz-transition`: transitions have been unprefixed everywhere for years
//     (only added here because the rule sits inside a `::-webkit-/-moz-` pseudo).
const removeRedundantPrefixes = {
  postcssPlugin: 'remove-redundant-prefixes',
  OnceExit(root) {
    root.walkDecls(decl => {
      const { prop } = decl
      if (
        (prop.startsWith('-webkit-mask') && !prop.startsWith('-webkit-mask-box-image')) ||
        prop === '-moz-column-gap' ||
        prop === '-webkit-transition' ||
        prop === '-moz-transition'
      ) {
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
