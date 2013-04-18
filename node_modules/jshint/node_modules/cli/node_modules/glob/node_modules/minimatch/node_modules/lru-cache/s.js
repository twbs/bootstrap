var LRU = require('lru-cache');

var max = +process.argv[2] || 10240;
var more = 1024;

var cache = LRU({
  max: max, maxAge: 86400e3
});

// fill cache
for (var i = 0; i < max; ++i) {
  cache.set(i, {});
}

var start = process.hrtime();

// adding more items
for ( ; i < max+more; ++i) {
  cache.set(i, {});
}

var end = process.hrtime(start);
var msecs = end[0] * 1E3 + end[1] / 1E6;

console.log('adding %d items took %d ms', more, msecs.toPrecision(5));
