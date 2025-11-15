#!/usr/bin/env node

/**
 * Generate utilities metadata JSON from Sass
 * This script compiles a special Sass file that outputs utility information as CSS comments,
 * then extracts and saves it as JSON for documentation use.
 */

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Compile the metadata generator SCSS file
console.log('Compiling utilities metadata...')

try {
  execSync(
    'sass --style expanded --no-source-map build/generate-utilities-metadata.scss:dist/css/utilities-metadata.tmp.css',
    { cwd: rootDir, stdio: 'inherit' }
  )
} catch {
  console.error('Failed to compile metadata SCSS')
  process.exit(1)
}

// Read the compiled CSS
const cssPath = path.join(rootDir, 'dist/css/utilities-metadata.tmp.css')
const cssContent = readFileSync(cssPath, 'utf8')

// Extract JSON from the CSS comment
const startMarker = 'BOOTSTRAP-UTILITIES-METADATA-START'
const endMarker = 'BOOTSTRAP-UTILITIES-METADATA-END'

const startIndex = cssContent.indexOf(startMarker)
const endIndex = cssContent.indexOf(endMarker)

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find metadata markers in compiled CSS')
  process.exit(1)
}

// Extract JSON content between markers
const jsonContent = cssContent
  .slice(startIndex + startMarker.length, endIndex)
  .trim()

// Validate JSON
try {
  const parsed = JSON.parse(jsonContent)
  console.log(`✓ Extracted metadata for ${Object.keys(parsed.utilities).length} utilities`)

  // Write to JSON file
  const outputPath = path.join(rootDir, 'dist/css/bootstrap-utilities.metadata.json')
  writeFileSync(outputPath, JSON.stringify(parsed, null, 2))
  console.log(`✓ Wrote metadata to ${outputPath}`)

  // Clean up temporary CSS files
  try {
    unlinkSync(cssPath)
  } catch {
    // File may not exist
  }

  // Also clean up any other temporary variants that may have been created
  const tempFiles = [
    'dist/css/utilities-metadata.tmp.min.css',
    'dist/css/utilities-metadata.tmp.min.css.map'
  ]

  for (const file of tempFiles) {
    try {
      unlinkSync(path.join(rootDir, file))
    } catch {
      // File may not exist, ignore
    }
  }

  console.log('✓ Cleaned up temporary files')
} catch (error) {
  console.error('Failed to parse extracted JSON:', error.message)
  console.error('Extracted content:', jsonContent.slice(0, 500))
  process.exit(1)
}
