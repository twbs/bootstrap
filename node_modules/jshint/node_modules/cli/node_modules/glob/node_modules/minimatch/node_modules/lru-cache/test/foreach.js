var test = require('tap').test
var LRU = require('../')

test('forEach', function (t) {
  var l = new LRU(5)
  for (var i = 0; i < 10; i ++) {
    l.set(i.toString(), i.toString(2))
  }

  var i = 9
  l.forEach(function (val, key, cache) {
    t.equal(cache, l)
    t.equal(key, i.toString())
    t.equal(val, i.toString(2))
    i -= 1
  })

  // get in order of most recently used
  l.get(6)
  l.get(8)

  var order = [ 8, 6, 9, 7, 5 ]
  var i = 0

  l.forEach(function (val, key, cache) {
    var j = order[i ++]
    t.equal(cache, l)
    t.equal(key, j.toString())
    t.equal(val, j.toString(2))
  })

  t.end()
})

test('keys() and values()', function (t) {
  var l = new LRU(5)
  for (var i = 0; i < 10; i ++) {
    l.set(i.toString(), i.toString(2))
  }

  t.similar(l.keys(), ['9', '8', '7', '6', '5'])
  t.similar(l.values(), ['1001', '1000', '111', '110', '101'])

  // get in order of most recently used
  l.get(6)
  l.get(8)

  t.similar(l.keys(), ['8', '6', '9', '7', '5'])
  t.similar(l.values(), ['1000', '110', '1001', '111', '101'])

  t.end()
})
