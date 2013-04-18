var t = require("tap")

var origCwd = process.cwd()
process.chdir(__dirname)

var glob = require('../')
var path = require('path')

t.test('.', function (t) {
  glob('/b*/**', { globDebug: true, root: '.' }, function (er, matches) {
    t.ifError(er)
    t.like(matches, [])
    t.end()
  })
})


t.test('a', function (t) {
  console.error("root=" + path.resolve('a'))
  glob('/b*/**', { globDebug: true, root: path.resolve('a') }, function (er, matches) {
    t.ifError(er)
    var wanted = [
        '/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f'
      ].map(function (m) {
        return path.join(path.resolve('a'), m).replace(/\\/g, '/')
      })

    t.like(matches, wanted)
    t.end()
  })
})

t.test('root=a, cwd=a/b', function (t) {
  glob('/b*/**', { globDebug: true, root: 'a', cwd: path.resolve('a/b') }, function (er, matches) {
    t.ifError(er)
    t.like(matches, [ '/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f' ].map(function (m) {
      return path.join(path.resolve('a'), m).replace(/\\/g, '/')
    }))
    t.end()
  })
})

t.test('cd -', function (t) {
  process.chdir(origCwd)
  t.end()
})
