;(function () { // closure for web browsers

if (module) {
  module.exports = LRUCache
} else {
  // just set the global for non-node platforms.
  ;(function () { return this })().LRUCache = LRUCache
}

function hOP (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function LRUCache (maxLength) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(maxLength)
  }
  var cache = {} // hash of items by key
    , lruList = {} // list of items in order of use recency
    , lru = 0 // least recently used
    , mru = 0 // most recently used
    , length = 0 // number of items in the list

  // resize the cache when the maxLength changes.
  Object.defineProperty(this, "maxLength",
    { set : function (mL) {
        if (!mL || !(typeof mL === "number") || mL <= 0 ) mL = Infinity
        maxLength = mL
        // if it gets above double maxLength, trim right away.
        // otherwise, do it whenever it's convenient.
        if (length > maxLength) trim()
      }
    , get : function () { return maxLength }
    , enumerable : true
    })

  this.maxLength = maxLength

  Object.defineProperty(this, "length",
    { get : function () { return length }
    , enumerable : true
    })

  this.reset = function () {
    cache = {}
    lruList = {}
    lru = 0
    mru = 0
    length = 0
  }

  // Provided for debugging/dev purposes only. No promises whatsoever that
  // this API stays stable.
  this.dump = function () {
    return cache
  }

  this.set = function (key, value) {
    if (hOP(cache, key)) {
      this.get(key)
      cache[key].value = value
      return undefined
    }
    var hit = {key:key, value:value, lu:mru++}
    lruList[hit.lu] = cache[key] = hit
    length ++
    if (length > maxLength) trim()
  }

  this.get = function (key) {
    if (!hOP(cache, key)) return undefined
    var hit = cache[key]
    delete lruList[hit.lu]
    if (hit.lu === lru) lruWalk()
    hit.lu = mru ++
    lruList[hit.lu] = hit
    return hit.value
  }

  this.del = function (key) {
    if (!hOP(cache, key)) return undefined
    var hit = cache[key]
    delete cache[key]
    delete lruList[hit.lu]
    if (hit.lu === lru) lruWalk()
    length --
  }

  function lruWalk () {
    // lru has been deleted, hop up to the next hit.
    lru = Object.keys(lruList).shift()
  }

  function trim () {
    if (length <= maxLength) return undefined
    var prune = Object.keys(lruList).slice(0, length - maxLength)
    for (var i = 0, l = (length - maxLength); i < l; i ++) {
      delete cache[ lruList[prune[i]].key ]
      delete lruList[prune[i]]
    }
    length = maxLength
    lruWalk()
  }
}

})()
