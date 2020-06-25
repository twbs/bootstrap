module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        bugfixes: true,
        modules: false
      }
    ]
  ],
  env: {
    test: {
      plugins: [ 'istanbul' ]
    }
  }
};
