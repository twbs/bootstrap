import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties'
import autoprefixer from 'autoprefixer'

const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

// Drop the `-webkit-mask-*` prefixes Autoprefixer adds: `mask-*` is unprefixed in
// all our targets (Safari 15.4+), but caniuse-lite still flags the feature so it
// can't be disabled via config. Keep `-webkit-mask-box-image` (the `mask-border`
// translation), which does still need the prefix.
const removeRedundantMaskPrefixes = {
  postcssPlugin: 'remove-redundant-mask-prefixes',
  OnceExit(root) {
    root.walkDecls(/^-webkit-mask(?!-box-image)/, decl => decl.remove())
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
      removeRedundantMaskPrefixes
    ]
  }
}
