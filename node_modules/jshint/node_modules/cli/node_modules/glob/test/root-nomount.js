var tap = require("tap")

var origCwd = process.cwd()
process.chdir(__dirname)

tap.test("changing root and searching for /b*/**", function (t) {
  var glob = require('../')
  var path = require('path')
  t.test('.', function (t) {
    glob('/b*/**', { globDebug: true, root: '.', nomount: true }, function (er, matches) {
      t.ifError(er)
      t.like(matches, [])
      t.end()
    })
  })

  t.test('a', function (t) {
    glob('/b*/**', { globDebug: true, root: path.resolve('a'), nomount: true }, function (er, matches) {
      t.ifError(er)
      t.like(matches, [ '/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f' ])
      t.end()
    })
  })

  t.test('root=a, cwd=a/b', function (t) {
    glob('/b*/**', { globDebug: true, root: 'a', cwd: path.resolve('a/b'), nomount: true }, function (er, matches) {
      t.ifError(er)
      t.like(matches, [ '/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f' ])
      t.end()
    })
  })

  t.test('cd -', function (t) {
    process.chdir(origCwd)
    t.end()
  })

  t.end()
})
