#!/usr/bin/env node

import { execSync } from 'node:child_process'
import fs from 'node:fs'

const configPath = '.bundlewatch.config.json'

let stdout
try {
  stdout = execSync('npx bundlewatch --config .bundlewatch.config.json', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  })
} catch (error) {
  stdout = error.stdout || ''
}

const failLines = stdout.split('\n').filter(l => l.startsWith('FAIL'))

if (failLines.length === 0) {
  console.log('All files are within their bundlewatch limits. Nothing to fix.')
  process.exit(0)
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

const parseSize = str => Number.parseFloat(str.replace('KB', ''))
const ceilToQuarter = n => Math.ceil(n / 0.25) * 0.25
const formatSize = n => {
  const frac = n % 1
  const decimals = (frac === 0 || frac === 0.5) ? 1 : 2
  return `${n.toFixed(decimals)} kB`
}

for (const line of failLines) {
  const match = line.match(/(FAIL)\s+(.+?):\s+([\d.]+KB)\s+([<>])\s+([\d.]+KB)/)
  if (!match) {
    continue
  }

  const file = match[2]
  const currentSize = parseSize(match[3])
  const oldMax = formatSize(parseSize(match[5]))
  const newMax = ceilToQuarter(currentSize)
  const newMaxStr = formatSize(newMax)

  const entry = config.files.find(f => f.path === `./${file}` || f.path === file)
  if (entry) {
    entry.maxSize = newMaxStr
    console.log(`Updated ${file}: ${oldMax} -> ${newMaxStr}`)
  }
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')
console.log(`\nUpdated ${configPath}`)
