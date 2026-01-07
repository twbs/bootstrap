#!/usr/bin/env node

/**
 * CSS minification script using lightningcss
 *
 * This replaces clean-css which doesn't support modern CSS features
 * like light-dark(), color-mix(), @layer, etc.
 */

import fs from 'node:fs'
import path from 'node:path'
import { transform, browserslistToTargets } from 'lightningcss'

const distDir = path.join(process.cwd(), 'dist/css')

// Get all CSS files that need minification
const cssFiles = fs.readdirSync(distDir)
  .filter(file => file.endsWith('.css') && !file.endsWith('.min.css'))

// Target browsers (matching Bootstrap's browser support)
const targets = browserslistToTargets(['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead'])

for (const file of cssFiles) {
  const inputPath = path.join(distDir, file)
  const outputPath = path.join(distDir, file.replace('.css', '.min.css'))
  const mapPath = `${outputPath}.map`

  console.log(`Minifying ${file}...`)

  const inputCss = fs.readFileSync(inputPath, 'utf8')
  const inputMap = fs.existsSync(`${inputPath}.map`) ?
    JSON.parse(fs.readFileSync(`${inputPath}.map`, 'utf8')) :
    undefined

  try {
    const result = transform({
      filename: file,
      code: Buffer.from(inputCss),
      minify: true,
      sourceMap: true,
      inputSourceMap: inputMap ? JSON.stringify(inputMap) : undefined,
      targets
    })

    // Write minified CSS with source map reference
    const minifiedCss = `${result.code.toString()}\n/*# sourceMappingURL=${path.basename(mapPath)} */`
    fs.writeFileSync(outputPath, minifiedCss)

    // Write source map
    if (result.map) {
      fs.writeFileSync(mapPath, result.map.toString())
    }

    console.log(`  ✓ ${file} → ${path.basename(outputPath)}`)
  } catch (error) {
    console.error(`  ✗ Error minifying ${file}:`, error.message)
    process.exit(1)
  }
}

console.log('\nCSS minification complete!')
