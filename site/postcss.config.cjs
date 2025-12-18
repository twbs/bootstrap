module.exports = {
  plugins: [
    require('postcss-prefix-custom-properties')({
      prefix: 'bs-',
      ignore: [/^--bs-/, /^--bd-/]
    }),
    require('autoprefixer')
  ]
}
