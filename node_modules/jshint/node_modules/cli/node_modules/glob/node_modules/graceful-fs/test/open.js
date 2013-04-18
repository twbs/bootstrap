var test = require('tap').test
var fs = require('../graceful-fs.js')

test('graceful fs is not fs', function (t) {
  t.notEqual(fs, require('fs'))
  t.end()
})

test('open an existing file works', function (t) {
  var start = fs._curOpen
  var fd = fs.openSync(__filename, 'r')
  t.equal(fs._curOpen, start + 1)
  fs.closeSync(fd)
  t.equal(fs._curOpen, start)
  fs.open(__filename, 'r', function (er, fd) {
    if (er) throw er
    t.equal(fs._curOpen, start + 1)
    fs.close(fd, function (er) {
      if (er) throw er
      t.equal(fs._curOpen, start)
      t.end()
    })
  })
})

test('open a non-existing file throws', function (t) {
  var start = fs._curOpen
  var er
  try {
    var fd = fs.openSync('this file does not exist', 'r')
  } catch (x) {
    er = x
  }
  t.ok(er, 'should throw')
  t.notOk(fd, 'should not get an fd')
  t.equal(er.code, 'ENOENT')
  t.equal(fs._curOpen, start)

  fs.open('neither does this file', 'r', function (er, fd) {
    t.ok(er, 'should throw')
    t.notOk(fd, 'should not get an fd')
    t.equal(er.code, 'ENOENT')
    t.equal(fs._curOpen, start)
    t.end()
  })
})
