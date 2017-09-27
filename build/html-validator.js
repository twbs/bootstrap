#!/usr/bin/env node

/*!
 * Script to validate our HTML files.
 * Copyright 2017 The Bootstrap Authors
 * Copyright 2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const fs = require('fs')
const path = require('path')
const async = require('async')
const glob = require('glob')
const validator = require('html-validator')

const validatorLimit = 10

const validatorOptions = {
  format: 'text',
  ignore: [
    'Error: Element “img” is missing required attribute “src”.',
    'Warning: The “main” role is unnecessary for element “main”.'
  ],
  validator: 'https://checker.html5.org'
}

const GH_PAGES_DIR = path.join(__dirname, '../_gh_pages/')

glob(path.join(GH_PAGES_DIR, '**/*.html'), function (er, files) {
  if (er) {
    throw er
  }

  async.eachLimit(files, validatorLimit, (file, cb) => {
    const f = path.normalize(file)

    fs.readFile(f, 'utf8', (err, html) => {
      if (err) {
        //throw err
        cb(err)
      }

      console.log(`Validating ${f}`)

      validatorOptions.data = html

      validator(validatorOptions, (error, data) => {
        if (error) {
          console.error(error)
          cb(error)
        }

        console.log(data)
        cb()
      })

    })
  }, (err) => {
    if (err) {
      console.error('Something went wrong')
    }
  })
})
