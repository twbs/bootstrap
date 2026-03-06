#!/usr/bin/env node

/*!
 * Script to detect unused SCSS @use statements.
 *
 * Copyright 2017-2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'

const DISABLE_FILE = 'check-unused-imports-disable'
const DISABLE_NEXT_LINE = 'check-unused-imports-disable-next-line'
const DISABLE_LINE = 'check-unused-imports-disable-line'

function findScssFiles(dirs) {
  const files = []
  for (const dir of dirs) {
    const resolvedDir = path.resolve(dir)
    if (!existsSync(resolvedDir)) {
      throw new Error(`Directory does not exist: ${dir}`)
    }

    walk(resolvedDir, files)
  }

  return files.sort()
}

function walk(dir, results) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, results)
    } else if (entry.name.endsWith('.scss')) {
      results.push(full)
    }
  }
}

function parseUseStatements(content) {
  const lines = content.split('\n')
  const uses = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('//')) {
      if (trimmed.includes(DISABLE_FILE)) {
        return []
      }

      continue
    }

    break
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (!trimmed.startsWith('@use ')) {
      continue
    }

    // Suppression comments
    if (trimmed.includes(DISABLE_LINE)) {
      continue
    }

    if (i > 0 && lines[i - 1].trim().includes(DISABLE_NEXT_LINE)) {
      continue
    }

    if (/\bwith\s*\(/.test(trimmed)) {
      continue
    }

    const match = trimmed.match(/^@use\s+["']([^"']+)["'](?:\s+as\s+(\*|[\w-]+))?/)
    if (!match) {
      continue
    }

    const modulePath = match[1]
    const asClause = match[2]

    let namespace
    let isGlob = false

    if (asClause === '*') {
      isGlob = true
      namespace = '*'
    } else if (asClause) {
      namespace = asClause
    } else {
      namespace = modulePath.split('/').at(-1).replace(/^_/, '')
    }

    uses.push({
      line: i + 1,
      modulePath,
      namespace,
      isGlob,
      isBuiltin: modulePath.startsWith('sass:')
    })
  }

  return uses
}

function resolveModule(modulePath, fromFile) {
  if (modulePath.startsWith('sass:')) {
    return null
  }

  const fromDir = path.dirname(fromFile)
  const target = path.resolve(fromDir, modulePath)
  const dir = path.dirname(target)
  const base = path.basename(target)

  const candidates = [
    path.join(dir, `_${base}.scss`),
    `${target}.scss`,
    path.join(target, '_index.scss'),
    path.join(target, 'index.scss')
  ]

  for (const c of candidates) {
    if (existsSync(c)) {
      return c
    }
  }

  return null
}

const exportCache = new Map()

function getModuleExports(filePath) {
  if (!filePath || !existsSync(filePath)) {
    return { variables: new Set(), mixins: new Set(), functions: new Set() }
  }

  const real = path.resolve(filePath)
  if (exportCache.has(real)) {
    return exportCache.get(real)
  }

  const exports = { variables: new Set(), mixins: new Set(), functions: new Set() }
  exportCache.set(real, exports)

  const content = readFileSync(real, 'utf8')
  const lines = content.split('\n')

  for (const line of lines) {
    const v = line.match(/^\$([a-zA-Z][\w-]*)\s*:/)
    if (v) {
      exports.variables.add(v[1])
    }

    const m = line.match(/^@mixin\s+([a-zA-Z][\w-]*)/)
    if (m) {
      exports.mixins.add(m[1])
    }

    const f = line.match(/^@function\s+([a-zA-Z][\w-]*)/)
    if (f) {
      exports.functions.add(f[1])
    }
  }

  for (const line of lines) {
    const fwd = line.trim().match(/^@forward\s+["']([^"']+)["']/)
    if (fwd) {
      const resolved = resolveModule(fwd[1], real)
      if (resolved) {
        const fwdExports = getModuleExports(resolved)
        for (const variable of fwdExports.variables) {
          exports.variables.add(variable)
        }

        for (const mixin of fwdExports.mixins) {
          exports.mixins.add(mixin)
        }

        for (const fn of fwdExports.functions) {
          exports.functions.add(fn)
        }
      }
    }
  }

  return exports
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isNamespaceUsed(namespace, body) {
  return new RegExp(`(?<![\\w-])${escapeRegExp(namespace)}\\.`).test(body)
}

function isGlobImportUsed(moduleExports, body) {
  for (const name of moduleExports.variables) {
    if (new RegExp(`\\$${escapeRegExp(name)}(?![\\w-])`).test(body)) {
      return true
    }
  }

  for (const name of moduleExports.mixins) {
    if (new RegExp(`@include\\s+${escapeRegExp(name)}(?![\\w-])`).test(body)) {
      return true
    }
  }

  for (const name of moduleExports.functions) {
    if (new RegExp(`(?<![\\w-])${escapeRegExp(name)}\\s*\\(`).test(body)) {
      return true
    }
  }

  return false
}

function getBody(content) {
  const lines = content.split('\n')
  const filtered = []
  let inBlockComment = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!inBlockComment && trimmed.startsWith('@use ')) {
      continue
    }

    if (!inBlockComment && trimmed.startsWith('@forward ')) {
      continue
    }

    let current = line
    if (inBlockComment) {
      const end = current.indexOf('*/')
      if (end === -1) {
        continue
      }

      current = current.slice(end + 2)
      inBlockComment = false
    }

    for (;;) {
      const start = current.indexOf('/*')
      if (start === -1) {
        break
      }

      const end = current.indexOf('*/', start + 2)
      if (end === -1) {
        current = current.slice(0, start)
        inBlockComment = true
        break
      }

      current = `${current.slice(0, start)}${current.slice(end + 2)}`
    }

    const singleCommentStart = current.indexOf('//')
    if (singleCommentStart !== -1) {
      current = current.slice(0, singleCommentStart)
    }

    filtered.push(current)
  }

  return filtered.join('\n')
}

function isUseUnused(use, body, file) {
  if (use.isBuiltin) {
    const name = use.modulePath.split(':')[1]
    return !isNamespaceUsed(name, body)
  }

  if (!use.isGlob) {
    return !isNamespaceUsed(use.namespace, body)
  }

  const resolved = resolveModule(use.modulePath, file)
  if (!resolved) {
    return false
  }

  const moduleExports = getModuleExports(resolved)
  const hasExports =
    moduleExports.variables.size > 0 ||
    moduleExports.mixins.size > 0 ||
    moduleExports.functions.size > 0

  if (!hasExports) {
    return false
  }

  return !isGlobImportUsed(moduleExports, body)
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: node check-unused-imports.mjs <dir1> [dir2] ...')
    process.exit(2)
  }

  let files
  try {
    files = findScssFiles(args)
  } catch (error) {
    console.error(error.message)
    process.exit(2)
  }

  let total = 0
  for (const file of files) {
    const content = readFileSync(file, 'utf8')
    const uses = parseUseStatements(content)
    if (uses.length === 0) {
      continue
    }

    const body = getBody(content)
    for (const use of uses) {
      if (isUseUnused(use, body, file)) {
        const rel = path.relative(process.cwd(), file)
        console.log(`${rel}:${use.line}\tUnused @use "${use.modulePath}"`)
        total++
      }
    }
  }

  if (total > 0) {
    console.log(`\nFound ${total} unused @use statement${total === 1 ? '' : 's'}`)
    process.exit(1)
  }
}

main()
