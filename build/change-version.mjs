#!/usr/bin/env node

/*!
 * Script to update version number references in the project.
 * Copyright 2017-2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const VERBOSE = process.argv.includes('--verbose')
const DRY_RUN = process.argv.includes('--dry') || process.argv.includes('--dry-run')

// These are the files we only care about replacing the version
const FILES = [
  'README.md',
  'config.yml',
  'js/src/base-component.js',
  'package.js',
  'scss/mixins/_banner.scss',
  'site/data/docs-versions.yml'
]

const DOCS_LINK_FILES = [
  'README.md'
]

const DOCS_LINK_DIRECTORIES = [
  'site/src'
]

const DOCS_LINK_EXTENSIONS = new Set([
  '.astro',
  '.html',
  '.md',
  '.mdx'
])

// Blame TC39... https://github.com/benjamingr/RegExp.escape/issues/37
function regExpQuote(string) {
  return string.replace(/[$()*+-.?[\\\]^{|}]/g, '\\$&')
}

function regExpQuoteReplacement(string) {
  return string.replace(/\$/g, '$$')
}

export function shortVersion(version) {
  return version.replace(/^v/, '').split('.').slice(0, 2).join('.')
}

export function replaceDocsShortVersionLinks(string, oldVersion, newVersion) {
  const oldShortVersion = shortVersion(oldVersion)
  const newShortVersion = shortVersion(newVersion)

  if (oldShortVersion === newShortVersion) {
    return string
  }

  return string.replace(
    new RegExp(`/docs/${regExpQuote(oldShortVersion)}(?=/)`, 'g'),
    `/docs/${regExpQuoteReplacement(newShortVersion)}`
  )
}

async function replaceInFile(file, transform) {
  const originalString = await fs.readFile(file, 'utf8')
  const newString = transform(originalString)

  // No need to move any further if the strings are identical
  if (originalString === newString) {
    return
  }

  if (VERBOSE) {
    console.log(`Updating ${file}`)
  }

  if (DRY_RUN) {
    return
  }

  await fs.writeFile(file, newString, 'utf8')
}

async function replaceRecursively(file, oldVersion, newVersion) {
  await replaceInFile(file, originalString => {
    return originalString
      .replace(
        new RegExp(regExpQuote(oldVersion), 'g'),
        regExpQuoteReplacement(newVersion)
      )
      // Also replace the version used by the rubygem,
      // which is using periods (`.`) instead of hyphens (`-`)
      .replace(
        new RegExp(regExpQuote(oldVersion.replace(/-/g, '.')), 'g'),
        regExpQuoteReplacement(newVersion.replace(/-/g, '.'))
      )
  })
}

async function findDocsLinkFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      const nestedFiles = await findDocsLinkFiles(entryPath)
      files.push(...nestedFiles)
      continue
    }

    if (entry.isFile() && DOCS_LINK_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

async function replaceDocsLinks(oldVersion, newVersion) {
  const files = [
    ...DOCS_LINK_FILES,
    ...(
      await Promise.all(
        DOCS_LINK_DIRECTORIES.map(directory => findDocsLinkFiles(directory))
      )
    ).flat()
  ]

  await Promise.all(
    files.map(file => replaceInFile(file, originalString => {
      return replaceDocsShortVersionLinks(originalString, oldVersion, newVersion)
    }))
  )
}

function bumpNpmVersion(newVersion) {
  if (DRY_RUN) {
    return
  }

  execFile('npm', ['version', newVersion, '--no-git-tag'], { shell: true }, error => {
    if (error) {
      console.error(error)
      process.exit(1)
    }
  })
}

function showUsage(args) {
  console.error('USAGE: change-version old_version new_version [--verbose] [--dry[-run]]')
  console.error('Got arguments:', args)
  process.exit(1)
}

async function main(args) {
  let [oldVersion, newVersion] = args

  if (!oldVersion || !newVersion) {
    showUsage(args)
  }

  // Strip any leading `v` from arguments because
  // otherwise we will end up with duplicate `v`s
  [oldVersion, newVersion] = [oldVersion, newVersion].map(arg => {
    return arg.startsWith('v') ? arg.slice(1) : arg
  })

  if (oldVersion === newVersion) {
    showUsage(args)
  }

  bumpNpmVersion(newVersion)

  try {
    await Promise.all(
      FILES.map(file => replaceRecursively(file, oldVersion, newVersion))
    )
    await replaceDocsLinks(oldVersion, newVersion)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2))
}
