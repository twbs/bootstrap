/**
 * prettier-plugin-bootstrap
 *
 * A Prettier plugin that automatically sorts Bootstrap CSS classes
 * following the framework's recommended order.
 *
 * Works with HTML, JSX/TSX, Vue, Angular, and Astro templates.
 *
 * Usage:
 *   // .prettierrc
 *   {
 *     "plugins": ["prettier-plugin-bootstrap"]
 *   }
 *
 * Options:
 *   - bootstrapAttributes: additional HTML attributes to sort (default: [])
 *   - bootstrapFunctions: function calls whose arguments contain class
 *     lists to sort, e.g. ["clsx", "classNames"] (default: [])
 */

import { sortClasses } from './class-order.mjs'

// ── Shared helpers ────────────────────────────────────────────

/**
 * Sort the space-separated class names inside a string value.
 * Returns the string with classes re-ordered.
 */
function sortClassString(value) {
  if (!value || typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return value
  }

  const classes = trimmed.split(/\s+/)
  if (classes.length <= 1) {
    return value
  }

  const sorted = sortClasses(classes)

  // Preserve leading/trailing whitespace from the original value
  const leadingWs = value.match(/^\s*/)[0]
  const trailingWs = value.match(/\s*$/)[0]

  return `${leadingWs}${sorted.join(' ')}${trailingWs}`
}

// The default attributes whose values contain class lists
const DEFAULT_ATTRIBUTES = ['class', 'className']

// ── AST traversal ─────────────────────────────────────────────

/**
 * Recursively walk an AST node and its children, calling `visitor`
 * on every node.
 */
function walk(node, visitor) {
  if (!node) return
  visitor(node)

  // Prettier HTML AST children
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, visitor)
    }
  }

  // JSX AST children
  if (Array.isArray(node.body)) {
    for (const child of node.body) {
      walk(child, visitor)
    }
  }

  // Handle various AST node structures
  for (const key of ['expression', 'left', 'right', 'argument', 'callee',
    'object', 'property', 'consequent', 'alternate', 'init', 'test',
    'update', 'declaration', 'declarations', 'openingElement',
    'closingElement', 'attributes', 'value', 'elements', 'properties',
    'arguments']) {
    const child = node[key]
    if (child) {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object') {
            walk(item, visitor)
          }
        }
      } else if (typeof child === 'object') {
        walk(child, visitor)
      }
    }
  }
}

/**
 * Process an HTML-like AST (from Prettier's html, vue, or angular parser).
 * Looks for attributes whose name matches `targetAttrs` and sorts
 * their values.
 */
function processHtmlAst(ast, targetAttrs) {
  walk(ast, (node) => {
    // Prettier HTML AST: node.type === "element", node.attrs is an array
    if (node.attrs && Array.isArray(node.attrs)) {
      for (const attr of node.attrs) {
        if (targetAttrs.includes(attr.name) && typeof attr.value === 'string') {
          attr.value = sortClassString(attr.value)
        }
      }
    }

    // Alternative structure: node.attributes
    if (node.attributes && Array.isArray(node.attributes)) {
      for (const attr of node.attributes) {
        const name = attr.name || (attr.key && attr.key.value)
        if (targetAttrs.includes(name) && attr.value) {
          if (typeof attr.value === 'string') {
            attr.value = sortClassString(attr.value)
          } else if (attr.value && typeof attr.value.value === 'string') {
            attr.value.value = sortClassString(attr.value.value)
          }
        }
      }
    }
  })

  return ast
}

/**
 * Process a JSX/TSX AST. Looks for JSXAttribute nodes with
 * class-related names and sorts their string literal values.
 */
function processJsxAst(ast, targetAttrs) {
  walk(ast, (node) => {
    // JSXAttribute with a StringLiteral value
    if (node.type === 'JSXAttribute' || node.type === 'JSXSpreadAttribute') {
      const name = node.name && (node.name.name || node.name.value)
      if (targetAttrs.includes(name) && node.value) {
        if (node.value.type === 'StringLiteral' || node.value.type === 'Literal') {
          node.value.value = sortClassString(node.value.value)
          if (node.value.raw) {
            const quote = node.value.raw[0]
            node.value.raw = `${quote}${node.value.value}${quote}`
          }
        }
      }
    }
  })

  return ast
}

// ── Plugin options ────────────────────────────────────────────

export const options = {
  bootstrapAttributes: {
    type: 'string',
    array: true,
    default: [{ value: [] }],
    category: 'Bootstrap',
    description: 'Additional HTML attributes containing Bootstrap class lists to sort.'
  },
  bootstrapFunctions: {
    type: 'string',
    array: true,
    default: [{ value: [] }],
    category: 'Bootstrap',
    description: 'Function names whose arguments are Bootstrap class lists (e.g. clsx, classNames).'
  }
}

// ── Parser wrappers ───────────────────────────────────────────

/**
 * Create a parser wrapper that sorts Bootstrap classes in the AST
 * after the original parser runs.
 */
function createParserWrapper(parserName, processAst) {
  return {
    astFormat: parserName === 'html' || parserName === 'vue' || parserName === 'angular' ? 'html' : undefined,
    async parse(text, options) {
      // Resolve the original parser — may come from Prettier's built-in
      // parsers or another plugin
      const originalParser = options.plugins
        .flatMap((plugin) => {
          if (plugin.parsers && plugin.parsers[parserName]) {
            return [plugin.parsers[parserName]]
          }
          return []
        })
        .find((parser) => parser !== createParserWrapper)

      if (!originalParser) {
        throw new Error(
          `prettier-plugin-bootstrap: could not find the "${parserName}" parser. ` +
          'Make sure Prettier and the relevant parser plugin are installed.'
        )
      }

      const ast = await originalParser.parse(text, options)

      const targetAttrs = [
        ...DEFAULT_ATTRIBUTES,
        ...(options.bootstrapAttributes || [])
      ]

      return processAst(ast, targetAttrs, options)
    }
  }
}

// ── Exported parsers ──────────────────────────────────────────

export const parsers = {
  html: createParserWrapper('html', processHtmlAst),
  vue: createParserWrapper('vue', processHtmlAst),
  angular: createParserWrapper('angular', processHtmlAst),
  babel: createParserWrapper('babel', processJsxAst),
  'babel-ts': createParserWrapper('babel-ts', processJsxAst),
  typescript: createParserWrapper('typescript', processJsxAst),
  acorn: createParserWrapper('acorn', processJsxAst),
  meriyah: createParserWrapper('meriyah', processJsxAst),
  astro: createParserWrapper('astro', processHtmlAst)
}
