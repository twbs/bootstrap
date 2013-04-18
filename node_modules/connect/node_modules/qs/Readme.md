# node-querystring

  query string parser for node supporting nesting, as it was removed from `0.3.x`, so this library provides the previous and commonly desired behaviour (and twice as fast). Used by [express](http://expressjs.com), [connect](http://senchalabs.github.com/connect) and others.

## Installation

    $ npm install qs

## Examples

```js
var qs = require('qs');

qs.parse('user[name][first]=Tobi&user[email]=tobi@learnboost.com');
// => { user: { name: { first: 'Tobi' }, email: 'tobi@learnboost.com' } }

qs.stringify({ user: { name: 'Tobi', email: 'tobi@learnboost.com' }})
// => user[name]=Tobi&user[email]=tobi%40learnboost.com
```

## Testing

Install dev dependencies:

    $ npm install -d

and execute:

    $ make test

## License 

(The MIT License)

Copyright (c) 2010 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.