module.exports = {
  "presets": [
    [
      "env",
      {
        "loose": true,
        "modules": false
      }
    ]
  ],
  plugins: [
    process.env.ROLLUP && 'external-helpers',
    process.env.PLUGINS && 'transform-es2015-modules-strip',
  ].filter(Boolean)
};
