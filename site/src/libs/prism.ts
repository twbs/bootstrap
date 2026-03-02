import Prism, { type hooks } from 'prismjs'
const { Token } = Prism

let isPrismConfigured = false

export function configurePrism() {
  if (isPrismConfigured) {
    return
  }

  isPrismConfigured = true

  Prism.hooks.add('after-tokenize', lineWrapPlugin)
}

// A plugin to wrap each line in a .line span, except for comments and empty lines
function lineWrapPlugin(env: hooks.HookEnvironmentMap['after-tokenize']) {
  // Skip processing if the language isn't one we want to modify
  if (env.language !== 'bash' && env.language !== 'sh' && env.language !== 'powershell') {
    return
  }

  // First, split tokens into lines
  const lines: (string | Prism.Token)[][] = [[]]

  for (let i = 0; i < env.tokens.length; i++) {
    const token = env.tokens[i]

    if (typeof token === 'string') {
      // Split string tokens by newlines
      const parts = token.split('\n')

      for (let j = 0; j < parts.length; j++) {
        if (j > 0) {
          // Start a new line after each newline
          lines.push([])
        }

        if (parts[j]) {
          lines[lines.length - 1].push(parts[j])
        }
      }
    } else {
      lines[lines.length - 1].push(token)
    }
  }

  // Now rebuild tokens with the line structure
  env.tokens = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check if this is an empty line
    const isEmptyLine = line.length === 0 || (line.length === 1 && typeof line[0] === 'string' && line[0].trim() === '')

    // Check if this is a comment-only line
    const isCommentLine = line.every((token) => {
      if (typeof token === 'string') {
        return token.trim() === ''
      }
      return token.type === 'comment'
    })

    if (isEmptyLine || isCommentLine) {
      // For comment or empty lines, just add the tokens without a wrapper
      env.tokens.push(...line)

      // Add a newline after each line (except the last)
      if (i < lines.length - 1) {
        env.tokens.push('\n')
      }
    } else {
      // For normal lines, wrap with .line class
      const lineToken = new Token('span', '', ['line'])
      const lineChildren: (string | Prism.Token)[] = []

      // Add the line content
      lineChildren.push(...line)

      // For the last token in the line, append a newline
      if (i < lines.length - 1) {
        lineChildren.push('\n')
      }

      // Set line content
      lineToken.content = lineChildren

      // Add the entire structure to tokens
      env.tokens.push(lineToken)
    }
  }
}
