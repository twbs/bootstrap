const fs = require('fs')

fs.readFile('package.json', (err, data) => {
  if (err) {
    throw err
  }

  const pkg = JSON.parse(data)
  const year = new Date().getFullYear()

  const stampTop =
`/*!
 * Bootstrap v${pkg.version} (${pkg.homepage})
 * Copyright 2011-${year} ${pkg.author}
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\\'s JavaScript.')
}

(function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
    throw new Error('Bootstrap\\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
  }
})(jQuery);

(function () {
`
  const stampEnd = `
})();`

  process.stdout.write(stampTop)

  process.stdin.on('end', () => {
    process.stdout.write(stampEnd)
  })

  process.stdin.pipe(process.stdout)
})
