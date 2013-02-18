;(function () { // closure for web browsers

if (typeof module === 'object' && module.exports) {
  module.exports = LRUCache
} else {
  // just set the global for non-node platforms.
  this.LRUCache = LRUCache
}

function hOP (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function naiveLength () { return 1 }

function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options)
  }

  var max
  if (typeof options === 'number') {
    max = options
    options = { max: max }
  }
  max = options.max

  if (!options) options = {}

  var lengthCalculator = options.length || naiveLength

  if (typeof lengthCalculator !== "function") {
    lengthCalculator = naiveLength
  }
  if (!max || !(typeof max === "number") || max <= 0 ) {
    // a little bit silly.  maybe this should throw?
    max = Infinity
  }

  var maxAge = options.maxAge || null

  var dispose = options.dispose

  var cache = Object.create(null) // hash of items by key
    , lruList = Object.create(null) // list of items in order of use recency
    , mru = 0 // most recently used
    , length = 0 // number of items in the list
    , itemCount = 0


  // resize the cache when the max changes.
  Object.defineProperty(this, "max",
    { set : function (mL) {
        if (!mL || !(typeof mL === "number") || mL <= 0 ) mL = Infinity
        max = mL
        // if it gets above double max, trim right away.
        // otherwise, do it whenever it's convenient.
        if (length > max) trim()
      }
    , get : function () { return max }
    , enumerable : true
    })

  // resize the cache when the lengthCalculator changes.
  Object.defineProperty(this, "lengthCalculator",
    { set : function (lC) {
        if (typeof lC !== "function") {
          lengthCalculator = naiveLength
          length = itemCount
          for (var key in cache) {
            cache[key].length = 1
          }
        } else {
          lengthCalculator = lC
          length = 0
          for (var key in cache) {
            cache[key].length = lengthCalculator(cache[key].value)
            length += cache[key].length
          }
        }

        if (length > max) trim()
      }
    , get : function () { return lengthCalculator }
    , enumerable : true
    })

  Object.defineProperty(this, "length",
    { get : function () { return length }
    , enumerable : true
    })


  Object.defineProperty(this, "itemCount",
    { get : function () { return itemCount }
    , enumerable : true
    })

  this.reset = function () {
    if (dispose) {
      for (var k in cache) {
        dispose(k, cache[k].value)
      }
    }
    cache = {}
    lruList = {}
    mru = 0
    length = 0
    itemCount = 0
  }

  // Provided for debugging/dev purposes only. No promises whatsoever that
  // this API stays stable.
  this.dump = function () {
    return cache
  }

  this.set = function (key, value) {
    if (hOP(cache, key)) {
      // dispose of the old one before overwriting
      if (dispose) dispose(key, cache[key].value)
      if (maxAge) cache[key].now = Date.now()
      cache[key].value = value
      this.get(key)
      return true
    }

    var len = lengthCalculator(value)
    var age = maxAge ? Date.now() : 0
    var hit = new Entry(key, value, mru++, len, age)

    // oversized objects fall out of cache automatically.
    if (hit.length > max) {
      if (dispose) dispose(key, value)
      return false
    }

    length += hit.length
    lruList[hit.lu] = cache[key] = hit
    itemCount ++

    if (length > max) trim()
    return true
  }

  this.get = function (key) {
    if (!hOP(cache, key)) return
    var hit = cache[key]
    if (maxAge && (Date.now() - hit.now > maxAge)) {
      this.del(key)
      return
    }
    delete lruList[hit.lu]
    hit.lu = mru ++
    lruList[hit.lu] = hit
    return hit.value
  }

  this.del = function (key) {
    if (!hOP(cache, key)) return
    var hit = cache[key]
    if (dispose) dispose(key, hit.value)
    delete cache[key]
    delete lruList[hit.lu]
    length -= hit.length
    itemCount --
  }

  function trim () {
    if (length <= max) return
    for (var k in lruList) {
      if (length <= max) break;
      var hit = lruList[k]
      if (dispose) dispose(hit.key, hit.value)
      length -= hit.length
      delete cache[ hit.key ]
      delete lruList[k]
    }
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, mru, len, age) {
  this.key = key
  this.value = value
  this.lu = mru
  this.length = len
  this.now = age
}

})()
