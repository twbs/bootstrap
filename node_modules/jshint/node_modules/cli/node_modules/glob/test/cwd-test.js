var tap = require("tap")

var origCwd = process.cwd()
process.chdir(__dirname)

tap.test("changing cwd and searching for **/d", function (t) {
  var glob = require('../')
  var path = require('path')
  t.test('.', function (t) {
    glob('**/d', function (er, matches) {
      t.ifError(er)
      t.like(matches, [ 'a/b/c/d', 'a/c/d' ])
      t.end()
    })
  })

  t.test('a', function (t) {
    glob('**/d', {cwd:path.resolve('a')}, function (er, matches) {
      t.ifError(er)
      t.like(matches, [ 'b/c/d', 'c/d' ])
      t.end()
    })
  })

  t.test('a/b', function (t) {
    glob('**/d', {cwd:path.resolve('a/b')}, function (er, matches) {
      t.ifError(er)
      t.like(matches, [ 'c/d' ])
      t.end()
    })
  })

  t.test('a/b/', function (t) {
    glob('**/d', {cwd:path.resolve('a/b/')}, function (er, matches) {
      t.ifError(er)
      t.like(matches, [ 'c/d' ])
      t.end()
    })
  })

  t.test('.', function (t) {
    glob('**/d', {cwd: process.cwd()}, function (er, matches) {
      t.ifError(er)
      t.like(matches, [ 'a/b/c/d', 'a/c/d' ])
      t.end()
    })
  })

  t.test('cd -', function (t) {
    process.chdir(origCwd)
    t.end()
  })

  t.end()
})
