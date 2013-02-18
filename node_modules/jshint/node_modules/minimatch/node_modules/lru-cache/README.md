# lru cache

A cache object that deletes the least-recently-used items.

Usage:

    var LRU = require("lru-cache")
      , cache = LRU(10) // max 10 items. default = Infinity
    cache.set("key", "value")
    cache.get("key") // "value"

    cache.reset()    // empty the cache

RTFS for more info.
