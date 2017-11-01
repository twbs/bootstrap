module.exports = {
  presets: [
    [
      'env',
      {
        loose: true,
        modules: false,
        exclude: ['transform-es2015-typeof-symbol']
      }
    ]
  ],
  plugins: [
    process.env.ROLLUP && 'external-helpers',
    process.env.PLUGINS && 'transform-es2015-modules-strip'
  ].filter(Boolean)
};
