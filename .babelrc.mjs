export default {
  // `loose` opts class fields into set (assignment) semantics, which disagree
  // with tsconfig's `useDefineForClassFields` and with Rolldown/oxc. Force
  // define semantics so all three agree. No field is emitted today (every
  // instance field uses `declare`), so this only guards future fields.
  assumptions: {
    setPublicClassFields: false
  },
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
