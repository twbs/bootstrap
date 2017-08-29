const fs   = require('fs')
const path = require('path')
const pkg  = require(path.resolve(__dirname, '../package.json'))
const year = new Date().getFullYear()

const pathBoostrap        = path.resolve(__dirname, '../dist/js/bootstrap.js')
const pathBootstrapBundle = path.resolve(__dirname, '../dist/js/bootstrap.bundle.js')
const contentFile         = fs.readFileSync(pathBoostrap, { encoding: 'UTF8' })
const contentBundleFile   = fs.readFileSync(pathBootstrapBundle, { encoding: 'UTF8' })

const stamp =
`/*!
 * Bootstrap v${pkg.version} (${pkg.homepage})
 * Copyright 2011-${year} ${pkg.author}
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
`
fs.writeFileSync(pathBoostrap, `${stamp}${contentFile}`, { encoding: 'UTF8' })
fs.writeFileSync(pathBootstrapBundle, `${stamp}${contentBundleFile}`, { encoding: 'UTF8' })
