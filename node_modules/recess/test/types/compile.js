var fs = require('fs')
  , assert = require('assert')
  , colors = require('colors')
  , RECESS = require('../../lib')

fs.readdirSync('test/fixtures').forEach(function (file, index) {
  // Ignore anything not a less/css file.
  if (file.indexOf('css') === -1 && file.indexOf('less') === -1) {
  	return
  }

  RECESS('test/fixtures/' + file, { compile: true, inlineImages: true  }, function (err, fat) {
    file = file.replace(/less$/, 'css')
    assert.ok(err == null)
    assert.ok(fat.output[0] == fs.readFileSync('test/compiled/' + file, 'utf-8'))
  })

})

console.log("✓ compiling".green)