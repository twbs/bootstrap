import Prism, { type hooks, Token } from 'prismjs'

const prefixType = 'prefix'

let isPrismConfigured = false

export function configurePrism() {
  if (isPrismConfigured) {
    return
  }

  isPrismConfigured = true

  Prism.hooks.add('after-tokenize', prismPrefixPlugin)
}

// A plugin to add empty prefix tokens bebore each command line in code blocks.
function prismPrefixPlugin(env: hooks.HookEnvironmentMap['after-tokenize']) {
  if (env.language !== 'bash' && env.language !== 'sh' && env.language !== 'powershell') {
    return
  }

  // Add a prefix token at the beginning of the code block.
  env.tokens.unshift(new Token(prefixType, ''))

  for (let i = 0; i < env.tokens.length; i++) {
    const token = env.tokens[i]

    if (typeof token === 'string' && token.endsWith('\n')) {
      // Add a prefix token after each line break.
      env.tokens.splice(i + 1, 0, new Token(prefixType, ''))
      i++
    }
  }
}
