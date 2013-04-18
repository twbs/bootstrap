
/**
 * Module dependencies.
 */

var qs = require('./');

var obj = qs.parse('foo');
console.log(obj)

var obj = qs.parse('foo=bar=baz');
console.log(obj)

var obj = qs.parse('users[]');
console.log(obj)

var obj = qs.parse('name=tj&email=tj@vision-media.ca');
console.log(obj)

var obj = qs.parse('users[]=tj&users[]=tobi&users[]=jane');
console.log(obj)

var obj = qs.parse('user[name][first]=tj&user[name][last]=holowaychuk');
console.log(obj)

var obj = qs.parse('users[][name][first]=tj&users[][name][last]=holowaychuk');
console.log(obj)

var obj = qs.parse('a=a&a=b&a=c');
console.log(obj)

var obj = qs.parse('user[tj]=tj&user[tj]=TJ');
console.log(obj)

var obj = qs.parse('user[names]=tj&user[names]=TJ&user[names]=Tyler');
console.log(obj)

var obj = qs.parse('user[name][first]=tj&user[name][first]=TJ');
console.log(obj)

var obj = qs.parse('user[0]=tj&user[1]=TJ');
console.log(obj)

var obj = qs.parse('user[0]=tj&user[]=TJ');
console.log(obj)

var obj = qs.parse('user[0]=tj&user[foo]=TJ');
console.log(obj)

var str = qs.stringify({ user: { name: 'Tobi', email: 'tobi@learnboost.com' }});
console.log(str);