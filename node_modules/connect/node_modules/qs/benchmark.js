
var qs = require('./');

var times = 100000
  , start = new Date
  , n = times;

console.log('times: %d', times);

while (n--) qs.parse('foo=bar');
console.log('simple: %dms', new Date - start);

var start = new Date
  , n = times;

while (n--) qs.parse('user[name][first]=tj&user[name][last]=holowaychuk');
console.log('nested: %dms', new Date - start);