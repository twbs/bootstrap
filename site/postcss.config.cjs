module.exports = {
  plugins: [
    require('postcss-prefix-custom-properties')({
      prefix: 'bs-',
      ignore: [/^--bs-/, /^--bd-/, /^--shell-/, /^--shiki-/]
    }),
    require('autoprefixer')
  ]
}
