#!/usr/bin/env node

/*!
 * Script to run html-validate for HTML validation.
 *
 * This replaces the Java-based vnu-jar validator with a faster, Node.js-only solution.
 * Benefits:
 * - No Java dependency required
 * - Faster execution (no JVM startup time)
 * - Easy to configure with rule-based system
 * - Better integration with Node.js build tools
 *
 * Copyright 2017-2025 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import { HtmlValidate } from 'html-validate'
import { globby } from 'globby'

const htmlValidate = new HtmlValidate({
  rules: {
    // Allow autocomplete on buttons (Bootstrap specific)
    'attribute-allowed-values': 'off',
    // Allow aria-disabled on links (Bootstrap specific)
    'aria-label-misuse': 'off',
    // Allow modern CSS syntax
    'valid-id': 'off',
    // Allow void elements with trailing slashes (Astro)
    'void-style': 'off',
    // Allow custom attributes
    'no-unknown-elements': 'off',
    'attribute-boolean-style': 'off',
    'no-inline-style': 'off'
  },
  elements: [
    'html5',
    {
      // Allow custom attributes for Astro/framework compatibility
      '*': {
        attributes: {
          'is:raw': { boolean: true },
          'switch': { boolean: true },
          'autocomplete': { enum: ['on', 'off', 'new-password', 'current-password'] }
        }
      }
    }
  ]
})

async function validateHTML() {
  try {
    console.log('Running html-validate validation...')

    // Find all HTML files
    const files = await globby([
      '_site/**/*.html',
      'js/tests/**/*.html'
    ], {
      ignore: ['**/node_modules/**']
    })

    console.log(`Validating ${files.length} HTML files...`)

    let hasErrors = false

    for (const file of files) {
      const report = await htmlValidate.validateFile(file)

      if (!report.valid) {
        hasErrors = true
        console.error(`\nErrors in ${file}:`)

        for (const result of report.results) {
          for (const message of result.messages) {
            if (message.severity === 'error') {
              console.error(`  Line ${message.line}:${message.column} - ${message.message}`)
            }
          }
        }
      }
    }

    if (hasErrors) {
      console.error('\nHTML validation failed!')
      process.exit(1)
    } else {
      console.log('✓ All HTML files are valid!')
    }

  } catch (error) {
    console.error('HTML validation error:', error)
    process.exit(1)
  }
}

validateHTML()
