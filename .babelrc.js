module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
        exclude: ['transform-typeof-symbol']
      }
    ]
  ],
  plugins: [
    process.env.PLUGINS && 'transform-es2015-modules-strip',
    '@babel/proposal-object-rest-spread'
  ].filter(Boolean),
  env: {
    test: {
      plugins: [ 'istanbul' ]
    }
  }
};
