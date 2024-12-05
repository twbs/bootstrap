module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,          // Enables a looser compilation for better performance
        bugfixes: true,       // Enables bug fixes for various JavaScript engines
        modules: false,       // Keep ES modules, so you can use tree-shaking in bundlers like Webpack
        targets: '> 0.25%, not dead', // Specifies target browsers
        useBuiltIns: 'usage', // Only include polyfills for the features you are using in your code
        corejs: 3             // Use the latest version of core-js for polyfilling
      }
    ],
    '@babel/preset-react',    // If you are using React, this is necessary
    '@babel/preset-typescript' // If you are using TypeScript, this should be included
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // Optimizes code for reuse across modules, reducing bundle size
    '@babel/plugin-proposal-class-properties', // For class properties support
    '@babel/plugin-proposal-private-methods', // For private methods in classes
    '@babel/plugin-proposal-private-methods' // Optional, for more advanced JavaScript features
  ]
};

