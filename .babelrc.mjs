export default {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        bugfixes: true,
        modules: false
      }
    ],
    [
      '@babel/preset-typescript',
      {
        // `declare` fields carry types for constructor-assigned properties
        // without emitting runtime field definitions
        allowDeclareFields: true
      }
    ]
  ]
}
