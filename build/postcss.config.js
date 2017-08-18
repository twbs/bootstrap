module.exports = (ctx) => ({
  map: ctx.file.dirname.startsWith('docs') ? false : {
    inline: false,
    annotation: true,
    sourcesContent: true
  },
  plugins: {
    autoprefixer: {
      browsers: [
        //
        // Official browser support policy:
        // https://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
        //
        'Chrome >= 45', // Exact version number here is kinda arbitrary
        'Firefox ESR',
        // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
        // NOT the Edge app version shown in Edge's "About" screen.
        // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
        // See also https://github.com/Fyrd/caniuse/issues/1928
        'Edge >= 12',
        'Explorer >= 10',
        // Out of leniency, we prefix these 1 version further back than the official policy.
        'iOS >= 9',
        'Safari >= 9',
        // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
        'Android >= 4.4',
        'Opera >= 30'
      ]
    }
  }
})
