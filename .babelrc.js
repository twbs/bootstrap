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
    '@babel/proposal-object-rest-spread'
  ],
  env: {
    test: {
      plugins: [ 'istanbul' ]
    }
  }
};
